'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import NumberField from '@/modules/common/NumberField';
import StaffSearchAutocomplete from '@/modules/common/staff-search-autocomplete';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import {
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {
  getLastPaySlipDateOfStaff,
  getStaffPaySlipCreateData,
  updateStaffPaySlip,
} from '../../../../api';
import { usePayslip } from '../../context';

interface EditProps {
  onCancel: () => void;
  onSave: () => void;
}

const EditGeneralInformation: React.FC<EditProps> = ({ onCancel, onSave }) => {
  const { invoice } = usePayslip();
  const { user: loggedUser } = useAuth();
  const invalidate = useInvalidate();
  const [loading, setLoading] = React.useState(false);
  const [lastToDate, setLastToDate] = React.useState<string | null>(null);

  type PayslipFormValues = {
    user_id: string;
    from_date: string;
    to_date: string;
    invoice_status: 'draft' | 'finalised';
    hour_price: number;
    activities: Array<{
      id: number;
      total_hour: number;
      service_name?: string;
    }>;
    staffQuickPays: Array<{ id: number; date: string; amount: string }>;
    account_id?: number;
    branch_id?: number;
  };

  const initialValues: PayslipFormValues = {
    user_id: String(invoice?.invoice.user_id ?? ''),
    from_date: dayjs(invoice?.invoice.from_date).format('YYYY/MM/DD'),
    to_date: dayjs(invoice?.invoice.to_date).format('YYYY/MM/DD'),
    invoice_status: invoice?.invoice.invoice_status as 'draft' | 'finalised',
    hour_price: Number(invoice?.invoice.hour_price ?? 0),
    activities: [],
    staffQuickPays: [],
    account_id: loggedUser?.account_id,
    branch_id: loggedUser?.branch_id,
  };

  React.useEffect(() => {
    const fetchLastInvoiceDate = async () => {
      if (
        !initialValues.user_id ||
        !loggedUser?.account_id ||
        !loggedUser?.branch_id
      )
        return;
      try {
        const lastInvoiceDate = await getLastPaySlipDateOfStaff(
          initialValues.user_id,
          {
            account_id: loggedUser.account_id,
            branch_id: loggedUser.branch_id,
          },
        );
        if (lastInvoiceDate.status) {
          const date = lastInvoiceDate.data?.data;
          if (date && date.to_date) {
            setLastToDate(date.to_date);
          } else {
            setLastToDate(null);
          }
        } else {
          setLastToDate(null);
        }
      } catch (error) {
        setLastToDate(null);
      }
    };
    fetchLastInvoiceDate();
  }, [initialValues.user_id, loggedUser?.account_id, loggedUser?.branch_id]);

  const handleFormSubmit = async (
    values: PayslipFormValues,
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
      account_id: loggedUser?.account_id,
      branch_id: loggedUser?.branch_id,
      from_date: values.from_date,
      to_date: values.to_date,
      total_hours: parseFloat(totalHours.toFixed(2)),
      hour_price: staffHourRate,
      total_price: parseFloat(String(total_price)),
      activity_ids,
      quickpay_ids,
      quickpay_total_amount: parseFloat(String(deduct_price)),
      invoice_status: values.invoice_status,
    } as const;
    try {
      const res = await updateStaffPaySlip(
        String(invoice?.invoice.id ?? ''),
        payload,
      );
      if (res.status) {
        resetForm();
        toast.success(messages.COMMONUPDATE('Staff Pay Slip'));
        await invalidate(['getStaffPaySlipById']);
        onSave();
      }
    } catch (e) {}
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
        hour_price: Yup.number().required(),
      })}
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({
        handleReset,
        handleSubmit,
        values,
        setFieldValue,
        errors,
        touched,
      }) => {
        // derive totals
        const totalHours = (values.activities || []).reduce(
          (acc: number, a) =>
            acc + (parseFloat(String(a?.total_hour || 0)) || 0),
          0,
        );
        const gross = Math.round(
          totalHours * (parseFloat(String(values.hour_price || 0)) || 0),
        );

        const quickPaysTotalCalc = (values.staffQuickPays || []).reduce(
          (acc: number, q) => acc + (parseFloat(q?.amount || '0') || 0),
          0,
        );

        const netTotalCalc = Math.round(gross - quickPaysTotalCalc);

        return (
          <Form onReset={handleReset} onSubmit={handleSubmit}>
            <PageLayout.FormSection
              mode={Mode.EDIT}
              onCancel={onCancel}
              title="General Information"
              sx={{ mt: 3 }}
            >
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6 p-6">
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
                                account_id: loggedUser?.account_id as number,
                                branch_id: loggedUser?.branch_id as number,
                              });
                            if (lastInvoiceDate.status) {
                              const date = lastInvoiceDate.data?.data;
                              if (date && date.to_date) {
                                setFieldValue(
                                  'from_date',
                                  dayjs(date.to_date).format('YYYY-MM-DD'),
                                );
                                setLastToDate(date.to_date);
                              } else {
                                setLastToDate(null);
                                setFieldValue('from_date', undefined);
                                setFieldValue('to_date', undefined);
                              }
                            } else {
                              setLastToDate(null);
                            }
                          }
                        } catch (error) {
                          setLastToDate(null);
                          setFieldValue('from_date', undefined);
                          setFieldValue('to_date', undefined);
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
                      minDate={
                        lastToDate ? dayjs(lastToDate).add(1, 'day') : undefined
                      }
                      onChange={() => setFieldValue('to_date', undefined)}
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
                      onChange={(e) =>
                        setFieldValue('invoice_status', e.target.value)
                      }
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="finalised">Finalise</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </div>

              {/* Auto-fetch preview when staff + dates are set */}
              <AutoFetchPreview
                values={values}
                setFieldValue={setFieldValue}
                account_id={loggedUser?.account_id}
                branch_id={loggedUser?.branch_id}
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
                      <p className="text-sm">Period:</p>
                      <p className="text-sm font-medium">
                        {toDDMMYYYY(values.from_date)} →{' '}
                        {toDDMMYYYY(values.to_date)}
                      </p>
                    </div>
                  </div>

                  {/* Staff Info */}

                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {/* Activities Table */}
                      <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">
                          Activities
                        </h3>
                        <Table className="w-full text-sm border">
                          <TableHead className="bg-gray-100">
                            <TableRow>
                              <TableCell className="px-3 py-2 text-left">
                                Service
                              </TableCell>
                              <TableCell className="px-3 py-2 text-right">
                                Hours
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(values.activities || []).map(
                              (
                                a: PayslipFormValues['activities'][number],
                                idx: number,
                              ) => (
                                <TableRow
                                  key={a.id || idx}
                                  className="border-t"
                                >
                                  <TableCell className="px-3 py-2">
                                    {a.service_name || '-'}
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
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {/* Quick Pays */}
                      <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2">
                          Quick Pays (Deductions)
                        </h3>
                        <Table className="w-full text-sm border">
                          <TableHead className="bg-gray-100">
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
                              (q, idx: number) => (
                                <TableRow
                                  key={q.id || idx}
                                  className="border-t"
                                >
                                  <TableCell className="px-3 py-2">
                                    {toDDMMYYYY(q.date)}
                                  </TableCell>
                                  <TableCell className="px-3 py-2 text-right">
                                    {parseFloat(String(q.amount || 0)).toFixed(
                                      2,
                                    )}
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </Grid>
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
                      <span className="font-medium">{gross}</span>
                    </Grid>

                    {/* Quick Pays Total */}
                    <Grid size={{ xs: 8 }} textAlign={'end'}>
                      <span className="text-sm text-gray-600">
                        Quick Pays Total:
                      </span>
                    </Grid>
                    <Grid size={{ xs: 4 }} textAlign={'end'}>
                      <span className="font-medium">
                        - {quickPaysTotalCalc}
                      </span>
                    </Grid>

                    {/* Net Total */}
                    <Grid size={{ xs: 8 }} textAlign={'end'}>
                      <span className="font-bold text-lg">Net Total:</span>
                    </Grid>
                    <Grid size={{ xs: 4 }} textAlign={'end'}>
                      <span className="font-medium text-lg">
                        {netTotalCalc}
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
            </PageLayout.FormSection>
          </Form>
        );
      }}
    </Formik>
  );
};

const AutoFetchPreview = ({
  values,
  setFieldValue,
  account_id,
  branch_id,
  loading,
  setLoading,
}: {
  values: PayslipFormValues;
  setFieldValue: (
    field: keyof PayslipFormValues,
    value: PayslipFormValues[keyof PayslipFormValues],
  ) => void;
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
          from_date: `${from_date} 00:00:00`,
          to_date: `${to_date} 23:59:59`,
        });
        if (res.status) {
          const data = (res?.data?.data || {}) as {
            activities?: Array<{
              id: number;
              total_hour: number;
              service_name?: string;
            }>;
            staffQuickPays?: Array<{
              id: number;
              date: string;
              amount: number;
            }>;
          };
          setFieldValue(
            'activities',
            (data?.activities || []) as PayslipFormValues['activities'],
          );
          setFieldValue(
            'staffQuickPays',
            (data?.staffQuickPays || []).map((q) => ({
              ...q,
              amount: String(q.amount),
            })) as PayslipFormValues['staffQuickPays'],
          );
          setLoading(false);
        }
      } catch (e) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values?.user_id,
    values?.from_date,
    values?.to_date,
    account_id,
    branch_id,
  ]);

  return loading ? (
    <div className="text-sm text-gray-500">Loading payslip data…</div>
  ) : null;
};

export default EditGeneralInformation;
