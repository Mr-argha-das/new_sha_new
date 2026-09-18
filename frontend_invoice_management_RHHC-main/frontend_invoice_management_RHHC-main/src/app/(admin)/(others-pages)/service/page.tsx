'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import Link from '@/modules/common/elements/link';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { formatINR } from '@/modules/common/helpers/helper';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../packages/ui/icons';
import { getService, removeService } from './api';

// Define the Service type for the data grid
interface Service {
  id: string;
  name: string;
  hour_price: string;
  description: string;
}

const ServiceList = () => {
  const invalidate = useInvalidate();
  const { user } = useAuth();

  const handleDelete: OnDeleteFunction = async (id) => {
    let serviceId: string;
    if (typeof id === 'string') {
      serviceId = id;
    } else if (id && typeof id === 'object' && 'id' in id) {
      serviceId = String((id as { id: string | number }).id);
    } else {
      throw new Error('Invalid id type');
    }
    await removeService(serviceId);
    await invalidate(['getService']);
  };

  const columns: GridColDef<Service>[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 80,
      renderCell: ({ row }) => {
        return <span>{row.id}</span>;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: ({ row }) => {
        return <span>{capitalizeFirstLetter(truncateText(row.name, 17))}</span>;
      },
    },
    {
      field: 'hour_price',
      headerName: 'Hour Price (₹)',
      minWidth: 150,
      renderCell: ({ row }) => {
        return <span> {formatINR(row.hour_price)}</span>;
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 250,
      renderCell: ({ row }) => {
        return <span>{truncateText(row?.description, 22)}</span>;
      },
    },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      minWidth: 200,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        return (
          <Stack spacing={2} direction="row">
            <Box display={'flex'}>
              <Link href={`/service/${row.id}`} tenantId>
                <Tooltip title={`View`}>
                  <IconButton
                    size="small"
                    onClick={async () => {
                      await invalidate(['getServiceById']);
                    }}
                  >
                    <VisibilityIcon
                      style={{ color: 'neutral.500', opacity: 1 }}
                    />
                  </IconButton>
                </Tooltip>
              </Link>
              <DeleteConfirmationButton
                message="Check List"
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
            </Box>
          </Stack>
        );
      },
    },
  ];

  return (
    <PagePermissionGuard permissions={'product-management/service:read'}>
      <PaginatedDataGrid
        query={async (params) => {
          // Fetch data from backend
          const response = await getService(params);
          // Map _id to id for each record
          const mapped = {
            ...response.data,
            data: response.data.data.map((item: unknown) => {
              if (
                typeof item === 'object' &&
                item !== null &&
                'name' in item &&
                'hour_price' in item &&
                'description' in item &&
                ('_id' in item || 'id' in item)
              ) {
                const typedItem = item as {
                  _id?: string;
                  id?: string;
                  name: string;
                  hour_price: string;
                  description: string;
                };
                return {
                  id: typedItem._id || typedItem.id || '',
                  name: typedItem.name,
                  hour_price: typedItem.hour_price,
                  description: typedItem.description,
                };
              }
              // fallback for unexpected structure
              return { id: '', name: '', hour_price: '', description: '' };
            }),
          };
          return { ...response, data: mapped };
        }}
        queryKey={['getService']}
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
            href: `/service`,
            name: 'Services',
          },
        ]}
        title="Services"
      >
        {children}
        <Link href="/service/add">
          <Tooltip title={`Add Service`}>
            <Button variant="contained" sx={{ ml: 4 }}>
              Add
            </Button>
          </Tooltip>
        </Link>
      </PageLayoutHeader>
    </>
  );
};

export default ServiceList;
