import { Product } from '@/modules/common/models/product';
import { ResponseDto } from '@/modules/common/types/api';

export type GetProductByIdApiResponseData = Product;
export type GetProductByIdApiResponseDto = ResponseDto<GetProductByIdApiResponseData>;

export type ProductListResponseDto = ResponseDto<Product>;

export type IncDecProductStockPayload = {
    product_id: number;
    type: 'increment' | 'decrement';
    quantity: number;
};