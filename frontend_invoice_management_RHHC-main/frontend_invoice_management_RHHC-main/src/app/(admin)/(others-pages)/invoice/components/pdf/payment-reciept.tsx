'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Button,
    ButtonProps,
    Box,
    Typography,
    Modal,
} from '@mui/material';
import toast from 'react-hot-toast';
import { buildReceiptHTML, ReceiptPayload } from '@/lib/payment_recipt_html';
import { config } from '@/modules/common/config';
import { useAuth } from '@/context/AuthContext';
import { getFullFileUrl } from '@/modules/common/helpers/helper';

type Props = {
    payload: ReceiptPayload;
    fileName?: string;
    buttonText?: string;
    onError?: (err: Error) => void;
    onClose?: () => void;
    openOnMount?: boolean;
} & Omit<ButtonProps, 'onClick'>;

export default function PaymentReceiptPdf({
    payload,
    fileName = 'payment-receipt.pdf',
    buttonText = 'View Receipt',
    onError,
    openOnMount,
    onClose,
    ...buttonProps
}: Props) {
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [loadingPdfBtn, setLoadingPdfBtn] = useState(false);
    const { accountSettings } = useAuth();

    const handleOpenPreview = useCallback(async () => {
        setLoading(true);
        try {

            const normalized: ReceiptPayload = {
                ...payload,
                company: {
                    name: accountSettings?.name || '',
                    addressLines: accountSettings?.address_lines || '',
                    logoUrl: `${getFullFileUrl(accountSettings?.logo as string)}`,
                    mobile: accountSettings?.mobile,
                    email: accountSettings?.email,
                    extraIds: accountSettings?.extra_ids
                        ? (accountSettings.extra_ids as Record<string, string | number | undefined>)
                        : null,
                    isoCertificateUrl: `${window.location.origin}/images/invoice/ISOCertification.png`,
                },
                stampUrl: accountSettings?.use_stamp_image === 0 ? `${config.api.baseUrl}${accountSettings?.stamp}` : `${config.api.baseUrl}${accountSettings?.stamp_signature}`,
                bankName: accountSettings?.bank_details?.bank_name || '-',
            };

            const html = buildReceiptHTML(normalized);
            setHtmlContent(html);
            setOpen(true);
        } catch (e) {
            toast.error('Failed to generate receipt preview');
            console.log(e);
            if (onError) onError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [payload, accountSettings, onError]);

    useEffect(() => {
        if (openOnMount && payload) {
            handleOpenPreview();
        }
    }, [openOnMount, payload, handleOpenPreview]);


    const handleDownloadPDF = async () => {
        if (!htmlContent) return;
        setLoadingPdfBtn(true);
        try {
            const res = await fetch('/api/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ htmlContent, fileName }),
            });
            if (!res.ok) {
                setLoadingPdfBtn(false);
                toast.error(`Failed to generate PDF}`);
                return;
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setLoadingPdfBtn(false);
            toast.error('Failed to download PDF');
        } finally {
            setLoadingPdfBtn(false);
        }
    };

    const handleClose = () => {
        if (loadingPdfBtn) return;
        setOpen(false);
        onClose?.();
    };

    return (
        <>
            {/* Small Button inside Payment History Table */}
            <Button
                onClick={handleOpenPreview}
                disabled={loading}
                size="small"
                variant="text"
                {...buttonProps}
                sx={{
                    fontSize: "12px"
                }}
            >
                {loading ? 'Loading...' : buttonText}
            </Button>

            {/* Modal that opens with the HTML Preview */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 350, sm: 700 },
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    {htmlContent ? (
                        <Box
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                mb: 3,
                                height: '65vh',
                                overflow: 'hidden',
                            }}
                        >
                            <iframe
                                srcDoc={htmlContent}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                }}
                                title="Receipt Preview"
                            />
                        </Box>
                    ) : (
                        <Typography>Loading preview...</Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false);
                                onClose?.()
                            }}
                            disabled={loadingPdfBtn}
                        >
                            Close
                        </Button>
                        <Button
                            loading={loadingPdfBtn}
                            variant="contained"
                            onClick={handleDownloadPDF}
                        >
                            Download PDF
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
