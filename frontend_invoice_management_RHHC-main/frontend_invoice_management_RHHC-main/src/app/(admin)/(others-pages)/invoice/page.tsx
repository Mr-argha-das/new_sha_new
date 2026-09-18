'use client';

import { useAuth } from '@/context/AuthContext';
import { ReceiptPayload } from '@/lib/payment_recipt_html';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import CustomerSearchAutocomplete from '@/modules/common/customer-search-autocomplete';
import Link from '@/modules/common/elements/link';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import { formatINR } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Invoice } from '@/modules/common/models/invoice';
import { Lead } from '@/modules/common/models/lead';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import PermissionGuard from '@/modules/guards/permission-guard';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
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
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../packages/ui/icons';
import { getCustomerLeadList } from '../lead/api';
import { getInvoice, markRentedProductsReturned, removeInvoice } from './api';
import MarkRentedReturnedModal from './components/mark-rented-returned-modal';
import PaymentForm from './components/payment-form';
import PaymentReceiptPdf from './components/pdf/payment-reciept';
import ExtraParamsContext, { ExtraParams } from './context';
import {
  InvoiceAdvancedFilters,
  InvoiceFilterProvider,
  useInvoiceFilterContext,
} from './filter-context';

const InvoiceList = () => {
  const invalidate = useInvalidate();
  const router = useRouter();
  const { user } = useAuth();
  const { filters } = useInvoiceFilterContext();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedInvoiceForReturn, setSelectedInvoiceForReturn] =
    useState<Invoice | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptPayload, setReceiptPayload] = useState<ReceiptPayload | null>(
    null,
  );
  const [extraParams, setExtraParams] = useState<ExtraParams>({
    account_id: String(user?.account_id),
    branch_id: String(user?.branch_id),
  });

  const handleDelete: OnDeleteFunction = async (id) => {
    const invoiceId = typeof id === 'string' ? id : String(id);
    await removeInvoice(invoiceId);
    await invalidate(['getInvoice']);
  };

  const handlePaymentClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentModalOpen(true);
  };

  const handlePaymentClose = () => {
    setPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleOpenReturnModal = (invoice: Invoice) => {
    setSelectedInvoiceForReturn(invoice);
    setReturnModalOpen(true);
  };

  const handleReturnModalClose = () => {
    setReturnModalOpen(false);
    setSelectedInvoiceForReturn(null);
  };

  const handleMarkRentedProductsReturned = async (values: {
    return_date: string;
    note: string;
  }) => {
    if (!selectedInvoiceForReturn || !user?.account_id || !user?.branch_id)
      return;
    try {
      await markRentedProductsReturned({
        return_date: values.return_date,
        note: values.note ?? '',
        lead_id: Number(selectedInvoiceForReturn.lead_id),
        account_id: Number(user.account_id),
        branch_id: Number(user.branch_id),
      });
      toast.success('Rented products marked as returned');
      await invalidate(['getInvoice']);
    } catch (error) {
      console.error(error);
    }
  };

  const columns: GridColDef<Invoice>[] = [
    {
      field: 'invoice_number',
      headerName: 'Invoice No.',
      width: 120,
      renderCell: ({ row }) => {
        return (
          <Tooltip title={row.invoice_number} placement="left-start">
            <Link href={`/invoice/${row.id}`} tenantId>
              <span
                style={{
                  cursor: 'pointer',
                  color: '#1976d2',
                  textDecoration: 'none',
                }}
              >
                {row.invoice_number}
              </span>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      field: 'lead_name',
      headerName: 'Lead',
      minWidth: 150,
      renderCell: ({ row }) => {
        return (
          <Link href={`/lead/${row.lead_id}`}>
            {truncateText(row.lead_name, 15)}
          </Link>
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
            {truncateText(row.customer_name, 15)}
          </Link>
        );
      },
    },
    {
      field: 'invoice_date',
      headerName: 'Date',
      minWidth: 80,
      renderCell: ({ row }) => {
        return <span>{toDDMMYYYY(row.invoice_date)}</span>;
      },
    },
    {
      field: 'customer_mobile',
      headerName: 'Mobile',
      minWidth: 150,
      renderCell: ({ row }) => {
        return <span>{formatMobile(row.customer_mobile)}</span>;
      },
    },
    {
      field: 'total_amount',
      headerName: 'Amount (₹)',
      minWidth: 100,
      renderCell: ({ row }) => {
        return <span>{formatINR(row.total_amount, false)}</span>;
      },
    },
    {
      field: 'paid_amount',
      headerName: 'Paid (₹)',
      minWidth: 100,
      renderCell: ({ row }) => {
        return <span>{formatINR(row.paid_amount, false)}</span>;
      },
    },
    {
      field: 'invoice_status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: ({ row }) => {
        return <span>{chipLable(row.invoice_status)}</span>;
      },
    },
    {
      field: 'payment_status',
      headerName: 'Payment status',
      minWidth: 150,
      renderCell: ({ row }) => {
        return <span>{chipLable(row.payment_status)}</span>;
      },
    },

    {
      field: 'actions',
      minWidth: 130,
      headerName: '',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => {
        return (
          <Stack spacing={2} direction="row">
            <Box display={'flex'}>
              <PermissionGuard permissions={'invoice-management/invoice:write'}>
                <Box>
                  <Link href={`/invoice/${row.id}`} tenantId>
                    <Tooltip title={`View`}>
                      <IconButton
                        size="small"
                        onClick={async () => {
                          await invalidate(['getInvoiceById']);
                        }}
                      >
                        <VisibilityIcon
                          style={{ color: 'neutral.500', opacity: 1 }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </Box>
                {row.lead_status === 'productReturnPending' &&
                  Number(row.has_rent_product) === 1 &&
                  Number(row.is_deposit_counted) === 1 && (
                    <Box>
                      <Tooltip title="Mark rented products returned">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenReturnModal(row)}
                          sx={{ color: 'neutral.500' }}
                        >
                          <AssignmentReturnIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
              </PermissionGuard>
              {row.invoice_status === 'published' &&
                row.due_amount !== '0.00' &&
                row.payment_status != 'carry-forward' && (
                  <PermissionGuard
                    permissions={'invoice-management/invoice:write'}
                  >
                    <Tooltip title="Add Payment Record">
                      <IconButton
                        size="small"
                        onClick={() => handlePaymentClick(row)}
                      >
                        <CurrencyRupeeIcon sx={{ color: 'neutral.500' }} />
                      </IconButton>
                    </Tooltip>
                  </PermissionGuard>
                )}
              {row.payment_status !== 'carry-forward' &&
                Number(row.paymentLength || 0) === 0 && (
                  <PermissionGuard
                    permissions={'invoice-management/invoice:delete'}
                  >
                    <DeleteConfirmationButton
                      message="Invoice"
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
                )}
            </Box>
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      <PagePermissionGuard permissions={'invoice-management/invoice:read'}>
        <ExtraParamsContext.Provider
          value={{
            extraParams,
            setExtraParams,
          }}
        >
          <PaginatedDataGrid
            query={getInvoice}
            queryKey={['getInvoice']}
            columns={columns}
            searchLabel="Search"
            toolbarContainer={HeaderToolbar}
            extraParams={{
              account_id: user?.account_id,
              branch_id: user?.branch_id,
              ...(filters.lead_id !== undefined &&
              filters.lead_id !== '' &&
              typeof filters.lead_id === 'number'
                ? { lead_id: filters.lead_id }
                : {}),
              ...(filters.customer_id !== undefined &&
              filters.customer_id !== '' &&
              typeof filters.customer_id === 'number'
                ? { customer_id: filters.customer_id }
                : {}),
              ...(filters.invoice_status !== undefined &&
              filters.invoice_status !== ''
                ? { invoice_status: filters.invoice_status }
                : {}),
              ...(filters.payment_status !== undefined &&
              filters.payment_status !== ''
                ? { payment_status: filters.payment_status }
                : {}),
              ...(filters.from_date !== undefined && filters.from_date !== ''
                ? { from_date: filters.from_date }
                : {}),
              ...(filters.to_date !== undefined && filters.to_date !== ''
                ? { to_date: filters.to_date }
                : {}),
              ...(filters.is_deposit_counted !== undefined &&
              filters.is_deposit_counted !== ''
                ? { is_deposit_counted: filters.is_deposit_counted }
                : {}),
              ...(filters.has_rent_products !== undefined &&
              filters.has_rent_products !== ''
                ? { has_rent_products: filters.has_rent_products }
                : {}),
            }}
          />
        </ExtraParamsContext.Provider>
      </PagePermissionGuard>

      {selectedInvoice && (
        <PaymentForm
          open={paymentModalOpen}
          onClose={handlePaymentClose}
          invoiceId={selectedInvoice.id}
          invoiceNumber={selectedInvoice.invoice_number}
          dueAmount={selectedInvoice.due_amount}
          setReceiptPayload={setReceiptPayload}
          setShowReceipt={setShowReceipt}
        />
      )}

      <MarkRentedReturnedModal
        open={returnModalOpen}
        onClose={handleReturnModalClose}
        invoiceNumber={selectedInvoiceForReturn?.invoice_number ?? ''}
        onSubmit={handleMarkRentedProductsReturned}
      />
      {showReceipt && receiptPayload && (
        <PaymentReceiptPdf
          openOnMount={showReceipt}
          payload={receiptPayload}
          fileName={`payment-receipt-${receiptPayload.receiptNo}.pdf`}
          onClose={() => {
            router.push('/invoice');
            setShowReceipt(false);
            setReceiptPayload(null);
          }}
        />
      )}
    </>
  );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
  const { user } = useAuth();
  const { filters, setFilters, resetFilters } = useInvoiceFilterContext();
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    setLocalFilters(filters);
    setFromDate(filters.from_date ? dayjs(filters.from_date) : null);
    setToDate(filters.to_date ? dayjs(filters.to_date) : null);
  }, [filters]);

  // Fetch lead list for dropdown - only when customer is selected
  const { data: leadItemsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['getCustomerLeadsForInvoice', localFilters.customer_id],
    queryFn: async () => {
      if (
        !localFilters.customer_id ||
        typeof localFilters.customer_id !== 'number'
      ) {
        return { data: [] };
      }
      const res = await getCustomerLeadList({
        account_id: user?.account_id as number,
        branch_id: user?.branch_id as number,
        customer_id: localFilters.customer_id,
        is_finalished: 1,
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    enabled:
      !!user?.account_id &&
      !!user?.branch_id &&
      !!localFilters.customer_id &&
      typeof localFilters.customer_id === 'number',
  });

  const leadItems = useMemo(() => {
    const list: Lead[] = leadItemsData?.data ?? [];
    return list.map((l: Lead) => ({
      id: Number(l.id || 0),
      name: l.lead_name,
    }));
  }, [leadItemsData]);

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ];

  const paymentStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Partial', value: 'partial' },
    { label: 'Carry Forward', value: 'carry-forward' },
  ];

  const depositCountedOptions = [
    { label: 'All', value: '' as const },
    { label: 'Yes', value: 1 as const },
    { label: 'No', value: 0 as const },
  ];

  const hasRentedProductsOptions = [
    { label: 'All', value: '' as const },
    { label: 'Yes', value: 1 as const },
    { label: 'No', value: 0 as const },
  ];

  const leadOptions = [{ id: '', name: 'All' }, ...(leadItems || [])];

  return (
    <>
      <PageLayoutHeader
        breadcrumbs={[
          {
            href: `/invoice`,
            name: 'Invoices',
          },
        ]}
        title="Invoices"
      >
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
        {children}
        <Link href="/invoice/add">
          <Tooltip title={`Add Invoice`}>
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
                  // Clear lead selection when customer changes
                  setLocalFilters(
                    (p): InvoiceAdvancedFilters => ({
                      ...p,
                      customer_id: newCustomerId,
                      lead_id: '',
                    }),
                  );
                }}
                slotProps={{
                  root: {
                    sx: { minWidth: 180 },
                  },
                }}
              />

              {/* LEAD */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={leadOptions}
                getOptionLabel={(o) => o?.name ?? ''}
                value={
                  leadOptions.find((x) => x.id === localFilters.lead_id) || null
                }
                onChange={(_, v) => {
                  const leadId: number | '' = v?.id
                    ? typeof v.id === 'number'
                      ? v.id
                      : Number(v.id)
                    : '';
                  setLocalFilters(
                    (p): InvoiceAdvancedFilters => ({ ...p, lead_id: leadId }),
                  );
                }}
                disabled={
                  !localFilters.customer_id ||
                  typeof localFilters.customer_id !== 'number'
                }
                loading={leadsLoading}
                renderInput={(params) => <TextField {...params} label="Lead" />}
              />

              {/* STATUS */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={statusOptions}
                value={
                  statusOptions.find(
                    (x) => x.value === localFilters.invoice_status,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    invoice_status: v?.value as
                      | 'draft'
                      | 'published'
                      | 'cancelled'
                      | '',
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
                options={paymentStatusOptions}
                value={
                  paymentStatusOptions.find(
                    (x) => x.value === localFilters.payment_status,
                  ) || null
                }
                onChange={(_, v) => {
                  setLocalFilters((p) => ({
                    ...p,
                    payment_status: v?.value as
                      | 'paid'
                      | 'unpaid'
                      | 'partial'
                      | 'carry-forward'
                      | '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Payment Status" />
                )}
              />

              {/* FROM DATE */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  format="DD/MM/YYYY"
                  value={fromDate}
                  onChange={(newValue) => {
                    setFromDate(newValue);
                    setLocalFilters((p) => ({
                      ...p,
                      from_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                    }));
                  }}
                  maxDate={toDate || dayjs()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 180 },
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
                    setLocalFilters((p) => ({
                      ...p,
                      to_date: newValue ? newValue.format('YYYY-MM-DD') : '',
                    }));
                  }}
                  minDate={fromDate || undefined}
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 180 },
                    },
                  }}
                />
              </LocalizationProvider>

              {/* DEPOSIT COUNTED */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={depositCountedOptions}
                getOptionLabel={(o) => o?.label ?? ''}
                value={
                  depositCountedOptions.find(
                    (x) => x.value === localFilters.is_deposit_counted,
                  ) || depositCountedOptions[0]
                }
                onChange={(_, v) => {
                  setLocalFilters(
                    (p): InvoiceAdvancedFilters => ({
                      ...p,
                      is_deposit_counted: (v?.value ?? '') as 0 | 1 | '',
                    }),
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Deposit counted" />
                )}
              />

              {/* HAS RENTED PRODUCTS */}
              <Autocomplete
                size="small"
                sx={{ minWidth: 180 }}
                options={hasRentedProductsOptions}
                getOptionLabel={(o) => o?.label ?? ''}
                value={
                  hasRentedProductsOptions.find(
                    (x) => x.value === localFilters.has_rent_products,
                  ) || hasRentedProductsOptions[0]
                }
                onChange={(_, v) => {
                  setLocalFilters(
                    (p): InvoiceAdvancedFilters => ({
                      ...p,
                      has_rent_products: (v?.value ?? '') as 0 | 1 | '',
                    }),
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Has rented products" />
                )}
              />
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
    </>
  );
};

const InvoiceListWithProvider = () => (
  <InvoiceFilterProvider>
    <InvoiceList />
  </InvoiceFilterProvider>
);

export default InvoiceListWithProvider;
