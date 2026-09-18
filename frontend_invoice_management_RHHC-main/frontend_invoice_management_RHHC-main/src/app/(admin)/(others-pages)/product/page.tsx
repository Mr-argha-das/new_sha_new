'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import Link from '@/modules/common/elements/link';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Product } from '@/modules/common/models/product';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PermissionGuard from '@/modules/guards/permission-guard';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../packages/ui/icons';
// import { getUser, removeUser } from './api';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { chipLable } from '@/modules/common/helpers/helpers';
import { formatINR } from '@/modules/common/helpers/helper';
import { getProduct, removeProduct } from './api';

const ProductList = () => {
  const invalidate = useInvalidate();

  const { user } = useAuth();
  const handleDelete: OnDeleteFunction = async (id) => {
    const productId = typeof id === 'string' ? id : String(id);
    await removeProduct(productId);
    await invalidate(['getProduct']);
  };

  const columns: GridColDef<Product>[] = [
    {
      field: 'sku_code',
      headerName: 'SKU Code',
      minWidth: 100,
      renderCell: ({ row }) => {
        return <Link
          href={`/product/${row.id}`} tenantId>
          {row.sku_code}</Link>;
      },
    },
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   minWidth: 80,
    //   renderCell: ({ row }) => {
    //     return <span>{row.id}</span>;
    //   },
    // },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      renderCell: ({ row }) => {
        return <span>{capitalizeFirstLetter(row.name)}</span>;
      },
    },
    {
      field: 'base_price',
      headerName: 'Base Price (₹)',
      width: 200,
      renderCell: ({ row }) => {
        return <span>{formatINR(Number(row.base_price), false)}</span>;
      },
    },
    {
      field: 'total_stock',
      headerName: 'Total Stock',
      width: 100,
      renderCell: ({ row }) => {
        return <span>{row.total_stock}</span>;
      },
    },
    {
      field: 'available_stock',
      headerName: 'Available Stock',
      width: 100,
      renderCell: ({ row }) => {
        return <span>{row.available_stock}</span>;
      },
    },
    {
      field: 'rented_stock',
      headerName: 'Rented Stock',
      width: 100,
      renderCell: ({ row }) => {
        return <span>{row.rented_stock}</span>;
      },
    },
    {
      field: 'sold_stock',
      headerName: 'Sold Stock',
      width: 100,
      renderCell: ({ row }) => {
        return <span>{row.sold_stock ?? 0}</span>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: ({ row }) => {
        return <span>{chipLable(row.status)}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 300,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        return (
          <Stack spacing={2} direction="row">
            <Box display={'flex'}>
              <PermissionGuard permissions={'product-management/product:write'}>
                <Link href={`/product/${row.id}`} tenantId>
                  <Tooltip title={`View`}>
                    <IconButton
                      size="small"
                      onClick={async () => {
                        await invalidate(['getProductById', row.id]);
                      }}
                    >
                      <VisibilityIcon
                        style={{ color: 'neutral.500', opacity: 1 }}
                      />
                    </IconButton>
                  </Tooltip>
                </Link>
              </PermissionGuard>
              <PermissionGuard
                permissions={'product-management/product:delete'}
              >
                <Tooltip title="delete">
                  <DeleteConfirmationButton
                    message="Product"
                    iconColor="neutral.500"
                    opacity="1"
                    resourceId={String(row.id)}
                    onDelete={handleDelete}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 23,
                      },
                    }}
                  />
                </Tooltip>
              </PermissionGuard>
            </Box>
          </Stack>
        );
      },
    },
  ];

  return (
    <PagePermissionGuard permissions={'product-management/product:read'}>
      <PaginatedDataGrid
        query={getProduct}
        queryKey={['getProduct']}
        columns={columns}
        searchLabel="Search"
        toolbarContainer={HeaderToolbar}
        extraParams={{
          account_id: user?.account_id,
          branch_id: user?.branch_id,
        }}
      />
    </PagePermissionGuard>
  );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
  return (
    <>
      <PageLayoutHeader
        breadcrumbs={[
          {
            href: `/product`,
            name: 'Products',
          },
        ]}
        title="Products"
      >
        {children}
        <Link href="/product/add">
          <Tooltip title={`Add Product`}>
            <Button variant="contained" sx={{ ml: 4 }}>
              Add
            </Button>
          </Tooltip>
        </Link>
      </PageLayoutHeader>
    </>
  );
};

export default ProductList;
