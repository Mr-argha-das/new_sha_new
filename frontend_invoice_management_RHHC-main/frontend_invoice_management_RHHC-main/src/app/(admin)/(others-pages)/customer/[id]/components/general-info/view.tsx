import ImageThumbnail from '@/modules/common/components/imageThumbnail/ImageThumbnail';
import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { config } from '@/modules/common/config';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useUserEditPageContext } from '../../context';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import Link from 'next/link';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { chipLable } from '@/modules/common/helpers/helpers';
import { formatINR } from '@/modules/common/helpers/helper';
import { AddressInputValues } from '@/modules/common/address-input';
import { LeadStatus } from '@/modules/common/models/lead';
import { addrToString } from '@/modules/common/helpers/helper';

interface ViewGeneralInformationProps {
  onEdit: () => void;
}

const ViewGeneralInformation = ({ onEdit }: ViewGeneralInformationProps) => {
  const { user, activeSection } = useUserEditPageContext();

  const leads = user?.leads;
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
          <ResourceDetail label="Mobile" value={formatMobile(String(user?.mobile))} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Email" value={user?.email} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Age" value={capitalizeWords(user?.age)} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Gender" value={capitalizeWords(user?.gender)} />
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <ResourceDetail
            label="Permanent Address"
            value={addrToString(user?.permanent_address as AddressInputValues)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Aadhaar Number" value={user?.aadhar_number ?? ''} />
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
            label="Reference Relationship"
            value={user?.reference_relationship ? capitalizeWords(user.reference_relationship) : ''}
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

        <TableContainer component={Paper} variant="outlined">
          <Box sx={{ p: 1.5, borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Leads
            </Typography>
          </Box>
          <Table size="small" aria-label="lead leads">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Lead name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell >End Date</TableCell>
                <TableCell >Security Deposit (₹)</TableCell>
                <TableCell >Status</TableCell>
                <TableCell >Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads?.length ? (
                leads?.map((it, idx: number) => {
                  return (
                    <TableRow key={it?.id ?? idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell><Link href={`/lead/${it.id}`} className='text-blue-600' >{it.lead_name} </Link></TableCell>
                      <TableCell>{toDDMMYYYY(it.start_date)}</TableCell>
                      <TableCell>{toDDMMYYYY(it.end_date)}</TableCell>
                      <TableCell align='center'>{formatINR(it.security_deposit)}</TableCell>
                      <TableCell >{chipLable(it.status)}</TableCell>
                      <TableCell align='center' >{it.lead_status == LeadStatus.CREATED ? '-' : chipLable(String(it.lead_status))}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={7}>No items</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </PageLayout.FormSection>
  );
};

export default ViewGeneralInformation;
