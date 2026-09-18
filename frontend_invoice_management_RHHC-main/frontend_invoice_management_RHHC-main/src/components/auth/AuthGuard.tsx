'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.replace('/signin');
    }
  }, [isAuthLoading, token, router]);

  if (isAuthLoading) {
    return <></>; // or a spinner
  }

  return <>{children}</>;
};

export default AuthGuard;
