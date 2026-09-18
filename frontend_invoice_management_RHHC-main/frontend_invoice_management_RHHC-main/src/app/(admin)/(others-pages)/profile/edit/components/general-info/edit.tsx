import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import {
    FormGroup,
    Grid,
    InputAdornment,
} from '@mui/material';
import * as Yup from 'yup';
import { updateProfile, getMe } from '../../../api';
import { User } from '@/modules/common/models/user';
import NumberField from '@/modules/common/NumberField';

interface GeneralInformationFormValues {
    name: string;
    email: string;
    mobile: string;
    password: string;
    confirm_password: string;
}

interface EditGeneralInformationProps {
    onSave: () => void;
    onCancel: () => void;
    user: Partial<User> | null;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const EditGeneralInformation = ({
    onSave,
    onCancel,
    user,
    loading,
    setLoading,
}: EditGeneralInformationProps) => {
    const invalidate = useInvalidate();
    const { setUser } = useAuth();

    const initialValues: GeneralInformationFormValues = {
        name: user?.name ?? '',
        mobile: user?.mobile ?? '',
        email: user?.email ?? '',
        password: '',
        confirm_password: '',
    };

    const handleFormSubmit = async (values: GeneralInformationFormValues) => {
        try {
            // Prepare form data
            const formData: Record<string, string> = {
                name: values.name,
                email: values.email,
                mobile: values.mobile,
            };

            // Add password if it's being changed
            if (values.password && values.password.length > 0) {
                formData.password = values.password;
            }

            setLoading(true);
            const res = await updateProfile(formData);
            if (res.data) {
                setLoading(false);
                toast.success(messages.COMMONUPDATE('Profile'));
                // Invalidate and refetch user data
                await invalidate(['getMe']);
                // Refetch user data to update AuthContext
                const updatedUser = await getMe();
                if (updatedUser.data?.data) {
                    setUser(updatedUser.data.data);
                }
                onSave();
            }
            setLoading(false);
        } catch (e: unknown) {
            setLoading(false);

        }
    };

    return (
        <Formik<GeneralInformationFormValues>
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={Yup.object().shape({
                name: Yup.string().required(messages.REQUIRED),
                mobile: Yup.string()
                    .required(messages.REQUIRED)
                    .matches(/^\d+$/, 'Mobile number must contain only digits')
                    .max(10, 'Mobile number must be at most 10 digits long')
                    .min(10, 'Mobile number must be 10 digits'),
                email: Yup.string().email('Invalid').required(messages.REQUIRED),
                password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .notRequired(),
                confirm_password: Yup.string()
                    .when('password', {
                        is: (val: string) => val && val.length > 0,
                        then: (schema) =>
                            schema
                                .oneOf([Yup.ref('password')], 'Passwords must match')
                                .required('Please confirm your password'),
                        otherwise: (schema) => schema.notRequired(),
                    }),
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
                            <Grid container spacing={[2, 2]}>
                                {/* Box 1: Basic Info */}
                                <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                                    <h3 className="text-base font-semibold mb-2">Basic Info</h3>

                                    <Grid container spacing={[2, 2]}>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                            }}
                                        >
                                            <FormGroup>
                                                <TextField fullWidth label="Name" name="name" />
                                            </FormGroup>
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                            }}
                                        >
                                            <FormGroup>
                                                <TextField fullWidth label="Email" name="email" />
                                            </FormGroup>
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                            }}
                                        >
                                            <FormGroup>
                                                <NumberField
                                                    fullWidth
                                                    type="number"
                                                    label="Mobile"
                                                    name="mobile"
                                                    onChange={(e) => {
                                                        setFieldValue('mobile', e.target.value);
                                                    }}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    +91
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                        htmlInput: {
                                                            maxLength: 10,
                                                            inputMode: 'numeric',
                                                        },
                                                    }}
                                                />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </div>

                                {/* Box 2: Password Change */}
                                <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                                    <h3 className="text-base font-semibold mb-2">
                                        Change Password (Optional)
                                    </h3>
                                    <Grid container spacing={[2, 2]}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <FormGroup>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="New Password"
                                                    name="password"
                                                    autoComplete="new-password"
                                                />
                                            </FormGroup>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <FormGroup>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Confirm New Password"
                                                    name="confirm_password"
                                                    autoComplete="new-password"
                                                />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Leave password fields empty if you don&apos;t want to change your
                                        password.
                                    </p>
                                </div>
                            </Grid>
                        </PageLayout.FormSection>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default EditGeneralInformation;
