import { BaseDocument } from './baseDocument';

export interface AccountSettings extends BaseDocument {
  id?: ID;
  name: string;
  logo?: File | string | null;
  stamp?: File | string | null;
  qr_scanner?: File | string | null;
  stamp_signature?: File | string | null;
  address_lines: string | null;
  mobile: string;
  email: string;
  extra_ids:
  | Record<string, string | number>
  | null
  | Record<string, string | number>[];
  service_type: string;
  bank_details: {
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc: string;
  };
  use_stamp_image: number; //which image to use in invoice pdf. 0 = stamp, 1= stamp_signature
  account_id: number;
  branch_id: number;
}
