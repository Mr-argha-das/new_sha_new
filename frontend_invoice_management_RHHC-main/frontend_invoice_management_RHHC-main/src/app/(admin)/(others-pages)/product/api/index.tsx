import api from '@/modules/common/libs/axios';
import { AxiosApi, CreateApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';
import { Product, ProductTrackingHistory } from '@/modules/common/models/product';
import { IncDecProductStockPayload } from './schema';

export const getProduct: PaginatedApi<Product> = (params) => {
  return api.get('/product/getAll', {
    params,
  });
};

export const getAvailableProducts: PaginatedApi<Product> = (params) => {
  return api.get('/product/getAllAvailable', {
    params,
  });
};

export const getProductById: AxiosApi<ResponseDto<Product>, ID> = (id) => {
  return api.get(`/product/get/${id}`);
};

export const createProduct: CreateApi<Partial<Product>, Product> = (data) => {
  return api.post('/product/create', data);
};

export const updateProduct: AxiosApi<ResponseDto<Product>, [ID, Partial<Product>]> = (id, data) => {
  return api.patch(`/product/update/${id}`, data);
};

export const removeProduct: AxiosApi<ResponseDto<{ message: string }>, [ID]> = (id) => {
  return api.delete(`/product/delete/${id}`);
};

export const getProductTrackingHistory: PaginatedApi<ProductTrackingHistory> = (params) => {
  return api.get(`/product/getProductTrackingHistory`, { params });
};

export const incDecProductStock: AxiosApi<ResponseDto<{ message?: string }>, IncDecProductStockPayload> = (data) => {
  return api.post('/product/incDecProductStock', data);
};