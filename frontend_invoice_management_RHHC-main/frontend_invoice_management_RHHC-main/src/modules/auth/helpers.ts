import Cookies from 'js-cookie';
import { setHeaders } from '../common/libs/axios';

export const setAccessToken = (token: string) => {
  Cookies.set('access_token', token, {
    expires: 4,
    sameSite: 'None',
    secure: true,
  });
  setHeaders(token);
};
