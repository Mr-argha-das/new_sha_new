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
import { getInvoiceById } from '../api';
import GeneralInformation from './components/general-info';
import InvoiceEditPageContext, { InvoiceEditPageSection } from './context';
import { Invoice } from '@/modules/common/models/invoice';

interface InvoiceEditPageParams {
  id: ID;
}

interface InvoiceEditPageProps {
  params: Promise<InvoiceEditPageParams>;
}

const InvoiceEditPage: NextPage<InvoiceEditPageProps> = ({ params }) => {
  const { id } = use(params);
  const [activeSection, setActiveSection] =
    useState<InvoiceEditPageSection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkListItemAddModal, setCheckListItemAddModal] =
    useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const { token, isAuthLoading } = useAuth();

  const {
    data: response,
    isFetching,
  } = useQuery({
    queryKey: ['getInvoiceById', id],
    queryFn: () => getInvoiceById(id).then((response) => response.data),
    enabled: !!id && !!token,
  });

  if (isAuthLoading || isFetching) {
    return <PageLoader />;
  }
  const invoice = response?.data as Invoice;
  return (
    <>
      <PagePermissionGuard permissions={'invoice-management/invoice:write'}>
        <InvoiceEditPageContext.Provider
          value={{
            invoice,
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
              title={capitalizeWords(invoice.invoice_number)}
              breadcrumbs={[
                {
                  href: '/invoice',
                  name: 'Invoices',
                },
                {
                  name: 'Edit',
                },
              ]}
              back={
                <Link href={`/invoice`}>
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
        </InvoiceEditPageContext.Provider>
      </PagePermissionGuard>
    </>
  );
};

export default InvoiceEditPage;
