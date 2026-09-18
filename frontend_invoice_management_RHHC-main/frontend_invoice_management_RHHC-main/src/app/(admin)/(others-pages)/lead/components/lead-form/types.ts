import { Lead } from '@/modules/common/models/lead';

export type LeadItemForm = {
  id?: number;
  item_type: 'product' | 'service';
  deal_type: 'rent' | 'sell' | null;
  item_id: string | number;
  item_name: string;
  quantity: string;
  unit_price: string;
  hours_per_day: string;
  total_price: string;
  start_date: string;
  end_date: string;
  notes: string | null;
};

export type LeadFormValues = {
  account_id: number;
  branch_id: number;
  leadDetails: Omit<Lead, 'end_date' | 'security_deposit'> & {
    security_deposit: string;
  };
  leadItems: LeadItemForm[];
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export const emptyLeadItemForm = (): LeadItemForm => ({
  item_type: 'service',
  deal_type: 'rent',
  item_id: '',
  item_name: '',
  quantity: '1',
  unit_price: '',
  hours_per_day: '24',
  total_price: '',
  start_date: todayISO(),
  end_date: '',
  notes: '',
});
