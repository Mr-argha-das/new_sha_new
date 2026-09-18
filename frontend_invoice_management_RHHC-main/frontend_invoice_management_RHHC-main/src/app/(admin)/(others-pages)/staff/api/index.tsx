// import { User } from '@/app/api/user/schema';
import api from '@/modules/common/libs/axios';
import { StaffExperience, StaffTask } from '@/modules/common/models/staff';
import { User } from '@/modules/common/models/user';
import { AxiosApi, CreateApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';
import {
  GetUserByIdApiResponseData,
  ListResponse,
  StaffExperienceResponse,
  StaffPaySlipMinimal,
  StaffPaySlipResponse,
  StaffQuickPay,
  StaffQuickPayPayload,
  StaffQuickPayResponse,
  StaffTaskForm,
  UpdateActivityStatusPayload,
  UpdateStaffTaskForm,
} from './schema';

export const getUserById: AxiosApi<GetUserByIdApiResponseData, ID> = (id) => {
  return api.get(`/user/get/${id}`);
};

export const getUser: PaginatedApi<User> = (params) => {
  return api.get('/user/getAll', {
    params,
  });
};

export const createUser: CreateApi<FormData, { newUser: number }> = (data) => {
  return api.post('/user/create', data);
};

export const updateUser: AxiosApi<
  ResponseDto<Partial<User>>,
  [ID, FormData]
> = (id, data) => {
  return api.patch(`/user/update/${id}`, data);
};

export const removeUser: AxiosApi<ResponseDto<{ message: string }>, [ID]> = (
  id,
) => {
  return api.delete(`/user/delete/${id}`);
};

export const addStaffExperience: AxiosApi<
  StaffExperienceResponse,
  [FormData]
> = (data) => {
  return api.post(`staff/addExperience`, data);
};

export const updateStaffExperience: AxiosApi<
  ResponseDto<StaffExperienceResponse>,
  [ID, FormData]
> = (id, data) => {
  return api.put(`staff/updateExperiance/${id}`, data);
};

export const getAllStaffExperience: AxiosApi<
  ListResponse<StaffExperience>,
  [ID, Record<string, unknown>]
> = (userId, params) => {
  return api.get(`staff/getStaffExperience/${userId}`, { params });
};

export const deleteStaffExperience: AxiosApi<ResponseDto<unknown>, [ID]> = (
  id,
) => {
  return api.delete(`staff/deleteExperiance/${id}`);
};

export const addStaffQuickPay: AxiosApi<
  StaffQuickPayResponse,
  [StaffQuickPayPayload]
> = (data) => {
  return api.post(`staff/addStaffQuickPay`, data);
};

export const updateStaffQuickPayStatus: AxiosApi<
  ResponseDto<{ id: number }>,
  [ID, { status: 0 | 1 }]
> = (id, data) => {
  return api.post(`staff/updateStaffQuickPayStatus/${id}`, data);
};

export const deleteStaffQuickPay: AxiosApi<
  ResponseDto<{ message: string }>,
  [ID]
> = (id) => {
  return api.delete(`staff/deleteStaffQuickpay/${id}`);
};

export const getStaffQuickPays: AxiosApi<
  ListResponse<StaffQuickPay>,
  [ID, Record<string, unknown>]
> = (userId, params) => {
  return api.get(`staff/getStaffQuickPays/${userId}`, { params });
};

//Staff Tasks
export const getStaffTaskByID: AxiosApi<ResponseDto<StaffTask>, ID> = (id) => {
  return api.get(`/staff/activity/${id}`);
};

export const getAllStaffTask: PaginatedApi<StaffTask> = (params) => {
  return api.get('/staff/activities', {
    params,
  });
};

export const getAllStaffPastTasks: PaginatedApi<StaffTask> = (params) => {
  return api.get('/staff/pastActivities', {
    params,
  });
};

export const getAllStaffTodayTasks: PaginatedApi<StaffTask> = (params) => {
  return api.get('/staff/todayActivities', {
    params,
  });
};

export const getAllStaffFutureTasks: PaginatedApi<StaffTask> = (params) => {
  return api.get('/staff/getAllFutureTasks', {
    params,
  });
};

export const createStaffTask: CreateApi<StaffTaskForm[], ID> = (data) => {
  return api.post('/staff/addActivity', data);
};

export const updateStaffTask: AxiosApi<
  ResponseDto<UpdateStaffTaskForm>,
  [ID, UpdateStaffTaskForm]
> = (id, data) => {
  return api.patch(`/staff/updateActivity/${id}`, data);
};

export const adjustStaffActivityTime: AxiosApi<
  ResponseDto<{ message: string }>,
  [
    ID,
    {
      start_date_time: string;
      end_date_time: string;
      total_hour: number;
      task_holds?: Array<{
        hold_start_at: string;
        hold_end_at: string | null;
        is_carry_forward?: 0 | 1;
        notes?: string | null;
      }>;
    },
  ]
> = (id, data) => {
  return api.patch(`/staff/adjustActivityTime/${id}`, data);
};

export const updateStaffTaskActivityStatus: AxiosApi<
  ResponseDto<{ message: string }>,
  [UpdateActivityStatusPayload]
> = (data) => {
  return api.put('/staff/updateActivityStatus', data);
};

export const softDeleteStaffTaskHold: AxiosApi<
  ResponseDto<{ message: string }>,
  [ID]
> = (id) => {
  return api.delete(`/staff/taskHold/${id}`);
};

export const removeStaffTask: AxiosApi<ResponseDto<string>, [ID]> = (id) => {
  return api.delete(`/staff/deleteStaffActivity/${id}`);
};

export const getStaffPaySlipCreateData: AxiosApi<
  ResponseDto<{ data: unknown }>,
  [Record<string, unknown>]
> = (data) => {
  return api.post('/staff/getStaffInvoiceCreateData', data);
};

export const createStaffPaySlip: CreateApi<
  Record<string, unknown>,
  { id: number }
> = (data) => {
  return api.post(`/staff/createStaffInvoice`, data);
};

export const updateStaffPaySlip: AxiosApi<
  ResponseDto<{ id: number }>,
  [ID, Record<string, unknown>]
> = (id, data) => {
  return api.put(`/staff/updateStaffInvoice/${id}`, data);
};

export const getStaffPaySlipById: AxiosApi<StaffPaySlipResponse, [ID]> = (
  id,
) => {
  return api.get(`/staff/getStaffInvoiceById/${id}`);
};

export const getAllStaffPaySlips: PaginatedApi<StaffPaySlipMinimal> = (
  params,
) => {
  return api.get('/staff/getAllStaffInvoices', { params });
};

export const getLastPaySlipDateOfStaff: AxiosApi<
  ResponseDto<{
    to_date: string | null;
    from_date: string | null;
  }>,
  [ID, { account_id: number; branch_id: number }]
> = (id, data) => {
  return api.post(`/staff/getLastInvoiceDateOfStaff/${id}`, data);
};

export const deleteStaffPaySlip: AxiosApi<
  ResponseDto<{ message: string }>,
  [ID]
> = (id) => {
  return api.delete(`/staff/deleteStaffInvoice/${id}`);
};

// Staff Qualifications
export interface StaffQualification {
  id: number;
  account_id: number;
  branch_id: number;
  staff_id: number;
  qualification_type: string;
  qualification_name: string;
  registration_no?: string | null;
  year_of_passout: string;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StaffQualificationPayload {
  account_id: number;
  branch_id: number;
  staff_id: number;
  qualification_type: string;
  qualification_name: string;
  registration_no?: string | null;
  year_of_passout: string;
}

export const addStaffQualification: AxiosApi<
  ResponseDto<{ id: number }>,
  [StaffQualificationPayload]
> = (data) => {
  return api.post(`/staff/addQualification`, data);
};

export const updateStaffQualification: AxiosApi<
  ResponseDto<{ message: string }>,
  [ID, Omit<StaffQualificationPayload, 'staff_id'>]
> = (id, data) => {
  return api.put(`/staff/updateQualification/${id}`, data);
};

export const deleteStaffQualification: AxiosApi<
  ResponseDto<{ message: string }>,
  [ID]
> = (id) => {
  return api.delete(`/staff/deleteQualification/${id}`);
};

export const getDesignations: AxiosApi<
  ResponseDto<{ designations: string[] }>,
  [{ account_id: number; branch_id: number }]
> = (params) => {
  return api.get('/user/designations', { params });
};

export const changeStaffPassword: AxiosApi<
  ResponseDto<{ message: string }>,
  [{ user_id: number; password: string }]
> = (data) => {
  return api.post('/staff/changeStaffPassword', data);
};
