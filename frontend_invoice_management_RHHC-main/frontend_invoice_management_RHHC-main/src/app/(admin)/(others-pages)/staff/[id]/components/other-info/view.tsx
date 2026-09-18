import PageLayout from '@/modules/common/components/page-layout';
import { Button, Box, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useUserEditPageContext } from '../../context';
import { useState } from 'react';
import { deleteStaffExperience } from '../../../api';
import { StaffExperience, StaffExperienceDocument } from '@/modules/common/models/staff';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { config } from '@/modules/common/config';
import ImageThumbnail from '@/modules/common/components/imageThumbnail/ImageThumbnail';
import StaffExperienceModal from '../../../components/StaffExperienceModal';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { AddRoundedIcon, DeleteRoundedIcon, EditRoundedIcon } from '../../../../../../../../packages/ui/icons';
import LongTextDisplay from '@/modules/common/components/long-text-display/LongTextDisplay';
import { formatMobile } from '@/modules/common/helpers/formatMobile';

interface ViewGeneralInformationProps {
  onEdit: () => void;
}

const ViewOtherInformation = ({ onEdit }: ViewGeneralInformationProps) => {
  const { activeSection, setEditId, experiences, refetchExperiences } = useUserEditPageContext();
  const [loading, setLoading] = useState(false);
  const [openExperienceModal, setOpenExperienceModal] = useState(false);

  const handleDelete = async (id: ID) => {
    setLoading(true);
    try {
      await deleteStaffExperience(id);
      await refetchExperiences();
    } finally {
      setLoading(false);
    }
    toast.success('Experience deleted');
  };

  const handleEditItem = (item: StaffExperience) => {
    setEditId(String(item.id));
    onEdit();
  };

  return (
    <>
      <PageLayout.FormSection
        blur={Boolean(activeSection)}
        onEdit={onEdit}
        title="Experience"
        sx={{ mt: 3 }}
        loading={loading}
        actions={
          <Button
            variant="contained"
            size="small"
            sx={{
              p: '8px',
              minWidth: '24px !important'
            }}
            onClick={() => setOpenExperienceModal(true)}
          >
            <AddRoundedIcon />
          </Button>
        }
      >
        <Grid container spacing={[2, 2]}>
          {experiences.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <div className="text-gray-500 text-sm">No experience added.</div>
            </Grid>
          )}
          {/* {experiences.map((it) => (
            <Grid key={it.id} size={{ xs: 12 }}>
              <div className="flex items-start justify-between border rounded p-3">
                <div className="space-y-1">
                  <div className="font-medium text-gray-800">
                    Organization: {capitalizeFirstLetter(it.org_name)}
                    {it.category_name && (
                      <> • Category: {capitalizeFirstLetter(it.category_name)}</>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    {dayjs(it.from_month_year).format('MMM YYYY')}
                    {' - '}
                    {it.is_currently_working ? 'Present' : dayjs(it.to_month_year).format('MMM YYYY')}
                    {' • '}
                    {it.total_experience_month} months
                  </div>
                  <div className="text-xs text-gray-600">
                    Currently Working: {it.is_currently_working ? 'Yes' : 'No'}
                  </div>
                  {it.description && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      Description: <LongTextDisplay title="Description" content={it.description} />
                    </div>
                  )}
                  {it.referral_details && (it.referral_details.name || it.referral_details.designation || it.referral_details.contact_no) && (
                    <div className="text-xs text-gray-600 mt-1">
                      Referral Details:{' '}
                      {[
                        it.referral_details.name && `Name: ${capitalizeFirstLetter(it.referral_details.name)}`,
                        it.referral_details.designation && `Designation: ${capitalizeFirstLetter(it.referral_details.designation)}`,
                        it.referral_details.contact_no && `Contact: ${formatMobile(it.referral_details.contact_no) || it.referral_details.contact_no}`
                      ].filter(Boolean).join(' • ')}
                    </div>
                  )}
                  {Array.isArray(it.documents) && it.documents.length > 0 && (
                    <div className="text-xs mt-1">
                      Documents:{' '}
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Doc Name</TableCell>
                            <TableCell>Doc Image</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {it.documents.map((d: StaffExperienceDocument, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{capitalizeFirstLetter(d.name)}</TableCell>
                              <TableCell>
                                {d.path ? (
                                  <ImageThumbnail
                                    src={`${config.api.baseUrl}${d.path}`}
                                  />
                                ) :
                                  "-"}

                              </TableCell>
                            </TableRow>

                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">

                  <EditRoundedIcon fontSize="small" sx={{
                    color: 'neutral.300',
                    cursor: 'pointer'
                  }}
                    onClick={() => handleEditItem(it)}
                  />
                  <DeleteRoundedIcon
                    sx={{
                      color: 'red',
                      fontSize: '16',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDelete(String(it.id))}
                  />
                </div>
              </div>
            </Grid>
          ))} */}
          {experiences.map((it) => (
            <Grid key={it.id} size={{ xs: 12 }}>
              <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">

                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {capitalizeFirstLetter(it.org_name)}
                    </h3>
                    {it.category_name && (
                      <p className="text-sm text-gray-600">
                        Category: {capitalizeFirstLetter(it.category_name)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <EditRoundedIcon
                      fontSize="small"
                      className="cursor-pointer text-gray-500 hover:text-blue-600"
                      onClick={() => handleEditItem(it)}
                    />
                    <DeleteRoundedIcon
                      fontSize="small"
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(String(it.id))}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-2 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">Duration:</span>{" "}
                    {dayjs(it.from_month_year).format("MMM YYYY")} -{" "}
                    {it.is_currently_working
                      ? "Present"
                      : dayjs(it.to_month_year).format("MMM YYYY")}
                    <span className="text-gray-500 ml-1">
                      ({it.total_experience_month} months)
                    </span>
                  </div>

                  <div className="mt-1">
                    <span className="font-semibold">Currently Working:</span>{" "}
                    {it.is_currently_working ? "Yes" : "No"}
                  </div>
                </div>

                {/* Description */}
                {it.description && (
                  <div className="mt-3 text-sm text-gray-700 flex align-center gap-1">
                    <span className="font-semibold">Description:</span>{" "}
                    <LongTextDisplay title="Description" content={it.description} />
                  </div>
                )}

                {/* Referral Details */}
                {it.referral_details &&
                  (it.referral_details.name ||
                    it.referral_details.designation ||
                    it.referral_details.contact_no) && (
                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <div className="font-semibold">Referral:</div>

                      {it.referral_details.name && (
                        <div>
                          <span className="font-semibold">Name:</span>{" "}
                          {capitalizeFirstLetter(it.referral_details.name)}
                        </div>
                      )}

                      {it.referral_details.designation && (
                        <div>
                          <span className="font-semibold">Designation:</span>{" "}
                          {capitalizeFirstLetter(it.referral_details.designation)}
                        </div>
                      )}

                      {it.referral_details.contact_no && (
                        <div>
                          <span className="font-semibold">Contact:</span>{" "}
                          {formatMobile(it.referral_details.contact_no) ||
                            it.referral_details.contact_no}
                        </div>
                      )}
                    </div>
                  )}

                {/* Documents */}
                {Array.isArray(it.documents) && it.documents.length > 0 && (
                  <div className="mt-4">
                    <span className="font-semibold">Documents:</span>{" "}
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Doc Name</TableCell>
                            <TableCell>Preview</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {it.documents.map((d: StaffExperienceDocument, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{capitalizeFirstLetter(d.name)}</TableCell>
                              <TableCell>
                                {d.path ? (
                                  <ImageThumbnail src={`${config.api.baseUrl}${d.path}`} />
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </div>
            </Grid>
          ))}

        </Grid>
      </PageLayout.FormSection>

      <Modal open={openExperienceModal} onClose={(() => setOpenExperienceModal(false))}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 700,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: "auto"
          }}
        >
          <StaffExperienceModal onClose={async () => { setOpenExperienceModal(false); await refetchExperiences(); }} />
        </Box>
      </Modal>
    </>
  );
};

export default ViewOtherInformation;