import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import DateTimePicker from '@/modules/common/date-time-picker';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { staffTaskStatus } from '@/modules/common/models/staff';
import NumberField from '@/modules/common/NumberField';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import { Grid, MenuItem, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { cloneDeep } from 'lodash-es';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { updateStaffTask } from '../../../../api';
import { UpdateStaffTaskForm } from '../../../../api/schema';
import { useTaskContext } from '../../context';
interface EditGeneralInformationProps {
  onSave: () => void;

  onCancel: () => void;
}

const EditGeneralInformation = ({
  onSave,
  onCancel,
}: EditGeneralInformationProps) => {
  const { task } = useTaskContext();
  const invalidate = useInvalidate();

  const initialValues: UpdateStaffTaskForm = {
    from_date_time: task?.from_date_time ?? '',
    to_date_time: task?.to_date_time ?? '',
    status: task?.status ?? staffTaskStatus.todo,
    staff_working_hours: task?.staff_working_hours ?? 8,
  };

  const handleFormSubmit = async (values: UpdateStaffTaskForm) => {
    try {
      const payload = cloneDeep(values);
      await updateStaffTask(String(task?.id), payload);
      toast.success(messages.COMMONUPDATE('Staff Task'));
      await invalidate(['getStaffTask']);
      onSave();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      validationSchema={Yup.object().shape({
        from_date_time: Yup.string().required(messages.REQUIRED),
        to_date_time: Yup.string().required(messages.REQUIRED),
        status: Yup.string().required(messages.REQUIRED),
        staff_working_hours: Yup.number().required(messages.REQUIRED),
      })}
    >
      {({ handleSubmit, handleReset, setFieldValue, values }) => {
        return (
          <Form onReset={handleReset} onSubmit={handleSubmit}>
            <PageLayout.FormSection
              mode={Mode.EDIT}
              onCancel={onCancel}
              title="Edit Staff Task"
              sx={{ mt: 3 }}
            >
              <Grid container spacing={[2, 2]}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DateTimePicker
                    name="from_date_time"
                    label="From Date Time"
                    minDateTime={dayjs().startOf('minute')}
                    maxDateTime={
                      values.to_date_time
                        ? dayjs(values.to_date_time)
                        : undefined
                    }
                    onChange={(newValue) => {
                      setFieldValue(
                        'from_date_time',
                        newValue?.toISOString() || '',
                      );
                      // Auto update end time if working hours exist
                      if (newValue && values.staff_working_hours) {
                        const newToDate = dayjs(newValue).add(
                          values.staff_working_hours,
                          'hour',
                        );
                        setFieldValue('to_date_time', newToDate.toISOString());
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <DateTimePicker
                    name="to_date_time"
                    label="To Date Time"
                    format="DD/MM/YYYY HH:mm (A)"
                    minDateTime={
                      values.from_date_time
                        ? dayjs(values.from_date_time)
                        : undefined
                    }
                  />
                  {values.from_date_time &&
                    values.to_date_time &&
                    values.staff_working_hours
                    ? (() => {
                      const from = dayjs(values.from_date_time);
                      const to = dayjs(values.to_date_time);
                      const diffHours = to.diff(from, 'hour', true);
                      const diff = diffHours - values.staff_working_hours;

                      if (Math.abs(diff) === 0) return null;

                      return (
                        <Typography
                          fontSize={10}
                          sx={{
                            mt: 1,
                            color: diff > 0 ? 'warning.main' : 'info.main',
                          }}
                        >
                          {Math.abs(diff).toFixed(1)} hour{' '}
                          {Math.abs(diff) > 1 ? 's' : ''}{' '}
                          {diff > 0 ? 'more' : 'less'} than staff working
                          hours.
                        </Typography>
                      );
                    })()
                    : null}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <NumberField
                    fullWidth
                    label="Staff Working Hours"
                    name="staff_working_hours"
                    allowNegative={false}
                    allowDecimal={true}
                    decimalScale={4}
                    onChange={(e) => {
                      const hours = Number(e.target.value) || 0;
                      if (values.from_date_time) {
                        const newToDate = dayjs(values.from_date_time).add(
                          hours,
                          'hour',
                        );
                        setFieldValue('to_date_time', newToDate.toISOString());
                      }
                    }}
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    onChange={(e) => setFieldValue('status', e.target.value)}
                  >
                    <MenuItem value="onHold">On Hold</MenuItem>
                    <MenuItem value="todo">Todo</MenuItem>
                  </TextField>
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
