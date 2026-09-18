import { ReceiptPayload } from '@/lib/payment_recipt_html';
import api from '@/modules/common/libs/axios';
import { AccountSettings } from '@/modules/common/models/accountSettings';
import {
  Invoice,
  InvoicePaymentHistory,
} from '@/modules/common/models/invoice';
import { AxiosApi, CreateApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';
import { MarkRentedProductsReturnedValues } from './schema';

export const getInvoiceById: AxiosApi<ResponseDto<Invoice>, ID> = (id) => {
  return api.get(`/invoice/get/${id}`);
};

export const getInvoice: PaginatedApi<Invoice> = (params) => {
  return api.get('/invoice/getAll', {
    params,
  });
};

export const createInvoice: CreateApi<Partial<Invoice>, Invoice> = (data) => {
  return api.post('/invoice/create', data);
};

export const updateInvoice: AxiosApi<
  ResponseDto<Invoice>,
  [ID, Partial<Invoice>]
> = (id, data) => {
  return api.put(`/invoice/update/${id}`, data);
};

export const removeInvoice: AxiosApi<
  ResponseDto<{ success: boolean }>,
  [ID]
> = (id) => {
  return api.delete(`/invoice/delete/${id}`);
};

export const addPaymentRecord: AxiosApi<
  ResponseDto<ReceiptPayload>,
  [ID, Partial<InvoicePaymentHistory>]
> = (id, data) => {
  return api.post(`/invoice/addPaymenet/${id}`, data);
};

//accoount settings for invoice pdf
export const getAccountSettings: PaginatedApi<AccountSettings> = (params) => {
  return api.get(`/account-settings/getByAccountAndBranch`, {
    params,
  });
};

export const getCustomerLastInvoiceDueAmount: AxiosApi<
  ResponseDto<{
    dueAmount: number;
    lastInvoiceDate: string;
    lastInvoiceItems: Array<{ item_type: string; deal_type: string | null; item_id: string | number }>;
  }>,
  [ID, ID, ID?]
> = (customerId, leadId, exclude_id) => {
  return api.post(
    `/invoice/getCustomerLastInvoiceDueAmount/${customerId}/${leadId}`,
    { exclude_id },
  );
};

export const markRentedProductsReturned: AxiosApi<
  ResponseDto<{ success: boolean }>,
  MarkRentedProductsReturnedValues
> = (data) => {
  return api.post(`/invoice/markRentedProductsReturned`, data);
};
