// import { useAuth } from '@/context/AuthContext';
import { InfoIcon } from '@/icons';
import { AddressInputValues } from '@/modules/common/address-input';
import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import {
  capitalizeFirstLetter,
  capitalizeWords,
} from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import { formatINR } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
// import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import {
  InvoiceItem,
  InvoicePaymentHistory,
} from '@/modules/common/models/invoice';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CustomerInvoicePdfBtn from '../../../components/pdf/customer-invoice-pdf';
import PaymentReceiptPdf from '../../../components/pdf/payment-reciept';
import { useInvoiceEditPageContext } from '../../context';

interface ViewGeneralInformationProps {
  onEdit: () => void;
}

const ViewGeneralInformation = ({ onEdit }: ViewGeneralInformationProps) => {
  const { invoice, activeSection } = useInvoiceEditPageContext();
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InvoiceItem | null>(null);
  const [invoiceNotesOpen, setInvoiceNotesOpen] = useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);

  // const invalidate = useInvalidate();
  // const router = useRouter();
  // const { user } = useAuth();

  const isInvoicePublished = invoice?.invoice_status === 'published';

  const mobileDisplay = formatMobile(invoice?.customer_mobile || '') || '-';
  const items = invoice?.items ?? [];
  const handleNotesClick = (item: InvoiceItem) => {
    setSelectedItem(item);
    setNotesModalOpen(true);
  };

  const hasInvoiceNotes = !!(
    invoice?.notes && String(invoice?.notes).trim() !== ''
  );

  const handleNotesClose = () => {
    setNotesModalOpen(false);
    setSelectedItem(null);
  };

  const addrToString = (addr?: AddressInputValues) => {
    if (!addr)
      return {
        city: '-',
        state: '-',
        address: '-',
      };
    if (typeof addr == 'string') {
      try {
        addr = JSON.parse(addr);
      } catch {
        return {
          city: '-',
          state: '-',
          address: '-',
        };
      }
    }
    const city = addr?.city?.label;
    const state = addr?.state?.label;
    const parts = [addr?.title, addr?.line1, addr?.line2].filter(Boolean);
    return {
      city,
      state,
      address: parts.join(', '),
    };
  };

  const customerAddress = addrToString(invoice?.customer_address);

  return (
    <PageLayout.FormSection
      blur={Boolean(activeSection)}
      onEdit={onEdit}
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h5">General Information</Typography>

          {isInvoicePublished && (
            <Box display="flex" alignItems="center" gap={2}>
              <CustomerInvoicePdfBtn
                payload={{
                  invoice_number: invoice?.invoice_number,
                  invoice_date: invoice?.invoice_date,
                  customer_name: capitalizeFirstLetter(invoice?.customer_name),
                  customer_address: capitalizeFirstLetter(
                    customerAddress?.address,
                  ),
                  customer_city: capitalizeFirstLetter(
                    customerAddress?.city ?? '',
                  ),
                  customer_state: capitalizeFirstLetter(
                    customerAddress?.state ?? '',
                  ),
                  customer_age: invoice?.customer_age,
                  customer_gender: capitalizeFirstLetter(
                    invoice?.customer_gender,
                  ),
                  customer_mobile: invoice?.customer_mobile,
                  customer_email: invoice?.customer_email,
                  transportation: invoice?.transportation_charge ?? 0,
                  otherCharges: invoice?.other_charges ?? 0,
                  items: invoice?.items ?? [],
                  last_invoice_due: invoice.last_invoice_due ?? 0,
                  discount_amount: Number(invoice?.discount_amount ?? 0),
                  security_deposit: Number(invoice?.security_deposit ?? 0),
                  is_deposit_counted: Number(invoice?.is_deposit_counted ?? 0),
                }}
              />
              {Array.isArray(invoice?.payment) &&
                invoice.payment.length > 0 && (
                  <Grid size={{ lg: 4, xs: 12 }}>
                    <Tooltip title="Click to view payment history">
                      <IconButton
                        size="large"
                        onClick={() => setPaymentHistoryOpen(true)}
                        sx={{ color: '#1976d2', display: 'block' }}
                      >
                        <ReceiptLongIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
            </Box>
          )}
        </Box>
      }
      sx={{ mt: 3 }}
      editable={!isInvoicePublished}
    >
      <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Invoice No."
            value={invoice?.invoice_number || '-'}
          />
        </Grid>

        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Customer"
            isLink={`/customer/${invoice?.customer_id}`}
            value={capitalizeWords(invoice?.customer_name || '') || '-'}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Lead Name"
            isLink={`/lead/${invoice?.lead_id}`}
            value={capitalizeFirstLetter(invoice?.lead_name || '') || '-'}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Invoice Date"
            value={toDDMMYYYY(invoice?.invoice_date || '')}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Mobile"
            value={
              <>
                <Typography color="neutral.600" component="p" fontWeight={600}>
                  {mobileDisplay}
                </Typography>
              </>
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Total Quantity"
            value={
              invoice?.items?.reduce(
                (acc: number, itm: InvoiceItem) =>
                  acc + Number(itm?.quantity || 0),
                0,
              ) || '-'
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Paid Amount"
            value={formatINR(invoice?.paid_amount, true)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Due Amount"
            value={formatINR(invoice?.due_amount, true)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Status"
            isComponent={true}
            value={chipLable(invoice?.invoice_status || '')}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Payment Status"
            value={chipLable(invoice?.payment_status || '')}
            isComponent={true}
          />
        </Grid>
        {hasInvoiceNotes && (
          <Grid size={{ lg: 4, xs: 12 }}>
            <ResourceDetail
              label="Notes"
              value={
                <Tooltip title="Click to view invoice notes">
                  <IconButton
                    size="small"
                    onClick={() => setInvoiceNotesOpen(true)}
                    sx={{ color: '#1976d2', display: 'block' }}
                  >
                    <InfoIcon style={{ width: '16px', height: '16px' }} />
                  </IconButton>
                </Tooltip>
              }
            />
          </Grid>
        )}
      </Grid>

      {/* Item secction */}
      <Grid container spacing={[2, 2]} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="invoice items">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="center">Deal Type</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Hour | Sale Price (₹)</TableCell>
                  <TableCell align="right">Hours/Day</TableCell>
                  <TableCell align="right">Days</TableCell>
                  <TableCell align="right">Total (₹)</TableCell>
                  <TableCell align="center">Notes</TableCell>
                  {/* {
                    !isInvoicePublished && <TableCell align="center">Action</TableCell>
                  } */}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length ? (
                  items.map((it: InvoiceItem, idx: number) => {
                    const lineTotal =
                      Number(it?.quantity ?? 0) *
                      Number(it?.unit_price ?? 0) *
                      Number(it?.days ?? 0) *
                      (Number(it?.hours_per_day ?? 1) || 1);
                    const hasNotes = it?.notes && it.notes.trim() !== '';
                    return (
                      <TableRow key={it?.id ?? idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          {capitalizeFirstLetter(it?.item_name) || '-'}
                        </TableCell>
                        <TableCell>
                          {capitalizeFirstLetter(it?.item_type) || '-'}
                        </TableCell>
                        <TableCell align="center">
                          {it.deal_type ? capitalizeWords(it.deal_type) : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {it?.quantity ?? '-'}
                        </TableCell>
                        <TableCell align="right">
                          {formatINR(it?.unit_price, false)}
                        </TableCell>
                        <TableCell align="right">
                          {it?.hours_per_day ?? '-'}
                        </TableCell>
                        <TableCell align="right">{it?.days ?? '-'}</TableCell>
                        <TableCell align="right">
                          {formatINR(lineTotal, false)}
                        </TableCell>
                        <TableCell align="center">
                          {hasNotes ? (
                            <Tooltip title="Click to view notes">
                              <IconButton
                                size="small"
                                onClick={() => handleNotesClick(it)}
                                sx={{ color: '#1976d2' }}
                              >
                                <InfoIcon
                                  style={{ width: '16px', height: '16px' }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      No items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Summary */}
      <Grid container spacing={[2, 2]} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                pt: 2,
              }}
            >
              Summary
            </Typography>

            <Grid container spacing={[1, 1]} alignItems="center">
              {/* Subtotal */}
              <Grid
                size={{ xs: 10 }}
                sx={{ textAlign: 'right', color: 'neutral.600' }}
              >
                Item Subtotal
              </Grid>
              <Grid
                size={{ xs: 2 }}
                sx={{ textAlign: 'center', fontWeight: 600 }}
              >
                {formatINR(
                  invoice?.items?.reduce(
                    (acc, item) =>
                      acc +
                      Number(item.quantity) *
                        Number(item.unit_price) *
                        (Number(item.hours_per_day) || 1) *
                        Number(item.days),
                    0,
                  ) ?? 0,
                  false,
                )}
              </Grid>

              {/* Last Invoice Due */}
              <Grid
                size={{ xs: 10 }}
                sx={{ textAlign: 'right', color: 'neutral.600' }}
              >
                Last Invoice Due
              </Grid>
              <Grid
                size={{ xs: 2 }}
                sx={{ textAlign: 'center', fontWeight: 600 }}
              >
                {formatINR(invoice?.last_invoice_due ?? 0, false)}
              </Grid>

              {/* Transportation Charge */}
              <Grid
                size={{ xs: 10 }}
                sx={{ textAlign: 'right', color: 'neutral.600' }}
              >
                Transportation Charge
              </Grid>
              <Grid
                size={{ xs: 2 }}
                sx={{ textAlign: 'center', fontWeight: 600 }}
              >
                {formatINR(invoice?.transportation_charge ?? 0, false)}
              </Grid>

              {/* Other Charges */}
              <Grid
                size={{ xs: 10 }}
                sx={{ textAlign: 'right', color: 'neutral.600' }}
              >
                Other Charges
              </Grid>
              <Grid
                size={{ xs: 2 }}
                sx={{ textAlign: 'center', fontWeight: 600 }}
              >
                {formatINR(invoice?.other_charges ?? 0, false)}
              </Grid>

              {/* Flat Discount */}
              <Grid
                size={{ xs: 10 }}
                sx={{ textAlign: 'right', color: 'neutral.600' }}
              >
                Flat Discount
              </Grid>
              <Grid
                size={{ xs: 2 }}
                sx={{ textAlign: 'center', fontWeight: 600, color: 'red' }}
              >
                {'- ' + formatINR(invoice?.discount_amount ?? 0, false)}
              </Grid>

              {/* Count Security Deposit (if applicable) */}
              <Grid
                size={{ xs: 10 }}
                sx={{ textAlign: 'right', color: 'neutral.600' }}
              >
                Security Deposit
              </Grid>
              {invoice?.is_deposit_counted === 1 ? (
                <Grid
                  size={{ xs: 2 }}
                  sx={{ textAlign: 'center', fontWeight: 600, color: 'red' }}
                >
                  - {formatINR(invoice?.security_deposit ?? 0, false)}
                </Grid>
              ) : (
                <Grid
                  size={{ xs: 2 }}
                  sx={{ textAlign: 'center', fontWeight: 600 }}
                >
                  -
                </Grid>
              )}

              {/* Grand Total */}
              <Grid
                size={{ xs: 10 }}
                sx={{
                  textAlign: 'right',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Grand Total
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 2 }}
                sx={{
                  textAlign: 'center',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  fontWeight: 700,
                  color:
                    (Number(invoice?.total_amount ?? 0) as number) < 0
                      ? 'error.main'
                      : 'success.main',
                }}
              >
                {formatINR(Math.round(Number(invoice?.total_amount ?? 0)), true)}

                <Typography fontSize={10} fontWeight={300}>
                  {(Number(invoice?.total_amount ?? 0) as number) < 0
                    ? 'Pay to Customer'
                    : 'Take from Customer'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Notes Modal */}
      <Modal open={notesModalOpen} onClose={handleNotesClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Item Notes
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {selectedItem?.notes || 'No notes available'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleNotesClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Invoice Notes Modal */}
      <Modal open={invoiceNotesOpen} onClose={() => setInvoiceNotesOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Invoice Notes
          </Typography>
          <Box
            sx={{
              mb: 3,
              maxHeight: '50vh',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              border: '1px solid #ddd',
              borderRadius: 1,
              p: 1,
            }}
          >
            {invoice?.notes || 'No notes available'}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => setInvoiceNotesOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Payment History Modal */}
      <Modal
        open={paymentHistoryOpen}
        onClose={() => setPaymentHistoryOpen(false)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 350, sm: 600 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payment History
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="payment history">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell align="center">PDF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(invoice?.payment) &&
                invoice.payment.length > 0 ? (
                  invoice.payment.map(
                    (p: InvoicePaymentHistory, idx: number) => (
                      <TableRow key={p.id ?? idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {p?.payment_date ? toDDMMYYYY(p.payment_date) : '-'}
                        </TableCell>
                        <TableCell>{formatINR(p?.amount)}</TableCell>
                        <TableCell>
                          {capitalizeFirstLetter(p?.payment_method) || '-'}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={p?.notes || 'N/A'}
                            placement="left-start"
                            slotProps={{
                              tooltip: {
                                sx: {
                                  fontSize: '14px',
                                  bgcolor: '#000',
                                  color: '#fff',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                },
                              },
                            }}
                          >
                            <IconButton size="small" sx={{ color: '#1976d2' }}>
                              <InfoIcon
                                style={{ width: '16px', height: '16px' }}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <PaymentReceiptPdf
                            payload={{
                              receiptNo: String(p.id),
                              date: toDDMMYYYY(p.payment_date),
                              from: invoice.customer_name,
                              rupees: formatINR(p.amount),
                              againstBillNo: invoice.invoice_number,
                              onAccountOf: 'RHHC',
                              otherDetails: p.other_details,
                              paymentMethod: p.payment_method,
                            }}
                            fileName="payment-reciept.pdf"
                          />
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      No payments
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setPaymentHistoryOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </PageLayout.FormSection>
  );
};

export default ViewGeneralInformation;
