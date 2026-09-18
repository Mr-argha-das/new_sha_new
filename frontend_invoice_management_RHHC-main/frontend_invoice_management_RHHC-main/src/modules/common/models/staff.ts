import { AddressInputValues } from '../address-input';
import { BaseDocument } from './baseDocument';

export interface StaffExperienceDocument {
  id?: string;
  name: string;
  path?: string;
}

export interface ReferralDetails {
  name?: string;
  designation?: string;
  contact_no?: string;
}

// Payload expected by backend per Joi schema
export interface StaffExperiencePayload {
  org_name: string;
  category_id: number;
  from_month_year: string | Date;
  to_month_year?: string | Date | null;
  total_experience_month: number;
  is_currently_working: 0 | 1;
  referral_details?: ReferralDetails | null;
  worked_in?: 'icu' | 'non-icu' | null;
  description?: string | null;
  documents?: StaffExperienceDocument[];
}

// Full model as stored/returned by backend (if needed by UI)
export interface StaffExperience extends BaseDocument, StaffExperiencePayload {
  id: number;
  user_id?: number;
  category_name?: string;
}

export enum staffTaskStatus {
  todo = 'todo',
  inProgress = 'inProgress',
  done = 'done',
  onHold = 'onHold',
}

export interface StaffTask extends BaseDocument {
  id?: NumericId;
  user_id: NumericId;
  customer_id: NumericId;
  from_date_time: string;
  to_date_time: string;
  status: staffTaskStatus;
  service_id: NumericId;
  service_price: number;
  service_name: string;
  customer_name: string;
  staff_name: string;
  start_date_time: string;
  end_date_time: string;
  total_hour: number;
  total_hold_minutes?: number | null;
  task_holds?: Array<{
    id: number;
    task_id?: number;
    account_id?: number;
    branch_id?: number;
    hold_start_at: string;
    hold_end_at: string | null;
    duration_minutes: number;
    is_carry_forward: 0 | 1;
    notes: string | null;
    is_deleted?: 0 | 1;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string;
    updated_at?: string;
  }>;
  payment_status: number;
  staff_working_hours: number;
  note_by_staff: string;
  customer_address: AddressInputValues;
  staff_invoice_id: number;
}
