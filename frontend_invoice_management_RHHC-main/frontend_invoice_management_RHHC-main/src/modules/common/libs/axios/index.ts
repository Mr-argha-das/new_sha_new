import axios from 'axios';
import toast from 'react-hot-toast';
import { config } from '../../config';
// import { config } from '~/modules/common/config';

const api = axios.create({
  baseURL: config.api.baseUrl,
});

export const setHeaders = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    /** Check is we want to suppress errors, in that case. No need to show the toaster */
    if (!error.config.suppressErrors) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }

    // if (error.response.status === HttpStatusCode.Unauthorized) {
    //   /** Access token may have expired, re-generate a new token */
    //   const token = await refreshAuthToken();

    //   if (token) {
    //     return api(error.config, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //   }
    // }

    return Promise.reject(error);
  },
);

export default api;
