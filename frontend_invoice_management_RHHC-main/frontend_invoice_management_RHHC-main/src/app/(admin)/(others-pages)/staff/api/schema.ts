import {
  StaffExperience,
  staffTaskStatus,
} from '@/modules/common/models/staff';
import { User } from '@/modules/common/models/user';
import { ResponseDto } from '@/modules/common/types/api';

export type GetUserByIdApiResponseData = User;
export type GetUserByIdApiResponseDto = ResponseDto<GetUserByIdApiResponseData>;

export type UserListResponseDto = ResponseDto<User>;

// Minimal list item used in selects
export type ListItem = {
  id: number;
  name: string;
  hour_price?: number;
  working_hours?: number;
  designation?: string | null;
};

// Staff Quick Pay
export type StaffQuickPayStatus = 0 | 1;
export interface StaffQuickPayPayload {
  user_id: number;
  account_id: number;
  branch_id: number;
  date: string;
  description: string | null;
  amount: number;
  status: StaffQuickPayStatus;
}

export interface StaffQuickPay extends StaffQuickPayPayload {
  id: number;
}

export type StaffQuickPayResponse = ResponseDto<StaffQuickPay>;

// Experience
export type StaffExperienceResponse = ResponseDto<StaffExperience>;

// Generic envelope for list
export type ListResponse<T> = ResponseDto<{
  data: T[];
  meta: { total: number };
}>;

// Pay slip types (minimal to avoid any)
export interface StaffPaySlipMinimal {
  id: number;
  user_id: number;
  staff_name: string;
  from_date: string; // ISO date
  to_date: string; // ISO date
  invoice_status: string; // e.g., 'draft' | 'final'
  invoice: {
    hour_price?: number | string | null;
    total_hour?: number | string | null;
  };
}
export type StaffPaySlipResponse = ResponseDto<StaffPaySlipMinimal>;

export type UpdateActivityStatusPayload = {
  id: number;
  status: 'todo' | 'inProgress' | 'done' | 'onHold';
  note_by_staff?: string;
  is_carry_forward?: 0 | 1;
};

export interface StaffTaskForm {
  account_id: NumericId;
  branch_id: NumericId;
  user_id: string;
  customer_id: string;
  from_date_time: string;
  to_date_time: string;
  status: staffTaskStatus;
  service_id: string;
  service_price: number;
  staff_working_hours: number;
}

export interface UpdateStaffTaskForm {
  from_date_time: string;
  to_date_time: string;
  status: staffTaskStatus;
  staff_working_hours: number;
}
