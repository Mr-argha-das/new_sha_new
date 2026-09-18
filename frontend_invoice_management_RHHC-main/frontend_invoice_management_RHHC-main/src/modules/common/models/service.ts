import { BaseDocument } from './baseDocument';

export interface Service extends BaseDocument {
  id?: string;
  name: string;
  description?: string | null;
  hour_price?: number | null | string;
}
