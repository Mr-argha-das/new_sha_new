import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';

import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Invoice } from '@/modules/common/models/invoice';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { cloneDeep } from 'lodash-es';
import * as Yup from 'yup';
import { updateInvoice } from '../../../api';
import {
  PaymentMethodFields,
  defaultOtherDetails,
} from '../../../components/payment-method-fields';
import { useInvoiceEditPageContext } from '../../context';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface InvoiceDetailsFormValues {
  customer_id: string | '';
  lead_id: string | '';
  payment_status: 0 | 1 | 2;
  invoice_status: 'draft' | 'published';
  notes: string;
  total_amount: number;
  due_amount: number;
  is_deposit_counted: number;
  is_first_invoice: number;
  settlement_amount: number | null;
  security_deposit: number | null;
  payment_method: string;
  other_details: Record<string, string>;
}

interface EditInvoiceDetailsProps {
  onSave: () => void;
  onCancel: () => void;
}

const EditGeneralInformation = ({
  onSave,
  onCancel,
}: EditInvoiceDetailsProps) => {
  const { invoice, setLoading, loading } = useInvoiceEditPageContext();
  const invalidate = useInvalidate();

  const paymentStatusCode: Record<string, number> = {
    unpaid: 0,
    partial: 1,
    paid: 2,
  };

  const toNumber = (v: unknown): number => {
    if (v === null || v === undefined || v === '') return 0;
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const firstPayment = invoice?.payment?.find(
    (p) => p.payment_method !== 'carry-forward',
  );
  const initialValues: InvoiceDetailsFormValues = {
    customer_id: invoice?.customer_id ?? '',
    lead_id: invoice?.lead_id ?? '',
    payment_status:
      (Number(paymentStatusCode[String(invoice?.payment_status)]) as
        | 0
        | 1
        | 2) ?? 0,
    invoice_status:
      (invoice?.invoice_status as 'draft' | 'published') ?? 'draft',
    notes: invoice?.notes ?? '',
    total_amount: toNumber(invoice?.total_amount),
    due_amount: toNumber(invoice?.due_amount),
    is_deposit_counted: Number(invoice?.is_deposit_counted),
    security_deposit: invoice?.security_deposit ?? 0,
    is_first_invoice: 0,
    settlement_amount: invoice?.settlement_amount ?? 0,
    payment_method: firstPayment?.payment_method
      ? String(firstPayment.payment_method).toLowerCase()
      : 'cash',
    other_details:
      firstPayment?.other_details &&
      typeof firstPayment.other_details === 'object'
        ? { ...defaultOtherDetails, ...firstPayment.other_details }
        : { ...defaultOtherDetails },
  };
  const handleFormSubmit = async (values: InvoiceDetailsFormValues) => {
    try {
      const payload = cloneDeep(values);
      payload.customer_id = String(invoice?.customer_id);
      payload.lead_id = String(invoice?.lead_id);
      payload.due_amount = payload.total_amount;

      if (payload.is_deposit_counted == 0) {
        payload.security_deposit = null;
        payload.settlement_amount = null;
      } else {
        payload.security_deposit = Number(invoice?.lead_security_deposit);
        if (payload.total_amount < 0) {
          payload.settlement_amount = payload.total_amount;
        } else {
          payload.settlement_amount = null;
        }
      }

      payload.is_first_invoice = invoice?.lead_status === 'created' ? 1 : 0;
      setLoading(true);
      const res = await updateInvoice(
        String(invoice?.id),
        payload as unknown as Partial<Invoice>,
      );
      if (res.status) {
        toast.success(messages.COMMONUPDATE('Invoice'));
        await invalidate(['getInvoiceById']);
        onSave();
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Formik<InvoiceDetailsFormValues>
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      validationSchema={Yup.object().shape({
        payment_status: Yup.mixed<0 | 1 | 2>()
          .oneOf([0, 1, 2])
          .required(messages.REQUIRED)
          .when('is_deposit_counted', {
            is: 1,
            then: (schema) =>
              schema.test(
                'deposit-paid-check',
                "If deposit is counted, payment status must be 'Paid' ",
                (value) => value === 2,
              ),
          })
          .test(
            'paid-invoice-status-check',
            "If payment status is 'Paid', invoice must be 'Published'",
            function (value) {
              const { invoice_status } = this.parent;
              // only run this check if payment_status is 2
              if (value === 2 && invoice_status !== 'published') {
                return this.createError({
                  message:
                    "If payment status is 'Paid', invoice must be 'Published'",
                });
              }
              return true;
            },
          ),
        invoice_status: Yup.mixed<'draft' | 'published'>()
          .oneOf(['draft', 'published'])
          .required(messages.REQUIRED),
        notes: Yup.string().nullable(),
        is_deposit_counted: Yup.number()
          .oneOf([0, 1])
          .required(messages.REQUIRED),
      })}
    >
      {({ values, handleSubmit, handleReset, setFieldValue, errors }) => {
        const calculateTotals = (isDepositeCounted: boolean) => {
          let totalAmount = Number(invoice?.sub_total);
          if (isDepositeCounted) {
            totalAmount -= Number(invoice?.lead_security_deposit ?? 0);
          }
          return Math.round(totalAmount);
        };

        return (
          <Form onReset={handleReset} onSubmit={handleSubmit}>
            <PageLayout.FormSection
              loading={loading}
              mode={Mode.EDIT}
              onCancel={onCancel}
              title="Invoice Details"
              sx={{ mt: 3 }}
            >
              <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Invoice Status"
                    name="invoice_status"
                    onChange={(e) =>
                      setFieldValue('invoice_status', e.target.value)
                    }
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Payment Status"
                    name="payment_status"
                    onChange={(e) =>
                      setFieldValue('payment_status', Number(e.target.value))
                    }
                  >
                    <MenuItem value={0}>Unpaid</MenuItem>
                    <MenuItem value={1}>Partial</MenuItem>
                    <MenuItem value={2}>Paid</MenuItem>
                  </TextField>
                </Grid>

                {values.payment_status === 2 && <PaymentMethodFields />}

                <Grid
                  size={{ xs: 12, sm: 6 }}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!values.is_deposit_counted}
                        onChange={(e) => {
                          const val = e.target.checked ? 1 : 0;
                          setFieldValue('is_deposit_counted', val);
                          if (val === 1) {
                            setFieldValue('payment_status', 2);
                          }

                          // Calculate totals based on updated other charges
                          const totalAmount = calculateTotals(val === 1);
                          setFieldValue('total_amount', totalAmount, false);
                          setFieldValue('due_amount', totalAmount, false);
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={0.5}>
                        Count Security Deposit
                        <Tooltip title="Count deposit and mark lead as completed">
                          <InfoOutlineIcon
                            color="primary"
                            sx={{ cursor: 'pointer', fontSize: '16px' }}
                          />
                        </Tooltip>
                      </Box>
                    }
                  />
                  <div>₹ {invoice?.lead_security_deposit}</div>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Total Amount"
                    name="total_amount"
                    disabled
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    type="text"
                    label="Notes"
                    name="notes"
                    onChange={(e) => setFieldValue('notes', e.target.value)}
                  />
                </Grid>
              </Grid>
            </PageLayout.FormSection>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditGeneralInformation;
