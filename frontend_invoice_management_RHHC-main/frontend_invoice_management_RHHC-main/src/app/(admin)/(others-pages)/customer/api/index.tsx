import { User } from '@/modules/common/models/user';
import api from '@/modules/common/libs/axios';
import { AxiosApi, CreateApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';

export const getUserById: AxiosApi<ResponseDto<User>, ID> = (id) => {
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

export const updateUser: AxiosApi<ResponseDto<{ message: string }>, [ID, FormData]> = (id, data) => {
  return api.patch(`/user/update/${id}`, data);
};

export const removeUser: AxiosApi<ResponseDto<{ message: string }>, [ID]> = (id) => {
  return api.delete(`/user/delete/${id}`);
};
