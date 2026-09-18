'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import CustomerSearchAutocomplete from '@/modules/common/customer-search-autocomplete';
import DatePicker from '@/modules/common/date-picker';
import Link from '@/modules/common/elements/link';
import PageContainer from '@/modules/common/elements/page/page-container';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { formatINR, toNumber } from '@/modules/common/helpers/helper';
import { Lead, LeadItem } from '@/modules/common/models/lead';
import NumberField from '@/modules/common/NumberField';
import TextField from '@/modules/common/text-field';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { Button, Checkbox, Grid, MenuItem, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Form, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { LoadingButton } from '../../../../../../../packages/ui';
import { getCustomerLeadList } from '../../../lead/api';
import { getCustomerLastInvoiceDueAmount } from '../../api';
import { InvoiceValues } from '../../api/schema';
import { PaymentMethodFields } from '../payment-method-fields';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const computeItemTotal = (
  qty: number,
  days: number,
  unit: number,
  hoursPerDay?: number,
) => {
  const q = Number.isFinite(qty) ? qty : 0;
  const d = Number.isFinite(days) ? days : 0;
  const u = Number.isFinite(unit) ? unit : 0;
  const h =
    hoursPerDay === undefined || hoursPerDay === null
      ? 1
      : Number.isFinite(hoursPerDay)
        ? hoursPerDay
        : 1;
  return +(q * d * u * h).toFixed(2);
};

const computeDaysForInvoiceItem = (args: {
  invoiceDate: dayjs.Dayjs;
  periodStart: dayjs.Dayjs; // inclusive
  itemStart?: string | null;
  itemEnd?: string | null;
  allowBackbillBeforePeriodStart?: boolean;
}) => {
  const {
    invoiceDate,
    periodStart,
    itemStart,
    itemEnd,
    allowBackbillBeforePeriodStart,
  } = args;
  const invEnd = invoiceDate.startOf('day');

  const iStartRaw = itemStart ? dayjs(itemStart).startOf('day') : null;
  const start = (() => {
    if (!iStartRaw || !iStartRaw.isValid()) return periodStart;
    if (allowBackbillBeforePeriodStart) return iStartRaw;
    return iStartRaw.isAfter(periodStart) ? iStartRaw : periodStart;
  })();

  const iEndRaw = itemEnd ? dayjs(itemEnd).startOf('day') : null;
  const end =
    iEndRaw && iEndRaw.isValid() && iEndRaw.isBefore(invEnd)
      ? iEndRaw
      : invEnd;

  // Inclusive day count
  const diff = end.diff(start, 'day') + 1;
  return Math.max(1, diff);
};

// Component to handle lead query logic using Formik context
export const InvoiceFormContent: React.FC<{
  customers: Array<{ id: number | string; name: string }>;
  customersHasMore: boolean;
  customersFetchingMore: boolean;
  fetchMoreCustomers: () => void;
  isCustomerAndLeadDisable: boolean;
  customerId: string | null;
  leadId: string | null;
  selectedLead: React.RefObject<Partial<Lead> | null>;
  prefilledFromQuery: React.RefObject<boolean>;
  lastDueFetchedFor: React.RefObject<string | null>;
  lastInvoiceCreatedDate: React.RefObject<string | null>;
  getLastInvoiceError: boolean;
  setGetLastInvoiceError: (value: boolean) => void;
  router: ReturnType<typeof useRouter>;
  user: ReturnType<typeof useAuth>['user'];
}> = ({
  isCustomerAndLeadDisable,
  customerId,
  leadId,
  selectedLead,
  prefilledFromQuery,
  lastDueFetchedFor,
  lastInvoiceCreatedDate,
  getLastInvoiceError,
  setGetLastInvoiceError,
  router,
  user,
}) => {
    const { values, setFieldValue, isSubmitting, errors, touched } =
      useFormikContext<InvoiceValues>();

    // `lastInvoiceCreatedDate` comes from a ref (no rerender on update).
    // Keep a state copy so date constraints and calculations update reliably.
    const [lastInvoiceDate, setLastInvoiceDate] = React.useState<string | null>(
      lastInvoiceCreatedDate.current ?? null,
    );
    const [lastInvoiceItemKeys, setLastInvoiceItemKeys] = React.useState<Set<string>>(
      () => new Set(),
    );
    const [lastInvoiceMetaLoading, setLastInvoiceMetaLoading] =
      React.useState(false);

    const { data: leadItems, isLoading: leadsLoading } = useQuery({
      queryKey: ['getFinalisedCustomerLead', values.invoiceDetails.customer_id],
      queryFn: async () => {
        const res = await getCustomerLeadList({
          account_id: user?.account_id as number,
          branch_id: user?.branch_id as number,
          customer_id: values.invoiceDetails.customer_id as number,
          is_finalished: 1,
          is_completed: 0,
          productReturnPending: 0,
        });
        return res.data;
      },
      staleTime: 1000 * 60 * 2,
      enabled: !!values.invoiceDetails.customer_id,
    });

    const leads = useMemo(() => {
      const list = leadItems?.data ?? [];
      return list?.map((l) => ({
        id: l.id,
        customer_name: l.customer_name,
        lead_name: l.lead_name,
        start_date: l.start_date,
        end_date: l?.end_date ?? null,
        item_list: l.item_list ?? null,
        security_deposit: l.security_deposit,
        lead_status: l.lead_status,
      }));
    }, [leadItems]);

    const calculateTotals = useCallback(() => {
      const subtotal =
        values?.invoiceItems?.reduce(
          (acc, it) =>
            acc +
            computeItemTotal(
              toNumber(it.quantity),
              toNumber(it.days),
              toNumber(it.unit_price),
              toNumber(it.hours_per_day) || 1,
            ),
          0,
        ) ?? 0;
      const amountAfterDiscount = Math.max(
        0,
        subtotal - toNumber(values.invoiceDetails.discount_amount),
      );
      let totalAmount = 0;
      if (values.invoiceDetails.is_deposit_counted === 1) {
        totalAmount =
          Math.max(
            0,
            +(
              amountAfterDiscount +
              toNumber(values.invoiceDetails.transportation_charge) +
              toNumber(values.invoiceDetails.other_charges) +
              toNumber(values.invoiceDetails.last_invoice_due)
            ).toFixed(2),
          ) - Number(selectedLead.current?.security_deposit);
      } else {
        totalAmount = Math.max(
          0,
          +(
            amountAfterDiscount +
            toNumber(values.invoiceDetails.transportation_charge) +
            toNumber(values.invoiceDetails.other_charges) +
            toNumber(values.invoiceDetails.last_invoice_due)
          ).toFixed(2),
        );
      }
      totalAmount = Math.round(totalAmount);
      const dueAmount = totalAmount;
      const overalSubTotal = Math.max(
        0,
        +(
          amountAfterDiscount +
          toNumber(values.invoiceDetails.transportation_charge) +
          toNumber(values.invoiceDetails.other_charges) +
          toNumber(values.invoiceDetails.last_invoice_due)
        ).toFixed(2),
      );

      return {
        subtotal: +subtotal.toFixed(2),
        totalAmount,
        dueAmount,
        overalSubTotal,
      };
    }, [values, selectedLead]);

    const updateSummaryFromTotals = useCallback(() => {
      const { totalAmount, dueAmount, overalSubTotal } = calculateTotals();
      setFieldValue('invoiceDetails.total_amount', totalAmount, false);
      setFieldValue('invoiceDetails.due_amount', dueAmount, false);
      setFieldValue('invoiceDetails.sub_total', overalSubTotal, false);
    }, [calculateTotals, setFieldValue]);

    useEffect(() => {
      const setFormValuesFOrCustomerAndLead = async () => {
        if (prefilledFromQuery.current) return;

        // If only customer is provided, set it to trigger fetching leads
        if (customerId && !leadId) {
          setFieldValue('invoiceDetails.customer_id', Number(customerId), false);
          return;
        }

        // If both customer and lead are provided, wait for leads to load first
        if (customerId && leadId && leads.length > 0) {
          setFieldValue('invoiceDetails.customer_id', Number(customerId), false);
          setFieldValue('invoiceDetails.lead_id', Number(leadId), false);

          const selected = leads.find(
            (l) => Number(l.id) === Number(leadId),
          ) as Lead | null;
          if (selected) {
            selectedLead.current = selected;

            // set invoice items from the selected lead (include days for subtotal calculation)
            const items =
              selected.item_list
                ?.filter((li: LeadItem) => Number(li.status ?? 0) !== 2)
                .map((li: LeadItem) => ({
                  lead_item_id: li.id,
                  item_type: li.item_type,
                  deal_type: li.deal_type,
                  item_id: li.item_id,
                  item_name: li.item_name,
                  quantity: String(li.quantity ?? ''),
                  days: '1',
                  hours_per_day: String(li.hours_per_day ?? '1'),
                  unit_price: String(li.unit_price ?? ''),
                  total_price:
                    toNumber(li.unit_price) *
                    toNumber(li.quantity) *
                    (toNumber(li.hours_per_day) || 1),
                  notes: li.notes,
                  start_date: li.start_date ?? null,
                  end_date: li.end_date ?? null,
                  status: li.status ?? 0,
                })) || [];
            setFieldValue('invoiceItems', items, false);

            // Compute and set totals from new items (state may not have updated yet)
            const subtotalFromItems =
              items.reduce(
                (acc, it) =>
                  acc +
                  computeItemTotal(
                    toNumber(it.quantity),
                    toNumber(it.days ?? 1),
                    toNumber(it.unit_price),
                    toNumber(it.hours_per_day) || 1,
                  ),
                0,
              ) ?? 0;
            const amountAfterDiscount = Math.max(
              0,
              subtotalFromItems - toNumber(values.invoiceDetails.discount_amount),
            );
            const overalSubTotal = Math.max(
              0,
              +(
                amountAfterDiscount +
                toNumber(values.invoiceDetails.transportation_charge) +
                toNumber(values.invoiceDetails.other_charges) +
                toNumber(values.invoiceDetails.last_invoice_due)
              ).toFixed(2),
            );
            let totalAmount = overalSubTotal;
            if (values.invoiceDetails.is_deposit_counted === 1) {
              totalAmount = Math.max(
                0,
                overalSubTotal - Number(selected.security_deposit ?? 0),
              );
            }
            totalAmount = Math.round(totalAmount);
            setFieldValue(
              'invoiceDetails.sub_total',
              +overalSubTotal.toFixed(2),
              false,
            );
            setFieldValue('invoiceDetails.total_amount', totalAmount, false);
            setFieldValue('invoiceDetails.due_amount', totalAmount, false);

            // Fetch the last invoice due and update totals (only once per pair)
            const fetchKey = `${customerId}-${leadId}`;
            if (lastDueFetchedFor.current !== fetchKey) {
              try {
                setLastInvoiceMetaLoading(true);
                const res = await getCustomerLastInvoiceDueAmount(
                  String(customerId),
                  leadId,
                );
                const due = toNumber(res?.data?.data?.dueAmount ?? 0);
                const fetchedLastDate = res?.data?.data?.lastInvoiceDate ?? null;
                const fetchedItems =
                  (res?.data?.data?.lastInvoiceItems as
                    | Array<{
                        item_type: string;
                        deal_type: string | null;
                        item_id: string | number;
                      }>
                    | undefined) ?? [];
                lastInvoiceCreatedDate.current = fetchedLastDate;
                setLastInvoiceDate(fetchedLastDate);
                setLastInvoiceItemKeys(
                  new Set(
                    fetchedItems.map(
                      (it) =>
                        `${String(it.item_type)}|${String(it.deal_type ?? '')}|${String(it.item_id)}`,
                    ),
                  ),
                );
                setFieldValue(
                  'invoiceDetails.last_invoice_due',
                  String(due),
                  false,
                );

                const {
                  totalAmount: tAmt,
                  dueAmount: dAmt,
                  overalSubTotal: oSt,
                } = calculateTotals();
                setFieldValue('invoiceDetails.total_amount', tAmt, false);
                setFieldValue('invoiceDetails.due_amount', dAmt, false);
                setFieldValue('invoiceDetails.sub_total', oSt, false);
                lastDueFetchedFor.current = fetchKey;
              } catch {
                setGetLastInvoiceError(true);
              } finally {
                setLastInvoiceMetaLoading(false);
              }
            }
          } else {
            toast.error('No lead found');
            setFieldValue('invoiceDetails.lead_id', '');
            return;
          }

          prefilledFromQuery.current = true;
        }
      };
      setFormValuesFOrCustomerAndLead();
      // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when customer/lead/leads change, not on every invoiceDetails change
    }, [
      customerId,
      leadId,
      leads,
      setFieldValue,
      selectedLead,
      prefilledFromQuery,
      lastDueFetchedFor,
      lastInvoiceCreatedDate,
      setGetLastInvoiceError,
      calculateTotals,
    ]);

    return (
      <PageLayout component={Form}>
        <PageLayout.Header
          isListHeader={false}
          title={'Create Invoice'}
          breadcrumbs={[{ href: '/invoice', name: 'Invoices' }, { name: 'Add' }]}
          back={
            <Link href={`/invoice`}>
              <Button type="button" variant="text">
                Back to List
              </Button>
            </Link>
          }
        />

        <PageLayout.Content>
          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invoice Details
              </h3>
              <Grid container spacing={[2, 2]}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomerSearchAutocomplete
                    label="Customer"
                    name="invoiceDetails.customer_id"
                    value={values.invoiceDetails.customer_id ?? ''}
                    onChange={(customerId) => {
                      setFieldValue('invoiceDetails.customer_id', customerId);
                      setFieldValue('invoiceDetails.lead_id', '', false);
                      selectedLead.current = null;
                      lastInvoiceCreatedDate.current = null;
                      setLastInvoiceDate(null);
                      setLastInvoiceItemKeys(new Set());
                    }}
                    disabled={isCustomerAndLeadDisable}
                    error={Boolean(
                      touched.invoiceDetails?.customer_id &&
                      (errors.invoiceDetails as Record<string, unknown> | undefined)
                        ?.customer_id,
                    )}
                    helperText={
                      touched.invoiceDetails?.customer_id &&
                      (errors.invoiceDetails as Record<string, unknown> | undefined)
                        ?.customer_id as string | undefined
                    }
                    slotProps={{
                      root: {
                        sx: { width: '100%' },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Lead"
                    name="invoiceDetails.lead_id"
                    select
                    value={
                      leads.some(
                        (l) => Number(l.id) === Number(values.invoiceDetails.lead_id),
                      )
                        ? values.invoiceDetails.lead_id
                        : ''
                    }
                    onChange={(e) => {
                      const leadId = e.target.value;
                      setFieldValue('invoiceDetails.lead_id', leadId);
                      selectedLead.current = leads.find(
                        (l) => Number(l.id) === Number(leadId),
                      ) as Lead | null;

                      setFieldValue('invoiceDetails.invoice_date', '', false);
                      lastInvoiceCreatedDate.current = null;
                      setLastInvoiceDate(null);
                      setLastInvoiceItemKeys(new Set());
                      if (selectedLead.current) {
                        const items = selectedLead.current?.item_list
                          ?.filter((li: LeadItem) => Number(li.status ?? 0) !== 2)
                          .map((li: LeadItem) => ({
                            lead_item_id: li.id,
                            item_type: li.item_type,
                            deal_type: li.deal_type,
                            item_id: li.item_id,
                            item_name: li.item_name,
                            quantity: String(li.quantity ?? ''),
                            days: '1',
                            hours_per_day: String(li.hours_per_day ?? '1'),
                            unit_price: String(li.unit_price ?? ''),
                            total_price: computeItemTotal(
                              toNumber(li.quantity),
                              1,
                              toNumber(li.unit_price),
                              toNumber(li.hours_per_day) || 1,
                            ),
                            notes: li.notes,
                            start_date: li.start_date ?? null,
                            end_date: li.end_date ?? null,
                            status: li.status ?? 0,
                          }),
                          );
                        setFieldValue('invoiceItems', items);

                        // Update summary from new items immediately
                        const subtotalFromItems = (items ?? []).reduce(
                          (acc, it) =>
                            acc +
                            computeItemTotal(
                              toNumber(it.quantity),
                              toNumber(it.days ?? 1),
                              toNumber(it.unit_price),
                              toNumber(it.hours_per_day) || 1,
                            ),
                          0,
                        );
                        const amountAfterDiscount = Math.max(
                          0,
                          subtotalFromItems -
                          toNumber(values.invoiceDetails.discount_amount),
                        );
                        const overalSubTotal = Math.max(
                          0,
                          +(
                            amountAfterDiscount +
                            toNumber(
                              values.invoiceDetails.transportation_charge,
                            ) +
                            toNumber(values.invoiceDetails.other_charges) +
                            toNumber(values.invoiceDetails.last_invoice_due)
                          ).toFixed(2),
                        );
                        const totalAmount = Math.round(
                          values.invoiceDetails.is_deposit_counted === 1
                            ? Math.max(
                              0,
                              overalSubTotal -
                              Number(
                                selectedLead.current?.security_deposit ?? 0,
                              ),
                            )
                            : overalSubTotal,
                        );
                        setFieldValue(
                          'invoiceDetails.sub_total',
                          +overalSubTotal.toFixed(2),
                          false,
                        );
                        setFieldValue(
                          'invoiceDetails.total_amount',
                          totalAmount,
                          false,
                        );
                        setFieldValue(
                          'invoiceDetails.due_amount',
                          totalAmount,
                          false,
                        );

                        setLastInvoiceMetaLoading(true);
                        getCustomerLastInvoiceDueAmount(
                          String(values.invoiceDetails.customer_id),
                          leadId,
                        )
                          .then((res) => {
                            const due = toNumber(res?.data?.data?.dueAmount ?? 0);
                            const fetchedLastDate =
                              res?.data?.data?.lastInvoiceDate ?? null;
                            const fetchedItems =
                              (res?.data?.data?.lastInvoiceItems as
                                | Array<{
                                    item_type: string;
                                    deal_type: string | null;
                                    item_id: string | number;
                                  }>
                                | undefined) ?? [];
                            lastInvoiceCreatedDate.current = fetchedLastDate;
                            setLastInvoiceDate(fetchedLastDate);
                            setLastInvoiceItemKeys(
                              new Set(
                                fetchedItems.map(
                                  (it) =>
                                    `${String(it.item_type)}|${String(it.deal_type ?? '')}|${String(it.item_id)}`,
                                ),
                              ),
                            );
                            setFieldValue(
                              'invoiceDetails.last_invoice_due',
                              String(due),
                              false,
                            );

                            const { totalAmount, dueAmount, overalSubTotal } =
                              calculateTotals();
                            setFieldValue(
                              'invoiceDetails.total_amount',
                              totalAmount,
                              false,
                            );
                            setFieldValue(
                              'invoiceDetails.due_amount',
                              dueAmount,
                              false,
                            );
                            setFieldValue(
                              'invoiceDetails.sub_total',
                              overalSubTotal,
                            );
                            if (getLastInvoiceError)
                              setGetLastInvoiceError(false);
                          })
                          .catch(() => {
                            setGetLastInvoiceError(true);
                          })
                          .finally(() => {
                            setLastInvoiceMetaLoading(false);
                          });
                      }
                    }}
                    disabled={
                      !values.invoiceDetails.customer_id ||
                      isCustomerAndLeadDisable
                    }
                  >
                    {leadsLoading ? (
                      <MenuItem>
                        <span
                          role="status"
                          aria-label="Loading"
                          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin text-center"
                        ></span>
                      </MenuItem>
                    ) : leads && leads.length > 0 ? (
                      leads.map((l) => (
                        <MenuItem key={l.id} value={l.id}>
                          {l.lead_name} ({toDDMMYYYY(l.start_date)} -{' '}
                          {toDDMMYYYY(l?.end_date ?? '')})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No lead found</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    name="invoiceDetails.invoice_date"
                    label="Invoice Date"
                    minDate={
                      lastInvoiceDate
                        ? dayjs(lastInvoiceDate).add(1, 'day')
                        : selectedLead.current
                          ? dayjs(selectedLead.current.start_date)
                          : dayjs()
                    }
                    // disableFuture
                    disabled={!values.invoiceDetails.lead_id || lastInvoiceMetaLoading}
                    onChange={(e) => {
                      if (
                        e &&
                        (lastInvoiceDate ||
                          selectedLead.current?.start_date)
                      ) {
                        const selectedDate = dayjs(e).startOf('day');

                        // Billing period start (inclusive):
                        // - if last invoice exists: start from the next day of last invoice date
                        // - else: start from lead start date
                        const fallbackPeriodStart = lastInvoiceDate
                          ? dayjs(lastInvoiceDate).add(1, 'day').startOf('day')
                          : dayjs(selectedLead.current?.start_date).startOf('day');

                        // Update days per invoice item:
                        // - if item has end_date: count only item start -> item end (capped by invoice date)
                        // - if item has no end_date: count by invoice date range (periodStart -> invoice date),
                        //   but also respect item start_date if it starts later than periodStart
                        if (
                          values.invoiceItems &&
                          values.invoiceItems.length > 0
                        ) {
                          const updatedItems = values.invoiceItems.map(
                            (item) => {
                              const itemKey = `${String(item.item_type)}|${String(item.deal_type ?? '')}|${String(item.item_id)}`;
                              const existedInLastInvoice = lastInvoiceDate
                                ? lastInvoiceItemKeys.has(itemKey)
                                : false;

                              const itemPeriodStart = existedInLastInvoice
                                ? fallbackPeriodStart
                                : item.start_date
                                  ? dayjs(item.start_date).startOf('day')
                                  : fallbackPeriodStart;

                              const d = computeDaysForInvoiceItem({
                                invoiceDate: selectedDate,
                                periodStart: itemPeriodStart,
                                itemStart: item.start_date ?? null,
                                itemEnd: item.end_date ?? null,
                                // Never backbill before the current invoice period start.
                                // First invoice periodStart is lead start, later invoices use last invoice date.
                                allowBackbillBeforePeriodStart: false,
                              });
                              return {
                                ...item,
                                days: String(d),
                                total_price: computeItemTotal(
                                  toNumber(item.quantity),
                                  d,
                                  toNumber(item.unit_price),
                                  toNumber(item.hours_per_day) || 1,
                                ),
                              };
                            },
                          );
                          setFieldValue('invoiceItems', updatedItems);
                          updateSummaryFromTotals();
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </div>

          {/* Items */}
          {!getLastInvoiceError &&
            values.invoiceDetails.lead_id &&
            leads &&
            leads.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Items from Lead
                  </h3>

                  {/* Header Row */}
                  <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 border-b pb-2 mb-2">
                    <div className="col-span-2">Item Type</div>
                    <div className="col-span-2">Item Name</div>
                    <div className="col-span-2">Deal Type</div>
                    <div className="col-span-1 text-center">Quantity</div>
                    <div className="col-span-2 text-center">
                      Hour | Sale Price
                    </div>
                    <div className="col-span-1 text-center">Hours/Day</div>
                    <div className="col-span-1 text-center">Days</div>
                    <div className="col-span-1 text-center">Total</div>
                  </div>

                  {/* Items */}
                  {values?.invoiceItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-4 items-center py-2 border-b last:border-b-0"
                    >
                      {/* Item Type */}
                      <div className="col-span-2 text-gray-900">
                        {capitalizeFirstLetter(item.item_type)}
                      </div>

                      {/* Item Name */}
                      <div className="col-span-2 text-gray-900">
                        {capitalizeFirstLetter(item.item_name)}
                      </div>

                      {/* Deal Type */}
                      <div className="col-span-2 text-gray-900">
                        {capitalizeFirstLetter(item?.deal_type || '-')}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1 text-center text-gray-900">
                        {item.quantity}
                      </div>

                      {/* Unit Price - editable */}
                      <div className="col-span-2 text-center">
                        <NumberField
                          name={`invoiceItems.${idx}.unit_price`}
                          fullWidth
                          size="small"
                          allowDecimal
                          decimalScale={4}
                          onChange={(e) => {
                            const newPrice = toNumber(e.target.value);
                            const qty = toNumber(item.quantity);
                            const days = toNumber(item.days) || 1;
                            const hours = toNumber(item.hours_per_day) || 1;
                            setFieldValue(
                              `invoiceItems.${idx}.total_price`,
                              computeItemTotal(qty, days, newPrice, hours),
                            );
                            updateSummaryFromTotals();
                          }}
                          slotProps={{
                            input: {
                              sx: {
                                padding: '4px 8px',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                              },
                            },
                          }}
                        />
                      </div>

                      {/* Hours per day - editable */}
                      <div className="col-span-1 text-center">
                        <NumberField
                          name={`invoiceItems.${idx}.hours_per_day`}
                          fullWidth
                          size="small"
                          allowDecimal
                          decimalScale={4}
                          onChange={(e) => {
                            const newHours = toNumber(e.target.value) || 0;
                            const qty = toNumber(item.quantity);
                            const days = toNumber(item.days) || 1;
                            const unit = toNumber(item.unit_price);
                            setFieldValue(
                              `invoiceItems.${idx}.total_price`,
                              computeItemTotal(qty, days, unit, newHours || 1),
                            );
                            updateSummaryFromTotals();
                          }}
                          slotProps={{
                            input: {
                              sx: {
                                padding: '4px 8px',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                              },
                            },
                          }}
                        />
                      </div>

                      {/* Days - calculate from last invoice data to selected invoice date*/}
                      <div className="col-span-1 text-center">
                        <NumberField
                          name={`invoiceItems.${idx}.days`}
                          fullWidth
                          size="small"
                          onChange={(e) => {
                            const newDays = toNumber(e.target.value) || 1;
                            const qty = toNumber(item.quantity);
                            const unit = toNumber(item.unit_price);
                            const hours = toNumber(item.hours_per_day) || 1;
                            setFieldValue(
                              `invoiceItems.${idx}.total_price`,
                              computeItemTotal(qty, newDays, unit, hours),
                            );
                            updateSummaryFromTotals();
                          }}
                          allowDecimal={true}
                          decimalScale={4}
                          allowNegative={false}
                          slotProps={{
                            input: {
                              sx: {
                                padding: '4px 8px',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                              },
                            },
                          }}
                        />
                      </div>

                      {/* Total */}
                      <div className="col-span-1 text-center text-gray-900">
                        ₹{item.total_price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 border-t">
                    Summary
                  </h3>

                  {/* Calculate values for display */}
                  {(() => {
                    const discountAmount = toNumber(
                      values.invoiceDetails.discount_amount,
                    );
                    const transportationCharge = toNumber(
                      values.invoiceDetails.transportation_charge,
                    );
                    const otherCharges = toNumber(
                      values.invoiceDetails.other_charges,
                    );
                    const { subtotal, totalAmount: grandTotal } =
                      calculateTotals();
                    return (
                      <div className="grid grid-cols-12 gap-4">
                        {/* Subtotal */}
                        <div className="col-span-10 flex flex-wrap justify-end items-center text-right text-gray-700">
                          <span className="mr-2">Subtotal</span>
                          <div className="hidden sm:block w-[80px]" />
                        </div>
                        <div className="col-span-2 text-center text-gray-900 font-medium">
                          {formatINR(subtotal)}
                        </div>

                        {/* Last Invoice Due */}
                        <div className="col-span-10 flex flex-wrap justify-end items-center text-right text-gray-700 gap-2">
                          <span>Last Invoice Due</span>
                          <NumberField
                            size="small"
                            name="invoiceDetails.last_invoice_due"
                            disabled
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '4px 8px',
                                fontSize: '0.875rem',
                                width: '60px',
                                textAlign: 'center',
                              },
                            }}
                          />
                        </div>
                        <div className="col-span-2 text-center text-gray-900 font-medium">
                          {formatINR(
                            toNumber(
                              values.invoiceDetails.last_invoice_due,
                            ).toFixed(0),
                          )}
                        </div>

                        {/* Transportation Charge */}
                        <div className="col-span-10 flex flex-wrap justify-end items-center text-right text-gray-700 gap-2">
                          <span>Transportation Charge</span>
                          <NumberField
                            size="small"
                            name="invoiceDetails.transportation_charge"
                            allowDecimal
                            decimalScale={4}
                            onChange={() => updateSummaryFromTotals()}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '4px 8px',
                                fontSize: '0.875rem',
                                width: '60px',
                                textAlign: 'center',
                              },
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 text-center text-gray-900 font-medium">
                          {formatINR(transportationCharge.toFixed(0))}
                        </div>

                        {/* Other Charges */}
                        <div className="col-span-10 flex flex-wrap justify-end items-center text-right text-gray-700 gap-2">
                          <span>Other Charges</span>
                          <NumberField
                            size="small"
                            name="invoiceDetails.other_charges"
                            allowDecimal
                            decimalScale={4}
                            onChange={() => updateSummaryFromTotals()}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '4px 8px',
                                fontSize: '0.875rem',
                                width: '60px',
                                textAlign: 'center',
                              },
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 text-center text-gray-900 font-medium">
                          {formatINR(otherCharges.toFixed(0))}
                        </div>

                        {/* Flat Discount */}
                        <div className="col-span-10 flex flex-wrap justify-end items-center text-right text-gray-700 gap-2">
                          <span>Flat Discount</span>
                          <NumberField
                            size="small"
                            name="invoiceDetails.discount_amount"
                            allowDecimal
                            decimalScale={4}
                            onChange={() => updateSummaryFromTotals()}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '4px 8px',
                                fontSize: '0.875rem',
                                width: '60px',
                                textAlign: 'center',
                              },
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 text-center font-medium text-red-600">
                          {'- ' + formatINR(discountAmount.toFixed(0))}
                        </div>

                        {/* Count Security Deposit */}
                        <div className="col-span-10 flex flex-wrap justify-end items-center text-right text-gray-700 gap-2">
                          <span>
                            Count Security Deposit
                            <Tooltip title="count deposit and mark lead as completed">
                              <InfoOutlineIcon
                                color="primary"
                                sx={{ cursor: 'pointer', fontSize: '16px' }}
                              />
                            </Tooltip>
                          </span>
                          <div className="hidden sm:block w-[80px] text-start">
                            <Checkbox
                              checked={!!values.invoiceDetails.is_deposit_counted}
                              disabled={!values.invoiceDetails.lead_id}
                              onChange={(e) => {
                                const val = e.target.checked ? 1 : 0;
                                setFieldValue(
                                  'invoiceDetails.is_deposit_counted',
                                  val,
                                );
                                if (val === 1) {
                                  setFieldValue(
                                    'invoiceDetails.payment_status',
                                    2,
                                  );
                                }
                                updateSummaryFromTotals();
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-span-2 text-center font-medium text-red-600">
                          {values.invoiceDetails.is_deposit_counted === 1 &&
                            '- ' +
                            formatINR(selectedLead.current?.security_deposit)}
                        </div>

                        {/* Grand Total */}
                        <div className="col-span-10 text-right text-lg font-semibold border-t pt-4 text-gray-900">
                          Grand Total
                        </div>
                        <div
                          className={`col-span-2 text-center text-lg font-semibold border-t pt-4 ${grandTotal < 0 ? 'text-red-600' : 'text-green-600'
                            }`}
                        >
                          {formatINR(Math.abs(grandTotal))}

                          <div className="text-sm font-medium mt-1">
                            {grandTotal < 0
                              ? 'Pay to Customer'
                              : 'Take from Customer'}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
            <div className="p-6">
              {/* Status Fields */}
              <Grid container spacing={[2, 2]}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Payment Status"
                    name="invoiceDetails.payment_status"
                    onChange={(e) =>
                      setFieldValue(
                        'invoiceDetails.payment_status',
                        Number(e.target.value),
                      )
                    }
                  >
                    <MenuItem value={0}>Unpaid</MenuItem>
                    <MenuItem value={1}>Partial</MenuItem>
                    <MenuItem value={2}>Paid</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Invoice Status"
                    name="invoiceDetails.invoice_status"
                    onChange={(e) =>
                      setFieldValue(
                        'invoiceDetails.invoice_status',
                        e.target.value,
                      )
                    }
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </TextField>
                </Grid>

                {Number(values.invoiceDetails.payment_status) === 2 && (
                  <PaymentMethodFields namePrefix="invoiceDetails." />
                )}

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    name="invoiceDetails.notes"
                    onChange={(e) =>
                      setFieldValue('invoiceDetails.notes', e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        </PageLayout.Content>

        <PageContainer sx={{ px: 0 }}>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
            sx={{ mr: 2 }}
            disabled={getLastInvoiceError}
          >
            Save
          </LoadingButton>
          <Button
            onClick={() => router.push(`/invoice`)}
            disabled={isSubmitting}
            type="button"
            variant="text"
            sx={{ px: 3, color: 'neutral.200' }}
          >
            Cancel
          </Button>
        </PageContainer>
      </PageLayout>
    );
  };
