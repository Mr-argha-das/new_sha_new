'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/modules/common/components/page-layout';
import { Button } from '@mui/material';
import Link from '@/modules/common/elements/link';
import { StaffTask } from '@/modules/common/models/staff';
import { getStaffTaskByID } from '../../api';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { useAuth } from '@/context/AuthContext';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import TaskContext, { TaskSection } from './context';
import GeneralInformation from './component/general-info';

interface PageParams { id: ID }
interface PageProps { params: Promise<PageParams> }

const StaffTaskPage = ({ params }: PageProps) => {
    const { id } = use(params);
    const [activeSection, setActiveSection] = useState<TaskSection | null>(null);
    const { token, isAuthLoading } = useAuth();


    const { data: response, isFetching } = useQuery({
        queryKey: ['getStaffTaskByID', id],
        queryFn: () => getStaffTaskByID(id).then(r => r.data),
        enabled: !!id && !!token,
    });

    if (isAuthLoading || isFetching) return <PageLoader />;
    const task = response?.data as StaffTask | null;

    return (
        <PagePermissionGuard permissions={'user-management/staff-task:read'}>
            <TaskContext.Provider value={{ task: task ?? null, activeSection, setActiveSection }}>
                <PageLayout>
                    <PageLayout.Header
                        isListHeader={false}
                        title={String(task?.staff_name || '')}
                        breadcrumbs={
                            [
                                {
                                    href: '/staff/task',
                                    name: 'Tasks'
                                },
                                {
                                    name: 'View'
                                }]}
                        back={
                            <Link href={`/staff/task`}>
                                <Button type="button" variant="text">Back to List</Button>
                            </Link>
                        }
                    />
                    <PageLayout.Content>
                        <GeneralInformation />
                    </PageLayout.Content>
                </PageLayout>
            </TaskContext.Provider>

        </PagePermissionGuard>
    );
};

export default StaffTaskPage;


