'use client';

import StatisticsChart from '@/components/ecommerce/StatisticsChart';
import { getStaffDashboardSummary } from '@/app/(admin)/api';
import { useAuth } from '@/context/AuthContext';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { useQuery } from '@tanstack/react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect, useMemo, useState } from 'react';
import { formatINR } from '@/modules/common/helpers/helper';
dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD-MM-YYYY';

type StaffDashboardFilters = {
    account_id?: number;
    branch_id?: number;
    from_date: string | null;
    to_date: string | null;
};

export default function StaffDashboard() {
    const { user } = useAuth();
    const [filters, setFilters] = useState<StaffDashboardFilters>(() => ({
        account_id: user?.account_id,
        branch_id: user?.branch_id,
        from_date: dayjs().subtract(1, 'month').format(DATE_FORMAT),
        to_date: dayjs().format(DATE_FORMAT),
    }));

    useEffect(() => {
        if (user?.account_id && user?.branch_id) {
            setFilters((prev) => {
                const next = {
                    ...prev,
                    account_id: user.account_id,
                    branch_id: user.branch_id,
                };
                return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
            });
        }
    }, [user?.account_id, user?.branch_id]);

    const canFetch =
        Boolean(user?.id) &&
        Boolean(filters.account_id) &&
        Boolean(filters.branch_id);

    const {
        data: dashboardResponse,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['staffDashboardSummary', filters],
        queryFn: () =>
            getStaffDashboardSummary({
                account_id: filters.account_id as number,
                branch_id: filters.branch_id as number,
                from_date: filters.from_date || undefined,
                to_date: filters.to_date || undefined,
            }),
        enabled: canFetch,
    });

    const summaryData = dashboardResponse?.data?.data;

    useEffect(() => {
        const fetchedFrom = summaryData?.filters?.from_date;
        const fetchedTo = summaryData?.filters?.to_date;
        if (fetchedFrom || fetchedTo) {
            setFilters((prev) => {
                const next = {
                    ...prev,
                    from_date: fetchedFrom ?? prev.from_date,
                    to_date: fetchedTo ?? prev.to_date,
                };
                return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
            });
        }
    }, [summaryData?.filters?.from_date, summaryData?.filters?.to_date]);

    const monthlySummary = useMemo(
        () => summaryData?.monthlyCompletedTasks ?? {},
        [summaryData?.monthlyCompletedTasks],
    );

    const fromValue: Dayjs | null = useMemo(() => {
        if (!filters.from_date) {
            return null;
        }
        const parsed = dayjs(filters.from_date, DATE_FORMAT, true);
        return parsed.isValid() ? parsed : null;
    }, [filters.from_date]);

    const toValue: Dayjs | null = useMemo(() => {
        if (!filters.to_date) {
            return null;
        }
        const parsed = dayjs(filters.to_date, DATE_FORMAT, true);
        return parsed.isValid() ? parsed : null;
    }, [filters.to_date]);

    if (isLoading && !summaryData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <PageLoader />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
                {isFetching ? (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Refreshing...
                    </span>
                ) : null}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="From Date"
                        format={DATE_FORMAT}
                        value={fromValue}
                        onChange={(newValue) => {
                            setFilters((prev) => ({
                                ...prev,
                                from_date: newValue ? newValue.format(DATE_FORMAT) : null,
                            }));
                        }}
                        maxDate={
                            filters.to_date
                                ? dayjs(filters.to_date, DATE_FORMAT)
                                : dayjs()
                        }
                        minDate={dayjs().subtract(1, 'year')}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: false,
                            },
                        }}
                    />
                    <DatePicker
                        label="To Date"
                        format={DATE_FORMAT}
                        value={toValue}
                        onChange={(newValue) => {
                            setFilters((prev) => ({
                                ...prev,
                                to_date: newValue ? newValue.format(DATE_FORMAT) : null,
                            }));
                        }}
                        minDate={
                            filters.from_date
                                ? dayjs(filters.from_date, DATE_FORMAT)
                                : dayjs().subtract(6, 'month')
                        }
                        maxDate={dayjs()}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: false,
                            },
                        }}
                    />
                </LocalizationProvider>
            </div>

            <div className="col-span-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Today&apos;s Tasks
                        </span>
                        <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                            {summaryData?.todaysTaskCount ?? 0}
                        </h4>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Tasks assigned for today
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Money Received
                        </span>
                        <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                            {formatINR(summaryData?.paymentSummary?.received, true)}
                        </h4>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Based on Payslip
                        </p>
                    </div>

                    {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Money Remaining
                        </span>
                        <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                            {formatINR(summaryData?.paymentSummary?.remaining, true)}
                        </h4>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Pending payouts for completed tasks
                        </p>
                    </div> */}
                </div>
            </div>

            <div className="col-span-12">
                <StatisticsChart
                    chartData={monthlySummary}
                    title="Monthly Completed Tasks"
                    subtitle=""
                    seriesName="Completed Tasks"
                />
            </div>
        </div>
    );
}

