import api from '@/modules/common/libs/axios';
import { AxiosApi, CreateApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';
// import { Service } from '@/app/api/service/schema';
import { Service } from '@/modules/common/models/service';

type ID = string;

export const getServiceById: AxiosApi<ResponseDto<Service>, ID> = (id) => {
  return api.get(`/services/get/${id}`);
};

export const getService: PaginatedApi<Service> = (params) => {
  return api.get('/services/getAll', {
    params,
  });
};

export const createService: CreateApi<Partial<Service>, string> = (data) => {
  return api.post('/services/create', data);
};

export const updateService: AxiosApi<ResponseDto<string>, [ID, Partial<Service>]> = (id, data) => {
  return api.patch(`/services/update/${id}`, data);
};

export const removeService: AxiosApi<ResponseDto<string>, [ID]> = (id) => {
  return api.delete(`/services/delete/${id}`);
}; 