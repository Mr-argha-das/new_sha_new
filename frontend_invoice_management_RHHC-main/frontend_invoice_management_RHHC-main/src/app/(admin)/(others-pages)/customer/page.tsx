'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import { defaultRoles } from '@/modules/common/constant/messages';
import Link from '@/modules/common/elements/link';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { User } from '@/modules/common/models/user';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PermissionGuard from '@/modules/guards/permission-guard';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../packages/ui/icons';
import { getUser, removeUser } from './api';

const UserList = () => {
  const invalidate = useInvalidate();

  const { user } = useAuth();
  const handleDelete: OnDeleteFunction = async (id) => {
    const customerId = typeof id == 'string' ? id : String(id);
    await removeUser(customerId);
    await invalidate(['getUser']);
  };

  const columns: GridColDef<User>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: ({ row }) => {
        return <span>{row.id}</span>;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      renderCell: ({ row }) => {
        return <span>{capitalizeWords(truncateText(row.name, 15))}</span>;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      renderCell: ({ row }) => {
        return <span>{truncateText(row?.email)}</span>;
      },
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      width: 150,
      renderCell: ({ row }) => {
        return <span>{formatMobile(row.mobile)}</span>;
      },
    },
    {
      field: 'city',
      headerName: 'City',
      width: 150,
      renderCell: ({ row }) => {
        const addr = row.permanent_address;
        const city = addr?.city?.label || addr?.city?.value || 'N/A';
        return <span>{capitalizeWords(String(city))}</span>;
      },
    },
    {
      field: 'pincode',
      headerName: 'Pincode',
      width: 150,
      renderCell: ({ row }) => {
        const addr = row.permanent_address;
        const pin = addr?.pinCode || 'N/A';
        return <span>{String(pin)}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        return (
          <Stack spacing={2} direction="row">
            <Box display={'flex'}>
              <PermissionGuard permissions={'user-management/user:write'}>
                <Link href={`/customer/${row.id}`} tenantId>
                  <Tooltip title={`View`}>
                    <IconButton
                      size="small"
                      onClick={async () => {
                        await invalidate(['getUserById']);
                      }}
                    >
                      <VisibilityIcon
                        style={{ color: 'neutral.500', opacity: 1 }}
                      />
                    </IconButton>
                  </Tooltip>
                </Link>
              </PermissionGuard>
              <PermissionGuard permissions={'user-management/user:delete'}>
                <DeleteConfirmationButton
                  message="Customer"
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
              </PermissionGuard>
            </Box>
          </Stack>
        );
      },
    },
  ];

  return (
    <PagePermissionGuard permissions={'user-management/user:read'}>
      <PaginatedDataGrid
        query={getUser}
        queryKey={['getUser']}
        columns={columns}
        searchLabel="Search"
        toolbarContainer={HeaderToolbar}
        extraParams={{
          account_id: user?.account_id,
          branch_id: user?.branch_id,
          isRoleIncluded: true,
          role_id: defaultRoles.customer_role_id, // customer role id
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
            href: `/customer`,
            name: 'Customers',
          },
        ]}
        title="Customers"
      >
        {children}
        <Link href="/customer/add">
          <Tooltip title={`Add Customer`}>
            <Button variant="contained" sx={{ ml: 4 }}>
              Add
            </Button>
          </Tooltip>
        </Link>
      </PageLayoutHeader>
    </>
  );
};

export default UserList;
