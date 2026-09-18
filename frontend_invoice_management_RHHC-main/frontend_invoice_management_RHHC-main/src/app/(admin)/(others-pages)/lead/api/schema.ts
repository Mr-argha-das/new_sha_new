import { Lead } from '@/modules/common/models/lead';
import { ResponseDto } from '@/modules/common/types/api';

export type GetLeadByIdApiResponseData = Lead;
export type GetLeadByIdApiResponseDto = ResponseDto<GetLeadByIdApiResponseData>;

export type GetCustomerLeadList = {
  account_id: number;
  branch_id: number;
  customer_id: number;
  is_finalished: number;
  is_completed?: number;
  productReturnPending?: number;
};
