'use client';

import { messages } from '@/modules/common/constant/messages';
import { toNumber } from '@/modules/common/helpers/helper';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import { updateLead } from '../../../api';
import LeadForm from '../../../components/lead-form';
import { LeadFormValues } from '../../../components/lead-form/types';
import { leadToFormValues } from '../../../components/lead-form/utils';
import { useLeadEditPageContext } from '../../context';

interface EditGeneralInformationProps {
  onSave: () => void;
  onCancel: () => void;
}

const EditGeneralInformation: React.FC<EditGeneralInformationProps> = ({
  onSave,
  onCancel,
}) => {
  const { lead, setLoading } = useLeadEditPageContext();
  const invalidate = useInvalidate();

  const initialValues = useMemo(() => leadToFormValues(lead), [lead]);
  const lockLeadDetails = lead?.status === 'finalised';

  const handleSubmit = async (values: LeadFormValues) => {
    try {
      setLoading(true);
      const payload = {
        customer_id: values.leadDetails.customer_id,
        lead_name: values.leadDetails.lead_name,
        start_date: values.leadDetails.start_date,
        security_deposit: toNumber(values.leadDetails.security_deposit),
        status: values.leadDetails.status,
        notes: values.leadDetails.notes ?? null,
        leadItems: values.leadItems.map((item) => ({
          ...(item.id ? { id: item.id } : {}),
          item_type: item.item_type,
          deal_type: item.item_type === 'product' ? item.deal_type : null,
          item_id: item.item_id,
          item_name: item.item_name,
          start_date: item.start_date || null,
          end_date: item.end_date || null,
          quantity: toNumber(item.quantity),
          unit_price: toNumber(item.unit_price),
          hours_per_day: toNumber(item.hours_per_day),
          total_price: toNumber(item.total_price),
          notes: item.notes || null,
        })),
      };
      const res = await updateLead(
        String(lead?.id),
        payload as Parameters<typeof updateLead>[1],
      );
      if (res?.status) {
        toast.success(messages.COMMONUPDATE('Lead'));
        await invalidate(['getLeadById']);
        await invalidate(['getLead']);
        onSave();
      }
    } catch {
      // error handled by caller or toast
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) return null;

  return (
    <LeadForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel="Update"
      showCancel
      onCancel={onCancel}
      showHeader={false}
      lockLeadDetails={lockLeadDetails}
    />
  );
};

export default EditGeneralInformation;
