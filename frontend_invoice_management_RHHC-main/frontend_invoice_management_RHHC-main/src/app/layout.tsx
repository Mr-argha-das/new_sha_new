'use client';
import { Outfit } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ReactQueryClientProvider from '@/modules/common/libs/react-query/provider';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      {/* <style></style> */}
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ReactQueryClientProvider>
          <ThemeProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  zIndex: 9999,
                },
              }}
              containerStyle={{
                top: 100,
                left: '50%',
                transform: 'translateX(-50%)',
                position: 'fixed',
              }}
            />
            <AuthProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
