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
import { Button, Box, Tabs, Tab } from '@mui/material';
import { getProductById } from '../api';
import GeneralInformation from './components/general-info';
import TrackingHistory from './components/tracking-history';
import ProductEditPageContext, { ProductEditPageSection } from './context';
import { Product } from '@/modules/common/models/product';
import { TrackingHistoryFilterProvider } from './components/tracking-history/filter-context';

interface ProductEditPageParams {
  id: ID;
}

interface ProductEditPageProps {
  params: Promise<ProductEditPageParams>;
}

const ProductEditPage: NextPage<ProductEditPageProps> = ({ params }) => {
  const { id } = use(params);
  const [activeSection, setActiveSection] =
    useState<ProductEditPageSection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkListItemAddModal, setCheckListItemAddModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const { token, isAuthLoading } = useAuth();

  const {
    data: response,
    isFetching,
  } = useQuery({
    queryKey: ['getProductById', id],
    queryFn: () => getProductById(id).then((response) => response.data),
    enabled: !!id && !!token,
  });

  if (isAuthLoading || isFetching) {
    return <PageLoader />;
  }
  const product = response?.data as Product;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <PagePermissionGuard permissions={'product-management/product:write'}>
        <ProductEditPageContext.Provider
          value={{
            product,
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
              title={capitalizeWords(product?.name)}
              breadcrumbs={[
                {
                  href: '/product',
                  name: 'Products',
                },
                {
                  name: 'Edit',
                },
              ]}
              back={
                <Link href={`/product`}>
                  <Button type="button" variant="text">
                    Back to List
                  </Button>
                </Link>
              }
            ></PageLayout.Header>

            <PageLayout.Content>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="product tabs">
                  <Tab label="General Information" />
                  <Tab label="Product Tracking History" />
                </Tabs>
              </Box>

              {activeTab === 0 && <GeneralInformation />}
              {activeTab === 1 && (
                <TrackingHistoryFilterProvider>
                  <TrackingHistory />
                </TrackingHistoryFilterProvider>
              )}
            </PageLayout.Content>
          </PageLayout>
        </ProductEditPageContext.Provider>
      </PagePermissionGuard>
    </>
  );
};

export default ProductEditPage;

