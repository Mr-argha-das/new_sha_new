import type { Metadata } from 'next';
import Dashboard from '@/components/dashboard';


export const metadata: Metadata = {
  title:
    'Dashboard | Invoice Management RHHC',
  description: 'Dashboard page',
};

export default function Ecommerce() {
  return (
    <>
      <Dashboard />
    </>
  );

}