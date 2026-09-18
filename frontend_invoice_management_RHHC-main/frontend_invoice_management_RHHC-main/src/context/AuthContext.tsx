'use client';

import api from '@/modules/common/libs/axios'; // adjust this import path as needed
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/modules/common/models/user';
import { AccountSettings } from '@/modules/common/models/accountSettings';
import { getAccountSettingsByAccountAndBranchID } from '@/app/(admin)/(others-pages)/account-settings/api';

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setToken: (token: string | null, refreshToken: string | null) => void;
  setUser: (user: User | null) => void;
  setAccountSettings: (accountSettings: AccountSettings | null) => void;
  logout: () => void;
  accountSettings: AccountSettings | null;
  isAuthLoading: boolean;
  refreshAccountSettings: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accountSettings, setAccountSettings] = useState<AccountSettings | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // ✅ Added loading state
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get('access_token') || null;
    const storedRefreshToken = Cookies.get('refresh_token') || null;
    if (storedToken) {
      setTokenState(storedToken);
      setRefreshToken(storedRefreshToken);
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      fetchUser().finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setToken = (newToken: string | null, refreshToken: string | null) => {
    if (newToken) {
      Cookies.set('access_token', newToken, {
        expires: 4,
        sameSite: 'None',
        secure: true,
      });
      if (refreshToken) {
        Cookies.set('refresh_token', refreshToken, {
          expires: 4,
          sameSite: 'None',
          secure: true,
        });
      }
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    } else {
      Cookies.remove('access_token');
      delete api.defaults.headers.common.Authorization;
    }
    setTokenState(newToken);
    setRefreshToken(refreshToken);
    if (newToken) {
      fetchUser();
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('account_settings');

    setToken(null, null);
    setUser(null);
    setAccountSettings(null);
    router.push('/signin');
  };

  const fetchAccountSettings = async (accountId: string, branchId: string) => {
    try {
      const storedAccountSettings = Cookies.get('account_settings');
      if (storedAccountSettings) {
        setAccountSettings(JSON.parse(storedAccountSettings));
        return JSON.parse(storedAccountSettings);
      }

      const res = await getAccountSettingsByAccountAndBranchID({ account_id: Number(accountId), branch_id: Number(branchId) });

      if (res.data?.data?.length) {
        const settings = res.data.data[0];
        setAccountSettings(settings);
        Cookies.set('account_settings', JSON.stringify(settings), {
          expires: 4,
          sameSite: 'None',
          secure: true,
        });
        return settings;
      }

      return null;
    } catch (err) {
      return null;
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/user/me');
      if (res.data?.success) {
        const userData = res.data.data;
        setUser(userData);

        // Fetch account settings
        await fetchAccountSettings(userData.account_id, userData.branch_id);
      }
    } catch (err) {
      logout();
    }
  };

  const refreshAccountSettings = async () => {
    if (!user) return;
    Cookies.remove('account_settings');
    await fetchAccountSettings(String(user.account_id), String(user.branch_id));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        accountSettings,
        setAccountSettings,
        setToken,
        setUser,
        logout,
        isAuthLoading,
        refreshToken,
        refreshAccountSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
