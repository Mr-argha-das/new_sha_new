'use client';
import { GroupIcon } from '@/icons';
import { CurrencyRupeeIcon } from '../../../packages/ui/icons';

interface props {
  totalUserCount: number;
  totalAmount: string;
}
export const EcommerceMetrics = ({ totalUserCount, totalAmount }: props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon sx={{ color: '#1d2939', fontSize: '24px' }} />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Customers
            </span>
            <h4
              className="mt-2 
              font-bold 
              text-gray-800 
              dark:text-white/90 
              text-base 
              sm:text-lg 
              md:text-xl 
              lg:text-2xl 
              xl:text-3xl
              "
            >
              {totalUserCount}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <CurrencyRupeeIcon sx={{ color: '#1d2939' }} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Amount
            </span>
            <h4
              className="
             mt-2 
            font-bold 
            text-gray-800 
            dark:text-white/90 
            text-base 
            sm:text-lg 
            md:text-xl 
            lg:text-2xl 
            xl:text-3xl
          "
            >
              {totalAmount}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
