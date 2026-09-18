import { Form, Formik } from 'formik';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';

import { ReceiptPayload } from '@/lib/payment_recipt_html';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { formatINR } from '@/modules/common/helpers/helper';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { InvoicePaymentHistory } from '@/modules/common/models/invoice';
import NumberField from '@/modules/common/NumberField';
import TextField from '@/modules/common/text-field';
import { Box, Button, FormGroup, Grid, Modal, Typography } from '@mui/material';
import * as Yup from 'yup';
import { addPaymentRecord } from '../../api';
import {
  PaymentMethodFields,
  defaultOtherDetails,
} from '../payment-method-fields';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
  dueAmount: string;
  setReceiptPayload: Dispatch<SetStateAction<ReceiptPayload | null>>;
  setShowReceipt: Dispatch<SetStateAction<boolean>>;
}

const PaymentForm = ({
  open,
  onClose,
  invoiceId,
  invoiceNumber,
  dueAmount,
  setReceiptPayload,
  setShowReceipt,
}: PaymentFormProps) => {
  const [loading, setLoading] = useState(false);
  const invalidate = useInvalidate();

  const initialValues: InvoicePaymentHistory = {
    payment_date: new Date().toISOString().split('T')[0],
    amount: dueAmount,
    payment_method: 'cash',
    notes: '',
    other_details: { ...defaultOtherDetails },
  };

  const handleFormSubmit = async (values: InvoicePaymentHistory) => {
    try {
      setLoading(true);
      let other_details: Record<string, string> | null = null;

      switch (values.payment_method) {
        case 'cheque':
          other_details = {
            cheque_no: values.other_details?.cheque_no || '',
            bank_name: values.other_details?.bank_name || '',
          };
          break;

        case 'bank_transfer':
          other_details = {
            bank_name: values.other_details?.bank_name || '',
            transaction_id: values.other_details?.transaction_id || '',
          };
          break;

        case 'card':
          other_details = {
            card_last4: values.other_details?.card_last4 || '',
            bank_name: values.other_details?.bank_name || '',
          };
          break;

        case 'upi':
          other_details = {
            upi_id: values.other_details?.upi_id || '',
            utr_number: values.other_details?.utr_number || '',
          };
          break;

        default:
          other_details = null; // cash, other → no details
      }

      const payload = {
        ...values,
        other_details,
      };

      const res = await addPaymentRecord(invoiceId, payload);
      if (res.status) {
        toast.success(messages.COMMONADDED('Payment Record'));
        await invalidate(['getInvoiceById']);
        await invalidate(['getInvoice']);
        const data = res.data.data;
        const payload: ReceiptPayload = {
          receiptNo: data?.receiptNo,
          date: toDDMMYYYY(data?.date),
          from: capitalizeFirstLetter(data?.from),
          rupees: formatINR(data?.rupees),
          againstBillNo: data?.againstBillNo,
          onAccountOf: data?.onAccountOf,
          // enrich with payment-method specific details for the receipt
          paymentMethod: values?.payment_method,
          otherDetails: values?.other_details || null,
        };

        // Show preview modal automatically
        setReceiptPayload(payload);
        setShowReceipt(true);
        onClose();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3 }}>
            Add Payment Record - {invoiceNumber}
          </Typography>

          <Formik<InvoicePaymentHistory>
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={Yup.object().shape({
              payment_date: Yup.string().required(messages.REQUIRED),
              amount: Yup.number()
                .min(1)
                .max(Number(dueAmount))
                .required(messages.REQUIRED),
              payment_method: Yup.string()
                .oneOf(
                  ['cash', 'card', 'bank_transfer', 'other', 'cheque', 'upi'],
                  'Invalid payment method',
                )
                .required(messages.REQUIRED),
              notes: Yup.string(),
            })}
          >
            {({ handleSubmit, handleReset }) => (
              <Form onReset={handleReset} onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormGroup>
                      <DatePicker
                        label="Payment Date"
                        name="payment_date"
                        disableFuture
                      />
                    </FormGroup>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormGroup>
                      <NumberField
                        fullWidth
                        label="Amount to add"
                        name="amount"
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            max: dueAmount,
                            step: '1',
                          },
                        }}
                        allowDecimal={true}
                        allowNegative={false}
                        decimalScale={4}
                      />
                    </FormGroup>
                  </Grid>
                  <PaymentMethodFields />

                  <Grid size={{ xs: 12 }}>
                    <FormGroup>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Note"
                        name="notes"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button variant="outlined" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Payment'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default PaymentForm;
