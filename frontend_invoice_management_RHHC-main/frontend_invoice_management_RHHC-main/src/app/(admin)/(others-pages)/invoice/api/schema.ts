export type InvoiceItem = {
  lead_item_id?: number;
  item_type: 'product' | 'service';
  deal_type: string | null;
  item_id: string | number;
  item_name: string;
  quantity: string;
  days: string;
  hours_per_day: string;
  unit_measure?: string;
  unit_price: string;
  total_price: number;
  notes?: string | null;
  // Optional lead item metadata (used only for day calculation UI)
  start_date?: string | null;
  end_date?: string | null;
  status?: 0 | 1 | 2;
};

export type InvoiceValues = {
  account_id: number;
  branch_id: number;
  invoiceDetails: {
    lead_id: number | '';
    customer_id: number | '';
    invoice_date: string; // yyyy-mm-dd
    total_amount: number; // computed
    sub_total: number; // without deposite
    paid_amount: number; // fixed 0 for create
    due_amount: number; // computed = total_amount - paid_amount
    other_charges: string | null;
    transportation_charge: string | null;
    last_invoice_due: string | null;
    discount_amount: string;
    payment_status: 0 | 1 | 2; // 0 unpaid, 1 partial, 2 paid
    invoice_status: 'draft' | 'published';
    notes: string;
    security_deposit: number | null;
    settlement_amount: number | null;
    is_deposit_counted: number;
    is_first_invoice: number;
    payment_method?: string;
    other_details?: Record<string, string> | null;
  };

  invoiceItems: InvoiceItem[] | null;
};

export type MarkRentedProductsReturnedValues = {
  note: string;
  return_date: string;
  lead_id: number;
  account_id: number;
  branch_id: number;
};