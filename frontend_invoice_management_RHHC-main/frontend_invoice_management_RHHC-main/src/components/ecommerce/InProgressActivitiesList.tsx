'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from '@mui/material';
import Link from 'next/link';
import { InProgressStaffActivity } from '@/app/(admin)/api/schema';
import dayjs from 'dayjs';

interface InProgressActivitiesListProps {
    activities: InProgressStaffActivity[];
}

export default function InProgressActivitiesList({ activities }: InProgressActivitiesListProps) {
    return (
        <Box className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <Box className=" text-lg font-semibold text-gray-800 flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                In-Progress Staff Tasks
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none', maxHeight: 300 }} >
                <Table stickyHeader>
                    <TableHead >
                        <TableRow>
                            <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Staff Name
                            </TableCell>
                            <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Customer Name
                            </TableCell>
                            <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Service
                            </TableCell>
                            <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                From Date
                            </TableCell>
                            <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                To Date
                            </TableCell>
                            <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Start Time
                            </TableCell>
                            <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Task details
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activities && activities.length > 0 ? (
                            activities.map((activity) => (
                                <TableRow key={activity.id} hover>
                                    <TableCell className="py-3">
                                        <Link
                                            href={`/staff/${activity.user_id}`}
                                            className="font-medium text-blue-500 text-theme-sm dark:text-white/90 hover:underline"
                                        >
                                            {activity.staff_name || '-'}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <Link
                                            href={`/customer/${activity.customer_id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {activity.customer_name || '-'}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {
                                            activity.service_name ? (
                                                <Link
                                                    href={`/service/${activity.service_id}`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {activity.service_name}
                                                </Link>
                                            ) : '-'
                                        }
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {activity.from_date_time ? dayjs(activity.from_date_time).format('DD-MM-YYYY HH:mm') : '-'}
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {activity.to_date_time ? dayjs(activity.to_date_time).format('DD-MM-YYYY HH:mm') : '-'}
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {activity.start_date_time ? dayjs(activity.start_date_time).format('DD-MM-YYYY HH:mm') : '-'}
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <Link
                                            href={`/staff/task/${activity.id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            View Task
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-3 text-end text-gray-500 text-theme-sm dark:text-gray-400">
                                    No in-progress activities found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

