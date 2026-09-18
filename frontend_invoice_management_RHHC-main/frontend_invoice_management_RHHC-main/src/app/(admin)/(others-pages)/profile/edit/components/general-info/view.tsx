import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { formatMobile } from '@/modules/common/helpers/formatMobile';
import { Grid } from '@mui/material';
import { User } from '@/modules/common/models/user';

interface ViewGeneralInformationProps {
    onEdit: () => void;
    user: Partial<User> | null;
}

const ViewGeneralInformation = ({ onEdit, user }: ViewGeneralInformationProps) => {

    return (
        <PageLayout.FormSection
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
            </Grid>
        </PageLayout.FormSection>
    );
};

export default ViewGeneralInformation;

