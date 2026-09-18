import { useAuth } from '@/context/AuthContext';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { chipLable } from '@/modules/common/helpers/helpers';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { ProductTrackingHistory } from '@/modules/common/models/product';
import Link from '@/modules/common/elements/link';
import LongTextDisplay from '@/modules/common/components/long-text-display/LongTextDisplay';
import { Box, Typography, Button, Paper, Collapse, Stack, Autocomplete, TextField, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useProductEditPageContext } from '../../context';
import { getProductTrackingHistory } from '../../../api';
import PaginatedDataGrid from '../../../../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../../../../packages/ui/components/data-grid/paginated/toolbar';
import { useTrackingHistoryFilterContext, TrackingHistoryAdvancedFilters } from './filter-context';

const productTrackingStatus: Record<number, string> = {
    0: 'On Rent',
    1: 'Returned',
    3: 'Sold',
};

const dealTypeOptions = [
    { value: '', label: 'All' },
    { value: 'rent', label: 'Rent' },
    { value: 'sell', label: 'Sell' },
];

const TrackingHistory = () => {
    const { product } = useProductEditPageContext();
    const { user } = useAuth();
    const { filters, setFilters, resetFilters } = useTrackingHistoryFilterContext();
    const [openAdvanced, setOpenAdvanced] = useState(false);
    const [localFilters, setLocalFilters] = useState<TrackingHistoryAdvancedFilters>(filters);
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        setLocalFilters(filters);
        setFromDate(filters.from_date ? dayjs(filters.from_date) : null);
        setToDate(filters.to_date ? dayjs(filters.to_date) : null);
    }, [filters]);

    const columns: GridColDef<ProductTrackingHistory>[] = [
        {
            field: 'customer_name',
            headerName: 'Customer',
            minWidth: 150,
            renderCell: ({ row }) => {
                return (
                    <Link href={`/customer/${row.customer_id}`} className="text-blue-600">
                        {capitalizeFirstLetter(row.customer_name)}
                    </Link>
                );
            },
        },
        {
            field: 'lead_name',
            headerName: 'Lead',
            minWidth: 150,
            renderCell: ({ row }) => {
                return (
                    <Link href={`/lead/${row.lead_id}`} className="text-blue-600">
                        {capitalizeFirstLetter(row.lead_name)}
                    </Link>
                );
            },
        },
        {
            field: 'deal_type',
            headerName: 'Deal Type',
            minWidth: 120,
            renderCell: ({ row }) => {
                return <span>{capitalizeFirstLetter(row.deal_type)}</span>;
            },
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            minWidth: 120,
            renderCell: ({ row }) => {
                return <span>{row.quantity}</span>;
            },
        },
        {
            field: 'rent_start_date',
            headerName: 'Start Date',
            minWidth: 120,
            renderCell: ({ row }) => {
                return <span>{toDDMMYYYY(row.rent_start_date as string)}</span>;
            },
        },
        {
            field: 'rent_end_date',
            headerName: 'End Date',
            minWidth: 120,
            renderCell: ({ row }) => {
                return <span>{toDDMMYYYY(row.rent_end_date as string)}</span>;
            },
        },
        {
            field: 'return_date',
            headerName: 'Return Date',
            minWidth: 120,
            renderCell: ({ row }) => {
                const returnDate = row.return_date ? toDDMMYYYY(row.return_date as string) : 'N/A';
                return <span>{returnDate}</span>;
            },
        },
        {
            field: 'sold_date',
            headerName: 'Sold Date',
            minWidth: 120,
            renderCell: ({ row }) => {
                const soldDate = row.sold_date ? toDDMMYYYY(row.sold_date as string) : 'N/A';
                return <span>{soldDate}</span>;
            },
        },

        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            renderCell: ({ row }) => {
                return <span>{chipLable(productTrackingStatus[row.status] || 'Unknown')}</span>;
            },
        },
        {
            field: 'notes',
            headerName: 'Notes',
            minWidth: 80,
            flex: 0.5,
            sortable: false,
            renderCell: ({ row }) => (
                <LongTextDisplay
                    title="Notes"
                    content={row.notes ?? undefined}
                    tooltip="View notes"
                />
            ),
        },
    ];


    return (
        <Box sx={{ mt: 3 }}>


            <Collapse in={openAdvanced}>
                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Stack spacing={2}>
                        <Box sx={{ typography: 'body2', fontWeight: 600 }}>Filter Options</Box>

                        {/* FILTERS */}
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                            {/* DEAL TYPE */}
                            <Autocomplete
                                size="small"
                                sx={{ minWidth: 180 }}
                                options={dealTypeOptions}
                                value={dealTypeOptions.find((x) => x.value === localFilters.deal_type) || dealTypeOptions[0]}
                                onChange={(_, v) => {
                                    setLocalFilters((p): TrackingHistoryAdvancedFilters => ({
                                        ...p,
                                        deal_type: (v?.value ?? '') as 'rent' | 'sell' | '',
                                    }));
                                }}
                                renderInput={(params) => <TextField {...params} label="Deal Type" />}
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
                                        setLocalFilters((p) => ({ ...p, to_date: newValue ? newValue.format('YYYY-MM-DD') : '' }));
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

            <PaginatedDataGrid
                query={getProductTrackingHistory}
                queryKey={['getProductTrackingHistory', product?.id]}
                columns={columns}
                searchLabel="Search..."
                toolbarContainer={HeaderToolbar}
                extraParams={{
                    id: product?.id,
                    account_id: user?.account_id,
                    branch_id: user?.branch_id,
                    ...(filters.deal_type !== undefined && filters.deal_type !== '' ? { deal_type: filters.deal_type } : {}),
                    ...(filters.from_date !== undefined && filters.from_date !== '' ? { from_date: filters.from_date } : {}),
                    ...(filters.to_date !== undefined && filters.to_date !== '' ? { to_date: filters.to_date } : {}),
                }}
            />
        </Box>
    );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
    const { filters, setFilters, resetFilters } = useTrackingHistoryFilterContext();
    const [openAdvanced, setOpenAdvanced] = useState(false);
    const [localFilters, setLocalFilters] = useState<TrackingHistoryAdvancedFilters>(filters);
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        setLocalFilters(filters);
        setFromDate(filters.from_date ? dayjs(filters.from_date) : null);
        setToDate(filters.to_date ? dayjs(filters.to_date) : null);
    }, [filters]);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>

                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Product Tracking History
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        sx={{ mr: 2 }}
                        onClick={() => {
                            if (!openAdvanced) {
                                setLocalFilters(filters);
                                setFromDate(filters.from_date ? dayjs(filters.from_date) : null);
                                setToDate(filters.to_date ? dayjs(filters.to_date) : null);
                            }
                            setOpenAdvanced(!openAdvanced);
                        }}
                        size="medium"
                    >
                        {openAdvanced ? 'Hide' : 'Filters'}
                    </Button>
                    {children}
                </Box>
            </Box>

            <Collapse in={openAdvanced}>
                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Stack spacing={2}>
                        <Box sx={{ typography: 'body2', fontWeight: 600 }}>Filter Options</Box>

                        {/* FILTERS */}
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                            {/* DEAL TYPE */}
                            <Autocomplete
                                size="small"
                                sx={{ minWidth: 180 }}
                                options={dealTypeOptions}
                                value={dealTypeOptions.find((x) => x.value === localFilters.deal_type) || dealTypeOptions[0]}
                                onChange={(_, v) => {
                                    setLocalFilters((p): TrackingHistoryAdvancedFilters => ({
                                        ...p,
                                        deal_type: (v?.value ?? '') as 'rent' | 'sell' | '',
                                    }));
                                }}
                                renderInput={(params) => <TextField {...params} label="Deal Type" />}
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
                                        setLocalFilters((p) => ({ ...p, to_date: newValue ? newValue.format('YYYY-MM-DD') : '' }));
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

export default TrackingHistory;



