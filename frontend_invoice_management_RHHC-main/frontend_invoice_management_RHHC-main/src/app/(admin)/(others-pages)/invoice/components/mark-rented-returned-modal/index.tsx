'use client';

import { Form, Formik } from 'formik';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, Grid } from '@mui/material';
import TextField from '@/modules/common/text-field';
import * as Yup from 'yup';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';

export type MarkRentedReturnedFormValues = {
  return_date: string;
  note: string;
};

type MarkRentedReturnedModalProps = {
  open: boolean;
  onClose: () => void;
  invoiceNumber: string;
  onSubmit: (values: MarkRentedReturnedFormValues) => Promise<void>;
};

const initialValues: MarkRentedReturnedFormValues = {
  return_date: '',
  note: '',
};

const validationSchema = Yup.object().shape({
  return_date: Yup.string().required(messages.REQUIRED),
  note: Yup.string(),
});

export default function MarkRentedReturnedModal({
  open,
  onClose,
  invoiceNumber,
  onSubmit,
}: MarkRentedReturnedModalProps) {
  const handleSubmit = async (values: MarkRentedReturnedFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mark Rented Products Returned{invoiceNumber ? ` - ${invoiceNumber}` : ''}</DialogTitle>
      <Formik<MarkRentedReturnedFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit: formSubmit, isSubmitting }) => (
          <Form onSubmit={formSubmit}>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <FormGroup>
                      <DatePicker
                        name="return_date"
                        label="Return Date"
                        disableFuture={true}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormGroup>
                      <TextField
                        fullWidth
                        name="note"
                        label="Note"
                        multiline
                        rows={3}
                        placeholder="Optional notes"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Submit'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
