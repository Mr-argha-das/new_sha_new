'use client';

import { useAuth } from '@/context/AuthContext';
import Link from '@/modules/common/elements/link';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Status } from '@/modules/common/models/lead';
import { Button } from '@mui/material';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import LeadForm from '../components/lead-form';
import { emptyLeadItemForm, LeadFormValues } from '../components/lead-form/types';
import { createLead } from '../api';
import { messages } from '@/modules/common/constant/messages';

const toNumber = (v: unknown): number => {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const AddLead: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const invalidate = useInvalidate();

  const initialValues: LeadFormValues = useMemo(
    () => ({
      account_id: user?.account_id as number,
      branch_id: user?.branch_id as number,
      leadDetails: {
        customer_id: '',
        lead_name: '',
        start_date: todayISO(),
        security_deposit: '',
        status: Status.DRAFT,
        notes: '',
      },
      leadItems: [{ ...emptyLeadItemForm() }],
    }),
    [user?.account_id, user?.branch_id],
  );

  const handleSubmit = async (values: LeadFormValues) => {
    try {
      const payload = {
        ...cloneDeep(values),
        leadDetails: {
          ...values.leadDetails,
          security_deposit: toNumber(values.leadDetails.security_deposit),
        },
        leadItems: values.leadItems.map((item) => ({
          ...item,
          deal_type: item.item_type === 'product' ? item.deal_type : null,
          start_date: item.start_date || null,
          end_date: item.end_date || null,
          quantity: toNumber(item.quantity),
          unit_price: toNumber(item.unit_price),
          hours_per_day: toNumber(item.hours_per_day),
          total_price: toNumber(item.total_price),
        })),
      };

      const res = await createLead(payload);

      const ok = Boolean(res?.data?.success);
      if (ok) {
        toast.success(messages.COMMONADDED('Lead'));
        await invalidate(['getLead']);
        router.push('/lead');
        return;
      }

      toast.error(String(res?.data?.message || 'Failed to create lead'));
    } catch (err) {
      const e = err as { response?: { data?: { message?: unknown } } };
      const msg = e?.response?.data?.message ?? 'Failed to create lead';
      toast.error(String(msg));
    }
  };

  return (
    <LeadForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      title="Create Lead"
      breadcrumbs={[{ href: '/lead', name: 'Leads' }, { name: 'Add' }]}
      back={
        <Link href="/lead">
          <Button type="button" variant="text">
            Back to List
          </Button>
        </Link>
      }
      submitLabel="Save"
      showCancel
      onCancel={() => router.push('/lead')}
    />
  );
};

export default AddLead;
