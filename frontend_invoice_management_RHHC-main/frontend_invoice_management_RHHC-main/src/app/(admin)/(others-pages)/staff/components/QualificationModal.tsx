'use client';

import { Form, Formik } from 'formik';
import { useAuth } from '@/context/AuthContext';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import TextField from '@/modules/common/text-field';
import { Button, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../../../../packages/ui';
import {
    addStaffQualification,
    updateStaffQualification,
    StaffQualification,
    StaffQualificationPayload,
} from '../api';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import dayjs, { Dayjs } from 'dayjs';

type QualificationFormValues = {
    qualification_type: string;
    qualification_name: string;
    registration_no: string;
    year_of_passout: Dayjs | string;
};

const validationSchema = Yup.object({
    qualification_type: Yup.string().required(messages.REQUIRED),
    qualification_name: Yup.string().required(messages.REQUIRED),
    registration_no: Yup.string().nullable(),
    year_of_passout: Yup.string()
        .required(messages.REQUIRED)
});

interface QualificationModalProps {
    staffId: ID;
    qualification?: StaffQualification | null;
    onClose: () => void;
}

export default function QualificationModal({
    staffId,
    qualification,
    onClose,
}: QualificationModalProps) {
    const invalidate = useInvalidate();
    const router = useRouter();
    const { user } = useAuth();
    const isEditing = !!qualification;
    const initialValues: QualificationFormValues = {
        qualification_type: qualification?.qualification_type || '',
        qualification_name: qualification?.qualification_name || '',
        registration_no: qualification?.registration_no || '',
        year_of_passout: qualification?.year_of_passout ? dayjs().year(Number(qualification.year_of_passout)) : '',
    };

    const handleSubmit = async (values: QualificationFormValues) => {
        try {
            if (!user?.account_id || !user?.branch_id) {
                toast.error('User account information missing');
                return;
            }

            if (isEditing) {
                const payload: Omit<StaffQualificationPayload, 'staff_id'> = {
                    account_id: user.account_id,
                    branch_id: user.branch_id,
                    qualification_type: values.qualification_type,
                    qualification_name: values.qualification_name,
                    registration_no: values.registration_no || null,
                    year_of_passout: values.year_of_passout ? String(dayjs(values.year_of_passout).year()) : '',
                };

                const res = await updateStaffQualification(String(qualification.id), payload);
                if (res.status) {
                    toast.success(messages.COMMONUPDATE('Qualification'));
                    await invalidate(['getStaffQualifications', staffId]);
                    await invalidate(['getUserById']);
                    router.push(`/staff/${staffId}`);
                    onClose();
                }
            } else {
                const payload: StaffQualificationPayload = {
                    account_id: user.account_id,
                    branch_id: user.branch_id,
                    staff_id: Number(staffId),
                    qualification_type: values.qualification_type,
                    qualification_name: values.qualification_name,
                    registration_no: values.registration_no || null,
                    year_of_passout: values.year_of_passout ? String(dayjs(values.year_of_passout).year()) : '',
                };

                const res = await addStaffQualification(payload);
                if (res.status) {
                    toast.success(messages.COMMONADDED('Qualification'));
                    await invalidate(['getStaffQualifications', staffId]);
                    await invalidate(['getUserById']);
                    router.push(`/staff/${staffId}`);
                    onClose();
                }
            }
        } catch (error) {
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, handleSubmit, errors }) => {

                return (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={[2, 2]} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Qualification Type"
                                    name="qualification_type"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Qualification Name"
                                    name="qualification_name"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Registration Number"
                                    name="registration_no"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    name="year_of_passout"
                                    label="Year of Passout"
                                    view='year'
                                    format='YYYY'
                                    maxDate={dayjs()}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: Boolean(errors.year_of_passout), // must be boolean ✅
                                            helperText: errors.year_of_passout ? errors.year_of_passout : undefined,
                                        },
                                        popper: {
                                            placement: 'right-end'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={[2, 2]} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <Button
                                        variant="text"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <LoadingButton
                                        loading={isSubmitting}
                                        type="submit"
                                        variant="contained"
                                    >
                                        {isEditing ? 'Update' : 'Add'}
                                    </LoadingButton>
                                </div>
                            </Grid>
                        </Grid>
                    </Form>
                )
            }}
        </Formik>
    );
}

