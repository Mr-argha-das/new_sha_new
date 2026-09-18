import { AddressInputValues } from '@/modules/common/address-input';
import ImageThumbnail from '@/modules/common/components/imageThumbnail/ImageThumbnail';
import LongTextDisplay from '@/modules/common/components/long-text-display/LongTextDisplay';
import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { config } from '@/modules/common/config';
import {
  capitalizeFirstLetter,
  capitalizeWords,
} from '@/modules/common/helpers/capitalizeWords';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import { formatINR } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import DeleteConfirmationButton from '../../../../../../../../packages/ui/components/delete-confirmation/button';
import {
  AddRoundedIcon,
  EditRoundedIcon,
} from '../../../../../../../../packages/ui/icons';
import { deleteStaffQualification, StaffQualification } from '../../../api';
import QualificationModal from '../../../components/QualificationModal';
import Quickpay from '../../../components/quickpay';
import { useUserEditPageContext } from '../../context';
interface ViewGeneralInformationProps {
  onEdit: () => void;
}

const ViewGeneralInformation = ({ onEdit }: ViewGeneralInformationProps) => {
  const { user, activeSection, experiences, setLoading } =
    useUserEditPageContext();
  const [addQualificationModalOpen, setAddQualificationModalOpen] =
    useState(false);
  const [editingQualification, setEditingQualification] =
    useState<StaffQualification | null>(null);
  const invalidate = useInvalidate();

  const qualifications: StaffQualification[] = user?.qualifications || [];

  const addrToString = (addr?: AddressInputValues | null) => {
    if (!addr) return '—';
    const city = addr.city?.label;
    const state = addr.state?.label;
    const country = addr.country?.label;
    const parts = [
      addr.title,
      addr.line1,
      addr.line2,
      city,
      state,
      country,
      addr.pinCode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <PageLayout.FormSection
      blur={Boolean(activeSection)}
      onEdit={onEdit}
      title="General Information"
      sx={{ mt: 3 }}
    >
      <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Name" value={capitalizeWords(user?.name)} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Mobile"
            value={formatMobile(user?.mobile ?? '')}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Email" value={user?.email} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Reference Relationship"
            value={user?.reference_relationship ?? ''}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Reference Mobile 1"
            value={formatMobile(user?.reference_mobile_1 ?? '')}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Reference Mobile 2"
            value={formatMobile(user?.reference_mobile_2 ?? '')}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Has Vehicle"
            value={user?.has_vehicle === 1 ? 'Yes' : 'No'}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Has Driving License"
            value={user?.has_vehicle === 1 ? 'Yes' : 'No'}
          />
        </Grid>

        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Hour Price"
            value={formatINR(user?.hour_price, true)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Working Hours" value={user?.working_hours} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Date of Birth"
            value={
              user?.date_of_birth
                ? new Date(user.date_of_birth).toLocaleDateString()
                : ''
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Marital Status"
            value={
              user?.marital_status ? capitalizeWords(user.marital_status) : ''
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Designation"
            value={user?.designation ? capitalizeWords(user.designation) : ''}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Police Verification"
            value={user?.police_verification === 1 ? 'Yes' : 'No'}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Medical Verification"
            value={user?.medical_verification === 1 ? 'Yes' : 'No'}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Total Experience"
            value={
              experiences?.length
                ? `${(experiences.reduce((acc, curr) => acc + curr.total_experience_month, 0) / 12).toFixed(1)} years`
                : ''
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            isComponent={true}
            label="Status"
            value={chipLable(user?.status ?? '')}
          />
        </Grid>
        {((user?.status ?? '') as string) === 'block' && (
          <>
            <Grid size={{ lg: 4, xs: 12 }}>
              <ResourceDetail
                label="Block Reason"
                isComponent={true}
                value={
                  <LongTextDisplay
                    title="Block Reason"
                    content={user?.block_reason ?? ''}
                  />
                }
              />
            </Grid>
          </>
        )}
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Aadhaar Number"
            value={user?.aadhar_number ?? ''}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="PAN Number" value={user?.pan_number ?? ''} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Driving License Number"
            value={
              user?.has_driving_license === 1
                ? (user?.driving_license_number ?? '')
                : ''
            }
          />
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <ResourceDetail
            label="Permanent Address"
            value={addrToString(user?.permanent_address)}
          />
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <ResourceDetail
            label="Temporary Address"
            value={addrToString(user?.temporary_address)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Photo"
            value={
              user?.photo_url ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${user?.photo_url}`}
                  alt="Photo"
                />
              ) : (
                'Not Available'
              )
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Aadhar Card"
            value={
              user?.aadhar_card_url ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${user?.aadhar_card_url}`}
                  alt="Aadhar Card"
                />
              ) : (
                'Not Available'
              )
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Pan Card"
            value={
              user?.pan_card_url ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${user?.pan_card_url}`}
                  alt="Pan Card"
                />
              ) : (
                'Not Available'
              )
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Driving License"
            value={
              user?.driving_license_url ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${user?.driving_license_url}`}
                  alt="Driving License"
                />
              ) : (
                'Not Available'
              )
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Reference Aadhar"
            value={
              user?.reference_aadhar_url ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${user?.reference_aadhar_url}`}
                  alt="Reference Aadhar"
                />
              ) : (
                'Not Available'
              )
            }
          />
        </Grid>
      </Grid>

      {/* Qualifications Section */}
      <Grid container spacing={[2, 2]} sx={{ mb: 6, mt: 4 }}>
        <Grid size={{ xs: 12 }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ maxHeight: 300 }}
          >
            <Box
              sx={{
                p: 1.5,
                borderBottom: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Qualifications
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  p: '8px',
                  minWidth: '24px !important',
                }}
                onClick={() => {
                  setEditingQualification(null);
                  setAddQualificationModalOpen(true);
                }}
              >
                <AddRoundedIcon />
              </Button>
            </Box>

            {qualifications.length > 0 ? (
              <Table size="small" aria-label="qualifications" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Registration No</TableCell>
                    <TableCell>Year of Passout</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qualifications.map((qual, idx) => (
                    <TableRow key={qual.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(qual.qualification_type) || '-'}
                      </TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(qual.qualification_name) || '-'}
                      </TableCell>
                      <TableCell>{qual.registration_no || '-'}</TableCell>
                      <TableCell>{qual.year_of_passout || '-'}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingQualification(qual);
                              setAddQualificationModalOpen(true);
                            }}
                            sx={{ color: '#1976d2' }}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                          <DeleteConfirmationButton
                            message="qualification"
                            iconColor="neutral.500"
                            opacity="1"
                            resourceId={String(qual.id)}
                            onDelete={async () => {
                              try {
                                setLoading(true);
                                const res = await deleteStaffQualification(
                                  String(qual.id),
                                );
                                if (res.status) {
                                  await invalidate(['getUserById']);
                                  await invalidate([
                                    'getStaffQualifications',
                                    user?.id,
                                  ]);
                                }
                                setLoading(false);
                              } catch (error) {
                                setLoading(false);
                              }
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography
                variant="body1"
                sx={{ textAlign: 'center', mt: 2, color: 'gray' }}
              >
                No qualifications found
              </Typography>
            )}
          </TableContainer>
        </Grid>
      </Grid>

      {/* Qualification Modal */}
      <Modal
        open={addQualificationModalOpen}
        onClose={() => setAddQualificationModalOpen(false)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 350, sm: 600 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingQualification ? 'Edit Qualification' : 'Add Qualification'}
          </Typography>
          <QualificationModal
            staffId={user?.id ?? ''}
            qualification={editingQualification}
            onClose={() => {
              setAddQualificationModalOpen(false);
              setEditingQualification(null);
            }}
          />
        </Box>
      </Modal>

      <Quickpay userId={user?.id ?? ''} />
    </PageLayout.FormSection>
  );
};

export default ViewGeneralInformation;
