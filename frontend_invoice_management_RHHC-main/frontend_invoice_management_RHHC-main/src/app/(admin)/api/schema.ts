import {
  DashboardData,
  StaffDashboardSummary,
} from '@/modules/common/models/dashboard';
import { ResponseDto } from '@/modules/common/types/api';

export type GetDashboardDataApiResponseData = DashboardData;

export type GetDashboardDataApiResponseDto =
  ResponseDto<GetDashboardDataApiResponseData>;

export type GetStaffDashboardSummaryApiResponseData = StaffDashboardSummary;

export type GetStaffDashboardSummaryApiResponseDto =
  ResponseDto<GetStaffDashboardSummaryApiResponseData>;

// Dashboard Payload Types
export type Payload = {
  account_id: number | string;
  branch_id: number | string;
  from_date?: string | null;
  to_date?: string | null;
  excluded_id?: string;
};

export type StaffDashboardPayload = {
  account_id: number | string;
  branch_id: number | string;
  from_date?: string | null;
  to_date?: string | null;
};

// Blocked Staff Types
export type GetBlockedStaffListPayload = {
  account_id: number | string;
  branch_id: number | string;
};

export interface BlockedStaff {
  status: string;
  block_reason: string | null;
  updated_at: string;
  name: string;
  id: number;
}

export interface GetBlockedStaffListApiResponseData {
  message: string;
  data: BlockedStaff[];
}

export type GetBlockedStaffListApiResponseDto =
  ResponseDto<GetBlockedStaffListApiResponseData>;

// In-Progress Staff Activities Types
export type GetInProgressStaffActivitiesPayload = {
  account_id: number | string;
  branch_id: number | string;
  fetchAll?: number | string;
  page?: number;
  limit?: number;
};

export interface InProgressStaffActivity {
  id: number;
  user_id: number;
  customer_id: number;
  service_id: number;
  account_id: number;
  branch_id: number;
  from_date_time: string;
  to_date_time: string;
  status: string;
  service_price: string;
  staff_name: string;
  customer_name: string;
  service_name: string;
  created_at: string;
  updated_at: string;
  start_date_time: string;
}

export interface GetInProgressStaffActivitiesApiResponseData {
  message: string;
  data: InProgressStaffActivity[] | {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    data: InProgressStaffActivity[];
  };
}

export type GetInProgressStaffActivitiesApiResponseDto =
  ResponseDto<GetInProgressStaffActivitiesApiResponseData>;