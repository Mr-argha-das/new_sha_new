'use client';

import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import TextField from '@/modules/common/text-field';
import { Button, Grid } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { changeStaffPassword } from '../api';

type Props = {
  staffId: number;
  staffName: string;
  onCancel: () => void;
  onSuccess?: () => void;
};

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function ChangeStaffPasswordModal({
  staffId,
  staffName,
  onCancel,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { password: string }) => {
    setLoading(true);
    try {
      const res = await changeStaffPassword({
        user_id: staffId,
        password: values.password.trim(),
      });
      if (res.status) {
        toast.success(res.data?.message || 'Password changed successfully');
        onSuccess?.();
        onCancel();
      } else {
        toast.error(res.data?.message || 'Failed to change password');
      }
    } catch {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <p className="text-sm text-gray-600">
                Change password for{' '}
                <span className="font-medium">
                  {capitalizeWords(staffName)}
                </span>
              </p>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="text"
                label="New Password"
                name="password"
                placeholder="Enter new password"
                slotProps={{
                  htmlInput: { autoComplete: 'new-password' },
                }}
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
                    {loading || isSubmitting ? 'Saving...' : 'Change Password'}
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
