import { toYYYYMMDD } from '@/modules/common/helpers/dateFormat';
import { Lead } from '@/modules/common/models/lead';
import { LeadFormValues, LeadItemForm } from './types';

export function leadToFormValues(lead: Lead | null | undefined): LeadFormValues | null {
  if (!lead) return null;
  const items = (lead as Lead & { items?: Array<Record<string, unknown>> }).items ?? [];
  const leadItems: LeadItemForm[] = items.map((it: Record<string, unknown>) => {
    const qty = Number(it.quantity) || 0;
    const unit = Number(it.unit_price) || 0;
    const hours = Number(it.hours_per_day) || 1;
    const total = Math.round(qty * unit * hours);
    return {
      ...(typeof it.id === 'number' ? { id: it.id as number } : {}),
      item_type: (it.item_type as 'product' | 'service') || 'service',
      deal_type: (it.deal_type as 'rent' | 'sell' | null) ?? null,
      item_id: it.item_id != null ? String(it.item_id) : '',
      item_name: String(it.item_name ?? ''),
      quantity: String(it.quantity ?? '1'),
      unit_price: String(it.unit_price ?? ''),
      hours_per_day: String(it.hours_per_day ?? '1'),
      total_price: String(total),
      start_date: toYYYYMMDD((it.start_date as string | null | undefined) ?? '') || '',
      end_date: toYYYYMMDD((it.end_date as string | null | undefined) ?? '') || '',
      notes: it.notes != null ? String(it.notes) : null,
    };
  });
  if (leadItems.length === 0) {
    leadItems.push({
      item_type: 'service',
      deal_type: 'rent',
      item_id: '',
      item_name: '',
      quantity: '1',
      unit_price: '',
      hours_per_day: '24',
      total_price: '',
      start_date: '',
      end_date: '',
      notes: null,
    });
  }
  return {
    account_id: lead.account_id as number,
    branch_id: lead.branch_id as number,
    leadDetails: {
      customer_id: lead.customer_id ?? '',
      lead_name: lead.lead_name ?? '',
      start_date: toYYYYMMDD(lead.start_date ?? ''),
      security_deposit: String(lead.security_deposit ?? ''),
      status: lead.status as LeadFormValues['leadDetails']['status'],
      notes: lead.notes ?? '',
    },
    leadItems,
  };
}
