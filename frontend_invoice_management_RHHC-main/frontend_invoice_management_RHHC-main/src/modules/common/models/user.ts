import { AddressInputValues } from '../address-input';
import { BaseDocument } from './baseDocument';
import { Lead } from './lead';

export interface User extends BaseDocument {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  username: string;
  role_name?: string;
  role_id?: ID;
  permanent_address?: AddressInputValues | null;
  temporary_address?: AddressInputValues | null;
  age: string | null;
  gender: string;
  leads?: Lead[];
  total_experience_in_months: number | null;
  hour_price?: number;
  working_hours?: number;
  aadhar_number?: string;
  pan_number?: string;
  driving_license_number?: string;
  has_vehicle?: 1 | 0;
  has_driving_license?: 1 | 0;
  status: 'string';
  aadhar_card_url?: string;
  pan_card_url?: string;
  driving_license_url?: string;
  photo_url?: string;
  date_of_birth?: string;
  marital_status?: 'married' | 'unmarried' | '';
  designation?: 'nurse' | 'attendant';
  police_verification?: 1 | 0;
  medical_verification?: 1 | 0;
  password?: string;
  menu_map?: string;
  block_reason?: string;
  reference_relationship?: string | null;
  reference_mobile_1?: string | null;
  reference_mobile_2?: string | null;
  reference_aadhar_url?: string | null;
}

export interface ReferralDetails {
  name?: string;
  designation?: string;
  contact_no?: string;
}

export interface StaffExperienceDocument {
  id?: string;
  name: string;
  path?: string;
}

export interface staffExperience extends BaseDocument {
  id: number;
  account_id: number;
  branch_id: number;
  user_id: number;
  category_id: number;
  from_month_year: string | Date;
  to_month_year?: string | Date | null;
  total_experience_month: number;
  org_name: string;
  referral_details?: ReferralDetails | null;
  worked_in?: 'icu' | 'non-icu' | null;
  description?: string | null;
  is_deleted: 0 | 1;
  is_currently_working: 0 | 1;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: Date;
  updated_at?: Date;
  documents?: StaffExperienceDocument[];
}
