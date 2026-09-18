import { BaseDocument } from './baseDocument';

export enum LeadStatus {
  CREATED = 'created',
  INPROGRESS = 'inProgress',
  PRODUCT_RETURN_PENDING = 'productReturnPending',
  COMPLETED = 'completed',
}

export enum Status {
  DRAFT = 'draft',
  FINALISED = 'finalised',
  ONHOLD = 'onhold',
  INVALID = 'invalid',
}

export interface Lead extends BaseDocument {
  id?: string;
  customer_id: string;
  lead_name: string;
  start_date: string;
  end_date?: string | null;
  security_deposit: number;
  status: Status;
  lead_status?: LeadStatus;
  customer_name?: string;
  notes: string | null;
  item_list?: LeadItem[];
}

export interface LeadItem {
  id?: number;
  lead_id?: number;
  item_type: 'product' | 'service';
  deal_type: string | null;
  item_id: string | number;
  item_name: string;
  quantity: number | string;
  unit_price: number;
  hours_per_day: number;
  total_price: number;
  start_date?: string | null;
  end_date?: string | null;
  status?: 0 | 1 | 2;
  notes?: string | null;
}
