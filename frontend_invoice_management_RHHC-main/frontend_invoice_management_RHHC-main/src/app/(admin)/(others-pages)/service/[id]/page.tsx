'use client';

import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { use, useState } from 'react';

import PageLayout from '@/modules/common/components/page-layout';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { getServiceById } from '../api';
import GeneralInformation from './components/general-info';
import ServiceEditPageContext, { ServiceEditPageSection, Service } from './context';
import Link from '@/modules/common/elements/link';
import { Button } from '@mui/material';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';

interface ServiceEditPageParams {
  id: string;
}
interface ServiceEditPageProps {
  params: Promise<ServiceEditPageParams>;
}
const ServiceEditPage: NextPage<ServiceEditPageProps> = ({ params }) => {
  const { id } = use(params);
  const [activeSection, setActiveSection] =
    useState<ServiceEditPageSection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkListItemAddModal, setCheckListItemAddModal] =
    useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  // const invalidate = useInvalidate();

  const {
    data: response,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['getServiceById', id],
    queryFn: () => getServiceById(id).then((response) => {
      const data = response.data;
      return data;
    }),
    enabled: !!id,
  });

  if (isFetching || isLoading) {
    return <PageLoader />;
  }
  const service = response?.data as Service;
  return (
    <>
      <PagePermissionGuard permissions={'product-management/service:write'}>
      <ServiceEditPageContext.Provider
        value={{
          service,
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
            title={capitalizeWords(service?.name || '')}
            breadcrumbs={[
              {
                href: '/service',
                name: 'Services',
              },
              {
                name: 'Edit',
              },
            ]}
            back={
              <Link href={`/service`}>
                <Button type="button" variant="text">
                  Back to List
                </Button>
              </Link>
            }
          ></PageLayout.Header>

          <PageLayout.Content>
            <GeneralInformation />
            {/* <OtherInformation /> */}
          </PageLayout.Content>
        </PageLayout>
      </ServiceEditPageContext.Provider>
      </PagePermissionGuard>
    </>
  );
};

export default ServiceEditPage; 