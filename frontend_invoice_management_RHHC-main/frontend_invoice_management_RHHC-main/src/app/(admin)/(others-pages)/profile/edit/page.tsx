'use client';

import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import { defaultRoles } from '@/modules/common/constant/messages';
import { getMe } from '../api';
import GeneralInformation from './components/general-info';
import { User } from '@/modules/common/models/user';

const ProfileEditPage: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { token, isAuthLoading, user: loggedUser } = useAuth();

    const {
        data: response,
        isFetching,
    } = useQuery({
        queryKey: ['getMe'],
        queryFn: () => getMe().then((response) => response.data),
        enabled: !!token,
    });

    if (isAuthLoading || isFetching) {
        return <PageLoader />;
    }

    // Check if user is staff or admin
    const isStaffOrAdmin =
        Number(loggedUser?.role_id) === defaultRoles.staff_role_id ||
        Number(loggedUser?.role_id) === defaultRoles.supAdmin_role_id;

    if (!isStaffOrAdmin) {
        return (
            <PageLayout>
                <PageLayout.Content>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-lg text-gray-600">
                            You don&apos;t have permission to access this page.
                        </div>
                    </div>
                </PageLayout.Content>
            </PageLayout>
        );
    }

    const hydratedUser = response?.data as Partial<User>;

    return (
        <PagePermissionGuard permissions={['user-management/profile:write']}>
            <PageLayout>
                <PageLayout.Header
                    isListHeader={false}
                    title={`Edit Profile - ${capitalizeWords(hydratedUser.name || 'Profile')}`}
                    breadcrumbs={[
                        {
                            href: '/',
                            name: 'Dashboard',
                        },
                        {
                            name: 'Edit Profile',
                        },
                    ]}
                ></PageLayout.Header>

                <PageLayout.Content>
                    <GeneralInformation
                        user={hydratedUser}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </PageLayout.Content>
            </PageLayout>
        </PagePermissionGuard>
    );
};

export default ProfileEditPage;

