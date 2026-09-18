"use client";

import React, { useEffect } from "react";
// import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { addStaffExperience } from "../api";
import { Form, Formik, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import TextField from "@/modules/common/text-field";
import { Checkbox, FormControlLabel, Grid, MenuItem } from "@mui/material";
import { messages } from "@/modules/common/constant/messages";
import DatePicker from "@/modules/common/date-picker";
import FileUploadField from "@/modules/common/FileField";
import { DeleteIcon } from "../../../../../../packages/ui/icons";
import toast from "react-hot-toast";
import useInvalidate from "@/modules/common/libs/react-query/useInvalidate";
import { useRouter } from "next/navigation";
import { useUserEditPageContext } from '../[id]/context';
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesForDropdown } from "../../staff-experience-category/api";
dayjs.extend(duration);

type DocumentItem = {
    id?: string;
    name: string;
    file?: File | null;
    path?: string;
};


const Schema = Yup.object().shape({
    org_name: Yup.string().required(messages.REQUIRED),
    category_id: Yup.number().required(messages.REQUIRED),
    from_month_year: Yup.string().required(messages.REQUIRED),
    to_month_year: Yup.string().when("is_currently_working", {
        is: 0,
        then: (s) => s.required(messages.REQUIRED),
        otherwise: (s) => s.optional(),
    }),
    total_experience_month: Yup.number().typeError("Must be a number").required(messages.REQUIRED),
    is_currently_working: Yup.number().oneOf([0, 1]).required(),
    referral_details: Yup.object().shape({
        name: Yup.string().optional(),
        designation: Yup.string().optional(),
        contact_no: Yup.string().optional(),
    }).optional(),
    worked_in: Yup.string().oneOf(['icu', 'non-icu', '']).optional(),
    documents: Yup.array()
        .of(
            Yup.object({
                id: Yup.string().optional(),
                name: Yup.string().optional(),
                path: Yup.string().optional(),
            })
        )
        .optional(),
});


// Component to handle experience months recalculation
export const ExperienceMonthsCalculator: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<{
        from_month_year: string;
        to_month_year: string;
        is_currently_working: 0 | 1;
        total_experience_month: number;
    }>();

    useEffect(() => {
        const from = values.from_month_year ? dayjs(values.from_month_year) : null;
        const to =
            values.is_currently_working === 1
                ? dayjs()
                : values.to_month_year
                    ? dayjs(values.to_month_year)
                    : null;

        if (!from || !to || !from.isValid() || !to.isValid()) {
            setFieldValue("total_experience_month", 0);
            return;
        }

        // Whole months difference
        const months = (to.year() - from.year()) * 12 + (to.month() - from.month());

        // Fractional part = day difference / days in the "from" month
        const dayDiff = to.date() - from.date();
        const daysInFromMonth = from.daysInMonth();
        let fraction = dayDiff / daysInFromMonth;

        // Ensure fraction is between 0–1
        if (fraction < 0) fraction = 0;

        let total = months + fraction;

        // Clamp minimum to 0
        if (total < 0) total = 0;

        // Round to 1 decimal place
        setFieldValue("total_experience_month", Math.round(total * 10) / 10);
    }, [values.from_month_year, values.to_month_year, values.is_currently_working, setFieldValue]);

    return null;
};

const StaffExperienceModal: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const { user: loggedUser } = useAuth();
    const { user: editUser } = useUserEditPageContext();

    const invalidate = useInvalidate();
    const router = useRouter();

    interface FormValues {
        org_name: string;
        category_id: number | "";
        from_month_year: string;
        to_month_year: string;
        total_experience_month: number;
        is_currently_working: 0 | 1;
        referral_details: {
            name: string;
            designation: string;
            contact_no: string;
        };
        worked_in: 'icu' | 'non-icu' | '';
        description: string;
        documents: DocumentItem[];
        account_id: number;
        branch_id: number;
    }

    const initialValues: FormValues = { org_name: "", category_id: "", from_month_year: "", to_month_year: "", total_experience_month: 0, is_currently_working: 0, referral_details: { name: "", designation: "", contact_no: "" }, worked_in: "", description: "", documents: [{ name: "", file: null }], account_id: Number(loggedUser?.account_id), branch_id: Number(loggedUser?.branch_id) };

    // Fetch categories for dropdown
    const { data: categoriesData } = useQuery({
        queryKey: ['getCategoriesForDropdown', loggedUser?.account_id, loggedUser?.branch_id],
        queryFn: async () => {
            if (!loggedUser?.account_id || !loggedUser?.branch_id) return null;
            const res = await getCategoriesForDropdown({
                account_id: loggedUser.account_id,
                branch_id: loggedUser.branch_id,
            });
            return res.data.data || [];
        },
        enabled: !!loggedUser?.account_id && !!loggedUser?.branch_id,
    });

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting, resetForm }: { setSubmitting: (s: boolean) => void; resetForm: () => void }
    ) => {
        try {
            if (!loggedUser?.account_id || !loggedUser?.branch_id) return;
            const formData = new FormData();
            formData.append("account_id", String(values.account_id));
            formData.append("branch_id", String(values.branch_id));
            if (!editUser?.id) return;
            formData.append("staff_id", String(editUser.id));
            formData.append("org_name", values.org_name);
            formData.append("category_id", String(values.category_id));
            formData.append("from_month_year", values.from_month_year);
            if (values.to_month_year && values.is_currently_working === 0) {
                formData.append("to_month_year", values.to_month_year);
            }
            formData.append("total_experience_month", String(values.total_experience_month));
            formData.append("is_currently_working", String(values.is_currently_working));

            // Add referral_details
            const referralDetails = {
                name: values.referral_details.name || '',
                designation: values.referral_details.designation || '',
                contact_no: values.referral_details.contact_no || ''
            };
            if (referralDetails.name || referralDetails.designation || referralDetails.contact_no) {
                formData.append("referral_details", JSON.stringify(referralDetails));
            }

            // Add worked_in
            if (values.worked_in) {
                formData.append("worked_in", values.worked_in);
            }

            // Add description
            if (values.description) {
                formData.append("description", values.description);
            }

            const docsMeta = (values.documents || [])
                .filter((d: DocumentItem) => d.name && (d.file || d.path))
                .map(({ id, name, path }: DocumentItem) => ({ id, name, path }));
            if (docsMeta.length) formData.append("documents", JSON.stringify(docsMeta));

            (values.documents || []).forEach((d: DocumentItem) => {
                if (d.file) formData.append("document_files", d.file);
            });

            const res = await addStaffExperience(formData);
            if (res.status) {
                resetForm();
                onClose?.();
                toast.success(messages.COMMONADDED('Staff Experience'));
                await invalidate(['getUserById']);
                router.push(`/staff/${editUser.id}`);
            }

        } catch (e) {
        } finally {
            setSubmitting(false);
        }
    };
    return (

        <Formik
            initialValues={initialValues}
            validationSchema={Schema}
            onSubmit={handleSubmit} enableReinitialize>
            {({ values, setFieldValue, isSubmitting }) => {
                return (
                    <Form>
                        <ExperienceMonthsCalculator />
                        <div className="space-y-6">
                            <h4 className="text-lg font-medium text-gray-800">Add Staff Experience</h4>

                            <Grid container spacing={[2, 2]}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Organization Name" name="org_name" />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Category"
                                        name="category_id"
                                        select
                                    >
                                        <MenuItem value="">
                                            <em>Select Category</em>
                                        </MenuItem>
                                        {(categoriesData || []).map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <DatePicker
                                        name="from_month_year"
                                        label="From"
                                        maxDate={dayjs()}
                                    />

                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.is_currently_working === 1}
                                                onChange={(e) => {
                                                    setFieldValue("is_currently_working", e.target.checked ? 1 : 0);
                                                    if (e.target.checked) setFieldValue("to_month_year", "");
                                                }}
                                            />
                                        }
                                        label="Currently Working"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <DatePicker
                                        name="to_month_year"
                                        label="To"
                                        disabled={values.is_currently_working === 1}
                                        maxDate={dayjs()}
                                        minDate={values.from_month_year ? dayjs(values.from_month_year) : undefined}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        name="total_experience_month"
                                        label="Total Experience (months)"
                                        type="number"
                                        disabled
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Worked In"
                                        name="worked_in"
                                        select
                                    >
                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        <MenuItem value="icu">ICU</MenuItem>
                                        <MenuItem value="non-icu">Non-ICU</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <div className="space-y-3">
                                        <h5 className="text-sm font-medium text-gray-800">Referral Details</h5>
                                        <Grid container spacing={[2, 2]}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    name="referral_details.name"
                                                    label="Referral Name"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    name="referral_details.designation"
                                                    label="Designation"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    name="referral_details.contact_no"
                                                    label="Contact Number"
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        name="description"
                                        label="Description"
                                        multiline
                                        rows={4}
                                        placeholder="Enter experience description..."
                                    />
                                </Grid>
                            </Grid>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">Documents</h5>

                                </div>

                                <FieldArray name="documents">
                                    {({ push, remove }) => (
                                        <>
                                            <div className="space-y-4">
                                                {(values.documents || []).map((doc: DocumentItem, index: number) => (
                                                    <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-12 ">
                                                        <div className="sm:col-span-6">
                                                            <TextField
                                                                fullWidth
                                                                name={`documents.${index}.name`}
                                                                label="Document Name"
                                                                placeholder="e.g. Experience Letter"
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-6">
                                                            <FileUploadField
                                                                name={`documents.${index}.file`}
                                                                label="File"
                                                                initialVal=''
                                                                width={100}
                                                                height={60}
                                                            />
                                                        </div>
                                                        {
                                                            values.documents.length > 1 && <div className="sm:col-span-1">
                                                                <Button size="sm" variant="outline" type="button" onClick={() => remove(index)}><DeleteIcon /></Button>
                                                            </div>

                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                            <Button size="sm" onClick={() => push({ name: "", file: null })} type="button">Add</Button>
                                        </>
                                    )}
                                </FieldArray>

                            </div>

                            <div className="flex items-center justify-end gap-3 mt-2">
                                <Button size="sm" variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>Close</Button>
                                <Button size="sm" type="submit" disabled={isSubmitting}>Submit</Button>
                            </div>
                        </div>
                    </Form>
                )
            }
            }
        </Formik>
    )
}
export default StaffExperienceModal



