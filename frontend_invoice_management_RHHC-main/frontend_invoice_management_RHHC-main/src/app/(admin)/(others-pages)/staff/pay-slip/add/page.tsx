'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import Link from '@/modules/common/elements/link';
import PageContainer from '@/modules/common/elements/page/page-container';
import { toDDMMYYYY, toYYYYMMDD } from '@/modules/common/helpers/dateFormat';
import { formatINR } from '@/modules/common/helpers/helper';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import NumberField from '@/modules/common/NumberField';
import StaffSearchAutocomplete from '@/modules/common/staff-search-autocomplete';
import TextField from '@/modules/common/text-field';
import {
  Button,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {
  createStaffPaySlip,
  getLastPaySlipDateOfStaff,
  getStaffPaySlipCreateData,
} from '../../api';
type ActivityItem = {
  id: number | string;
  customer_name: string;
  service_name?: string;
  from_date_time: string;
  to_date_time: string;
  total_hour: number | string;
};
type QuickPayItem = { id: number | string; date: string; amount: string };
interface FormValues {
  account_id: string | number;
  branch_id: string | number;
  user_id: string | number;
  from_date: string;
  to_date: string;
  hour_price: string;
  activities: ActivityItem[];
  staffQuickPays: QuickPayItem[];
  invoice_status: 'draft' | 'finalised';
}

const AddStaffPaySlip = () => {
  const invalidate = useInvalidate();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [lastToDate, setLastToDate] = React.useState<Dayjs | null>(null);

  const handleFormSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    // Recompute totals to build backend-ready payload
    const totalHours = (values.activities || []).reduce(
      (acc, a) => acc + (parseFloat(String(a?.total_hour || 0)) || 0),
      0,
    );
    const staffHourRate = parseFloat(String(values.hour_price || 0)) || 0;
    const gross = Math.round(totalHours * staffHourRate);
    const quickPaysTotalCalc = (values.staffQuickPays || []).reduce(
      (acc: number, q) => acc + (parseFloat(q?.amount || '0') || 0),
      0,
    );
    const netTotalCalc = Math.round(gross - quickPaysTotalCalc);

    const deduct_price = quickPaysTotalCalc;

    const total_price = netTotalCalc;

    // new: explicit ids and flags
    const activity_ids = (values.activities || [])
      .map((a) => a.id)
      .filter(Boolean);
    const quickpay_ids = (values.staffQuickPays || [])
      .map((q) => q.id)
      .filter(Boolean);

    const payload = {
      user_id: values.user_id,
      account_id: user?.account_id,
      branch_id: user?.branch_id,
      from_date: toYYYYMMDD(values.from_date),
      to_date: toYYYYMMDD(values.to_date),
      total_hours: parseFloat(totalHours.toFixed(2)),
      hour_price: staffHourRate,
      total_price: parseFloat(String(total_price)),
      activity_ids,
      quickpay_ids,
      quickpay_total_amount: parseFloat(String(deduct_price)),
      invoice_status: values.invoice_status,
    } as const;
    try {
      const res = await createStaffPaySlip(payload);
      if (res.status) {
        resetForm();
        toast.success(messages.COMMONADDED('Staff Pay Slip'));
        await invalidate(['getStaffPaySlip']);
        router.push('/staff/pay-slip');
      }
    } catch (e) {}
  };

  const initialValues: FormValues = {
    account_id: '',
    branch_id: '',
    user_id: '',
    from_date: '',
    to_date: '',
    hour_price: '',
    activities: [],
    staffQuickPays: [],
    invoice_status: 'draft',
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        user_id: Yup.number().required(messages.REQUIRED),
        from_date: Yup.string().required(messages.REQUIRED),
        to_date: Yup.string().required(messages.REQUIRED),
        invoice_status: Yup.string()
          .oneOf(['draft', 'finalised'])
          .required(messages.REQUIRED),
        hour_price: Yup.string().required(),
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
        const totalHours = (values.activities || []).reduce(
          (acc: number, a: ActivityItem) =>
            acc + (parseFloat(String(a?.total_hour || 0)) || 0),
          0,
        );

        const gross = Math.round(
          totalHours * (parseFloat(String(values.hour_price || 0)) || 0),
        );

        const quickPaysTotalCalc = (values.staffQuickPays || []).reduce(
          (acc: number, q: QuickPayItem) =>
            acc + (parseFloat(q?.amount || '0') || 0),
          0,
        );

        const netTotalCalc = Math.round(gross - quickPaysTotalCalc);

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
              title={'Add Pay Slip'}
              breadcrumbs={[
                {
                  href: '/staff/pay-slip',
                  name: 'Pay Slips',
                },
                {
                  name: 'Add',
                },
              ]}
              back={
                <Link href={`/staff/pay-slip`}>
                  <Button type="button" variant="text">
                    Back to List
                  </Button>
                </Link>
              }
            ></PageLayout.Header>

            <PageLayout.Content>
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6 p-6">
                <PageLayout.FormSection
                  blur={false}
                  title={''}
                  editable={false}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StaffSearchAutocomplete
                        label="Staff"
                        name="user_id"
                        value={String(values.user_id ?? '')}
                        onChange={async (staffId) => {
                          setFieldValue('user_id', staffId);
                          try {
                            if (staffId) {
                              const lastInvoiceDate =
                                await getLastPaySlipDateOfStaff(staffId, {
                                  account_id: user?.account_id as number,
                                  branch_id: user?.branch_id as number,
                                });
                              if (lastInvoiceDate.status) {
                                const date = lastInvoiceDate.data?.data;
                                if (date && date.to_date) {
                                  setFieldValue(
                                    'from_date',
                                    dayjs(date.to_date).add(1, 'day'),
                                  );
                                  setLastToDate(dayjs(date.to_date));
                                } else {
                                  setLastToDate(null);
                                  setFieldValue('from_date', undefined);
                                  setFieldValue('to_date', undefined);
                                }
                              }
                            }
                          } catch (error) {
                            setLastToDate(null);
                          }
                        }}
                        error={Boolean(touched.user_id && errors.user_id)}
                        helperText={touched.user_id && errors.user_id}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePicker
                        name="from_date"
                        label="From Date"
                        maxDate={
                          lastToDate ? dayjs(lastToDate).add(1, 'day') : dayjs()
                        }
                        disabled={values.user_id ? false : true}
                        // minDate={lastToDate ? dayjs(lastToDate).add(1, 'day') : undefined}
                        onChange={() =>
                          (
                            setFieldValue as unknown as (
                              f: string,
                              v: unknown,
                            ) => void
                          )('to_date', undefined)
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePicker
                        name="to_date"
                        label="To Date"
                        minDate={
                          values.from_date ? dayjs(values.from_date) : dayjs()
                        }
                        maxDate={dayjs()}
                        disabled={values.from_date ? false : true}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Status"
                        name="invoice_status"
                        value={values.invoice_status}
                        onChange={(e) =>
                          setFieldValue('invoice_status', e.target.value)
                        }
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="finalised">Finalise</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </PageLayout.FormSection>
              </div>

              {/* Auto-fetch preview when staff + dates are set */}
              <AutoFetchPreview
                values={values}
                setFieldValue={setFieldValue}
                account_id={user?.account_id}
                branch_id={user?.branch_id}
                loading={loading}
                setLoading={setLoading}
              />

              {/* Payslip preview */}
              {values.activities?.length || values.staffQuickPays?.length ? (
                <div className="bg-white rounded-lg shadow-lg border border-gray-300 my-6 p-8 ">
                  {/* Payslip Header */}
                  <div className="flex justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold">Staff Payslip</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        From{' '}
                        <span className="font-bold">
                          {toDDMMYYYY(values.from_date)}
                        </span>{' '}
                        → To{' '}
                        <span className="font-bold">
                          {toDDMMYYYY(values.to_date)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Staff Info */}

                  <Grid container spacing={[2, 2]}>
                    <Grid
                      size={
                        values.activities?.length > 0
                          ? { xs: 12, sm: 6 }
                          : { xs: 12, sm: 12 }
                      }
                    >
                      {/* Activities Table */}
                      <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">
                          Activities
                        </h3>
                        <TableContainer sx={{ maxHeight: 300 }}>
                          <Table stickyHeader className="w-full text-sm border">
                            <TableHead>
                              <TableRow>
                                <TableCell className="px-3 py-2 text-left">
                                  Customer
                                </TableCell>
                                <TableCell className="px-3 py-2 text-left">
                                  Service
                                </TableCell>
                                <TableCell className="px-3 py-2 text-left">
                                  From Date
                                </TableCell>
                                <TableCell className="px-3 py-2 text-right">
                                  Hours
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(values.activities || []).map(
                                (a: ActivityItem, idx: number) => (
                                  <TableRow
                                    key={a.id || idx}
                                    className="border-t"
                                  >
                                    <TableCell className="px-3 py-2">
                                      {a.customer_name || '-'}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                      {a.service_name || '-'}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                      {toDDMMYYYY(a.from_date_time)}
                                    </TableCell>
                                    <TableCell className="px-3 py-2 text-right">
                                      {parseFloat(
                                        String(a.total_hour || 0),
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </Grid>
                    {(values.staffQuickPays?.length || 0) > 0 && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {/* Quick Pays */}
                        <div className="mb-6">
                          <h3 className="text-base font-semibold mb-2">
                            Quick Pays (Deductions)
                          </h3>
                          <TableContainer sx={{ maxHeight: 300 }}>
                            <Table
                              stickyHeader
                              className="w-full text-sm border"
                            >
                              <TableHead className="bg-gray-800">
                                <TableRow>
                                  <TableCell className="px-3 py-2 text-left">
                                    Date
                                  </TableCell>
                                  <TableCell className="px-3 py-2 text-right">
                                    Amount
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(values.staffQuickPays || []).map(
                                  (q: QuickPayItem, idx: number) => (
                                    <TableRow
                                      key={q.id || idx}
                                      className="border-t"
                                    >
                                      <TableCell className="px-3 py-2">
                                        {toDDMMYYYY(q.date)}
                                      </TableCell>
                                      <TableCell className="px-3 py-2 text-right">
                                        {parseFloat(
                                          String(q.amount || 0),
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      </Grid>
                    )}
                  </Grid>

                  {/* Summary Section */}

                  <Grid container spacing={[2, 2]} sx={{ borderTop: 1, pt: 2 }}>
                    {/* Total Hours */}
                    <Grid size={{ xs: 8 }} textAlign={'end'}>
                      <span className="text-sm text-gray-600">
                        Total Hours:
                      </span>
                    </Grid>
                    <Grid size={{ xs: 4 }} textAlign={'end'}>
                      <span className="font-medium">
                        {totalHours.toFixed(2)}
                      </span>
                    </Grid>

                    {/* Staff Hourly Rate */}
                    <Grid size={{ xs: 8 }} textAlign={'end'}>
                      <span className="text-sm text-gray-600">
                        Staff Hourly Rate:
                      </span>
                    </Grid>
                    <Grid size={{ xs: 4 }} textAlign={'end'}>
                      <NumberField
                        name="hour_price"
                        allowDecimal={true}
                        allowNegative={false}
                        decimalScale={2}
                        slotProps={{
                          input: {
                            style: { textAlign: 'right' },
                          },
                        }}
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '6px 6px',
                            width: '100px',
                            textAlign: 'end',
                          },
                        }}
                        placeholder="0"
                      />
                    </Grid>

                    {/* Gross */}
                    <Grid size={{ xs: 8 }} textAlign={'end'}>
                      <span className="text-sm text-gray-600">
                        Gross (Hours × Rate):
                      </span>
                    </Grid>
                    <Grid size={{ xs: 4 }} textAlign={'end'}>
                      <span className="font-medium">
                        {formatINR(gross, false)}
                      </span>
                    </Grid>

                    {/* Quick Pays Total */}
                    <Grid size={{ xs: 8 }} textAlign={'end'}>
                      <span className="text-sm text-gray-600">
                        Quick Pays Total:
                      </span>
                    </Grid>
                    <Grid size={{ xs: 4 }} textAlign={'end'}>
                      <span className="font-medium text-red-600">
                        {Number(quickPaysTotalCalc) > 0 ? '-' : ''}{' '}
                        {formatINR(quickPaysTotalCalc, false)}
                      </span>
                    </Grid>

                    {/* Net Total */}
                    <Grid size={{ xs: 8 }} textAlign={'end'}>
                      <span className="font-bold text-lg">Net Total:</span>
                    </Grid>
                    <Grid size={{ xs: 4 }} borderTop={1} textAlign={'end'}>
                      <span className="font-medium text-lg">
                        {formatINR(netTotalCalc, true)}
                      </span>
                    </Grid>
                  </Grid>
                </div>
              ) : !loading &&
                values.user_id &&
                values.from_date &&
                values.to_date ? (
                <div className="bg-white rounded-lg shadow-lg border border-gray-300 my-6 p-8 text-center text-sm text-gray-600">
                  No data found for the selected period.
                </div>
              ) : null}
            </PageLayout.Content>

            {/* <PageLayout.Footer> */}
            <PageContainer sx={{ px: 0 }}>
              <Button
                loading={isSubmitting}
                disabled={loading}
                type="submit"
                variant="contained"
                sx={{ mr: 2 }}
              >
                Save
              </Button>
              <Button
                onClick={() => router.push(`/staff/pay-slip`)}
                disabled={isSubmitting || loading}
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

type CreateData = {
  hasDraft?: boolean;
  staffHourRate?: number;
  activities?: ActivityItem[];
  staffQuickPays?: { id: number | string; date: string; amount: number }[];
};

const AutoFetchPreview = ({
  values,
  setFieldValue,
  account_id,
  branch_id,
  loading,
  setLoading,
}: {
  values: FormValues;
  setFieldValue: (field: string, value: unknown) => void;
  account_id?: number;
  branch_id?: number;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const prevKeyRef = React.useRef<string>('');

  React.useEffect(() => {
    const { user_id, from_date, to_date } = values || {};
    if (!user_id || !from_date || !to_date || !account_id || !branch_id) return;
    const key = `${user_id}-${from_date}-${to_date}-${account_id}-${branch_id}`;
    if (prevKeyRef.current === key) return;
    prevKeyRef.current = key;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getStaffPaySlipCreateData({
          user_id,
          account_id,
          branch_id,
          from_date: `${toYYYYMMDD(from_date)} 00:00:00`,
          to_date: `${toYYYYMMDD(to_date)} 23:59:59`,
        });
        const data = (res?.data?.data || {}) as CreateData;
        if (data.hasDraft) {
          setFieldValue('activities', []);
          setFieldValue('staffQuickPays', []);
          setFieldValue('staffHourRate', 0);
          toast.error(
            'A draft payslip already exists for this staff. Finalised it before creating a new one.',
          );
          return;
        }
        if (cancelled) return;
        setFieldValue('hour_price', String(data.staffHourRate) ?? '');
        setFieldValue('activities', data.activities || []);
        setFieldValue(
          'staffQuickPays',
          (data.staffQuickPays || []).map((q) => ({
            ...q,
            amount: String(q.amount),
          })),
        );
      } catch (e) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    values?.user_id,
    values?.from_date,
    values?.to_date,
    account_id,
    branch_id,
    setLoading,
    setFieldValue,
    values,
  ]);

  return loading ? (
    <div className="text-sm text-gray-500">Loading payslip data…</div>
  ) : null;
};

export default AddStaffPaySlip;
