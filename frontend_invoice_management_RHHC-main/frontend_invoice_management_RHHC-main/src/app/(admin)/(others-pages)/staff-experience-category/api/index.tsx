import api from '@/modules/common/libs/axios';
import { AxiosApi, CreateApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';

type ID = string;

export interface StaffExperienceCategory {
    id: number;
    account_id: number;
    branch_id: number;
    name: string;
    description?: string | null;
    is_deleted: number;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string;
    updated_at?: string;
}

export const getCategoryById: AxiosApi<ResponseDto<StaffExperienceCategory>, ID> = (id) => {
    return api.get(`/staff-experience-category/get/${id}`);
};

export const getCategories: PaginatedApi<StaffExperienceCategory> = (params) => {
    return api.get('/staff-experience-category/getAll', {
        params,
    });
};

export const getCategoriesForDropdown: AxiosApi<ResponseDto<StaffExperienceCategory[]>, Record<string, unknown>> = (params) => {
    return api.get('/staff-experience-category/getDropdown', {
        params,
    });
};

export const createCategory: CreateApi<Partial<StaffExperienceCategory>, string> = (data) => {
    return api.post('/staff-experience-category/create', data);
};

export const updateCategory: AxiosApi<ResponseDto<string>, [ID, Partial<StaffExperienceCategory>]> = (id, data) => {
    return api.put(`/staff-experience-category/update/${id}`, data);
};

export const removeCategory: AxiosApi<ResponseDto<string>, [ID]> = (id) => {
    return api.delete(`/staff-experience-category/delete/${id}`);
};

