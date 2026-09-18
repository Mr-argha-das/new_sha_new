'use client';

import TextField from '@/modules/common/text-field';
import { FormGroup, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'upi', label: 'UPI' },
  { value: 'other', label: 'Other' },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value'];

export const defaultOtherDetails = {
  cheque_no: '',
  bank_name: '',
  transaction_id: '',
  card_last4: '',
  upi_id: '',
  utr_number: '',
};

interface PaymentMethodFieldsProps {
  namePrefix?: string;
  gridSize?: { xs?: number; sm?: number };
}

export function PaymentMethodFields({
  namePrefix = '',
  gridSize = { xs: 12, sm: 6 },
}: PaymentMethodFieldsProps) {
  const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();

  const getByPath = (obj: Record<string, unknown>, path: string): unknown => {
    const keys = path.replace(/\.$/, '').split('.').filter(Boolean);
    let cur: unknown = obj;
    for (const k of keys) {
      cur = (cur as Record<string, unknown>)?.[k];
    }
    return cur;
  };

  const paymentMethod = (() => {
    if (!namePrefix) return (values as { payment_method?: string }).payment_method ?? '';
    const base = getByPath(values as Record<string, unknown>, namePrefix) as Record<string, unknown> | undefined;
    return (base?.payment_method as string) ?? '';
  })();

  const name = (field: string) => (namePrefix ? `${namePrefix}${field}` : field);

  return (
    <>
      <Grid size={gridSize}>
        <FormGroup>
          <TextField
            fullWidth
            select
            label="Payment Method"
            name={name('payment_method')}
            onChange={(e) => setFieldValue(name('payment_method'), e.target.value)}
          >
            {PAYMENT_METHODS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </FormGroup>
      </Grid>

      {paymentMethod === 'cheque' && (
        <>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="Cheque No" name={name('other_details.cheque_no')} />
            </FormGroup>
          </Grid>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="Bank Name" name={name('other_details.bank_name')} />
            </FormGroup>
          </Grid>
        </>
      )}

      {paymentMethod === 'bank_transfer' && (
        <>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="Bank Name" name={name('other_details.bank_name')} />
            </FormGroup>
          </Grid>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="Transaction ID" name={name('other_details.transaction_id')} />
            </FormGroup>
          </Grid>
        </>
      )}

      {paymentMethod === 'card' && (
        <>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="Card Last 4 Digits" name={name('other_details.card_last4')} />
            </FormGroup>
          </Grid>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="Bank Name" name={name('other_details.bank_name')} />
            </FormGroup>
          </Grid>
        </>
      )}

      {paymentMethod === 'upi' && (
        <>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="UPI ID" name={name('other_details.upi_id')} />
            </FormGroup>
          </Grid>
          <Grid size={gridSize}>
            <FormGroup>
              <TextField fullWidth label="UTR Number" name={name('other_details.utr_number')} />
            </FormGroup>
          </Grid>
        </>
      )}
    </>
  );
}

export default PaymentMethodFields;
