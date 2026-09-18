import { Lead, LeadItem } from '@/modules/common/models/lead';
import api from '@/modules/common/libs/axios';
import { AxiosApi, CreateApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';
import { GetCustomerLeadList } from './schema';

export const getLeadById: AxiosApi<ResponseDto<Lead>, ID> = (id) => {
  return api.get(`/lead/get/${id}`);
};

export const getLead: PaginatedApi<Lead> = (params) => {
  return api.get('/lead/getAll', {
    params,
  });
};

export const createLead: CreateApi<Partial<Lead>, Lead> = (data) => {
  return api.post('/lead/create', data);
};

export const updateLead: AxiosApi<ResponseDto<Lead>, [ID, Partial<Lead>]> = (id, data) => {
  return api.patch(`/lead/update/${id}`, data);
};

export const removeLead: AxiosApi<ResponseDto<{ success: boolean }>, [ID]> = (id) => {
  return api.delete(`/lead/delete/${id}`);
};


export const addLeadItem: AxiosApi<ResponseDto<unknown>, [ID, Partial<LeadItem>[]]> = (id, data) => {
  return api.post(`/lead/addLeadItem/${id}`, data);
};

export const deleteLeadItem: AxiosApi<ResponseDto<{ success: boolean }>, [ID, ID]> = (leadId, itemId) => {
  return api.delete(`/lead/${leadId}/item/${itemId}`);
};

export const endLeadItem: AxiosApi<ResponseDto<{ success: boolean }>, [ID, ID, { end_date?: string | null }?]> = (
  leadId,
  itemId,
  body,
) => {
  return api.patch(`/lead/${leadId}/item/${itemId}/end`, body || {});
};

export const getCustomerLeadList: AxiosApi<ResponseDto<Lead[]>, [GetCustomerLeadList]> = (params) => {
  return api.get(`/lead/getAllLeadsByCustomer`, { params });
}

export const updateLeadDeposit = (id: ID, deposit: number) => {
  return api.patch(`/lead/update-deposit/${id}`, {
    security_deposit: deposit,
  });
};
