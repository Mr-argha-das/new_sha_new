import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Link from 'next/link'
import { truncateText } from "@/modules/common/helpers/truncateText";
import { BlockedStaff } from "@/app/(admin)/api/schema";
import { toDDMMYYYY } from "@/modules/common/helpers/dateFormat";

interface BlockedStaffListProps {
    staffs: BlockedStaff[];
}

export default function BlockedStaffList({ staffs: tableData }: BlockedStaffListProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Blocked Staffs
                    </h3>
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
                                Staff Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Block Reason
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Blocked On
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {tableData && tableData.length > 0 ? (
                            tableData.map((staff) => (
                                <TableRow key={staff.id} className="">
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-medium text-blue-500 text-theme-sm dark:text-white/90">
                                                    <Link href={`/staff/${staff.id}`}>
                                                        {truncateText(staff.name, 30)}
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {staff.block_reason ? truncateText(staff.block_reason, 50) : '-'}
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {toDDMMYYYY(staff?.updated_at)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="py-3 text-end text-gray-500 text-theme-sm dark:text-gray-400">
                                    No blocked staffs found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

