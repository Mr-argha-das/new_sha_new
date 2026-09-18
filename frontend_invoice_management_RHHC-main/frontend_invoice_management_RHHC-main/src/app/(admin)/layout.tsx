'use client';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/layout/AppHeader';
import AppSidebar from '@/layout/AppSidebar';
import Backdrop from '@/layout/Backdrop';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useRefreshToken from '../useRefreshToken';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isAuthLoading } = useAuth();
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  useRefreshToken();

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.replace('/signin');
    }
  }, [isAuthLoading, token, router]);

  if (isAuthLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {' '}
        <PageLoader disableShrink />
      </div>
    );
  }

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]';

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <div className={`lg:max-w-[calc(100vw-300px)] overflow-auto`}>
          <AppHeader />
          <div className="p-4 mx-auto  md:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
