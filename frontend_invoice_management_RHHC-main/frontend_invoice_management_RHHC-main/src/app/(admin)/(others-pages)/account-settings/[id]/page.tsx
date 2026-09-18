'use client';

import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { use, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import Link from '@/modules/common/elements/link';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { Button } from '@mui/material';
import { getAccountSettingsById } from '../api';
import GeneralInformation from './components/general-info';
import AccountSettingsEditPageContext, { AccountSettingsEditPageSection } from './context';

interface AccountSettingsEditPageParams {
  id: string;
}

interface AccountSettingsEditPageProps {
  params: Promise<AccountSettingsEditPageParams>;
}

const AccountSettingsEditPage: NextPage<AccountSettingsEditPageProps> = ({ params }) => {
  const { id } = use(params);
  const [activeSection, setActiveSection] =
    useState<AccountSettingsEditPageSection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkListItemAddModal, setCheckListItemAddModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const { token, isAuthLoading } = useAuth();
  const {
    data: response,
    isFetching,
  } = useQuery({
    queryKey: ['getAccountSettingsById', id],
    queryFn: () => getAccountSettingsById(id).then((response) => response.data),
    enabled: !!id && !!token,
  });

  if (isAuthLoading || isFetching) {
    return <PageLoader />;
  }
  const accountSettings = response?.data;

  return (
    <>
      <AccountSettingsEditPageContext.Provider
        value={{
          accountSettings,
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
            title={capitalizeWords(accountSettings?.name as string)}
            breadcrumbs={[
              {
                href: '/account-settings',
                name: 'Account Settings',
              },
              {
                name: 'Edit',
              },
            ]}
            back={
              <Link href={`/account-settings`}>
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
      </AccountSettingsEditPageContext.Provider>
    </>
  );
};

export default AccountSettingsEditPage;
