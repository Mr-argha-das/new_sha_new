import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from 'next/link'
import dayjs from "dayjs";
import { chipLable } from "@/modules/common/helpers/helpers";
import { formatINR } from "@/modules/common/helpers/helper";
import { truncateText } from "@/modules/common/helpers/truncateText";


interface Invoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  total_amount: string;
  invoice_status: "published" | "draft";
}
interface RecentInvoiceProps {
  invoices: Invoice[];
}

export default function RecentOrders({ invoices: tableData }: RecentInvoiceProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Invoices
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href={"/invoice"}>
            See all
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Invoice Number
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData?.map((invoice) => (
              <TableRow key={invoice.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">

                    <div>
                      <p className="font-medium text-blue-500 text-theme-sm dark:text-white/90">
                        <Link href={`/invoice/${invoice.id}`}>
                          {truncateText(invoice.invoice_number, 10)}
                        </Link>
                      </p>

                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {dayjs(invoice.invoice_date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatINR(invoice.total_amount)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {chipLable(invoice.invoice_status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
