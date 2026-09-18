'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import Link from '@/modules/common/elements/link';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { chipLable } from '@/modules/common/helpers/helpers';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PermissionGuard from '@/modules/guards/permission-guard';
import { Button, IconButton, Stack, Tooltip, Paper, Collapse, Autocomplete, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { GridColDef } from '@mui/x-data-grid';
import PaginatedDataGrid from '../../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../../packages/ui/icons';
import { deleteStaffPaySlip, getAllStaffPaySlips, getUser } from '.././api';
import { StaffPaySlipMinimal, ListItem } from '../api/schema';
import { defaultRoles } from '@/modules/common/constant/messages';
import { usePayslipContext, PayslipProvider } from './context';
import { useHorizontalInfiniteList } from '@/hooks/useHorizontalInfiniteList';
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const StaffPaySlip = () => {
  const invalidate = useInvalidate();

  const { user } = useAuth();
  const isAdminLoggedIn = Number(user?.role_id) === defaultRoles.supAdmin_role_id;
  const { filters } = usePayslipContext();

  const handleDelete: OnDeleteFunction = async (id) => {
    await deleteStaffPaySlip(String(id));
    await invalidate(['getStaffPaySlip']);
  };

  const columns: GridColDef<StaffPaySlipMinimal>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: ({ row }) => {
        return <span>{row.id}</span>;
      },
    },
    {
      field: 'staff_name',
      headerName: 'Staff',
      width: 150,
      renderCell: ({ row }) => (
        <Link href={`/staff/${row?.user_id ?? ''}`} >
          {capitalizeFirstLetter(truncateText(row.staff_name, 15))}
        </Link >
      ),
    },
    {
      field: 'from_date',
      headerName: 'From',
      width: 150,
      renderCell: ({ row }) => <span>{toDDMMYYYY(row.from_date)}</span>,
    },
    {
      field: 'to_date',
      headerName: 'To',
      width: 120,
      renderCell: ({ row }) => <span>{toDDMMYYYY(row.to_date)}</span>,
    },
    {
      field: 'invoice_status',
      headerName: 'Status',
      width: 120,
      renderCell: ({ row }) => <span>{chipLable(row.invoice_status)}</span>,
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
              <Link href={`/staff/pay-slip/${row.id}`}>
                <Tooltip title={`View`}>
                  <IconButton
                    size="small"
                    onClick={async () => {
                      await invalidate(['getStaffPaySlipById']);
                    }}
                  >
                    <VisibilityIcon
                      style={{ color: 'neutral.500', opacity: 1 }}
                    />
                  </IconButton>
                </Tooltip>
              </Link>

              <PermissionGuard permissions={'user-management/user:delete'}>
                {/* {row.invoice_status === 'draft' && ( */}
                <DeleteConfirmationButton
                  message="Staff"
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
                {/* )} */}
              </PermissionGuard>
            </Box>
          </Stack>
        );
      },
    },
  ];

  const extraParams: Record<string, string | number> = {
    account_id: user?.account_id ?? '',
    branch_id: user?.branch_id ?? '',
  };
  if (!isAdminLoggedIn) {
    extraParams.staff_id = Number(user?.id) ?? '';
    extraParams.invoice_status = 'finalised';
  } else {
    // Apply filters for admin
    if (filters.staff_id !== undefined && filters.staff_id !== '') {
      extraParams.staff_id = Number(filters.staff_id);
    }
    if (filters.from_date !== undefined && filters.from_date !== '') {
      extraParams.from_date = filters.from_date;
    }
    if (filters.to_date !== undefined && filters.to_date !== '') {
      extraParams.to_date = filters.to_date;
    }
    if (filters.invoice_status !== undefined && filters.invoice_status !== '') {
      extraParams.invoice_status = filters.invoice_status;
    }
  }

  return (
    <PagePermissionGuard permissions={'user-management/staff-pay-slip:read'}>
      <PaginatedDataGrid
        query={getAllStaffPaySlips}
        queryKey={['getStaffPaySlip']}
        columns={columns}
        searchLabel="Search"
        toolbarContainer={HeaderToolbar}
        extraParams={extraParams}
      />
    </PagePermissionGuard>
  );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
  const { user } = useAuth();
  const isAdminLoggedIn = Number(user?.role_id) === defaultRoles.supAdmin_role_id;
  const { filters, setFilters, resetFilters } = usePayslipContext();
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  // Sync localFilters with filters when filters change
  useEffect(() => {
    setLocalFilters(filters);
    setFromDate(filters.from_date ? dayjs(filters.from_date) : null);
    setToDate(filters.to_date ? dayjs(filters.to_date) : null);
  }, [filters]);

  // Fetch staff list for dropdown
  const {
    items: staffItems,
    isFetchingNextPage: staffFetchingMore,
    hasMore: staffHasMore,
    fetchNextPage: fetchMoreStaff,
  } = useHorizontalInfiniteList<ListItem, Record<string, unknown>>({
    queryKey: ['getStaffForPayslip'],
    fetcher: async (params) => {
      const res = await (getUser as unknown as (p: unknown) => Promise<unknown>)({ ...params, isRoleIncluded: false, role_id: defaultRoles.customer_role_id });
      const raw = res as { data?: unknown };
      const d = (raw?.data as { data?: Array<{ id: string | number; name: string }>; meta?: { total?: number } }) || {};
      return {
        data: {
          data: (d?.data || []).map((x) => ({ id: Number(x.id), name: x.name })) as ListItem[],
          meta: { total: d?.meta?.total ?? (Array.isArray(d?.data) ? d.data.length : 0) },
        },
      } as { data: { data: ListItem[]; meta: { total: number } } };
    },
    params: {
      account_id: user?.account_id,
      branch_id: user?.branch_id,
    },
    limit: 20,
    enabled: !!user?.account_id && !!user?.branch_id && isAdminLoggedIn,
  });

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Draft", value: "draft" },
    { label: "Finalised", value: "finalised" },
  ];

  const staffOptions = [{ id: "", name: "All" }, ...(staffItems || [])];

  return (
    <>
      <PageLayoutHeader
        breadcrumbs={[
          {
            href: `/staff/pay-slip`,
            name: 'Pay Slips',
          },
        ]}
        title="Pay Slips"
      >
        {isAdminLoggedIn && (
          <Button
            variant="outlined"
            onClick={() => {
              if (!openAdvanced) {
                setLocalFilters(filters);
                setFromDate(filters.from_date ? dayjs(filters.from_date) : null);
                setToDate(filters.to_date ? dayjs(filters.to_date) : null);
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
        )}
        {children}
        {isAdminLoggedIn && (
          <Link href="/staff/pay-slip/add">
            <Tooltip title={`Add Pay Slip`}>
              <Button variant="contained" sx={{ ml: 2 }}>
                Add
              </Button>
            </Tooltip>
          </Link>
        )}
      </PageLayoutHeader>

      {isAdminLoggedIn && (
        <Collapse in={openAdvanced}>
          <Paper elevation={1} sx={{ mt: 2, p: 2, mb: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ typography: 'h6', fontWeight: 600 }}>Advanced Search</Box>

              {/* FILTERS */}
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {/* STAFF */}
                <Autocomplete
                  size="small"
                  sx={{ minWidth: 180 }}
                  options={staffOptions}
                  getOptionLabel={(o) => o?.name ?? ""}
                  value={staffOptions.find(x => x.id === localFilters.staff_id) || null}
                  onChange={(_, v) => {
                    setLocalFilters(p => ({ ...p, staff_id: v?.id ?? "" }));
                  }}
                  slotProps={{
                    listbox: {
                      onScroll: (e: React.UIEvent<HTMLUListElement>) => {
                        const el = e.currentTarget;
                        const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
                        if (remaining < 160 && staffHasMore && !staffFetchingMore) {
                          fetchMoreStaff();
                        }
                      }
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Staff" />}
                />

                {/* STATUS */}
                <Autocomplete
                  size="small"
                  sx={{ minWidth: 180 }}
                  options={statusOptions}
                  value={
                    statusOptions.find(x => x.value === localFilters.invoice_status) || null
                  }
                  onChange={(_, v) => {
                    setLocalFilters((p) => ({ ...p, invoice_status: v?.value as "draft" | "finalised" | "" }));
                  }}
                  renderInput={(params) => <TextField {...params} label="Status" />}
                />

                {/* FROM DATE */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    format="DD/MM/YYYY"
                    value={fromDate}
                    onChange={(newValue) => {
                      setFromDate(newValue);
                      setLocalFilters((p) => ({ ...p, from_date: newValue ? newValue.format('YYYY-MM-DD') : '' }));
                    }}
                    maxDate={toDate || dayjs()}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { minWidth: 180 }
                      },
                    }}
                  />
                </LocalizationProvider>

                {/* TO DATE */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To Date"
                    format="DD/MM/YYYY"
                    value={toDate}
                    onChange={(newValue) => {
                      setToDate(newValue);
                      setLocalFilters((p) => ({ ...p, to_date: newValue ? newValue.format('YYYY-MM-DD') : '' }));
                    }}
                    minDate={fromDate || undefined}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { minWidth: 180 }
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
                    setFromDate(null);
                    setToDate(null);
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
      )}
    </>
  );
};

const StaffPaySlipWithProvider = () => (
  <PayslipProvider>
    <StaffPaySlip />
  </PayslipProvider>
);

export default StaffPaySlipWithProvider;
