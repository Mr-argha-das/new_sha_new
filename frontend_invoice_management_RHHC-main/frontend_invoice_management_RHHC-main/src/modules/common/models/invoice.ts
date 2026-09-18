import { AddressInputValues } from '../address-input';
import { BaseDocument } from './baseDocument';
import { LeadStatus } from './lead';

export interface Invoice extends BaseDocument {
  id: string;
  customer_id: ID;
  lead_id: ID;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  sub_total: string;
  discount_amount: string;
  paid_amount: string;
  due_amount: string;
  other_charges: number | null;
  transportation_charge: number | null;
  settlement_amount: number | null;
  security_deposit: number | null;
  invoice_status: string;
  payment_status: string;
  paymentLength: number | null;
  customer_name: string;
  lead_name: string;
  customer_mobile: string;
  total_quantity: string;
  payment?: InvoicePaymentHistory[];
  notes?: string;
  items?: InvoiceItem[];
  customer_address: AddressInputValues;
  customer_age: number;
  customer_gender: string;
  customer_email: string;
  last_invoice_due: number | null;
  lead_start_date: string;
  lead_end_date: string;
  lead_security_deposit: string | null;
  is_deposit_counted: number;
  lead_status: LeadStatus;
  has_rent_product?: number;
}

export interface InvoiceItem {
  id: string;
  item_type: 'product' | 'service';
  deal_type: 'rent' | 'sell' | null;
  item_id: string;
  item_name: string;
  quantity: number;
  days: number;
  hours_per_day: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

export interface InvoicePaymentHistory {
  id?: number;
  payment_date: string;
  amount: number | string;
  payment_method: string;
  notes: string | null;
  other_details?: Record<string, string> | null;
}
