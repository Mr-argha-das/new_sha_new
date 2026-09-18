'use client'
import { useAuth } from '@/context/AuthContext';
import { defaultRoles } from '@/modules/common/constant/messages';
import React from 'react'
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import PageLoader from '@/modules/common/elements/page/page-loader';

export default function Dashboard() {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <PageLoader />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">No user found</div>
            </div>
        );
    }

    const isAdmin = Number(user?.role_id) === defaultRoles.supAdmin_role_id;

    if (isAdmin) {
        return <AdminDashboard />
    }

    return <StaffDashboard />
}