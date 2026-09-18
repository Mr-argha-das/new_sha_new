import { AxiosResponse } from 'axios';

export type Cursor = string;

export interface PageCursorMap {
  [page: number]: Cursor;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total?: number;
  totalRecords: number;
}

export interface PaginatedApiRequestParams {
  q?: string;
  before?: string;
  after?: string;
  limit?: number;
  role_id?: string;
  isRoleIncluded?: boolean;
  account_id?: number;
  branch_id?: number;
  exclude_id?: number;
  staff_id?: number;
  customer_id?: number;
  service_id?: number;
}

export type PaginatedApi<
  ResponseType,
  RequestType = PaginatedApiRequestParams,
> = (
  params: RequestType,
) => Promise<AxiosResponse<PaginatedResponseDto<ResponseType>>>;
