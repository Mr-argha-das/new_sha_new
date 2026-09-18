import { useAuth } from '@/context/AuthContext';
import api from '@/modules/common/libs/axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const useRefreshToken = () => {
  const { setToken, logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const refreshToken = Cookies.get('refresh_token'); // or handle from secure storage

        const res = await api.post('/user/refresh-token', { refreshToken });
        const newAccessToken = res.data.data.jwtToken;
        const newRefreshToken = res.data.data.refreshToken;

        Cookies.set('access_token', newAccessToken, {
          expires: 365 * 20, 
          sameSite: 'None',
          secure: true,
        });

        Cookies.set('refresh_token', newRefreshToken, {
          expires: 365 * 20, 
          sameSite: 'None',
          secure: true,
        });

        setToken(newAccessToken, newRefreshToken);
      } catch (err) {
        // Optionally show login prompt instead of force logout
        logout();
      }
    }, 10 * 60 * 1000); // every 10 minutes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useRefreshToken;
