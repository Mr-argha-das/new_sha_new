'use client';

import { useAuth } from '@/context/AuthContext';
import { useHorizontalInfiniteList } from '@/hooks/useHorizontalInfiniteList';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import CustomerSearchAutocomplete from '@/modules/common/customer-search-autocomplete';
import DateTimePicker from '@/modules/common/date-time-picker';
import Link from '@/modules/common/elements/link';
import PageContainer from '@/modules/common/elements/page/page-container';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { staffTaskStatus } from '@/modules/common/models/staff';
import NumberField from '@/modules/common/NumberField';
import StaffSearchAutocomplete from '@/modules/common/staff-search-autocomplete';
import TextField from '@/modules/common/text-field';
import PersonIcon from '@mui/icons-material/Person';
import { Button, Grid, MenuItem, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../../../../../packages/ui';
import { getService } from '../../../service/api';
import { createStaffTask } from '../../api';
import { ListItem, StaffTaskForm } from '../../api/schema';

const AddStaffTask = () => {
  const invalidate = useInvalidate();
  const router = useRouter();
  const { user } = useAuth();

  const {
    items: serviceItems,
    isFetchingNextPage: serviceFetchingMore,
    hasMore: serviceHasMore,
    fetchNextPage: fetchMoreServices,
  } = useHorizontalInfiniteList<ListItem, Record<string, unknown>>({
    queryKey: ['getServices'],
    fetcher: async (params) => {
      const res = await getService(params);
      const d = (res?.data || {}) as {
        data?: Array<{ id: number; name: string; hour_price?: number }>;
        meta?: { total?: number };
      };
      return {
        data: {
          data: d?.data || [],
          meta: {
            total:
              d?.meta?.total ?? (Array.isArray(d?.data) ? d.data.length : 0),
          },
        },
      } as {
        data: {
          data: Array<{ id: number; name: string; hour_price?: number }>;
          meta: { total: number };
        };
      };
    },
    params: {
      account_id: user?.account_id,
      branch_id: user?.branch_id,
    },
    limit: 20,
    enabled: !!user?.account_id && !!user?.branch_id,
  });

  const services = (serviceItems || []).map((s) => ({
    id: s.id,
    name: s.name,
    hour_price: s.hour_price ?? 0,
  }));

  const handleFormSubmit = async (
    values: StaffTaskForm,
    { resetForm }: { resetForm: () => void },
  ) => {
    try {
      const payload = cloneDeep(values);
      payload.account_id = user?.account_id as number;
      payload.branch_id = user?.branch_id as number;

      await createStaffTask([payload]);
      toast.success(messages.COMMONADDED('Staff Task'));
      await invalidate(['getStaffTask']);
      resetForm();
      router.push('/staff/task');
    } catch (e) { }
  };

  const initialValues: StaffTaskForm = {
    account_id: user?.account_id as number,
    branch_id: user?.branch_id as number,
    customer_id: '',
    user_id: '',
    service_id: '',
    from_date_time: '',
    to_date_time: '',
    service_price: 0,
    status: staffTaskStatus.todo,
    staff_working_hours: 0,
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        customer_id: Yup.number().required(messages.REQUIRED),
        user_id: Yup.number().required(messages.REQUIRED),
        service_id: Yup.number().required(messages.REQUIRED),
        from_date_time: Yup.string().required(messages.REQUIRED),
        to_date_time: Yup.string()
          .required(messages.REQUIRED)
          .test(
            'is-after',
            'To Date Time must be after From Date Time',
            function (value) {
              const { from_date_time } = this.parent;
              if (!from_date_time || !value) return true;

              return dayjs(value).isAfter(dayjs(from_date_time));
            },
          ),
        service_price: Yup.number().required(messages.REQUIRED),
      })}
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({
        handleBlur,
        handleSubmit,
        isSubmitting,
        values,
        setFieldValue,
        errors,
        touched,
      }) => {
        return (
          <PageLayout
            component={Form}
            onBlur={handleBlur}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          >
            <PageLayout.Header
              isListHeader={false}
              title={'Add Task'}
              breadcrumbs={[
                {
                  href: '/staff/task',
                  name: 'Tasks',
                },
                {
                  name: 'Add',
                },
              ]}
              back={
                <Link href={`/staff/task`}>
                  <Button type="button" variant="text">
                    Back to List
                  </Button>
                </Link>
              }
            ></PageLayout.Header>

            <PageLayout.Content>
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <PersonIcon sx={{ color: 'blue' }} />
                  <h2 className="text-lg font-semibold">Staff Task</h2>
                </div>
                <PageLayout.FormSection
                  blur={false}
                  title={''}
                  editable={false}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StaffSearchAutocomplete
                        value={values.user_id}
                        label="Staff"
                        onChange={(id) => {
                          setFieldValue('user_id', id);
                        }}
                        onUserChange={(staff) => {
                          const workingHours = staff?.working_hours ?? 0;
                          setFieldValue('staff_working_hours', workingHours);

                          if (values.from_date_time && workingHours) {
                            const newToDate = dayjs(values.from_date_time).add(
                              workingHours,
                              'hour',
                            );
                            setFieldValue(
                              'to_date_time',
                              newToDate.toISOString(),
                            );
                          }
                        }}
                        onBlur={handleBlur}
                        error={!!errors.user_id && touched.user_id}
                        helperText={errors.user_id}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomerSearchAutocomplete
                        value={values.customer_id}
                        label="Customer"
                        onChange={(id) => {
                          setFieldValue('customer_id', id);
                        }}
                        onBlur={handleBlur}
                        error={!!errors.customer_id && touched.customer_id}
                        helperText={errors.customer_id}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Service"
                        name="service_id"
                        slotProps={{
                          select: {
                            MenuProps: {
                              PaperProps: {
                                onScroll: (
                                  e: React.UIEvent<HTMLDivElement>,
                                ) => {
                                  const el = e.currentTarget;
                                  const remaining =
                                    el.scrollHeight -
                                    el.scrollTop -
                                    el.clientHeight;
                                  if (
                                    remaining < 160 &&
                                    serviceHasMore &&
                                    !serviceFetchingMore
                                  ) {
                                    fetchMoreServices();
                                  }
                                },
                              },
                            },
                          },
                        }}
                        onChange={(e) => {
                          const id = e.target.value;
                          const found = services.find(
                            (s) => String(s.id) === String(id),
                          );
                          setFieldValue('service_id', id);
                          setFieldValue(
                            'service_price',
                            found?.hour_price ?? 0,
                          );
                        }}
                      >
                        {(services || []).map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <NumberField
                        fullWidth
                        allowNegative={false}
                        allowDecimal={true}
                        decimalScale={4}
                        label="Service Price"
                        name="service_price"
                        slotProps={{ htmlInput: { min: 0 } }}
                        disabled={values.service_id ? false : true}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <NumberField
                        fullWidth
                        allowNegative={false}
                        allowDecimal={true}
                        decimalScale={4}
                        label="Staff Working Hours"
                        name="staff_working_hours"
                        onChange={(e) => {
                          const hours = Number(e.target.value) || 0;

                          // Auto update to_date_time if from_date_time exists
                          if (values.from_date_time) {
                            const newToDate = dayjs(values.from_date_time).add(
                              hours,
                              'hour',
                            );
                            setFieldValue(
                              'to_date_time',
                              newToDate.toISOString(),
                            );
                          }
                        }}
                        slotProps={{ htmlInput: { min: 0 } }}
                        disabled={values.user_id ? false : true}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DateTimePicker
                        name="from_date_time"
                        label="From Date Time"
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
                            setFieldValue(
                              'to_date_time',
                              newToDate.toISOString(),
                            );
                          }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DateTimePicker
                        name="to_date_time"
                        label="To Date Time"
                        format="DD/MM/YYYY HH:mm (A)"
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
                                color:
                                  diff > 0 ? 'warning.main' : 'info.main',
                              }}
                            >
                              {Math.abs(diff).toFixed(1)} hour
                              {Math.abs(diff) > 1 ? 's' : ''}{' '}
                              {diff > 0 ? 'more' : 'less'} than staff working
                              hours.
                            </Typography>
                          );
                        })()
                        : null}
                    </Grid>
                  </Grid>
                </PageLayout.FormSection>
              </div>
            </PageLayout.Content>

            {/* <PageLayout.Footer> */}
            <PageContainer sx={{ px: 0 }}>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                variant="contained"
                sx={{ mr: 2 }}
              >
                Save
              </LoadingButton>
              <Button
                onClick={() => router.push(`/staff/task`)}
                disabled={isSubmitting}
                type="button"
                variant="text"
                sx={{ px: 3, color: 'neutral.200' }}
              >
                Cancel
              </Button>
            </PageContainer>
            {/* </PageLayout.Footer> */}
          </PageLayout>
        );
      }}
    </Formik>
  );
};

export default AddStaffTask;
