'use client';

import React from 'react';
import PageLayout from '@/modules/common/components/page-layout';
import Link from '@/modules/common/elements/link';
import { Button } from '@mui/material';
import { PayslipProvider, usePayslip } from './context';
import GeneralInformation from './components/general-info';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PageLoader from '@/modules/common/elements/page/page-loader';

const Content = () => {
    const { invoice, loading } = usePayslip();
    if (loading) return <PageLoader />;
    if (!invoice) return <div className="p-6">Payslip not found.</div>;
    return (
        <PageLayout>
            <PageLayout.Header
                isListHeader={false}
                title={`Staff Payslip ${invoice.invoice.id}`}
                breadcrumbs={[{ href: '/staff/pay-slip', name: 'Pay Slips' }, { name: 'View' }]}
                back={<Link href={`/staff/pay-slip`}><Button type="button" variant="text">Back to List</Button></Link>}
            />
            <PageLayout.Content>
                <GeneralInformation />
            </PageLayout.Content>
        </PageLayout>
    );
};

const PayslipPage = () => (
    <PagePermissionGuard permissions={'user-management/staff-pay-slip:read'}>
        <PayslipProvider>
            <Content />
        </PayslipProvider>
    </PagePermissionGuard>
);

export default PayslipPage;
