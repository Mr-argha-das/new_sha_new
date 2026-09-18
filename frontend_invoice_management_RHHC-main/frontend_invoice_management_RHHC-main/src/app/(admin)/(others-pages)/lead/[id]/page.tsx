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
import { getLeadById } from '../api';
import GeneralInformation from './components/general-info';
import LeadEditPageContext, { LeadEditPageSection } from './context';

interface LeadEditPageParams {
  id: ID;
}

interface LeadEditPageProps {
  params: Promise<LeadEditPageParams>;
}

const LeadEditPage: NextPage<LeadEditPageProps> = ({ params }) => {
  const { id } = use(params);
  const [activeSection, setActiveSection] =
    useState<LeadEditPageSection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkListItemAddModal, setCheckListItemAddModal] =
    useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const { token, isAuthLoading } = useAuth();

  const {
    data: response,
    isFetching,
  } = useQuery({
    queryKey: ['getLeadById', id],
    queryFn: () => getLeadById(id).then((response) => response.data),
    enabled: !!id && !!token,
  });

  if (isAuthLoading || isFetching) {
    return <PageLoader />;
  }
  const lead = response?.data;
  return (
    <>
      <PagePermissionGuard permissions={'lead-management/lead:write'}>
        <LeadEditPageContext.Provider
          value={{
            lead,
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
              title={capitalizeWords(String(lead?.lead_name || 'Lead'))}
              breadcrumbs={[
                {
                  href: '/lead',
                  name: 'Leads',
                },
                {
                  name: 'Edit',
                },
              ]}
              back={
                <Link href={`/lead`}>
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
        </LeadEditPageContext.Provider>
      </PagePermissionGuard>
    </>
  );
};

export default LeadEditPage;
