'use client';

import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { use, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import Link from '@/modules/common/elements/link';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import { Button } from '@mui/material';
import { getUserById } from '../api';
import GeneralInformation from './components/general-info';
import UserEditPageContext, { UserEditPageSection } from './context';
import { User } from '@/modules/common/models/user';

interface UserEditPageParams {
  id: ID;
}

interface UserEditPageProps {
  params: Promise<UserEditPageParams>;
}

const UserEditPage: NextPage<UserEditPageProps> = ({ params }) => {
  const { id } = use(params);
  const [activeSection, setActiveSection] = useState<UserEditPageSection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkListItemAddModal, setCheckListItemAddModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const { token, isAuthLoading } = useAuth();

  const {
    data: response,
    isFetching,
  } = useQuery({
    queryKey: ['getUserById', id],
    queryFn: () => getUserById(id).then((response) => response.data),
    enabled: !!id && !!token,
  });

  if (isAuthLoading || isFetching) {
    return <PageLoader />;
  }
  const user = response?.data as User;

  return (
    <>
      <PagePermissionGuard permissions={'user-management/user:write'}>
        <UserEditPageContext.Provider
          value={{
            user,
            activeSection,
            setActiveSection,
            loading,
            setLoading,
            checkListItemAddModal,
            setCheckListItemAddModal,
            editId,
            setEditId,
          }}
        >
          <PageLayout>
            <PageLayout.Header
              isListHeader={false}
              title={capitalizeWords(user?.name)}
              breadcrumbs={[
                {
                  href: '/customer',
                  name: 'Customers',
                },
                {
                  name: 'Edit',
                },
              ]}
              back={
                <Link href={`/customer`}>
                  <Button type="button" variant="text">
                    Back to List
                  </Button>
                </Link>
              }
            ></PageLayout.Header>

            <PageLayout.Content>
              <GeneralInformation />
            </PageLayout.Content>
          </PageLayout>
        </UserEditPageContext.Provider>
      </PagePermissionGuard>
    </>
  );
};

export default UserEditPage;
