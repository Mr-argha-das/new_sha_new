'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import Link from '@/modules/common/elements/link';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { AccountSettings } from '@/modules/common/models/accountSettings';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import { VisibilityIcon } from '../../../../../packages/ui/icons';
import { getAccountSettingsByAccountAndBranchID } from './api';

const AccountSetting = () => {
  const invalidate = useInvalidate();
  const { user } = useAuth();
  const columns: GridColDef<AccountSettings>[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 80,
      renderCell: ({ }) => {
        return <span>1</span>;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 200,
      renderCell: ({ row }) => {
        return <span>{capitalizeFirstLetter(row.name)}</span>;
      },
    },
    {
      field: 'service_type',
      headerName: 'Service Type',
      minWidth: 150,
      renderCell: ({ row }) => {
        return <span>{row.service_type}</span>;
      },
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      minWidth: 250,
      renderCell: ({ row }) => {
        return <span>{formatMobile(row.mobile)}</span>;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 250,
      renderCell: ({ row }) => {
        return <span>{row.email}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 200,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        return (
          <Stack spacing={2} direction="row">
            <Box display={'flex'}>
              <Link href={`/account-settings/${row.id}`} tenantId>
                <Tooltip title={`View`}>
                  <IconButton
                    size="small"
                    onClick={async () => {
                      await invalidate(['getAccountSettingsById']);
                    }}
                  >
                    <VisibilityIcon
                      style={{ color: 'neutral.500', opacity: 1 }}
                    />
                  </IconButton>
                </Tooltip>
              </Link>
            </Box>
          </Stack>
        );
      },
    },
  ];

  return (
    <PaginatedDataGrid
      query={getAccountSettingsByAccountAndBranchID}
      queryKey={['getAccountSettings']}
      columns={columns}
      searchLabel="Search"
      toolbarContainer={HeaderToolbar}
      extraParams={{
        account_id: user?.account_id ?? '',
        branch_id: user?.branch_id ?? '',
      }}
    />
  );
};

const HeaderToolbar: ToolbarContainer = ({ }) => {
  return (
    <>
      <PageLayoutHeader
        breadcrumbs={[
          {
            href: `/account-settings`,
            name: 'Account Settings',
          },
        ]}
        title="Account Settings"
      ></PageLayoutHeader>
    </>
  );
};

export default AccountSetting;
