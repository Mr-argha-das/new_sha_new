/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { ReactNode } from 'react';

export interface ResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
}

export interface PaginatedApiRequestParams {
  id?: string;
  before?: string;
  after?: string;
  limit: number;
}

export type PaginatedApi<
  ResponseType,
  RequestType = PaginatedApiRequestParams,
> = (
  params: RequestType,
) => Promise<AxiosResponse<PaginatedResponseDto<ResponseType>>>;

export type PaginatedApiExtraParams<
  ResponseType,
  // RequestType = PaginatedApiRequestParams,
> = (
  params: ReactNode,
) => Promise<AxiosResponse<PaginatedResponseDto<ResponseType>>>;

export type AxiosApi<
  ResponseType,
  RequestType extends any | undefined = undefined,
> = RequestType extends undefined
  ? () => Promise<AxiosResponse<ResponseType>>
  : RequestType extends any[]
    ? (...args: RequestType) => Promise<AxiosResponse<ResponseType>>
    : (data: RequestType) => Promise<AxiosResponse<ResponseType>>;

export type BulkUploadRequestDto<T> = T[];

export type BulkUploadResponseDetailErrors<ErrorKey extends string> = {
  [key in ErrorKey]?: string;
};

export type BulkUploadResponseDetail<T, ErrorKey extends string> = {
  data: T;
  index: number;
} & BulkUploadResponseDetailErrors<ErrorKey>;

export interface BulkUploadResponseDto<T, ErrorKey extends string> {
  id: string;
  name: string;
  FailureCount: number;
  successCount: number;
  details: BulkUploadResponseDetail<T, ErrorKey>[];
}

export type BulkUploadApi<T, ErrorKey extends string> = (
  data: BulkUploadRequestDto<T>,
) => Promise<AxiosResponse<ResponseDto<BulkUploadResponseDto<T, ErrorKey>>>>;

export type CreateApi<TRequest, TResponse> = (
  data: TRequest,
) => Promise<AxiosResponse<ResponseDto<TResponse>>>;
