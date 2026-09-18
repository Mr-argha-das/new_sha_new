'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import CustomerSearchAutocomplete from '@/modules/common/customer-search-autocomplete';
import Link from '@/modules/common/elements/link';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { formatINR } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Lead, LeadStatus } from '@/modules/common/models/lead';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PermissionGuard from '@/modules/guards/permission-guard';
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../packages/ui/icons';
import { getLead, removeLead } from './api';
import {
  LeadAdvancedFilters,
  LeadFilterProvider,
  useLeadFilterContext,
} from './filter-context';

const LeadList = () => {
  const invalidate = useInvalidate();

  const { user } = useAuth();
  const { filters } = useLeadFilterContext();

  const handleDelete: OnDeleteFunction = async (id) => {
    const leadId = typeof id === 'string' ? id : String(id);
    await removeLead(leadId);
    await Promise.all([
      invalidate(['getLead']),
      invalidate(['getInvoice']),
      invalidate(['getUser']),
    ]);
  };

  const columns: GridColDef<Lead>[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 80,
      renderCell: ({ row }) => {
        return (
          <Link href={`/lead/${row.id}`} tenantId>
            <span
              style={{
                cursor: 'pointer',
                color: '#1976d2',
                textDecoration: 'none',
              }}
            >
              {row.id}
            </span>
          </Link>
        );
      },
    },
    {
      field: 'lead_name',
      headerName: 'Lead Name',
      minWidth: 150,
      renderCell: ({ row }) => {
        return (
          <span>
            {truncateText(capitalizeFirstLetter(row.lead_name || ''), 15)}
          </span>
        );
      },
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      minWidth: 150,
      renderCell: ({ row }) => {
        return (
          <Link href={`/customer/${row.customer_id}`}>
            {truncateText(capitalizeFirstLetter(row.customer_name || ''), 15)}
          </Link>
        );
      },
    },
    {
      field: 'security_deposit',
      headerName: 'Deposit (₹)',
      minWidth: 100,
      renderCell: ({ row }) => {
        return <span>{formatINR(row.security_deposit, false)}</span>;
      },
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      minWidth: 150,
      renderCell: ({ row }) => {
        return <span>{toDDMMYYYY(row.start_date)}</span>;
      },
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      minWidth: 150,
      renderCell: ({ row }) => {
        const endDate = row.end_date ? toDDMMYYYY(row.end_date) : 'N/A';
        return <span>{endDate}</span>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: ({ row }) => {
        return <span>{chipLable(row.status)}</span>;
      },
    },
    {
      field: 'lead_status',
      headerName: 'Lead Progress',
      minWidth: 150,
      align: 'center',
      renderCell: ({ row }) => {
        const isInCreated = row.lead_status == LeadStatus.CREATED;
        const isInProductReturnPending =
          row.lead_status == LeadStatus.PRODUCT_RETURN_PENDING;

        return (
          <span>
            {isInCreated
              ? '-'
              : isInProductReturnPending
                ? chipLable(
                    row.lead_status ?? '',
                    'Product remaining to return',
                  )
                : chipLable(row.lead_status ?? '')}
          </span>
        );
      },
    },

    {
      field: 'actions',
      minWidth: 130,
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        return (
          <Stack spacing={2} direction="row">
            <Box display={'flex'}>
              <PermissionGuard permissions={'lead-management/lead:write'}>
                <Link href={`/lead/${row.id}`} tenantId>
                  <Tooltip title={`View`}>
                    <IconButton
                      size="small"
                      onClick={async () => {
                        await invalidate(['getLeadById']);
                      }}
                    >
                      <VisibilityIcon
                        style={{ color: 'neutral.500', opacity: 1 }}
                      />
                    </IconButton>
                  </Tooltip>
                </Link>
              </PermissionGuard>

              <PermissionGuard permissions={'lead-management/lead:delete'}>
                <DeleteConfirmationButton
                  message="Lead"
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
    <>
      <PagePermissionGuard permissions={'lead-management/lead:read'}>
        <PaginatedDataGrid
          query={getLead}
          queryKey={['getLead']}
          columns={columns}
          searchLabel="Search"
          toolbarContainer={HeaderToolbar}
          extraParams={{
            account_id: user?.account_id ?? '',
            branch_id: user?.branch_id ?? '',
            ...(filters.customer_id !== undefined &&
            filters.customer_id !== '' &&
            typeof filters.customer_id === 'number'
              ? { customer_id: filters.customer_id }
              : {}),
            ...(filters.status !== undefined && filters.status !== ''
              ? { status: filters.status }
              : {}),
            ...(filters.lead_status !== undefined && filters.lead_status !== ''
              ? { lead_status: filters.lead_status }
              : {}),
            ...(filters.start_date !== undefined && filters.start_date !== ''
              ? { start_date: filters.start_date }
              : {}),
            ...(filters.end_date !== undefined && filters.end_date !== ''
              ? { end_date: filters.end_date }
              : {}),
          }}
        />
      </PagePermissionGuard>
    </>
  );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
  const { filters, setFilters, resetFilters } = useLeadFilterContext();
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  // Sync localFilters with filters when filters change
  useEffect(() => {
    setLocalFilters(filters);
    setStartDate(filters.start_date ? dayjs(filters.start_date) : null);
    setEndDate(filters.end_date ? dayjs(filters.end_date) : null);
  }, [filters]);

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Draft', value: 'draft' },
    { label: 'Finalised', value: 'finalised' },
    { label: 'On Hold', value: 'onhold' },
    { label: 'Invalid', value: 'invalid' },
  ];

  const leadStatusOptions = [
    { label: 'All', value: '' },
    { label: '-', value: 'created' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Product remaining to return', value: 'productReturnPending' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <>
      <PageLayoutHeader
        breadcrumbs={[
          {
            href: `/lead`,
            name: 'Leads',
          },
        ]}
        title="Leads"
      >
        <Button
          variant="outlined"
          onClick={() => {
            if (!openAdvanced) {
              setLocalFilters(filters);
              setStartDate(
                filters.start_date ? dayjs(filters.start_date) : null,
              );
              setEndDate(filters.end_date ? dayjs(filters.end_date) : null);
            }
            setOpenAdvanced(!openAdvanced);
          }}
          sx={{
            mr: 2,
            mb: { xs: 2, sm: 0 }
          }}
        >
          {openAdvanced ? 'Hide' : 'Advanced'} Search
        </Button>
        {children}
        <Link href="/lead/add">
          <Tooltip title={`Add Lead`}>
            <Button variant="contained" sx={{ ml: 4 }}>
              Add
            </Button>
          </Tooltip>
        </Link>
      </PageLayoutHeader>

      <Collapse in={openAdvanced}>
        <Paper elevation={1} sx={{ mt: 2, p: 2, mb: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ typography: 'h6', fontWeight: 600 }}>
              Advanced Search
            </Box>

            {/* FILTERS */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {/* CUSTOMER */}
              <CustomerSearchAutocomplete
                size="small"
                value={localFilters.customer_id ?? ''}
                onChange={(customerId) => {
                  const newCustomerId: number | '' = customerId
                    ? Number(customerId)
                    : '';
                  setLocalFilters(
                    (p): LeadAdvancedFilters => ({
                      ...p,
                      customer_id: newCustomerId,
                    }),
                  );
                }}
                slotProps={{
                  root: {
                    sx: { minWidth: 180 },
                  },
                }}
              />

              {/* STATUS */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={statusOptions}
                value={
                  statusOptions.find((x) => x.value === localFilters.status) ||
                  null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    status: v?.value as
                      | 'draft'
                      | 'finalised'
                      | 'onhold'
                      | 'invalid'
                      | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
              />

              {/* LEAD PROGRESS */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={leadStatusOptions}
                value={
                  leadStatusOptions.find(
                    (x) => x.value === localFilters.lead_status,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    lead_status: v?.value as
                      | 'created'
                      | 'inProgress'
                      | 'completed'
                      | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Lead Progress" />
                )}
              />

              {/* START DATE */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  format="DD/MM/YYYY"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    setLocalFilters((p) => ({
                      ...p,
                      start_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                    }));
                  }}
                  maxDate={endDate || dayjs()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 180 },
                    },
                  }}
                />
              </LocalizationProvider>

              {/* END DATE */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  format="DD/MM/YYYY"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                    setLocalFilters((p) => ({
                      ...p,
                      end_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                    }));
                  }}
                  minDate={startDate || undefined}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 180 },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>

            {/* BUTTONS AT BOTTOM */}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={() => {
                  resetFilters();
                  setLocalFilters({});
                  setStartDate(null);
                  setEndDate(null);
                }}
                color="inherit"
                size="small"
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  setFilters(localFilters);
                }}
                variant="contained"
                size="small"
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Collapse>
    </>
  );
};

const LeadListWithProvider = () => (
  <LeadFilterProvider>
    <LeadList />
  </LeadFilterProvider>
);

export default LeadListWithProvider;
