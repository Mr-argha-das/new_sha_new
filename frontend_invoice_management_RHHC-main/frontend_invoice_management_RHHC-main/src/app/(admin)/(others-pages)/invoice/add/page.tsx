'use client';

import { useAuth } from '@/context/AuthContext';
import { useHorizontalInfiniteList } from '@/hooks/useHorizontalInfiniteList';
import { toNumber } from '@/modules/common/helpers/helper';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Lead } from '@/modules/common/models/lead';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Formik } from 'formik';
import { cloneDeep } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { getUser } from '../../customer/api';
import { createInvoice } from '../api';
import { InvoiceItem, InvoiceValues } from '../api/schema';
import { InvoiceFormContent } from '../components/invoice-form/invoiceForm';
import { defaultOtherDetails } from '../components/payment-method-fields';
import { addInvoiceValidationSchema } from '../validators/validator';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const computeItemTotal = (
  qty: number,
  days: number,
  unit: number,
  hoursPerDay?: number,
) => {
  const q = Number.isFinite(qty) ? qty : 0;
  const d = Number.isFinite(days) ? days : 1;
  const u = Number.isFinite(unit) ? unit : 0;
  const h =
    hoursPerDay === undefined || hoursPerDay === null
      ? 1
      : Number.isFinite(hoursPerDay)
        ? hoursPerDay
        : 1;
  return +(q * d * u * h).toFixed(2);
};

const computeSummary = (
  items: InvoiceItem[],
  discount: number,
  paid: number,
  transportationCharge: number = 0,
  otherCharges: number = 0,
  lastDueAmount: number = 0,
  is_deposit_counted: number,
  security_deposit: number,
) => {
  const subtotal = items.reduce(
    (acc, it) =>
      acc +
      computeItemTotal(
        toNumber(it.quantity),
        toNumber(it.days),
        toNumber(it.unit_price),
        toNumber(it.hours_per_day) || 1,
      ),
    0,
  );
  const amountAfterDiscount = Math.max(0, subtotal - toNumber(discount));
  let totalAmount = 0;
  if (is_deposit_counted == 1) {
    totalAmount =
      Math.max(
        0,
        +(
          amountAfterDiscount +
          toNumber(transportationCharge) +
          toNumber(otherCharges) +
          toNumber(lastDueAmount)
        ).toFixed(2),
      ) - toNumber(security_deposit);
  } else {
    totalAmount = Math.max(
      0,
      +(
        amountAfterDiscount +
        toNumber(transportationCharge) +
        toNumber(otherCharges) +
        toNumber(lastDueAmount)
      ).toFixed(2),
    );
  }

  totalAmount = Math.round(totalAmount);

  const overalSubTotal = Math.max(
    0,
    +(
      amountAfterDiscount +
      toNumber(transportationCharge) +
      toNumber(otherCharges) +
      toNumber(lastDueAmount)
    ).toFixed(2),
  );
  const dueAmount = Math.max(0, Math.round(totalAmount - toNumber(paid)));
  return {
    subtotal: +subtotal.toFixed(2),
    totalAmount,
    dueAmount,
    overalSubTotal,
  };
};

const AddInvoice: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const invalidate = useInvalidate();
  const selectedLead = useRef<Partial<Lead>>(null);
  const prefilledFromQuery = useRef(false);
  const lastDueFetchedFor = useRef<string | null>(null);
  const lastInvoiceCreatedDate = useRef<string | null>(null);
  const customerId = searchParams.get('customer_id');
  const leadId = searchParams.get('lead_id');
  const isCustomerAndLeadDisable = !!(customerId && leadId);
  const [getLastInvoiceError, setGetLastInvoiceError] = useState(false);

  const {
    items: customerItems,
    isFetchingNextPage: customersFetchingMore,
    hasMore: customersHasMore,
    fetchNextPage: fetchMoreCustomers,
  } = useHorizontalInfiniteList<
    { id: number | string; name: string },
    { account_id?: number | string; branch_id?: number | string }
  >({
    queryKey: ['getCustomers'],
    fetcher: async (params) => {
      const res = await getUser({
        ...(params as Record<string, unknown>),
        isRoleIncluded: true,
        role_id: '2',
      } as Record<string, unknown>);
      return {
        data: {
          data: res.data.data,
          meta: { total: res.data.meta.totalRecords || 0 },
        },
      };
    },
    params: {
      account_id: user?.account_id,
      branch_id: user?.branch_id,
    },
    limit: 20,
    enabled: !!user?.account_id && !!user?.branch_id,
  });

  const customers = (customerItems || []).map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const initialValues: InvoiceValues = useMemo(
    () => ({
      account_id: user?.account_id as number,
      branch_id: user?.branch_id as number,
      invoiceDetails: {
        lead_id: leadId ? parseInt(leadId ?? '') : '',
        customer_id: customerId ? parseInt(customerId ?? '') : '',
        invoice_date: '',
        total_amount: 0,
        sub_total: 0,
        discount_amount: '',
        transportation_charge: '',
        other_charges: '',
        last_invoice_due: '0',
        paid_amount: 0,
        due_amount: 0,
        payment_status: 0,
        invoice_status: 'draft',
        notes: '',
        is_deposit_counted: 0,
        settlement_amount: 0,
        security_deposit: 0,
        is_first_invoice: 0,
        payment_method: 'cash',
        other_details: { ...defaultOtherDetails },
      },
      invoiceItems: null,
    }),
    [user?.account_id, user?.branch_id, customerId, leadId],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addInvoiceValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = cloneDeep(values);
          if (!payload.invoiceItems || !payload.invoiceItems) {
            toast.error('There must be one invoice item');
            return;
          }
          const { totalAmount, dueAmount, overalSubTotal } = computeSummary(
            payload.invoiceItems,
            toNumber(payload.invoiceDetails.discount_amount),
            payload.invoiceDetails.paid_amount,
            toNumber(payload.invoiceDetails.transportation_charge),
            toNumber(payload.invoiceDetails.other_charges),
            toNumber(payload.invoiceDetails.last_invoice_due),
            payload.invoiceDetails.is_deposit_counted,
            toNumber(selectedLead.current?.security_deposit),
          );
          payload.invoiceDetails.sub_total = overalSubTotal;
          payload.invoiceDetails.total_amount = totalAmount;
          payload.invoiceDetails.due_amount = dueAmount; // paid is 0 at create
          // if (!payload.invoiceDetails.due_date) payload.invoiceDetails.due_date = null;
          const apiPayload = {
            ...payload,
            invoiceDetails: {
              ...payload.invoiceDetails,
              discount_amount:
                toNumber(payload.invoiceDetails.discount_amount) || 0,
              transportation_charge:
                toNumber(payload.invoiceDetails.transportation_charge) ?? 0,
              other_charges:
                toNumber(payload.invoiceDetails.other_charges) ?? 0,
              last_invoice_due:
                toNumber(payload.invoiceDetails.last_invoice_due) ?? 0,
              security_deposit:
                payload.invoiceDetails.is_deposit_counted === 0
                  ? null
                  : (selectedLead.current?.security_deposit as number),
              settlement_amount:
                payload.invoiceDetails.is_deposit_counted === 0
                  ? null
                  : totalAmount < 0
                    ? totalAmount
                    : null,
              is_first_invoice:
                selectedLead.current?.lead_status === 'created' ? 1 : 0,
            },
            invoiceItems: payload.invoiceItems.map((it) => ({
              // Send only fields allowed by backend validator (Joi rejects unknown keys)
              lead_item_id: typeof it.lead_item_id === 'number' ? it.lead_item_id : undefined,
              item_type: it.item_type,
              deal_type: it.deal_type,
              item_id: toNumber(it.item_id),
              item_name: it.item_name,
              quantity: toNumber(it.quantity),
              days: toNumber(it.days) || 1,
              hours_per_day: toNumber(it.hours_per_day) || 1,
              unit_measure: it.unit_measure,
              unit_price: toNumber(it.unit_price),
              total_price: Number(it.total_price),
              notes: it.notes ?? null,
            })),
          };

          const res = await createInvoice(
            apiPayload as Parameters<typeof createInvoice>[0],
          );
          if (res?.status) {
            toast.success('Invoice created');
            await invalidate(['getInvoice']);
            router.push('/invoice');
            return;
          }
          // toast.error(res?.message || 'Failed to create invoice');
        } catch (err) {
          const e = err as AxiosError<unknown>;
          const data = e?.response?.data as { message?: unknown } | undefined;
          const msg =
            data?.message ||
            e?.message ||
            'Failed to create invoice';
          toast.error(String(msg));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <InvoiceFormContent
        customers={customers}
        customersHasMore={customersHasMore}
        customersFetchingMore={customersFetchingMore}
        fetchMoreCustomers={fetchMoreCustomers}
        isCustomerAndLeadDisable={isCustomerAndLeadDisable}
        customerId={customerId}
        leadId={leadId}
        selectedLead={selectedLead}
        prefilledFromQuery={prefilledFromQuery}
        lastDueFetchedFor={lastDueFetchedFor}
        lastInvoiceCreatedDate={lastInvoiceCreatedDate}
        getLastInvoiceError={getLastInvoiceError}
        setGetLastInvoiceError={setGetLastInvoiceError}
        router={router}
        user={user}
      />
    </Formik>
  );
};

export default AddInvoice;
