import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import { Grid } from '@mui/material';
import * as Yup from 'yup';
import { updateCategory } from '../../../api';
import { useCategoryEditPageContext } from '../../context';
import { cloneDeep } from 'lodash-es';
import { useAuth } from '@/context/AuthContext';

export interface GeneralInformationFormValues {
    name: string;
    description: string;
    account_id: number;
    branch_id: number;
}

interface EditGeneralInformationProps {
    onCancel: () => void;
    onSave: () => void;
}

const EditGeneralInformation = ({ onCancel, onSave }: EditGeneralInformationProps) => {
    const { category, setLoading, loading } = useCategoryEditPageContext();
    const invalidate = useInvalidate();
    const { user } = useAuth();

    const initialValues: GeneralInformationFormValues = {
        name: category?.name || '',
        description: category?.description || '',
        account_id: Number(user?.account_id),
        branch_id: Number(user?.branch_id),
    };
    const handleFormSubmit = async (values: GeneralInformationFormValues) => {
        if (!category) return;
        try {
            const payload = cloneDeep(values);
            setLoading(true);
            const res = await updateCategory(String(category.id), payload);
            if (res.status === 200) {
                setLoading(false);
                toast.success(messages.COMMONUPDATE('Category'));
                await invalidate(['getCategoryById']);
                onSave();
            } else {
                setLoading(false);
                toast.error('Update failed');
            }
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <Formik<GeneralInformationFormValues>
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={Yup.object().shape({
                name: Yup.string().required(messages.REQUIRED),
                description: Yup.string().optional(),
            })}
        >
            {({ handleSubmit, handleReset, setFieldValue }) => {
                return (
                    <Form onReset={handleReset} onSubmit={handleSubmit}>
                        <PageLayout.FormSection
                            loading={loading}
                            mode={Mode.EDIT}
                            onCancel={onCancel}
                            title="General Information"
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
                                <Grid size={{
                                    xs: 12,
                                    md: 12,
                                }}>
                                    <TextField fullWidth label="Name" name="name" />
                                </Grid>
                                <Grid size={{
                                    xs: 12,
                                    md: 12,
                                }}>
                                    <TextField
                                        multiline
                                        rows={4}
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        onChange={(e) => {
                                            setFieldValue('description', e.target.value);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </PageLayout.FormSection>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default EditGeneralInformation;

