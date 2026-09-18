import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import FileUploadField from '@/modules/common/FileField';
import NumberField from '@/modules/common/NumberField';
import AddressInput, {
  AddressInputValues,
} from '@/modules/common/address-input';
import PageLayout from '@/modules/common/components/page-layout';
import { defaultRoles, messages } from '@/modules/common/constant/messages';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { User } from '@/modules/common/models/user';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import { FormGroup, Grid, InputAdornment, MenuItem } from '@mui/material';
import { cloneDeep } from 'lodash-es';
import * as Yup from 'yup';
import { updateUser } from '../../../api';
import { useUserEditPageContext } from '../../context';

interface EditGeneralInformationProps {
  onSave: () => void;

  onCancel: () => void;
}

interface CustomerFormValues extends Partial<User> {
  aadhar_card: File | null;
  reference_aadhar: File | null;
}

const EditGeneralInformation = ({
  onSave,
  onCancel,
}: EditGeneralInformationProps) => {
  const { user, setLoading, loading } = useUserEditPageContext();
  const invalidate = useInvalidate();
  const { user: loggedUser } = useAuth();

  const initialValues: CustomerFormValues = {
    name: user?.name,
    mobile: user?.mobile,
    email: user?.email || '',
    role_id: String(defaultRoles.customer_role_id),
    account_id: loggedUser?.account_id,
    branch_id: loggedUser?.branch_id,

    permanent_address: {
      title: user?.permanent_address?.title || '',
      line1: user?.permanent_address?.line1 || '',
      line2: user?.permanent_address?.line2 || '',
      pinCode: user?.permanent_address?.pinCode || '',
      country: user?.permanent_address?.country || null,
      state: user?.permanent_address?.state || null,
      city: user?.permanent_address?.city || null,
      default_shipping: !!user?.permanent_address?.default_shipping,
      default_billing: !!user?.permanent_address?.default_billing,
    } as AddressInputValues & {
      title?: string;
      pinCode: string;
      default_shipping?: boolean;
      default_billing?: boolean;
    },
    age: user?.age || '',
    gender: user?.gender || '',
    aadhar_number: user?.aadhar_number || '',
    aadhar_card: null,
    reference_relationship: user?.reference_relationship || '',
    reference_mobile_1: user?.reference_mobile_1 || '',
    reference_mobile_2: user?.reference_mobile_2 || '',
    reference_aadhar: null,
  };
  const handleFormSubmit = async (values: CustomerFormValues) => {
    try {
      const payload = cloneDeep(values);
      payload.role_id = String(defaultRoles.customer_role_id);
      payload.account_id = loggedUser?.account_id;
      payload.branch_id = loggedUser?.branch_id;

      // Map structured -> flat fields (keep backend compatibility)
      const perm = values.permanent_address;
      payload.permanent_address = perm;

      // Build FormData
      const formData = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val === null || typeof val === 'undefined') return;
        if (typeof File !== 'undefined' && val instanceof File) {
          formData.append(key, val);
          return;
        }
        if (typeof val === 'object') {
          formData.append(key, JSON.stringify(val));
          return;
        }
        formData.append(key, String(val));
      });

      // Add existing file URLs if no new files are uploaded
      if (user?.aadhar_card_url && !values.aadhar_card) {
        formData.append('aadhar_card_url', user.aadhar_card_url);
      }
      if (user?.reference_aadhar_url && !values.reference_aadhar) {
        formData.append('reference_aadhar_url', user.reference_aadhar_url);
      }

      setLoading(true);
      const res = await updateUser(String(user?.id), formData);
      if (res.status) {
        setLoading(false);
        toast.success(messages.COMMONUPDATE('Customer'));

        await invalidate(['getUserById']);

        onSave();
      } else {
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(messages.REQUIRED),
        email: Yup.string().email('Invalid').nullable(),
        mobile: Yup.string()
          .required(messages.REQUIRED)
          .matches(/^\d+$/, 'Mobile number must contain only digits')
          .length(10, 'Mobile number must be 10 digits'),

        permanent_address: Yup.object().shape({
          line1: Yup.string().nullable(),
          pinCode: Yup.string().nullable(),
          country: Yup.object().nullable(),
          state: Yup.object().nullable(),
          city: Yup.object().nullable(),
        }),
        age: Yup.string().nullable(),
        gender: Yup.string().nullable(),
        aadhar_number: Yup.string()
          .nullable()
          .test(
            'aadhar-digits',
            'Aadhaar must contain only digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return /^\d+$/.test(value);
            },
          )
          .test('aadhar-length', 'Aadhaar must be 12 digits', function (value) {
            if (!value || value.length === 0) return true;
            return value.length === 12;
          }),
        aadhar_card: Yup.mixed().nullable(),
        reference_relationship: Yup.string().nullable(),
        reference_mobile_1: Yup.string()
          .nullable()
          .test(
            'ref-mobile-1-digits',
            'Mobile number must contain only digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return /^\d+$/.test(value);
            },
          )
          .test(
            'ref-mobile-1-length',
            'Mobile number must be 10 digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return value.length === 10;
            },
          ),
        reference_mobile_2: Yup.string()
          .nullable()
          .test(
            'ref-mobile-2-digits',
            'Mobile number must contain only digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return /^\d+$/.test(value);
            },
          )
          .test(
            'ref-mobile-2-length',
            'Mobile number must be 10 digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return value.length === 10;
            },
          ),
        reference_aadhar: Yup.mixed().nullable(),
      })}
    >
      {({ handleSubmit, handleReset, setFieldValue, values }) => {
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
                <Grid size={{ sm: 6 }}>
                  <TextField fullWidth label="Name" name="name" />
                </Grid>

                <Grid size={{ sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={(e) => {
                      setFieldValue('email', e.target.value);
                    }}
                  />
                </Grid>
                <Grid size={{ sm: 6 }}>
                  <NumberField
                    fullWidth
                    label="Mobile"
                    name="mobile"
                    allowNegative={false}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">+91</InputAdornment>
                        ),
                      },
                      htmlInput: {
                        maxLength: 10,
                        inputMode: 'numeric',
                      },
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    sm: 6,
                  }}
                >
                  <FormGroup>
                    <NumberField
                      fullWidth
                      label="Age"
                      name="age"
                      allowNegative={false}
                      slotProps={{
                        htmlInput: {
                          maxLength: 2,
                          inputMode: 'numeric',
                        },
                      }}
                    />
                  </FormGroup>
                </Grid>
                <Grid
                  size={{
                    sm: 6,
                  }}
                >
                  <FormGroup>
                    <TextField
                      fullWidth
                      select
                      type="number"
                      label="Gender"
                      name="gender"
                      onChange={(e) => {
                        setFieldValue('gender', e.target.value);
                      }}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </TextField>
                  </FormGroup>
                </Grid>

                {/* Address Info */}
                <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                  <Grid container spacing={[2, 2]}>
                    <Grid
                      size={{
                        xs: 12,
                      }}
                    >
                      <h3 className="text-base font-semibold mb-2">
                        Permanent Address
                      </h3>
                      <AddressInput
                        namePrefix="permanent_address."
                        values={values.permanent_address as AddressInputValues}
                      />
                    </Grid>
                  </Grid>
                </div>

                {/* Document Uploads */}
                <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                  <h3 className="text-base font-semibold mb-2">Documents</h3>
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormGroup>
                        <NumberField
                          fullWidth
                          label="Aadhaar Number"
                          name="aadhar_number"
                          slotProps={{
                            htmlInput: {
                              maxLength: 12,
                              inputMode: 'numeric',
                            },
                          }}
                        />
                      </FormGroup>
                    </Grid>
                    <Grid
                      size={{
                        xl: 6,
                        lg: 6,
                      }}
                    >
                      <FormGroup>
                        <FileUploadField
                          name="aadhar_card"
                          label="Upload Aadhar Card"
                          initialVal={user?.aadhar_card_url}
                          width={200}
                          height={120}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </div>

                {/* Reference Details */}
                <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                  <h3 className="text-base font-semibold mb-2">
                    Reference Details
                  </h3>
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Reference Relationship"
                          name="reference_relationship"
                          placeholder="e.g., Father, Mother, Friend"
                          onChange={(e) =>
                            setFieldValue(
                              'reference_relationship',
                              e.target.value,
                            )
                          }
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormGroup>
                        <NumberField
                          fullWidth
                          label="Reference Mobile 1"
                          name="reference_mobile_1"
                          allowNegative={false}
                          
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
                            },
                          }}
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormGroup>
                        <NumberField
                          fullWidth
                          label="Reference Mobile 2"
                          name="reference_mobile_2"
                          allowNegative={false}
                          
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
                            },
                          }}
                        />
                      </FormGroup>
                    </Grid>
                    <Grid
                      size={{
                        xl: 6,
                        lg: 6,
                      }}
                    >
                      <FormGroup>
                        <FileUploadField
                          name="reference_aadhar"
                          label="Upload Reference Aadhar"
                          initialVal={user?.reference_aadhar_url}
                          width={200}
                          height={120}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
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
