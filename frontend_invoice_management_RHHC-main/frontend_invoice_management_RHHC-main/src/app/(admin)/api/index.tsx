import api from '@/modules/common/libs/axios';
import { AxiosApi } from '@/modules/common/types/api';
import {
  GetDashboardDataApiResponseDto,
  GetStaffDashboardSummaryApiResponseDto,
  Payload,
  StaffDashboardPayload,
  GetBlockedStaffListApiResponseDto,
  GetBlockedStaffListPayload,
  GetInProgressStaffActivitiesApiResponseDto,
  GetInProgressStaffActivitiesPayload,
} from './schema';

export const getDashboardData: AxiosApi<GetDashboardDataApiResponseDto, Payload> = (data) => {
  return api.post(`/dashboard/getDashboardData`, data);
};

export const getStaffDashboardSummary: AxiosApi<
  GetStaffDashboardSummaryApiResponseDto,
  StaffDashboardPayload
> = (data) => {
  return api.post(`/staff/dashboardSummary`, data);
};

export const getBlockedStaffListByAccountBranch: AxiosApi<
  GetBlockedStaffListApiResponseDto,
  GetBlockedStaffListPayload
> = (data) => {
  return api.get(`/staff/getBlockedStaffListByAccountBranch`, {
    params: data,
  });
};

export const getAllInProgressStaffActivities: AxiosApi<
  GetInProgressStaffActivitiesApiResponseDto,
  GetInProgressStaffActivitiesPayload
> = (data) => {
  return api.get(`/staff/getAllInProgressStaffActivities`, {
    params: data,
  });
};