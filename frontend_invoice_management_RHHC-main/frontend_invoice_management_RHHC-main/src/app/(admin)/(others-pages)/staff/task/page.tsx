'use client';

import { useAuth } from '@/context/AuthContext';
import { useHorizontalInfiniteList } from '@/hooks/useHorizontalInfiniteList';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import { defaultRoles } from '@/modules/common/constant/messages';
import CustomerSearchAutocomplete from '@/modules/common/customer-search-autocomplete';
import Link from '@/modules/common/elements/link';
import {
  capitalizeFirstLetter,
  capitalizeWords,
} from '@/modules/common/helpers/capitalizeWords';
import { formatHoursToHrMin } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { StaffTask } from '@/modules/common/models/staff';
import StaffSearchAutocomplete from '@/modules/common/staff-search-autocomplete';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PermissionGuard from '@/modules/guards/permission-guard';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PaginatedDataGrid from '../../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../../packages/ui/icons';
import { getService } from '../../service/api';
import {
  getAllStaffFutureTasks,
  getAllStaffPastTasks,
  getAllStaffTask,
  getAllStaffTodayTasks,
  removeStaffTask,
  updateStaffTaskActivityStatus,
} from '../api';
import { ListItem } from '../api/schema';
import { TaskProvider, TaskTabKey, useTaskContext } from './context';

const StaffTaskList = () => {
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [note, setNote] = useState('');
  const [selectedTask, setSelectedTask] = useState<StaffTask | null>(null);
  const [noteTitle, setNoteTitle] = useState('');

  const [holdDialogOpen, setHoldDialogOpen] = useState(false);
  const [holdTaskId, setHoldTaskId] = useState<string>('');
  const [holdNotes, setHoldNotes] = useState('');
  const [carryForward, setCarryForward] = useState(false);
  const { activeTab, filters } = useTaskContext();

  const invalidate = useInvalidate();
  const { user } = useAuth();

  const handleDelete: OnDeleteFunction = async (id) => {
    await removeStaffTask(String(id));
    await invalidate(['getStaffTask']);
  };

  const handleStartTask = async (id: string) => {
    try {
      const res = await updateStaffTaskActivityStatus({
        id: Number(id),
        status: 'inProgress',
      });
      if (res.status) {
        toast.success('Task marked as started');
        await invalidate(['getStaffTask']);
      }
    } catch { }
  };

  const handleEndTask = async (task: StaffTask) => {
    try {
      const now = dayjs();
      const toTime = dayjs(task.to_date_time);
      const diffMinutes = Math.abs(now.diff(toTime, 'minute'));

      if (diffMinutes > 15) {
        const isEarly = now.isBefore(toTime);
        setNoteTitle(
          isEarly ? 'Reason for ending earlier' : 'Reason for ending later',
        );
        setSelectedTask(task);
        setOpenNoteDialog(true);
        return;
      }

      // within 15 min, end directly
      const res = await updateStaffTaskActivityStatus({
        id: Number(task.id),
        status: 'done',
        note_by_staff: '',
      });
      if (res.status) {
        toast.success('Task marked as ended');
        await invalidate(['getStaffTask']);
      }
    } catch { }
  };

  const handleSetOnHold = async (id: string) => {
    setHoldTaskId(String(id));
    setHoldNotes('');
    setCarryForward(false);
    setHoldDialogOpen(true);
  };

  const handleHoldSubmit = async () => {
    if (!holdTaskId) return;
    try {
      const res = await updateStaffTaskActivityStatus({
        id: Number(holdTaskId),
        status: 'onHold',
        note_by_staff: holdNotes,
        is_carry_forward: carryForward ? 1 : 0,
      });
      if (res.status) {
        toast.success('Task put on hold');
        await invalidate(['getStaffTask']);
      }
    } catch {
    } finally {
      setHoldDialogOpen(false);
      setHoldTaskId('');
      setHoldNotes('');
      setCarryForward(false);
    }
  };

  const handleEndHold = async (id: string) => {
    try {
      const res = await updateStaffTaskActivityStatus({
        id: Number(id),
        status: 'inProgress',
      });
      if (res.status) {
        toast.success('Hold ended');
        await invalidate(['getStaffTask']);
      }
    } catch { }
  };

  const handleNoteSubmit = async () => {
    if (!selectedTask) return;
    try {
      const res = await updateStaffTaskActivityStatus({
        id: Number(selectedTask.id),
        status: 'done',
        note_by_staff: note,
      });
      if (res.status) {
        toast.success('Task ended with note submitted');
        await invalidate(['getStaffTask']);
      }
    } catch {
    } finally {
      setOpenNoteDialog(false);
      setNote('');
      setSelectedTask(null);
    }
  };

  const columns: GridColDef<StaffTask>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 50,
      renderCell: ({ row }) => {
        return <span>{row.id}</span>;
      },
    },
    {
      field: 'staff_name',
      headerName: 'Staff',
      width: 150,
      renderCell: ({ row }) => {
        const name = capitalizeWords(truncateText(row.staff_name, 15));
        const isAdmin = Number(user?.role_id) === defaultRoles.supAdmin_role_id;

        if (isAdmin) {
          return <Link href={`/staff/${row.user_id}`}>{name}</Link>;
        }
        return <span>{name}</span>;
      },
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      width: 150,
      renderCell: ({ row }) => {
        const name = capitalizeFirstLetter(truncateText(row.customer_name, 15));
        const isAdmin = Number(user?.role_id) === defaultRoles.supAdmin_role_id;

        if (isAdmin) {
          return <Link href={`/customer/${row.customer_id}`}>{name}</Link>;
        }
        return <span>{name}</span>;
      },
    },
    {
      field: 'service_name',
      headerName: 'Service',
      width: 150,
      renderCell: ({ row }) => {
        const name = capitalizeFirstLetter(truncateText(row.service_name, 15));
        const isAdmin = Number(user?.role_id) === defaultRoles.supAdmin_role_id;

        if (isAdmin) {
          return <Link href={`/service/${row.service_id}`}>{name}</Link>;
        }
        return <span>{name}</span>;
      },
    },
    {
      field: 'from_date_time',
      headerName: 'From',
      minWidth: 50,
      renderCell: ({ row }) => {
        return (
          <span>{dayjs(row.from_date_time).format('DD/MM/YYYY hh:mm A')}</span>
        );
      },
    },
    {
      field: 'to_date_time',
      headerName: 'To',
      minWidth: 50,
      renderCell: ({ row }) => {
        return (
          <span>{dayjs(row.to_date_time).format('DD/MM/YYYY hh:mm A')}</span>
        );
      },
    },
    {
      field: 'start_date_time',
      headerName: 'Staff Started At',
      minWidth: 50,
      renderCell: ({ row }) => {
        let startTime = 'N/A';
        if (row.start_date_time) {
          startTime = dayjs(row.start_date_time).format('DD/MM/YYYY hh:mm A');
        }
        return <span>{startTime}</span>;
      },
    },
    {
      field: 'end_date_time',
      headerName: 'Staff Ended At',
      minWidth: 50,
      renderCell: ({ row }) => {
        let endTime = 'N/A';
        if (row.end_date_time) {
          endTime = dayjs(row.end_date_time).format('DD/MM/YYYY hh:mm A');
        }
        return <span>{endTime}</span>;
      },
    },
    {
      field: 'required_in_hours',
      headerName: 'Required In(hours)',
      sortable: false,
      filterable: false,
      minWidth: 50,
      renderCell: ({ row }) => {
        const requiredInHours = dayjs(row.to_date_time)
          .diff(dayjs(row.from_date_time), 'hour', true)
          .toFixed(1);
        return <span>{formatHoursToHrMin(Number(requiredInHours))}</span>;
      },
    },
    {
      field: 'total_hour',
      headerName: 'Completed In(hours)',
      minWidth: 50,
      renderCell: ({ row }) => {
        return <span>{formatHoursToHrMin(Number(row.total_hour))}</span>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 80,
      renderCell: ({ row }) => {
        return <span>{chipLable(row.status)}</span>;
      },
    },
    {
      field: 'payment_status',
      headerName: 'Payment Status',
      minWidth: 50,
      renderCell: ({ row }) => {
        return (
          <span>
            {chipLable(Number(row.payment_status) === 1 ? 'paid' : 'unpaid')}
          </span>
        );
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
        const status = String(row?.status ?? '').trim();
        const statusLc = status.toLowerCase();
        return (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ ml: 1, flexWrap: 'nowrap' }}
          >
            <PermissionGuard permissions={'user-management/staff-task:write'}>
              <Link href={`/staff/task/${row.id}`}>
                <Tooltip title="View">
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </PermissionGuard>

            <PermissionGuard permissions={'user-management/staff-task:write'}>
              <Stack direction="row" spacing={1}>

                {statusLc === 'todo' && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleStartTask(String(row.id))}
                  >
                    Start Task
                  </Button>
                )}

                {statusLc === 'inprogress' && (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleSetOnHold(String(row.id))}
                    >
                      Hold
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleEndTask(row)}
                    >
                      End Task
                    </Button>
                  </>
                )}

                {statusLc === 'onhold' && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEndHold(String(row.id))}
                  >
                    End Hold
                  </Button>
                )}
              </Stack>
            </PermissionGuard>

            {Number(user?.role_id) === defaultRoles.supAdmin_role_id && (
              <PermissionGuard permissions={'user-management/staff-task:delete'}>
                <DeleteConfirmationButton
                  message="Task"
                  resourceId={String(row.id)}
                  onDelete={handleDelete}
                />
              </PermissionGuard>
            )}
          </Stack>
        );
      },
    },
  ];

  const extraParams: Record<
    string,
    string | number | boolean | undefined | null
  > = {
    account_id: user?.account_id ?? 0,
    branch_id: user?.branch_id ?? '',
  };

  if (Number(user?.role_id) === defaultRoles.staff_role_id) {
    extraParams.staff_id = Number(user?.id);
  } else if (filters.staff_id !== undefined && filters.staff_id !== '') {
    extraParams.staff_id = Number(filters.staff_id);
  }

  if (filters.status) extraParams.status = filters.status;
  if (filters.paymentStatus !== undefined && filters.paymentStatus !== '')
    extraParams.payment_status = filters.paymentStatus;
  if (filters.customer_id !== undefined && filters.customer_id !== '')
    extraParams.customer_id = filters.customer_id;
  if (filters.service_id !== undefined && filters.service_id !== '')
    extraParams.service_id = filters.service_id;
  if (activeTab === 'all') {
    if (filters.start_date !== undefined && filters.start_date !== '')
      extraParams.start_date = filters.start_date;
    if (filters.end_date !== undefined && filters.end_date !== '')
      extraParams.end_date = filters.end_date;
  }

  const queryForActiveTab = useMemo(() => {
    switch (activeTab) {
      case 'past':
        return getAllStaffPastTasks;
      case 'future':
        return getAllStaffFutureTasks;
      case 'today':
        return getAllStaffTodayTasks;
      case 'all':
        return getAllStaffTask;
      default:
        return getAllStaffTodayTasks;
    }
  }, [activeTab]);

  return (
    <>
      <PagePermissionGuard permissions={'user-management/staff-task:read'}>
        <PaginatedDataGrid
          key={activeTab}
          query={queryForActiveTab}
          queryKey={['getStaffTask', activeTab]}
          columns={columns}
          searchLabel="Search"
          toolbarContainer={HeaderToolbar}
          extraParams={extraParams}
        />
      </PagePermissionGuard>

      <Dialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{noteTitle}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Please enter your ${noteTitle.toLowerCase()} `}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleNoteSubmit}
            variant="contained"
            disabled={!note.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={holdDialogOpen}
        onClose={() => setHoldDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Put task on hold</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={holdNotes}
              onChange={(e) => setHoldNotes(e.target.value)}
            />
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={carryForward}
                  onChange={(e) => setCarryForward(e.target.checked)}
                />
              }
              label="Carry forward (extend task end time by hold duration)"
            /> */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHoldDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleHoldSubmit}>
            Hold
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
  const { user } = useAuth();
  const { activeTab, setActiveTab, filters, setFilters, resetFilters } =
    useTaskContext();
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const isStaffLoggedIn = Number(user?.role_id) === defaultRoles.staff_role_id;

  // Sync localFilters with filters when filters change
  useEffect(() => {
    setLocalFilters(filters);
    setFromDate(filters.start_date ? dayjs(filters.start_date) : null);
    setToDate(filters.end_date ? dayjs(filters.end_date) : null);
  }, [filters]);

  // Fetch dropdown lists (services, customers, staff) here so controls have access
  const {
    items: serviceItems,
    isFetchingNextPage: serviceFetchingMore,
    hasMore: serviceHasMore,
    fetchNextPage: fetchMoreServices,
  } = useHorizontalInfiniteList<ListItem, Record<string, unknown>>({
    queryKey: ['getServices'],
    fetcher: async (params) => {
      const res = await getService(params);
      const d =
        (res?.data as unknown as {
          data?: Array<{
            id: string | number;
            name: string;
            hour_price?: number;
          }>;
          meta?: { total?: number };
        }) || {};
      return {
        data: {
          data: (d?.data || []).map((x) => ({
            id: Number(x.id),
            name: x.name,
            hour_price: x.hour_price,
          })) as ListItem[],
          meta: {
            total:
              d?.meta?.total ?? (Array.isArray(d?.data) ? d.data.length : 0),
          },
        },
      } as { data: { data: ListItem[]; meta: { total: number } } };
    },
    params: {
      account_id: user?.account_id,
      branch_id: user?.branch_id,
    },
    limit: 20,
    enabled: !!user?.account_id && !!user?.branch_id,
  });

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Todo', value: 'todo' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Done', value: 'done' },
  ];
  const paymentOptions = [
    { label: 'All', value: '' },
    { label: 'Paid', value: 1 },
    { label: 'Unpaid', value: 0 },
  ];
  const serviceOptions = [{ id: '', name: 'All' }, ...(serviceItems || [])];

  return (
    <>
      <PageLayoutHeader
        breadcrumbs={[
          {
            href: `/staff/task`,
            name: 'Tasks',
          },
        ]}
        title="Tasks"
      >
        <Button
          variant="outlined"
          onClick={() => {
            if (!openAdvanced) {
              setLocalFilters(filters);
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
        {Number(user?.role_id) === defaultRoles.supAdmin_role_id && (
          <Link href="/staff/task/add">
            <Tooltip title={`Add Task`}>
              <Button variant="contained" sx={{ ml: 2 }}>
                Add
              </Button>
            </Tooltip>
          </Link>
        )}
      </PageLayoutHeader>

      <Collapse in={openAdvanced}>
        <Paper elevation={1} sx={{ mt: 2, p: 2, mb: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ typography: 'h6', fontWeight: 600 }}>
              Advanced Search
            </Box>

            {/* FILTERS */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
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
                    status: v?.value as 'todo' | 'inProgress' | 'done' | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
              />

              {/* PAYMENT STATUS */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={paymentOptions}
                value={
                  paymentOptions.find(
                    (x) => x.value === localFilters.paymentStatus,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    paymentStatus: v?.value as 0 | 1 | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Payment Status" />
                )}
              />

              {/* STAFF (when not staff logged in) */}
              {!isStaffLoggedIn && (
                <StaffSearchAutocomplete
                  size="small"
                  label="Staff"
                  name="staff_id"
                  value={String(localFilters.staff_id ?? '')}
                  onChange={(staffId) => {
                    setLocalFilters((p) => ({
                      ...p,
                      staff_id: staffId ? Number(staffId) : '',
                    }));
                  }}
                  slotProps={{
                    root: {
                      sx: { minWidth: 180 },
                    },
                  }}
                />
              )}

              {/* CUSTOMER */}
              <CustomerSearchAutocomplete
                size="small"
                value={localFilters.customer_id ?? ''}
                onChange={(customerId) => {
                  const newCustomerId: number | '' = customerId
                    ? Number(customerId)
                    : '';
                  setLocalFilters((p) => ({
                    ...p,
                    customer_id: newCustomerId,
                  }));
                }}
                slotProps={{
                  root: {
                    sx: { minWidth: 180 },
                  },
                }}
              />

              {/* SERVICE */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={serviceOptions}
                getOptionLabel={(o) => o?.name ?? ''}
                value={
                  serviceOptions.find(
                    (x) => x.id === localFilters.service_id,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    service_id: v?.id as number | '',
                  }));
                }}
                slotProps={{
                  listbox: {
                    onScroll: (e: React.UIEvent<HTMLUListElement>) => {
                      const el = e.currentTarget;
                      const remaining =
                        el.scrollHeight - el.scrollTop - el.clientHeight;
                      if (
                        remaining < 160 &&
                        serviceHasMore &&
                        !serviceFetchingMore
                      ) {
                        fetchMoreServices();
                      }
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Service" />
                )}
              />

              {/* DATE RANGE (only for All tab) */}
              {activeTab === 'all' && (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      format="DD/MM/YYYY"
                      value={fromDate}
                      onChange={(newValue) => {
                        setFromDate(newValue);
                        setLocalFilters((p) => ({
                          ...p,
                          start_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                        }));
                      }}
                      maxDate={toDate || undefined}
                      slotProps={{
                        textField: {
                          size: 'small',
                          sx: { minWidth: 180 },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      format="DD/MM/YYYY"
                      value={toDate}
                      onChange={(newValue) => {
                        setToDate(newValue);
                        setLocalFilters((p) => ({
                          ...p,
                          end_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                        }));
                      }}
                      minDate={fromDate || undefined}
                      slotProps={{
                        textField: {
                          size: 'small',
                          sx: { minWidth: 180 },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </>
              )}
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

      <Box sx={{ mt: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v: TaskTabKey) => {
            // Clear filters and search on tab change
            resetFilters();
            setLocalFilters({});
            setFromDate(null);
            setToDate(null);
            setActiveTab(v);
            setOpenAdvanced(false);
          }}
          aria-label="Task time range tabs"
        >
          <Tab value="all" label="All" />
          <Tab value="past" label="Past" />
          <Tab value="today" label="Today" />
          <Tab value="future" label="Future" />
        </Tabs>
      </Box>
    </>
  );
};

const StaffTaskListWithProvider = () => (
  <TaskProvider>
    <StaffTaskList />
  </TaskProvider>
);

export default StaffTaskListWithProvider;
