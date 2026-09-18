'use client';

import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { getStaffQuickPays, updateStaffQuickPayStatus, deleteStaffQuickPay } from '../api';
import { StaffQuickPay } from '../api/schema';
import LongTextDisplay from '@/modules/common/components/long-text-display/LongTextDisplay';
import { formatINR } from '@/modules/common/helpers/helper';
import DeleteConfirmationButton from '../../../../../../packages/ui/components/delete-confirmation/button';
import toast from 'react-hot-toast';

type Props = { userId: ID };

export default function Quickpay({ userId }: Props) {
    const { user } = useAuth();
    const qc = useQueryClient();

    const { data, isLoading } = useQuery<StaffQuickPay[]>({
        queryKey: ['getStaffQuickPays', userId],
        queryFn: () => getStaffQuickPays(userId, {
            account_id: user?.account_id,
            branch_id: user?.branch_id,
        }).then(res => res.data?.data || []),
        enabled: !!userId && !!user,
    });

    const toggleStatus = async (row: StaffQuickPay) => {
        try {
            const next = row.status === 1 ? 0 : 1;
            const res = await updateStaffQuickPayStatus(String(row.id), { status: next });
            if (res.status) {
                toast.success('Quick Pay status updated');
                await qc.invalidateQueries({ queryKey: ['getStaffQuickPays', userId] });
            }
        } catch (error) {
        }
    };

    const handleDelete = async (id: ID) => {
        try {
            const res = await deleteStaffQuickPay(String(id));
            if (res.status) {
                await qc.invalidateQueries({ queryKey: ['getStaffQuickPays', userId] });
            }
        } catch (error) {
        }
    };

    if (isLoading) return null;

    return (
        <Box mt={4}>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                <Box sx={{
                    p: 1.5,
                    borderBottom: '1px solid #ddd',
                    backgroundColor: '#f9f9f9',
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Quick Pays</Typography>

                </Box>
                {data && data.length > 0 ? (
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell >Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell >Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(data).map((row: StaffQuickPay) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.date ? dayjs(row.date).format('YYYY-MM-DD') : ''}</TableCell>
                                    <TableCell>{row.description ? <LongTextDisplay title="Description" content={row.description} /> : '-'}</TableCell>
                                    <TableCell >{formatINR(row.amount, true)}</TableCell>
                                    <TableCell>
                                        <Chip label={row.status === 1 ? 'Paid' : 'Unpaid'} color={row.status === 1 ? 'success' : 'warning'} size="small" />
                                    </TableCell>
                                    <TableCell >
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                disabled={row.status === 1}
                                                onClick={() => toggleStatus(row)}>
                                                {row.status === 1 ? 'Paid' : 'Mark Paid'}
                                            </Button>
                                            <DeleteConfirmationButton
                                                message="Quick Pay"
                                                iconColor="neutral.500"
                                                opacity="1"
                                                resourceId={String(row.id)}
                                                onDelete={() => handleDelete(String(row.id))}
                                            />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', mt: 2, color: 'gray' }}>
                        No quick pays found
                    </Typography>
                )}
            </TableContainer>
        </Box>
    );
}