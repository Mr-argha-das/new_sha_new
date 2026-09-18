import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { Grid } from '@mui/material';
import { useAccountSettingsEditPageContext } from '../../context';
import { config } from '@/modules/common/config';
import ImageThumbnail from '@/modules/common/components/imageThumbnail/ImageThumbnail';

interface ViewGeneralInformationProps {
  onEdit: () => void;
}

const ViewGeneralInformation = ({ onEdit }: ViewGeneralInformationProps) => {
  const { accountSettings, activeSection } = useAccountSettingsEditPageContext();

  return (
    <PageLayout.FormSection
      blur={Boolean(activeSection)}
      onEdit={onEdit}
      title="General Information"
      sx={{ mt: 3 }}
    >
      <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Name" value={capitalizeWords(accountSettings?.name || "")} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Logo"
            value={
              accountSettings?.logo ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${accountSettings.logo}`}
                  alt="Logo"
                  width={100}
                  height={100}
                />
              ) : (
                "—"
              )
            }
          />

        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Stamp"
            value={
              accountSettings?.stamp ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${accountSettings?.stamp}`}
                  alt="Stamp"
                  width={100}
                  height={100}
                />
              ) : (
                "—"
              )
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="QR Scanner"
            value={
              accountSettings?.qr_scanner ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${accountSettings?.qr_scanner}`}
                  alt="QR Scanner"
                  width={100}
                  height={100}
                />
              ) : (
                "—"
              )
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Stamp Signature"
            value={
              accountSettings?.stamp_signature ? (
                <ImageThumbnail
                  src={`${config.api.baseUrl}${accountSettings?.stamp_signature}`}
                  alt="Stamp Signature"
                  width={100}
                  height={100}
                />
              ) : (
                "—"
              )
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Address Lines"
            value={accountSettings?.address_lines}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Mobile" value={accountSettings?.mobile || "—"} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Email" value={accountSettings?.email || "—"} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Extra IDs"
            value={
              accountSettings?.extra_ids
                ? Object.entries(accountSettings.extra_ids)
                  .map(([key, val]) => `${key}: ${val}`)
                  .join(', ')
                : "—"
            }
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Service Type" value={accountSettings?.service_type || "—"} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Bank Name" value={accountSettings?.bank_details?.bank_name || "—"} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Account Holder Name" value={accountSettings?.bank_details?.account_holder_name || "—"} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Account Number" value={accountSettings?.bank_details?.account_number || "—"} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="IFSC" value={accountSettings?.bank_details?.ifsc || "—"} />
        </Grid>
      </Grid>
    </PageLayout.FormSection>
  );
};

export default ViewGeneralInformation;