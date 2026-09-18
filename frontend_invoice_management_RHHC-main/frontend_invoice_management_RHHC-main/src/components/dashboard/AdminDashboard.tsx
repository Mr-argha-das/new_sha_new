'use client'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics';
import RecentOrders from '@/components/ecommerce/RecentOrders';
import BlockedStaffList from '@/components/ecommerce/BlockedStaffList';
import InProgressActivitiesList from '@/components/ecommerce/InProgressActivitiesList';
import StatisticsChart from '@/components/ecommerce/StatisticsChart';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData, getBlockedStaffListByAccountBranch, getAllInProgressStaffActivities } from '@/app/(admin)/api';
import { BlockedStaff, InProgressStaffActivity } from '@/app/(admin)/api/schema';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [apiPayload, setApiPayload] = useState({
    account_id: user?.account_id as number,
    branch_id: user?.branch_id as number,
    from_date: dayjs().subtract(5, 'months').format("DD-MM-YYYY"),
    to_date: '',
    excluded_id: user?.id
  })

  const { data: DashboardFetchedData } = useQuery({
    queryKey: ['dashboardData', apiPayload],
    queryFn: () => getDashboardData(apiPayload)
  });
  const dashboardData = DashboardFetchedData?.data?.data

  const { data: BlockedStaffFetchedData } = useQuery({
    queryKey: ['blockedStaffList', user?.account_id, user?.branch_id],
    queryFn: () => getBlockedStaffListByAccountBranch({
      account_id: user?.account_id as number,
      branch_id: user?.branch_id as number,
    }),
    enabled: !!user?.account_id && !!user?.branch_id,
  });
  const blockedStaffList = BlockedStaffFetchedData?.data?.data || []

  const { data: InProgressActivitiesFetchedData } = useQuery({
    queryKey: ['inProgressActivities', user?.account_id, user?.branch_id],
    queryFn: () => getAllInProgressStaffActivities({
      account_id: user?.account_id as number,
      branch_id: user?.branch_id as number,
      fetchAll: 1,
    }),
    enabled: !!user?.account_id && !!user?.branch_id,
  });
  const inProgressActivities = (InProgressActivitiesFetchedData?.data?.data as unknown as InProgressStaffActivity[]) || []

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className='col-span-12 flex justify-end gap-2'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>

          <DatePicker

            label="From Date"
            format="DD-MM-YYYY"
            value={apiPayload.from_date ? dayjs(apiPayload.from_date, "DD-MM-YYYY") : null}
            onChange={(newValue) => {
              setApiPayload((prev) => ({
                ...prev,
                from_date: newValue ? newValue.format("DD-MM-YYYY") : "",
              }));
            }}
            maxDate={apiPayload?.to_date ? dayjs(apiPayload.to_date, "DD-MM-YYYY") : dayjs()}
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
            format="DD-MM-YYYY"
            value={apiPayload.to_date ? dayjs(apiPayload.to_date, "DD-MM-YYYY") : null}
            onChange={(newValue) => {
              setApiPayload((prev) => ({
                ...prev,
                to_date: newValue ? newValue.format("DD-MM-YYYY") : "",
              }));
            }}
            minDate={apiPayload?.from_date ? dayjs(apiPayload.from_date, "DD-MM-YYYY") : dayjs().subtract(6, 'months')}
            maxDate={dayjs()}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: false
              }
            }}
          />
        </LocalizationProvider>
      </div>
      <div className="col-span-12 space-y-6 ">
        <EcommerceMetrics totalAmount={dashboardData?.invoiceData?.totalAmount as unknown as string} totalUserCount={dashboardData?.totalUserCount as unknown as number} />

      </div>

      <div className="col-span-12">
        <StatisticsChart chartData={dashboardData?.invoiceData.monthlySummary as unknown as Record<string, number>} />
      </div>

      <div className="col-span-12 ">
        <InProgressActivitiesList activities={inProgressActivities} />
      </div>

      <div className="col-span-12 ">
        <RecentOrders invoices={dashboardData?.invoiceData.latestInvoices as unknown as any[]} />
      </div>

      <div className="col-span-12 ">
        <BlockedStaffList staffs={blockedStaffList as unknown as BlockedStaff[]} />
      </div>
    </div>
  );
}
