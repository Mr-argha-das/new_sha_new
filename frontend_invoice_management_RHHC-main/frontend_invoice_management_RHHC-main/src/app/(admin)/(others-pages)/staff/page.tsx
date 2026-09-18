'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import { defaultRoles } from '@/modules/common/constant/messages';
import Link from '@/modules/common/elements/link';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import { getFullFileUrl } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { User } from '@/modules/common/models/user';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PermissionGuard from '@/modules/guards/permission-guard';
import {
  Autocomplete,
  Avatar,
  Button,
  Collapse,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../packages/ui/components/delete-confirmation/types';
import {
  LockResetIcon,
  VisibilityIcon,
} from '../../../../../packages/ui/icons';
import { getDesignations, getUser, removeUser } from './api';
import ChangeStaffPasswordModal from './components/ChangeStaffPasswordModal';
import StaffQuickPayModal from './components/StaffQuickPayModal';
import {
  StaffAdvancedFilters,
  StaffFilterProvider,
  useStaffFilterContext,
} from './filter-context';

const UserList = () => {
  const invalidate = useInvalidate();
  const [passwordModalStaff, setPasswordModalStaff] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { user } = useAuth();
  const { filters } = useStaffFilterContext();

  const handleDelete: OnDeleteFunction = async (id) => {
    await removeUser(id.toString());
    await invalidate(['getUser']);
  };

  const columns: GridColDef<User>[] = [
    {
      field: 'id',
      headerName: 'ID',
      maxWidth: 80,
      renderCell: ({ row }) => {
        return <span>{row.id}</span>;
      },
    },
    {
      field: 'photo_url',
      headerName: '',
      width: 56,
      maxWidth: 56,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Avatar
          src={row.photo_url ? getFullFileUrl(row.photo_url) : undefined}
          alt={row.name || 'Staff'}
          sx={{ width: 36, height: 36, fontSize: '0.875rem' }}
        >
          {row.name?.trim()?.charAt(0)?.toUpperCase() || '?'}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      renderCell: ({ row }) => {
        return <span>{truncateText(capitalizeWords(row.name), 15)}</span>;
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
      field: 'designation',
      headerName: 'Designation',
      width: 150,
      renderCell: ({ row }) => {
        return <span>{capitalizeWords(row.designation) ?? 'N/A'}</span>;
      },
    },
    {
      field: 'total_experience_in_months',
      headerName: 'Total experience (in years)',
      width: 100,
      renderCell: ({ row }) => {
        let totalExperience = row.total_experience_in_months ?? 0;
        totalExperience = totalExperience / 12;
        return (
          <span>{totalExperience ? `${totalExperience.toFixed(1)}` : '—'}</span>
        );
      },
    },
    {
      field: 'medical_verification',
      headerName: 'Medical Verification',
      width: 100,
      renderCell: ({ row }) => {
        return <span>{row.medical_verification === 1 ? 'Yes' : 'No'}</span>;
      },
    },
    {
      field: 'police_verification',
      headerName: 'Police Verification',
      width: 100,
      renderCell: ({ row }) => {
        return <span>{row.police_verification === 1 ? 'Yes' : 'No'}</span>;
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
      width: 100,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        return (
          <Stack spacing={2} direction="row">
            <Box display={'flex'}>
              <PermissionGuard permissions={'user-management/user:write'}>
                <Link href={`/staff/${row.id}`} tenantId>
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
              <PermissionGuard permissions={'user-management/user:write'}>
                <Tooltip title="Change Password">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setPasswordModalStaff({
                        id: Number(row.id),
                        name: row.name || '',
                      })
                    }
                  >
                    <LockResetIcon
                      style={{ color: 'neutral.500', opacity: 1 }}
                    />
                  </IconButton>
                </Tooltip>
              </PermissionGuard>
              <PermissionGuard permissions={'user-management/user:delete'}>
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
              </PermissionGuard>
            </Box>
          </Stack>
        );
      },
    },
  ];

  return (
    <PagePermissionGuard permissions={'user-management/user:read'}>
      <Modal
        open={!!passwordModalStaff}
        onClose={() => setPasswordModalStaff(null)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 420,
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
            Change Staff Password
          </h4>
          {passwordModalStaff && (
            <ChangeStaffPasswordModal
              staffId={passwordModalStaff.id}
              staffName={passwordModalStaff.name}
              onCancel={() => setPasswordModalStaff(null)}
              onSuccess={() => setPasswordModalStaff(null)}
            />
          )}
        </Box>
      </Modal>
      <PaginatedDataGrid
        query={getUser}
        queryKey={['getUser']}
        columns={columns}
        searchLabel="Search"
        toolbarContainer={HeaderToolbar}
        extraParams={{
          account_id: user?.account_id ?? '',
          branch_id: user?.branch_id ?? '',
          isRoleIncluded: false,
          role_id: defaultRoles.customer_role_id, // customer role id
          ...(filters.has_vehicle !== '' && filters.has_vehicle !== undefined
            ? { has_vehicle: filters.has_vehicle }
            : {}),
          ...(filters.has_driving_license !== '' &&
            filters.has_driving_license !== undefined
            ? { has_driving_license: filters.has_driving_license }
            : {}),
          ...(filters.designation !== '' && filters.designation !== undefined
            ? { designation: filters.designation }
            : {}),
          ...(filters.police_verification !== '' &&
            filters.police_verification !== undefined
            ? { police_verification: filters.police_verification }
            : {}),
          ...(filters.medical_verification !== '' &&
            filters.medical_verification !== undefined
            ? { medical_verification: filters.medical_verification }
            : {}),
          ...(filters.status !== '' && filters.status !== undefined
            ? { status: filters.status }
            : {}),
        }}
      />
    </PagePermissionGuard>
  );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
  const [quickPayOpen, setQuickPayOpen] = React.useState(false);
  const { filters, setFilters, resetFilters } = useStaffFilterContext();
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<StaffAdvancedFilters>(filters);
  const { user } = useAuth();
  const invalidate = useInvalidate();
  // Sync localFilters with filters when filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Fetch designations using useQuery
  const { data: designationsResponse, isLoading: loadingDesignations } =
    useQuery({
      queryKey: ['getDesignations', user?.account_id, user?.branch_id],
      queryFn: () => {
        if (!user?.account_id || !user?.branch_id) {
          return Promise.resolve({
            data: { data: { designations: ['nurse', 'attendant'] } },
          });
        }
        return getDesignations({
          account_id: user.account_id,
          branch_id: user.branch_id,
        });
      },
      enabled: !!user?.account_id && !!user?.branch_id,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

  const designations = designationsResponse?.data?.data?.designations || [
    'nurse',
    'attendant',
  ];

  const hasVehicleOptions = [
    { label: 'All', value: '' as const },
    { label: 'Yes', value: 1 as const },
    { label: 'No', value: 0 as const },
  ];

  const hasDrivingLicenseOptions = [
    { label: 'All', value: '' as const },
    { label: 'Yes', value: 1 as const },
    { label: 'No', value: 0 as const },
  ];

  const designationOptions = [
    { label: 'All', value: '' as const },
    ...designations.map((d) => ({
      label: d.charAt(0).toUpperCase() + d.slice(1),
      value: d as 'nurse' | 'attendant' | '',
    })),
  ];

  const policeVerificationOptions = [
    { label: 'All', value: '' as const },
    { label: 'Yes', value: 1 as const },
    { label: 'No', value: 0 as const },
  ];

  const medicalVerificationOptions = [
    { label: 'All', value: '' as const },
    { label: 'Yes', value: 1 as const },
    { label: 'No', value: 0 as const },
  ];

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Block', value: 'block' },
  ];

  return (
    <>
      <PageLayoutHeader
        breadcrumbs={[
          {
            href: `/staff`,
            name: 'Staff',
          },
        ]}
        title="Staff"
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
        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => setQuickPayOpen(true)}
        >
          Quick Pay
        </Button>
        <Link href="/staff/add">
          <Tooltip title={`Add Staff`}>
            <Button variant="contained" sx={{ ml: 2 }}>
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
              {/* HAS VEHICLE */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={hasVehicleOptions}
                value={
                  hasVehicleOptions.find(
                    (x) => x.value === localFilters.has_vehicle,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    has_vehicle: v?.value as 0 | 1 | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Has Vehicle" />
                )}
              />

              {/* HAS DRIVING LICENSE */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={hasDrivingLicenseOptions}
                value={
                  hasDrivingLicenseOptions.find(
                    (x) => x.value === localFilters.has_driving_license,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    has_driving_license: v?.value as 0 | 1 | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Has Driving License" />
                )}
              />

              {/* DESIGNATION */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={designationOptions}
                value={
                  designationOptions.find(
                    (x) => x.value === localFilters.designation,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    designation: (v?.value ?? '') as string | '',
                  }));
                }}
                loading={loadingDesignations}
                renderInput={(params) => (
                  <TextField {...params} label="Designation" />
                )}
              />

              {/* POLICE VERIFICATION */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={policeVerificationOptions}
                value={
                  policeVerificationOptions.find(
                    (x) => x.value === localFilters.police_verification,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    police_verification: v?.value as 0 | 1 | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Police Verification" />
                )}
              />

              {/* MEDICAL VERIFICATION */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={medicalVerificationOptions}
                value={
                  medicalVerificationOptions.find(
                    (x) => x.value === localFilters.medical_verification,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    medical_verification: v?.value as 0 | 1 | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Medical Verification" />
                )}
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
                    status: v?.value as string | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
              />
            </Stack>

            {/* BUTTONS AT BOTTOM */}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={() => {
                  resetFilters();
                  setLocalFilters({});
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

      <Modal open={quickPayOpen} onClose={() => setQuickPayOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 700,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
            Quick Pay
          </h4>
          <StaffQuickPayModal
            onCancel={() => setQuickPayOpen(false)}
            onSuccess={() => {
              invalidate(['getStaffQuickPays', user?.id]);
              setQuickPayOpen(false);
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

const UserListWithProvider = () => (
  <StaffFilterProvider>
    <UserList />
  </StaffFilterProvider>
);

export default UserListWithProvider;
