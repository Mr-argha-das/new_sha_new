import api from "@/modules/common/libs/axios";

export const resetPassword = (password: string, token: string) => {
    return api.post('/user/reset-password', { password }, {
        headers: {
            'x-token': token,
        }
    });
};