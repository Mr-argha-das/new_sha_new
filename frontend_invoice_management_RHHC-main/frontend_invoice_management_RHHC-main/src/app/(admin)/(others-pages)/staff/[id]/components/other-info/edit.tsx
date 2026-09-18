import toast from 'react-hot-toast';

import ButtonComponent from '@/components/ui/button/Button';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import DatePicker from '@/modules/common/date-picker';
import FileUploadField from '@/modules/common/FileField';
import {
  StaffExperience,
  StaffExperienceDocument,
  StaffExperiencePayload,
} from '@/modules/common/models/staff';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import { Checkbox, FormControlLabel, Grid, MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { DeleteIcon } from '../../../../../../../../packages/ui/icons';
import { getCategoriesForDropdown } from '../../../../staff-experience-category/api';
import { updateStaffExperience } from '../../../api';
import { ExperienceMonthsCalculator } from '../../../components/StaffExperienceModal';
import { useUserEditPageContext } from '../../context';

dayjs.extend(duration);

interface EditProps {
  onSave: () => void;
  onCancel: () => void;
}

const Schema = Yup.object().shape({
  org_name: Yup.string().required('Required'),
  category_id: Yup.number().required('Required'),
  from_month_year: Yup.string().required('Required'),
  to_month_year: Yup.string().when('is_currently_working', {
    is: 0,
    then: (s) => s.required('Required'),
    otherwise: (s) => s.optional(),
  }),
  total_experience_month: Yup.number()
    .typeError('Must be a number')
    .required('Required'),
  is_currently_working: Yup.number().oneOf([0, 1]).required(),
  documents: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().optional(),
        name: Yup.string().optional(),
        path: Yup.string().optional(),
      }),
    )
    .optional(),
});

const EditOtherInformation = ({ onCancel }: EditProps) => {
  return <ExperienceSection onCancel={onCancel} />;
};

const ExperienceSection = ({ onCancel }: { onCancel: () => void }) => {
  const { user: loggedUser } = useAuth();
  const { user, editId, setEditId, experiences, refetchExperiences } =
    useUserEditPageContext();

  const handleCancelInline = () => {
    setEditId('');
    onCancel(); // exit to view mode like general-info
  };

  // Find the experience being edited
  const editingExperience = experiences.find((it) => String(it.id) === editId);

  return (
    <>
      {editingExperience ? (
        <ExperienceInlineForm
          item={editingExperience}
          accountId={Number(loggedUser?.account_id)}
          branchId={Number(loggedUser?.branch_id)}
          staff_id={Number(user?.id || 0)}
          onCancel={handleCancelInline}
          onUpdated={async () => {
            await refetchExperiences();
            onCancel(); // exit to view mode
          }}
        />
      ) : (
        <PageLayout.FormSection
          mode={Mode.VIEW}
          title="Experience"
          editable={false}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={[2, 2]}>
            {experiences.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <div className="text-gray-500 text-sm">
                  No experience added.
                </div>
              </Grid>
            )}
          </Grid>
        </PageLayout.FormSection>
      )}
    </>
  );
};

const ExperienceInlineForm = ({
  item,
  accountId,
  branchId,
  staff_id,
  onCancel,
  onUpdated,
}: {
  item: StaffExperience;
  accountId: number;
  branchId: number;
  staff_id: number;
  onCancel: () => void;
  onUpdated: () => void;
}) => {
  type DocumentInput = StaffExperienceDocument & { file?: File | null };
  interface ExperienceFormValues extends StaffExperiencePayload {
    category_id: number;
    account_id: number;
    branch_id: number;
    documents?: DocumentInput[];
  }
  const { user: loggedUser } = useAuth();

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: [
      'getCategoriesForDropdown',
      loggedUser?.account_id,
      loggedUser?.branch_id,
    ],
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

  const initialValues = {
    org_name: item.org_name || '',
    category_id: item.category_id,
    from_month_year: item.from_month_year || '',
    to_month_year: item.is_currently_working ? '' : item.to_month_year || '',
    total_experience_month: item.total_experience_month || 0,
    is_currently_working: item.is_currently_working || 0,
    referral_details: item.referral_details || {
      name: '',
      designation: '',
      contact_no: '',
    },
    worked_in: item.worked_in || '',
    description: item.description || '',
    documents:
      item.documents && item.documents.length
        ? (item.documents as StaffExperienceDocument[]).map((d) => ({ ...d }))
        : [{ name: '', file: null } as DocumentInput],
    account_id: Number(accountId),
    branch_id: Number(branchId),
  } as ExperienceFormValues;

  const handleSubmit = async (
    values: ExperienceFormValues,
    { setSubmitting }: { setSubmitting: (s: boolean) => void },
  ) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('account_id', String(values.account_id));
      formData.append('branch_id', String(values.branch_id));
      formData.append('staff_id', String(staff_id));
      formData.append('org_name', values.org_name);
      formData.append('category_id', String(values.category_id));
      formData.append('from_month_year', String(values.from_month_year));
      if (values.to_month_year && values.is_currently_working === 0) {
        formData.append('to_month_year', String(values.to_month_year));
      }
      formData.append(
        'total_experience_month',
        String(values.total_experience_month),
      );
      const referralDetails = {
        name: values.referral_details?.name || '',
        designation: values.referral_details?.designation || '',
        contact_no: values.referral_details?.contact_no || ''
      };
      if (referralDetails.name || referralDetails.designation || referralDetails.contact_no) {
        formData.append('referral_details', JSON.stringify(referralDetails));
      }

      if (values.worked_in) {
        formData.append('worked_in', values.worked_in);
      }

      if (values.description) {
        formData.append('description', values.description);
      }

      formData.append(
        'is_currently_working',
        String(values.is_currently_working),
      );

      const docsMeta = (values.documents || [])
        .filter((d) => d.name && (d.file || d.path || d.id))
        .map((d) => ({
          id: d.id,
          name: d.name,
          path: d.path,
          replacing: Boolean(d.file),
        }));
      if (docsMeta.length)
        formData.append('documents', JSON.stringify(docsMeta));

      (values.documents || []).forEach((d) => {
        if (d.file) formData.append('document_files', d.file);
      });

      const res = await updateStaffExperience(String(item.id), formData);
      if (res.status) {
        toast.success(res.data.message || 'Experience updated successfully');
        onUpdated?.();
      }
    } catch (e) {
      toast.error('An error occurred while updating experience');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => {
        return (
          <Form>
            <PageLayout.FormSection
              loading={isSubmitting}
              mode={Mode.EDIT}
              title="Experience"
              onCancel={onCancel}
              sx={{ mt: 3 }}
            >
              <ExperienceMonthsCalculator />
              <Grid container spacing={[2, 2]}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    name="org_name"
                  />
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
                          setFieldValue(
                            'is_currently_working',
                            e.target.checked ? 1 : 0,
                          );
                          if (e.target.checked)
                            setFieldValue('to_month_year', '');
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
                    minDate={
                      values.from_month_year
                        ? dayjs(values.from_month_year)
                        : undefined
                    }
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
                    name="worked_in"
                    label="Worked In"
                    select
                  >
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

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">
                    Documents
                  </h5>
                </div>

                <FieldArray name="documents">
                  {({ push, remove }) => (
                    <>
                      <div className="space-y-4">
                        {(values.documents || []).map(
                          (doc: DocumentInput, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-4 sm:grid-cols-12"
                            >
                              <div className="sm:col-span-6">
                                <TextField
                                  fullWidth
                                  name={`documents.${index}.name`}
                                  label="Document Name"
                                  placeholder="e.g. Experience Letter"
                                />
                              </div>
                              <div className="sm:col-span-5">
                                <FileUploadField
                                  name={`documents.${index}.file`}
                                  label={
                                    doc.path
                                      ? 'Replace File (optional)'
                                      : 'File'
                                  }
                                  initialVal={doc.path}
                                  width={100}
                                  height={60}
                                />
                              </div>
                              {(values?.documents?.length ?? 0) > 1 && (
                                <div className="sm:col-span-1 pt-2">
                                  <DeleteIcon
                                    sx={{
                                      color: 'red',
                                      fontSize: '16',
                                    }}
                                    onClick={() => remove(index)}
                                  />
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                      <ButtonComponent
                        size="sm"
                        onClick={() => push({ name: '', file: null })}
                        type="button"
                      >
                        Add
                      </ButtonComponent>
                    </>
                  )}
                </FieldArray>
              </div>
            </PageLayout.FormSection>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditOtherInformation;
