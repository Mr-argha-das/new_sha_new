'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import Link from '@/modules/common/elements/link';
import PageContainer from '@/modules/common/elements/page/page-container';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import TextField from '@/modules/common/text-field';
import { Button, FormGroup, Grid } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../../../../packages/ui';
import { createCategory, StaffExperienceCategory } from '../api';

const AddCategory = () => {
    const invalidate = useInvalidate();
    const router = useRouter();
    const { user } = useAuth();

    const initialValues: Partial<StaffExperienceCategory> = {
        name: '',
        description: '',
        account_id: user?.account_id,
        branch_id: user?.branch_id,
    };

    const handleFormSubmit = async (
        values: Partial<StaffExperienceCategory>,
        {
            resetForm,
        }: FormikHelpers<Partial<StaffExperienceCategory>>,
    ) => {
        try {
            const res = await createCategory(values);
            if (res.status) {
                resetForm();
                toast.success(messages.COMMONADDED('Category'));
                await invalidate(['getCategories']);
                router.push('/staff-experience-category');
            }
        } catch (e) {
        }
    };

    return (
        <Formik
            validationSchema={Yup.object().shape({
                name: Yup.string().required(messages.REQUIRED),
            })}
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
        >
            {({ handleBlur, handleSubmit, isSubmitting }) => (
                <PageLayout
                    component={Form}
                    onBlur={handleBlur}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                    }}
                >
                    <PageLayout.Header
                        isListHeader={false}
                        title={'Add Experience Category'}
                        breadcrumbs={[
                            {
                                href: '/staff-experience-category',
                                name: 'Experience Category',
                            },
                            {
                                name: 'Add',
                            },
                        ]}
                        back={
                            <Link href={`/staff-experience-category`}>
                                <Button type="button" variant="text">
                                    Back to List
                                </Button>
                            </Link>
                        }
                    ></PageLayout.Header>

                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6 p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v2H2V3zm0 4h16v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7z" />
                            </svg>
                            <h2 className="text-lg font-semibold">Category Details</h2>
                        </div>
                        <PageLayout.FormSection
                            blur={false}
                            title={''}
                            editable={false}
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={[2, 2]}>
                                <Grid
                                    size={{
                                        xl: 12,
                                        lg: 12,
                                    }}
                                >
                                    <FormGroup>
                                        <TextField fullWidth label="Name" name="name" />
                                    </FormGroup>
                                </Grid>
                                <Grid
                                    size={{
                                        xl: 12,
                                        lg: 12,
                                    }}
                                >
                                    <FormGroup>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            multiline
                                            rows={4}
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </PageLayout.FormSection>
                    </div>
                    <PageContainer>
                        <LoadingButton
                            loading={isSubmitting}
                            type="submit"
                            variant="contained"
                            sx={{ mr: 2 }}
                        >
                            Save
                        </LoadingButton>
                        <Button
                            onClick={() => router.push(`/staff-experience-category`)}
                            disabled={isSubmitting}
                            type="button"
                            variant="text"
                            sx={{ px: 3, color: 'neutral.200' }}
                        >
                            Cancel
                        </Button>
                    </PageContainer>
                </PageLayout>
            )}
        </Formik>
    );
};

export default AddCategory;

