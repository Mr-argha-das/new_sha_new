'use client';

import DateTimePicker from '@/modules/common/date-time-picker';
import NumberField from '@/modules/common/NumberField';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { Form, Formik, useFormikContext } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { adjustStaffActivityTime } from '../../../api';

type Props = {
  taskId: ID;
  initialStart?: string | null;
  initialEnd?: string | null;
  initialTotalHour?: number | string | null;
  fromDateTime?: string | null;
  toDateTime?: string | null;
  staffWorkingHours?: number | string | null;
  taskHolds?: Array<{
    id: number;
    hold_start_at: string;
    hold_end_at: string | null;
    duration_minutes: number;
  }>;
  onCancel: () => void;
  onSuccess?: () => void;
};

type FormValues = {
  start_date_time: string;
  end_date_time: string;
  total_hour: string;
};

const schema = Yup.object({
  start_date_time: Yup.string().required('Required'),
  end_date_time: Yup.string().required('Required'),
  total_hour: Yup.number().typeError('Invalid').min(0).required('Required'),
}).test('end-after-start', 'End time must be after start time', (values) => {
  if (!values) return true;
  const start = dayjs(values.start_date_time);
  const end = dayjs(values.end_date_time);
  if (!start.isValid() || !end.isValid()) return true;
  return end.isAfter(start) || end.isSame(start);
});

export default function AdjustActivityTimeModal({
  taskId,
  initialStart,
  initialEnd,
  initialTotalHour,
  fromDateTime,
  toDateTime,
  staffWorkingHours,
  taskHolds,
  onCancel,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const holds = useMemo(() => {
    return (taskHolds || []).slice().sort((a, b) => {
      return (
        dayjs(a.hold_start_at).valueOf() - dayjs(b.hold_start_at).valueOf()
      );
    });
  }, [taskHolds]);

  type HoldDraftRow = {
    key: string;
    hold_start_at: string; // local datetime string: YYYY-MM-DDTHH:mm
    hold_end_at: string; // local datetime string or ''
  };

  const [holdRows, setHoldRows] = useState<HoldDraftRow[]>([]);

  const NetHoursSync = () => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    useEffect(() => {
      if (!values.start_date_time || !values.end_date_time) return;
      const net = calcNetHours(values.start_date_time, values.end_date_time, holdRows);
      const next = String(net.toFixed(4));
      if (values.total_hour !== next) setFieldValue('total_hour', next);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.start_date_time, values.end_date_time, holdRows, values.total_hour, setFieldValue]);
    return null;
  };

  useEffect(() => {
    // initialise editable rows from backend rows
    const initial: HoldDraftRow[] = holds.map((h) => {
      const start = dayjs(h.hold_start_at);
      const end = h.hold_end_at ? dayjs(h.hold_end_at) : null;
      return {
        key: String(h.id),
        hold_start_at: start.isValid() ? start.format('YYYY-MM-DDTHH:mm') : '',
        hold_end_at: end && end.isValid() ? end.format('YYYY-MM-DDTHH:mm') : '',
      };
    });
    setHoldRows(initial);
  }, [holds]);

  const addHoldRow = () => {
    setHoldRows((p) => [
      ...p,
      {
        key: `new-${Date.now()}`,
        hold_start_at: '',
        hold_end_at: '',
      },
    ]);
  };

  const calcMinutes = (row: HoldDraftRow) => {
    const start = dayjs(row.hold_start_at);
    const end = row.hold_end_at ? dayjs(row.hold_end_at) : null;
    if (!start.isValid() || !end || !end.isValid()) return 0;
    const mins = Math.floor(end.diff(start, 'minute', true));
    return Math.max(0, mins);
  };

  const calcNetHours = (
    startIso: string,
    endIso: string,
    rows: HoldDraftRow[],
  ) => {
    const start = dayjs(startIso);
    const end = dayjs(endIso);
    if (!start.isValid() || !end.isValid()) return 0;
    const grossMins = Math.max(0, end.diff(start, 'minute'));
    const holdMins = rows.reduce((acc, r) => acc + calcMinutes(r), 0);
    const netMins = Math.max(0, grossMins - holdMins);
    return netMins / 60;
  };

  const derivedStart = initialStart || fromDateTime || null;
  const derivedEnd =
    initialEnd ||
    toDateTime ||
    (fromDateTime &&
      staffWorkingHours !== null &&
      staffWorkingHours !== undefined
      ? dayjs(fromDateTime)
        .add(Number(staffWorkingHours) || 0, 'hour')
        .toISOString()
      : null);

  const derivedTotal =
    initialTotalHour ??
    (derivedStart && derivedEnd
      ? dayjs(derivedEnd).diff(dayjs(derivedStart), 'hour', true)
      : null);

  const initialValues: FormValues = {
    start_date_time: derivedStart ?? '',
    end_date_time: derivedEnd ?? '',
    total_hour: String(derivedTotal ?? '0'),
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // validate hold rows are within task start/end
      const taskStart = dayjs(values.start_date_time);
      const taskEnd = dayjs(values.end_date_time);
      for (const r of holdRows) {
        if (!r.hold_start_at) continue;
        const hs = dayjs(r.hold_start_at);
        const he = r.hold_end_at ? dayjs(r.hold_end_at) : null;
        if (!hs.isValid()) {
          toast.error('Invalid Hold Start');
          return;
        }
        if (he && !he.isValid()) {
          toast.error('Invalid Hold End');
          return;
        }
        if (he && he.isBefore(hs)) {
          toast.error('Hold End must be after Hold Start');
          return;
        }
        if (taskStart.isValid() && hs.isBefore(taskStart)) {
          toast.error('Hold Start must be after Staff Started At');
          return;
        }
        if (taskEnd.isValid() && he && he.isAfter(taskEnd)) {
          toast.error('Hold End must be before Staff Ended At');
          return;
        }
        if (taskEnd.isValid() && !he) {
          toast.error('Please set Hold End for all rows');
          return;
        }
      }

      const payload = {
        start_date_time: dayjs(values.start_date_time).toISOString(),
        end_date_time: dayjs(values.end_date_time).toISOString(),
        total_hour: Number(values.total_hour || 0),
        task_holds: holdRows
          .filter((r) => String(r.hold_start_at || '').trim() !== '')
          .map((r) => ({
            hold_start_at: dayjs(r.hold_start_at).toISOString(),
            hold_end_at: r.hold_end_at ? dayjs(r.hold_end_at).toISOString() : null,
          })),
      };
      const res = await adjustStaffActivityTime(String(taskId), payload);
      if (res.status) {
        toast.success(res.data?.message || 'Activity time adjusted');
        onSuccess?.();
        onCancel();
      } else {
        toast.error(res.data?.message || 'Failed to adjust time');
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <NetHoursSync />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateTimePicker
                name="start_date_time"
                label="Staff Started At"
                onChange={(v) => {
                  const iso = v?.toISOString() || '';
                  setFieldValue('start_date_time', iso);
                  const hours = Number(values.total_hour || 0);
                  if (iso && !Number.isNaN(hours) && hours > 0) {
                    const newEnd = dayjs(iso).add(hours, 'hour').toISOString();
                    setFieldValue('end_date_time', newEnd);
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateTimePicker
                name="end_date_time"
                label="Staff Ended At"
                onChange={(v) => {
                  const iso = v?.toISOString() || '';
                  setFieldValue('end_date_time', iso);
                  if (values.start_date_time && iso) {
                    const net = calcNetHours(values.start_date_time, iso, holdRows);
                    setFieldValue('total_hour', String(net.toFixed(4)));
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <NumberField
                fullWidth
                label="Total Hour"
                name="total_hour"
                allowNegative={false}
                allowDecimal
                decimalScale={4}
                disabled
                onChange={() => {}}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Hold Rows (Duration not editable)
                  </Typography>
                  <Button size="small" variant="outlined" onClick={addHoldRow}>
                    + Add Hold
                  </Button>
                </Box>
                {holdRows.length ? (
                  <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 720 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Hold Start</TableCell>
                          <TableCell>Hold End</TableCell>
                          <TableCell>Duration (minutes)</TableCell>
                          <TableCell align="right"> </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {holdRows.map((r, idx) => (
                          <TableRow key={r.key}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="datetime-local"
                                value={r.hold_start_at}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setHoldRows((p) =>
                                    p.map((x) =>
                                      x.key === r.key ? { ...x, hold_start_at: v } : x,
                                    ),
                                  );
                                  if (values.start_date_time && values.end_date_time) {
                                    const nextRows = holdRows.map((x) =>
                                      x.key === r.key ? { ...x, hold_start_at: v } : x,
                                    );
                                    const net = calcNetHours(
                                      values.start_date_time,
                                      values.end_date_time,
                                      nextRows,
                                    );
                                    setFieldValue('total_hour', String(net.toFixed(4)));
                                  }
                                }}
                                sx={{ minWidth: 210 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="datetime-local"
                                value={r.hold_end_at}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setHoldRows((p) =>
                                    p.map((x) =>
                                      x.key === r.key ? { ...x, hold_end_at: v } : x,
                                    ),
                                  );
                                  if (values.start_date_time && values.end_date_time) {
                                    const nextRows = holdRows.map((x) =>
                                      x.key === r.key ? { ...x, hold_end_at: v } : x,
                                    );
                                    const net = calcNetHours(
                                      values.start_date_time,
                                      values.end_date_time,
                                      nextRows,
                                    );
                                    setFieldValue('total_hour', String(net.toFixed(4)));
                                  }
                                }}
                                sx={{ minWidth: 210 }}
                              />
                            </TableCell>
                            <TableCell>{calcMinutes(r)}</TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setHoldRows((p) =>
                                    p.filter((x) => x.key !== r.key),
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hold rows.
                  </Typography>
                )}
              </Box>
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
                    {loading || isSubmitting ? 'Saving...' : 'Save'}
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
