import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { defaultRoles } from '@/modules/common/constant/messages';
import {
  addrToString,
  formatHoursToHrMin,
  formatINR,
} from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import {
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTaskContext } from '../../context';
import AdjustActivityTimeModal from '../AdjustActivityTimeModal';

interface ViewGeneralInformationProps {
  onEdit: () => void;
}

const ViewGeneralInformation: React.FC<ViewGeneralInformationProps> = ({
  onEdit,
}) => {
  const { task } = useTaskContext();
  const { user } = useAuth();
  const invalidate = useInvalidate();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [notePopupOpen, setNotePopupOpen] = useState(false);
  const [notePopupText, setNotePopupText] = useState<string>('');

  const isSupAdmin = Number(user?.role_id) === defaultRoles.supAdmin_role_id;
  return (
    <>
      <PageLayout.FormSection
        onEdit={onEdit}
        editable={
          isSupAdmin && task?.status === 'onHold'
        }
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography variant="h5">General Information</Typography>
            {isSupAdmin && (
              <Button
                size="small"
                variant="contained"
                onClick={() => setAdjustOpen(true)}
                disabled={!task}
                sx={{ fontSize: '14px', height: '28px' }}
              >
                Adjust Time
              </Button>
            )}
          </Box>
        }
        sx={{ mt: 3 }}
      >
        <Grid container spacing={[2, 2]}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail label="Staff" value={task?.staff_name ?? ''} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Customer"
              value={task?.customer_name ?? ''}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail label="Service" value={task?.service_name ?? ''} />
          </Grid>

          {Number(user?.role_id) !== defaultRoles.staff_role_id && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <ResourceDetail
                label="Service Price"
                value={formatINR(task?.service_price ?? 0, true)}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="From"
              value={dayjs(task?.from_date_time ?? '').format(
                'DD/MM/YYYY hh:mm',
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="To"
              value={dayjs(task?.to_date_time).format('DD/MM/YYYY hh:mm')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Required In(hours)"
              value={formatHoursToHrMin(task?.staff_working_hours ?? 0)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Staff Started At"
              value={
                task?.start_date_time
                  ? dayjs(task?.start_date_time).format('DD/MM/YYYY hh:mm')
                  : 'N/A'
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Staff Ended At"
              value={
                task?.end_date_time
                  ? dayjs(task?.end_date_time).format('DD/MM/YYYY hh:mm')
                  : 'N/A'
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Completed In(hours)"
              value={formatHoursToHrMin(Number(task?.total_hour ?? 0))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Total Hold Time"
              value={formatHoursToHrMin(
                Number(task?.total_hold_minutes ?? 0) / 60,
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Customer Address"
              value={addrToString(task?.customer_address ?? undefined)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Staff Payment Status"
              value={chipLable(
                Number(task?.payment_status ?? 0) === 1 ? 'paid' : 'unpaid',
              )}
              isComponent
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ResourceDetail
              label="Status"
              value={chipLable(task?.status ?? '')}
              isComponent
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ResourceDetail
              label="Note By Staff"
              value={task?.note_by_staff ?? '-'}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Hold History
            </Typography>

            {(task?.task_holds || []).length ? (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Hold Start</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Hold End</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Duration (min)</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(task?.task_holds || []).map((h, idx) => (
                      <TableRow key={String(h.id)}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          {dayjs(h.hold_start_at).format('DD/MM/YYYY hh:mm')}
                        </TableCell>
                        <TableCell>
                          {h.hold_end_at
                            ? dayjs(h.hold_end_at).format('DD/MM/YYYY hh:mm')
                            : '—'}
                        </TableCell>
                        <TableCell>{Number(h.duration_minutes ?? 0)}</TableCell>
                        <TableCell>
                          {h.notes ? (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setNotePopupText(String(h.notes || ''));
                                setNotePopupOpen(true);
                              }}
                            >
                              View Notes
                            </Button>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No hold history.
              </Typography>
            )}
          </Grid>
        </Grid>
      </PageLayout.FormSection>

      <Modal open={notePopupOpen} onClose={() => setNotePopupOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 720,
            width: 'calc(100% - 32px)',
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notes
            </Typography>
            <Button size="small" variant="outlined" onClick={() => setNotePopupOpen(false)}>
              Close
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {notePopupText || '—'}
          </Typography>
        </Box>
      </Modal>

      <Modal open={adjustOpen} onClose={() => setAdjustOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 1100,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
            Adjust Activity Time
          </h4>
          {task && (
            <AdjustActivityTimeModal
              taskId={String(task.id)}
              initialStart={task.start_date_time}
              initialEnd={task.end_date_time}
              initialTotalHour={task.total_hour}
              fromDateTime={task.from_date_time}
              toDateTime={task.to_date_time}
              staffWorkingHours={task.staff_working_hours}
              taskHolds={task.task_holds || []}
              onCancel={() => setAdjustOpen(false)}
              onSuccess={async () => {
                await invalidate(['getStaffTaskByID', String(task.id)]);
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ViewGeneralInformation;
