'use client';

import { useAuth } from '@/context/AuthContext';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import NumberField from '@/modules/common/NumberField';
import StaffSearchAutocomplete from '@/modules/common/staff-search-autocomplete';
import TextField from '@/modules/common/text-field';
import { Button, Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { addStaffQuickPay } from '../api';
import { StaffQuickPayPayload } from '../api/schema';

type Props = {
  onCancel: () => void;
  onSuccess?: () => void;
};

type FormValues = {
  user_id: string;
  date: string;
  description: string;
  amount: string;
  status: 0 | 1;
};

const validationSchema = Yup.object({
  user_id: Yup.string().required('Required'),
  date: Yup.string().required('Required'),
  description: Yup.string().nullable(),
  amount: Yup.number().typeError('Invalid amount').min(1).required('Required'),
  status: Yup.mixed<0 | 1>().oneOf([0, 1]).required(),
});

export default function StaffQuickPayModal({ onCancel, onSuccess }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  const initialValues: FormValues = {
    user_id: '',
    date: '',
    description: '',
    amount: '',
    status: 0,
  };

  const handleSubmit = async (values: FormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      const payload: StaffQuickPayPayload = {
        user_id: Number(values.user_id),
        account_id: Number(user.account_id),
        branch_id: Number(user.branch_id),
        date: values.date,
        description: values.description || null,
        amount: Number(values.amount),
        status: values.status,
      };

      const res = await addStaffQuickPay(payload);
      if (res.status) {
        // Refresh quick pay list everywhere (e.g. staff view page)
        await qc.invalidateQueries({ queryKey: ['getStaffQuickPays'] });
        onSuccess?.();
        toast.success(messages.COMMONADDED('Quick Pay'));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, isSubmitting, setFieldValue, handleBlur }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StaffSearchAutocomplete
                value={values.user_id}
                onChange={(id) => {
                  void setFieldValue('user_id', id);
                }}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker name="date" label="Date" maxDate={dayjs()} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <NumberField
                label="Amount"
                name="amount"
                allowDecimal={true}
                allowNegative={false}
                decimalScale={2}
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Grid container justifyContent="flex-end" spacing={1}>
                <Grid>
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading || isSubmitting}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || isSubmitting}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
