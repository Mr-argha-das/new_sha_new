import api from '@/modules/common/libs/axios';
import { User } from '@/modules/common/models/user';
import { AxiosApi, ResponseDto } from '@/modules/common/types/api';

export const getMe: AxiosApi<ResponseDto<User>> = () => {
    return api.get('/user/me');
};

export const updateProfile: AxiosApi<
    ResponseDto<{ message: string }>,
    [Record<string, unknown>]
> = (data) => {
    return api.patch('/user/update-profile', data);
};

