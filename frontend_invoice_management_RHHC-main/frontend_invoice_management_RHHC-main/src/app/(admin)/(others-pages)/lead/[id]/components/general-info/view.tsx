import { InfoIcon } from '@/icons';
import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { formatINR } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import { Invoice } from '@/modules/common/models/invoice';
import { LeadItem, LeadStatus } from '@/modules/common/models/lead';
import { Product } from '@/modules/common/models/product';
import { Service } from '@/modules/common/models/service';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
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
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useLeadEditPageContext } from '../../context';
import { addLeadItem, endLeadItem, updateLeadDeposit } from '../../../api';
import NumberFieldWithoutFormik from '@/modules/common/NumberFieldWithoutFormik';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { TextField as MuiTextField } from '@mui/material';
import { getAvailableProducts } from '../../../../product/api';
import { getService } from '@/app/(admin)/(others-pages)/service/api';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import customParseFormat from 'dayjs/plugin/customParseFormat';
interface ViewGeneralInformationProps {
  onEdit: () => void;
}

dayjs.extend(customParseFormat);

// TS in this repo resolves `DatePickerProps` without `value` in some setups.
// We only use this picker in a non-Formik modal, so a local cast keeps things stable.
type NonFormikDatePickerProps = {
  label: string;
  value: Dayjs | null;
  minDate?: Dayjs;
  format?: string;
  onChange: (value: Dayjs | null) => void;
  slotProps?: Record<string, unknown>;
};
const NonFormikDatePicker =
  MuiDatePicker as unknown as React.ComponentType<NonFormikDatePickerProps>;

const toDay = (value: unknown): Dayjs | null => {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const candidates = [
    dayjs(raw), // try native parsing first (handles ISO)
    dayjs(raw, 'YYYY-MM-DD', true),
    dayjs(raw, 'DD-MM-YYYY', true),
    dayjs(raw, 'DD/MM/YYYY', true),
    dayjs(raw, 'YYYY/MM/DD', true),
  ];
  const d = candidates.find((x) => x.isValid()) ?? null;
  return d ? d.startOf('day') : null;
};

const toISO = (value: unknown): string => {
  const d = toDay(value);
  return d ? d.format('YYYY-MM-DD') : '';
};

const ViewGeneralInformation = ({ onEdit }: ViewGeneralInformationProps) => {
  const { lead, activeSection } = useLeadEditPageContext();
  const { user } = useAuth();
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LeadItem | null>(null);
  const [leadNotesOpen, setLeadNotesOpen] = useState(false);
  const [updateDepositOpen, setUpdateDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(lead?.security_deposit || 0);
  const [loading, setLoading] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [endItemOpen, setEndItemOpen] = useState(false);
  const [endItemTarget, setEndItemTarget] = useState<LeadItem | null>(null);
  const [endItemDate, setEndItemDate] = useState<string>(todayISO());
  const [newItem, setNewItem] = useState({
    item_type: 'service' as 'service' | 'product',
    deal_type: 'rent' as 'rent' | 'sell',
    item_id: '',
    item_name: '',
    start_date: lead?.start_date ? toISO(lead.start_date) : todayISO(),
    quantity: '1',
    unit_price: '',
    hours_per_day: '1',
    notes: '',
  });
  const invalidate = useInvalidate();

  const { data: productsRes } = useQuery({
    queryKey: ['leadAddItemProducts', user?.account_id, user?.branch_id],
    queryFn: async () => {
      const res = await getAvailableProducts({
        account_id: user?.account_id,
        branch_id: user?.branch_id,
        page: 1,
        limit: 200,
      } as Record<string, unknown>);
      return res.data;
    },
    enabled:
      !!lead &&
      !!user?.account_id &&
      !!user?.branch_id &&
      addItemOpen &&
      newItem.item_type === 'product',
    staleTime: 1000 * 60 * 5,
  });

  const { data: servicesRes } = useQuery({
    queryKey: ['leadAddItemServices', user?.account_id, user?.branch_id],
    queryFn: async () => {
      const res = await getService({
        account_id: user?.account_id,
        branch_id: user?.branch_id,
        page: 1,
        limit: 200,
      } as Record<string, unknown>);
      return res.data;
    },
    enabled:
      !!lead &&
      !!user?.account_id &&
      !!user?.branch_id &&
      addItemOpen &&
      newItem.item_type === 'service',
    staleTime: 1000 * 60 * 5,
  });

  const products: Product[] =
    (productsRes as { data?: Product[] } | undefined)?.data ?? [];
  const services: Service[] =
    (servicesRes as { data?: Service[] } | undefined)?.data ?? [];

  if (!lead) return null;

  const newItemComputedTotal = (() => {
    const qty = Number(newItem.quantity) || 1;
    const unit = Number(newItem.unit_price) || 0;
    const hours = Number(newItem.hours_per_day) || 1;
    return Math.round(qty * unit * hours);
  })();

  const isLeadFinalised = lead.status === 'finalised';
  const isLeadCompleted = lead.lead_status === LeadStatus.COMPLETED;

  const items: LeadItem[] = (lead?.items ?? []) as LeadItem[];
  const invoices: Invoice[] = (lead?.invoices ?? []) as Invoice[];

  const lastInvoiceDate = (() => {
    let max: Dayjs | null = null;
    for (const inv of invoices) {
      const d = toDay(inv?.invoice_date);
      if (!d) continue;
      if (!max || d.isAfter(max)) max = d;
    }
    return max ? max.format('YYYY-MM-DD') : null;
  })();

  const invoicesTotalAmount = invoices.reduce(
    (acc: number, inv: Invoice) => acc + Number(inv?.total_amount ?? 0),
    0,
  );
  const invoicesTotalDue = invoices.reduce(
    (acc: number, inv: Invoice) => acc + Number(inv?.due_amount ?? 0),
    0,
  );
  const invoicesTotalPaid = invoicesTotalAmount - invoicesTotalDue;
  const handleNotesClick = (item: LeadItem) => {
    setSelectedItem(item);
    setNotesModalOpen(true);
  };

  const hasLeadNotes = !!(lead?.notes && String(lead.notes).trim() !== '');

  const handleNotesClose = () => {
    setNotesModalOpen(false);
    setSelectedItem(null);
  };
  const handleUpdateDeposit = async () => {
    try {
      setLoading(true);

      const res = await updateLeadDeposit(
        String(lead.id),
        depositAmount
      );

      if (res.status) {
        await invalidate(['getLeadById']);
        await invalidate(['getLead']);
      }

      setUpdateDepositOpen(false);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleEndItem = async (item: LeadItem) => {
    // Open modal to choose end date (min = item.start_date)
    if (!item?.id) return;
    setEndItemTarget(item);
    const startMin = item.start_date ? toISO(item.start_date) : todayISO();
    const invMin = lastInvoiceDate ?? '';
    const min = invMin && invMin > startMin ? invMin : startMin;
    setEndItemDate(min);
    setEndItemOpen(true);
  };

  const handleConfirmEndItem = async () => {
    try {
      if (!endItemTarget?.id) return;
      const start = endItemTarget.start_date
        ? toISO(endItemTarget.start_date)
        : '';
      const end = String(endItemDate || '').slice(0, 10);
      const invMin = lastInvoiceDate ?? '';
      if (start && end && end < start) {
        toast.error('End date cannot be before item start date');
        return;
      }
      if (invMin && end && end < invMin) {
        toast.error('End date cannot be before the last invoice date');
        return;
      }
      setLoading(true);
      await endLeadItem(String(lead.id), String(endItemTarget.id), {
        end_date: end || null,
      });
      await invalidate(['getLeadById']);
      await invalidate(['getLead']);
      await invalidate(['getFinalisedCustomerLead']);
      setEndItemOpen(false);
      setEndItemTarget(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewItem = async () => {
    try {
      setLoading(true);
      const leadStart = lead?.start_date ? toDay(lead.start_date) : null;
      const itemStart = toDay(newItem.start_date);

      if (!itemStart) {
        toast.error('Start date is required');
        return;
      }
      if (leadStart && itemStart.isBefore(leadStart)) {
        toast.error('Item start date cannot be before lead start date');
        return;
      }

      const qty = Number(newItem.quantity) || 1;
      const unit = Number(newItem.unit_price) || 0;
      const hours = Number(newItem.hours_per_day) || 1;
      const total_price = Math.round(qty * unit * hours);
      const payload = [
        {
          account_id: Number(user?.account_id),
          branch_id: Number(user?.branch_id),
          item_type: newItem.item_type,
          deal_type: newItem.item_type === 'product' ? newItem.deal_type : null,
          item_id: Number(newItem.item_id),
          item_name: newItem.item_name,
          start_date: itemStart.format('YYYY-MM-DD'),
          end_date: null,
          quantity: qty,
          unit_price: unit,
          hours_per_day: hours,
          total_price,
          notes: newItem.notes || null,
        },
      ];
      await addLeadItem(String(lead.id), payload);
      await invalidate(['getLeadById']);
      await invalidate(['getLead']);
      // Invoice create page caches lead items under this key; invalidate so newly added items appear
      await invalidate(['getFinalisedCustomerLead']);
      setAddItemOpen(false);
      setNewItem({
        item_type: 'service',
        deal_type: 'rent',
        item_id: '',
        item_name: '',
        start_date: lead?.start_date ? toISO(lead.start_date) : todayISO(),
        quantity: '1',
        unit_price: '',
        hours_per_day: '1',
        notes: '',
      });
    } catch (err) {
      const e = err as { response?: { data?: { message?: unknown } } };
      const msg = e?.response?.data?.message ?? 'Failed to add item';
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };
  const dbDepositValue = String(lead?.security_deposit ?? "");

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

          {isLeadFinalised && !isLeadCompleted && (
            <Box display="flex" gap={2}>
              <Button
                component={Link}
                href={`/invoice/add?customer_id=${lead?.customer_id}&lead_id=${lead?.id}`}
                variant="contained"
                color="primary"
              >
                Create Invoice
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => setUpdateDepositOpen(true)} // or your handler
              >
                Update Deposit
              </Button>
            </Box>
          )}
        </Box>
      }
      sx={{ mt: 3 }}
      editable={!isLeadCompleted && !isLeadFinalised}
    >
      <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Customer"
            value={lead?.customer_name}
            isLink={`/customer/${lead.customer_id}`}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Lead Name"
            value={capitalizeFirstLetter(lead.lead_name)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Start Date"
            value={toDDMMYYYY(lead.start_date)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="End Date"
            value={lead.end_date ? toDDMMYYYY(lead.end_date) : null}
          />
        </Grid>

        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Total Quantity"
            value={
              (items.reduce(
                (acc: number, itm: LeadItem) =>
                  acc + Number(itm?.quantity || 0),
                0,
              ) as number) || '-'
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Security Deposit"
            value={`${formatINR(lead?.security_deposit, true)}`}
          />
        </Grid>

        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Total Amount (All Invoices)"
            value={
              invoices.length ? `${formatINR(invoicesTotalAmount, true)}` : '-'
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Total Paid (All Invoices)"
            value={invoices.length ? `${formatINR(invoicesTotalPaid, true)}` : '-'}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Total Due (All Invoices)"
            value={invoices.length ? `${formatINR(invoicesTotalDue, true)}` : '-'}
          />
        </Grid>

        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Status"
            isComponent={true}
            value={chipLable(lead.status)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Lead Progress"
            isComponent={true}
            value={
              lead.lead_status == LeadStatus.CREATED
                ? '-'
                : chipLable(lead.lead_status ?? '')
            }
          />
        </Grid>
        {hasLeadNotes && (
          <Grid size={{ lg: 4, xs: 12 }}>
            <ResourceDetail
              label="Notes"
              value={
                <Tooltip title="Click to view lead notes">
                  <IconButton
                    size="small"
                    onClick={() => setLeadNotesOpen(true)}
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

      {/* Item and Invoice section  */}
      <Grid container spacing={[2, 2]} sx={{ mb: 6 }}>
        {/* Lead Items */}
        <Grid size={{ xs: 12 }}>
          <TableContainer component={Paper} variant="outlined">
            <Box
              sx={{
                p: 1.5,
                borderBottom: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Lead Items
              </Typography>

              {!isLeadCompleted && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setAddItemOpen(true)}
                  disabled={loading}
                >
                  Add Item
                </Button>
              )}
            </Box>
            <Table size="small" aria-label="lead items">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="center">Deal Type</TableCell>
                  <TableCell align="center">Start Date</TableCell>
                  <TableCell align="center">End Date</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="center">Hour | Sale Price (₹)</TableCell>
                  <TableCell align="center">Hours/Day</TableCell>
                  <TableCell align="center">Total (₹)</TableCell>
                  <TableCell align="center">Notes</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length ? (
                  items.map((it: LeadItem, idx: number) => {
                    const lineTotal = Math.round(
                      Number(it?.quantity ?? 0) *
                      Number(it?.unit_price ?? 0) *
                      (Number(it?.hours_per_day ?? 1) || 1),
                    );
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
                          {it.deal_type
                            ? capitalizeFirstLetter(it.deal_type)
                            : '-'}
                        </TableCell>
                        <TableCell align="center">
                          {it.start_date ? toDDMMYYYY(it.start_date) : '-'}
                        </TableCell>
                        <TableCell align="center">
                          {it.end_date ? toDDMMYYYY(it.end_date) : '-'}
                        </TableCell>
                        <TableCell align="center">
                          {it?.quantity ?? '-'}
                        </TableCell>
                        <TableCell align="center">
                          {formatINR(it?.unit_price, false)}
                        </TableCell>
                        <TableCell align="center">
                          {it?.hours_per_day ?? '-'}
                        </TableCell>
                        <TableCell align="center">
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
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap={1}>
                            {!isLeadCompleted && Number(it.status ?? 0) === 0 && (
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={loading}
                                onClick={() => handleEndItem(it)}
                              >
                                End Item
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={13}>
                      No items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Lead Invoices */}
        <Grid size={{ xs: 12 }}>
          <TableContainer component={Paper} variant="outlined">
            <Box
              sx={{
                p: 1.5,
                borderBottom: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Lead Invoices
              </Typography>
            </Box>
            <Table size="small" aria-label="lead invoices">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Invoice Date</TableCell>
                  <TableCell align="center">Total (₹)</TableCell>
                  <TableCell align="right">Due (₹)</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.length ? (
                  invoices.map((it: Invoice, idx: number) => {
                    return (
                      <TableRow key={it?.id ?? idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          <Link
                            href={`/invoice/${it.id}`}
                            className="text-blue-600"
                          >
                            {it.invoice_number}{' '}
                          </Link>
                        </TableCell>
                        <TableCell>{toDDMMYYYY(it.invoice_date)}</TableCell>
                        <TableCell align="center">
                          {formatINR(it.total_amount, false)}
                        </TableCell>
                        <TableCell align="right">
                          {formatINR(it.due_amount, false)}
                        </TableCell>
                        <TableCell align="center">
                          {chipLable(it.invoice_status || '')}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={7}>
                      No invoice created
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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

      {/* Lead Notes Modal */}
      <Modal open={leadNotesOpen} onClose={() => setLeadNotesOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            maxHeight: '80vh', // prevent modal from exceeding viewport height
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: 'auto', // allows whole modal to scroll if needed
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Lead Notes
          </Typography>

          <Box
            sx={{
              mb: 3,
              maxHeight: '50vh', // limit notes area height
              overflowY: 'auto', // scroll when too long
              whiteSpace: 'pre-wrap', // preserve line breaks
              wordBreak: 'break-word', // wrap long words
              border: '1px solid #ddd',
              borderRadius: 1,
              p: 1,
            }}
          >
            {lead?.notes || 'No notes available'}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setLeadNotesOpen(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Update Deposit Modal */}
      <Modal
        open={updateDepositOpen}
        onClose={() => {
          setDepositAmount(Number(dbDepositValue));
          setUpdateDepositOpen(false);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 350, sm: 500 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Update Deposit
          </Typography>

          {/* Input */}
          <NumberFieldWithoutFormik
            label="Security Deposit"
            name="security_deposit"
            value={depositAmount}
            allowDecimal={true}
            allowNegative={false}
            decimalScale={4}
            onChange={(value: string) => {
              setDepositAmount(Number(value) || 0);
            }}
            sx={{ mb: 3 }}
          />

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setDepositAmount(Number(dbDepositValue));
                setUpdateDepositOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleUpdateDeposit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Item Modal */}
      <Modal open={addItemOpen} onClose={() => setAddItemOpen(false)}>
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
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Lead Item
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MuiTextField
                select
                fullWidth
                label="Type"
                name="__new_item_type"
                value={newItem.item_type}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewItem((p) => ({
                    ...p,
                    item_type: e.target.value as 'service' | 'product',
                    item_id: '',
                    item_name: '',
                    unit_price: '',
                    quantity: '1',
                  }))
                }
              >
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="product">Product</MenuItem>
              </MuiTextField>
            </Grid>
            {newItem.item_type === 'product' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <MuiTextField
                  select
                  fullWidth
                  label="Deal type"
                  name="__new_item_deal_type"
                  value={newItem.deal_type}
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      deal_type: e.target.value as 'rent' | 'sell',
                    }))
                  }
                >
                  <MenuItem value="rent">Rent</MenuItem>
                  <MenuItem value="sell">Sell</MenuItem>
                </MuiTextField>
              </Grid>
            )}
            {newItem.item_type === 'product' ? (
              <Grid size={{ xs: 12 }}>
                <MuiTextField
                  select
                  fullWidth
                  label="Product"
                  name="__new_item_product"
                  value={newItem.item_id}
                  onChange={(e) => {
                    const id = String(e.target.value);
                    const p = products.find((x) => String(x.id) === id);
                    const price =
                      newItem.deal_type === 'rent'
                        ? Number(p?.hour_rent_price ?? 0)
                        : Number(p?.sale_price ?? 0);
                    setNewItem((prev) => ({
                      ...prev,
                      item_id: id,
                      item_name: String(p?.name ?? ''),
                      unit_price: String(price || ''),
                    }));
                  }}
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </MuiTextField>
              </Grid>
            ) : (
              <Grid size={{ xs: 12 }}>
                <MuiTextField
                  select
                  fullWidth
                  label="Service"
                  name="__new_item_service"
                  value={newItem.item_id}
                  onChange={(e) => {
                    const id = String(e.target.value);
                    const s = services.find((x) => String(x.id) === id);
                    const price = Number(s?.hour_price ?? 0);
                    setNewItem((prev) => ({
                      ...prev,
                      item_id: id,
                      item_name: String(s?.name ?? ''),
                      unit_price: String(price || ''),
                    }));
                  }}
                >
                  {services.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </MuiTextField>
              </Grid>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <NonFormikDatePicker
                  label="Start Date"
                  value={newItem.start_date ? toDay(newItem.start_date) : null}
                  minDate={
                    lead?.start_date ? toDay(lead.start_date) ?? undefined : undefined
                  }
                  format="DD/MM/YYYY"
                  onChange={(e: Dayjs | null) => {
                    const next = e ? dayjs(e).format('YYYY-MM-DD') : '';
                    setNewItem((p) => ({ ...p, start_date: next }));
                  }}
                  slotProps={{ textField: { fullWidth: true, name: '__new_item_start_date' } }}
                />
              </Grid>
            </LocalizationProvider>
            {newItem.item_type === 'product' && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <MuiTextField
                  fullWidth
                  label="Qty"
                  name="__new_item_qty"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, quantity: e.target.value }))
                  }
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: newItem.item_type === 'service' ? 4 : 4 }}>
              <MuiTextField
                fullWidth
                label={newItem.item_type === 'service' ? 'Hour Price' : 'Unit price'}
                name="__new_item_unit_price"
                value={newItem.unit_price}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, unit_price: e.target.value }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: newItem.item_type === 'service' ? 4 : 4 }}>
              <MuiTextField
                fullWidth
                label="Hours/Day"
                name="__new_item_hours_per_day"
                value={newItem.hours_per_day}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, hours_per_day: e.target.value }))
                }
              />
            </Grid>
            {newItem.item_type === 'service' && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <MuiTextField
                  fullWidth
                  label="Total"
                  name="__new_item_total"
                  value={String(newItemComputedTotal)}
                  disabled
                />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <MuiTextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                name="__new_item_notes"
                value={newItem.notes}
                onChange={(e) => setNewItem((p) => ({ ...p, notes: e.target.value }))}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => setAddItemOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateNewItem}
              disabled={loading || !newItem.item_id || !newItem.item_name}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* End Item Modal */}
      <Modal
        open={endItemOpen}
        onClose={() => {
          setEndItemOpen(false);
          setEndItemTarget(null);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 350, sm: 520 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            End Item
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {endItemTarget?.item_name
              ? `Item: ${endItemTarget.item_name}`
              : 'Select an end date for this item.'}
          </Typography>

          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid size={{ xs: 12 }}>
                <NonFormikDatePicker
                  label="End Date"
                  value={endItemDate ? toDay(endItemDate) : null}
                  minDate={(() => {
                    const startMin = endItemTarget?.start_date ? toISO(endItemTarget.start_date) : '';
                    const invMin = lastInvoiceDate ?? '';
                    const min = invMin && (!startMin || invMin > startMin) ? invMin : startMin;
                    return min ? toDay(min) ?? undefined : undefined;
                  })()}
                  format="DD/MM/YYYY"
                  onChange={(e: Dayjs | null) => {
                    const next = e ? dayjs(e).format('YYYY-MM-DD') : '';
                    setEndItemDate(next);
                  }}
                  slotProps={{ textField: { fullWidth: true, name: '__end_item_end_date' } }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {(() => {
                    const startMin = endItemTarget?.start_date
                      ? String(endItemTarget.start_date).slice(0, 10)
                      : '';
                    const invMin = lastInvoiceDate ?? '';
                    if (invMin && startMin) {
                      const min = invMin > startMin ? invMin : startMin;
                      return `Must be on/after ${min} (item start / last invoice date)`;
                    }
                    if (invMin) return `Must be on/after ${invMin} (last invoice date)`;
                    if (startMin) return `Must be on/after ${startMin} (item start date)`;
                    return '';
                  })()}
                </Typography>
              </Grid>
            </LocalizationProvider>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setEndItemOpen(false);
                setEndItemTarget(null);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmEndItem}
              disabled={loading || !endItemTarget?.id}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </PageLayout.FormSection>
  );
};

export default ViewGeneralInformation;
