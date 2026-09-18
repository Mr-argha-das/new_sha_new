import { BaseDocument } from './baseDocument';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export interface Product extends BaseDocument {
  id: string;
  account_id: number;
  branch_id: number;
  name: string;
  description?: string | null;
  base_price: number | string | null;
  sale_price?: number | null | string;
  image?: string | null;
  hour_rent_price?: number | null | string;
  status: ProductStatus;
  purchase_date?: string | null;
  sku_code?: string | null;
  total_stock?: number | null;
  available_stock?: number | null;
  rented_stock?: number | null;
  sold_stock?: number | null;
}

export enum DealType {
  RENT = 'rent',
  SELL = 'sell',
}

export interface ProductTracking extends BaseDocument {
  id: string;
  account_id: number;
  branch_id: number;
  lead_id: number;
  product_id: number;
  customer_id: number;
  status: number;
  quantity: number;
  deal_type: DealType;
  rent_start_date?: string | null;
  rent_end_date?: string | null;
  return_date?: string | null;
  sold_date?: string | null;
  notes?: string | null;
}

export interface ProductTrackingHistory extends ProductTracking {
  customer_name: string;
  customer_id: number;
  lead_name: string;
  lead_id: number;
  lead_start_date: string;
  lead_end_date: string;
}