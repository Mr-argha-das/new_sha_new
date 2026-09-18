import api from "@/modules/common/libs/axios";
import { AxiosApi, ResponseDto } from "@/modules/common/types/api";

export const requestPasswordReset: AxiosApi<ResponseDto<string>, { email: string }> = (data) => {
    return api.post('/user/forgot-password', data);
};

