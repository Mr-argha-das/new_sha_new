'use client';

import React from 'react';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { usePayslip } from '../../context';
import PageLayout from '@/modules/common/components/page-layout';
import { Mode } from '@/modules/common/types/enum';
import { toDDMMYYYY, toDDMMYYYYhhmmss } from '@/modules/common/helpers/dateFormat';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { getFullFileUrl, formatINR } from '@/modules/common/helpers/helper';
import { useAuth } from '@/context/AuthContext';
import { buildPayslipHTML } from '@/lib/buildPayslipHTML';
import toast from 'react-hot-toast';
import { defaultRoles } from '@/modules/common/constant/messages';
import LongTextDisplay from '@/modules/common/components/long-text-display/LongTextDisplay';

interface ViewProps {
    onEdit?: () => void;
}

const ViewGeneralInformation: React.FC<ViewProps> = ({ onEdit }) => {
    const { invoice } = usePayslip();
    const { accountSettings, user } = useAuth();
    const [downloading, setDownloading] = React.useState(false);
    if (!invoice) return null;

    const isAdminLoggedIn = Number(user?.role_id) === defaultRoles.supAdmin_role_id;

    const payslipGrossTotal = Math.round(
      Number(invoice?.invoice?.total_hours || 0) *
        Number(invoice?.invoice?.hour_price || 0),
    );
    const payslipNetTotal = Math.round(Number(invoice?.invoice?.total_price || 0));

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);

            const companyLogoUrl = typeof accountSettings?.logo === 'string' ? getFullFileUrl(accountSettings.logo) : null;
            const company = {
                name: accountSettings?.name || '',
                logoUrl: companyLogoUrl,
                addressLines: accountSettings?.address_lines || '',
                mobile: accountSettings?.mobile,
                email: accountSettings?.email,
                extraIds: accountSettings?.extra_ids
                    ? (accountSettings.extra_ids as Record<string, string | number | undefined>)
                    : null,
                stampUrl: accountSettings?.use_stamp_image === 0 ? `${getFullFileUrl(accountSettings?.stamp as string)}` : `${getFullFileUrl(accountSettings?.stamp_signature as string)}`,
            };

            const payload = {
                company,
                meta: {
                    title: 'STAFF PAYSLIP',
                    staffName: capitalizeFirstLetter(invoice.invoice.staff_name),
                    periodFrom: toDDMMYYYY(invoice.invoice.from_date),
                    periodTo: toDDMMYYYY(invoice.invoice.to_date),
                    payslipNo: invoice.invoice.id,
                },
                summary: {
                    totalHours: Number(invoice?.invoice?.total_hours || 0),
                    hourlyRate: Number(invoice?.invoice?.hour_price || 0),
                    grossTotal: payslipGrossTotal,
                    deduction: Number(invoice?.invoice?.deduct_price || 0),
                    netTotal: payslipNetTotal,
                    currency: '₹',
                },
            };
            // return
            const htmlContent = buildPayslipHTML(payload);

            const res = await fetch('/api/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ htmlContent, fileName: `payslip-${invoice.invoice.id}.pdf` }),
            });

            if (!res.ok) {
                toast.error(`Failed to generate PDF`);
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `payslip-${invoice.invoice.id}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.log(e);
            toast.error('Failed to download PDF');
        } finally {
            setDownloading(false);
        }
    };
    return (
        <PageLayout.FormSection
            mode={Mode.VIEW}
            onEdit={onEdit}
            editable={invoice.invoice.invoice_status === 'draft' && isAdminLoggedIn}
            title={
                <div className="flex items-center justify-between w-full">
                    <span>General Information</span>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleDownloadPdf}
                        disabled={downloading}
                        hidden={invoice.invoice.invoice_status === 'draft'}
                        sx={{ fontSize: '14px', height: '28px' }}
                    >
                        {downloading ? 'Generating PDF...' : 'Download PDF'}
                    </Button>
                </div>
            }
            sx={{ mt: 3 }}
        >
            <Grid container spacing={[2, 2]}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <div className="text-sm text-gray-600">Staff</div>
                    <div className="font-medium">{capitalizeFirstLetter(invoice.invoice.staff_name)}</div>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <div className="text-sm text-gray-600">Period</div>
                    <div className="font-medium">{toDDMMYYYY(invoice.invoice.from_date)} → {toDDMMYYYY(invoice.invoice.to_date)}</div>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-medium">{capitalizeFirstLetter(invoice.invoice.invoice_status)}</div>
                </Grid>
            </Grid>

            <div className="mt-6">
                <h3 className="text-base font-semibold mb-2">Activities</h3>
                <TableContainer sx={{ maxHeight: 300 }}>
                    <Table stickyHeader className="w-full text-sm border">
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell>Customer</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>From Date Time</TableCell>
                                <TableCell>To Date Time</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Status</TableCell>

                                <TableCell align="right">Hours</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(invoice?.activities || []).map((a: { id: number; customer_name: string; service_name?: string; from_date_time: string; to_date_time: string; start_date_time: string; end_date_time: string; status: string; total_hour: number | string; }) => (
                                <TableRow key={a.id} className="border-t">
                                    <TableCell>{capitalizeFirstLetter(a.customer_name)}</TableCell>
                                    <TableCell>{capitalizeFirstLetter(a.service_name ?? '') || '-'}</TableCell>
                                    <TableCell>{toDDMMYYYYhhmmss(a.from_date_time)}</TableCell>
                                    <TableCell>{toDDMMYYYYhhmmss(a.to_date_time)}</TableCell>
                                    <TableCell>{toDDMMYYYYhhmmss(a.start_date_time)}</TableCell>
                                    <TableCell>{toDDMMYYYYhhmmss(a.end_date_time)}</TableCell>
                                    <TableCell >{capitalizeFirstLetter(a.status)}</TableCell>
                                    <TableCell align="right">{Number(a.total_hour || 0).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {invoice?.staffQuickPays && (
                <div className="mt-6">
                    <h3 className="text-base font-semibold mb-2">Quick Pays</h3>
                    <TableContainer sx={{ maxHeight: 300 }}>
                        <Table stickyHeader className="w-full text-sm border">
                            <TableHead className="bg-gray-100">
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(invoice?.staffQuickPays || []).map((q: { id: number; date: string; description?: string; amount: number | string }) => (
                                    <TableRow key={q.id} className="border-t">
                                        <TableCell>{toDDMMYYYY(q.date)}</TableCell>
                                        <TableCell>{<LongTextDisplay title="Description" content={q.description} />}</TableCell>
                                        <TableCell align="right">{formatINR(q.amount, false)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}

            <div className="mt-6 border-t pt-6 bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Summary</h3>

                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Total Hours</span>
                        <span className="font-medium">{Number(invoice?.invoice?.total_hours || 0).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Staff Hourly Rate</span>
                        <span className="font-medium">{Number(invoice?.invoice?.hour_price || 0).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Gross Total</span>
                        <span className="font-semibold underline">
                            {formatINR(payslipGrossTotal, false)}
                        </span>
                    </div>

                    <div className="flex justify-between text-red-600">
                        <span>Quick Pays Deduction</span>
                        <span>{Number(invoice?.invoice?.deduct_price || 0) > 0 ? '-' : ''} {formatINR(Number(invoice?.invoice?.deduct_price || 0), false)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-5 border-t pt-4 text-lg font-bold text-gray-900">
                    <span>Net Total</span>
                    <span>{formatINR(payslipNetTotal, true)}</span>
                </div>
            </div>



        </PageLayout.FormSection>
    );
};

export default ViewGeneralInformation;


