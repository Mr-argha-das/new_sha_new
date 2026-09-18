import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { Grid } from '@mui/material';
import { useCategoryEditPageContext } from '../../context';

interface ViewGeneralInformationProps {
    onEdit: () => void;
}

const ViewGeneralInformation = ({ onEdit }: ViewGeneralInformationProps) => {
    const { category, activeSection } = useCategoryEditPageContext();

    return (
        <PageLayout.FormSection
            blur={Boolean(activeSection)}
            onEdit={onEdit}
            title="General Information"
            sx={{ mt: 3 }}
        >
            <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <ResourceDetail label="Name" value={category?.name || ''} />
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        md: 12,
                    }}
                >
                    <ResourceDetail
                        label="Description"
                        value={category?.description || ''}
                    />
                </Grid>
            </Grid>
        </PageLayout.FormSection>
    );
};

export default ViewGeneralInformation;

