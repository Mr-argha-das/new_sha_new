'use client';

import { Form, Formik, FormikHelpers } from 'formik';
// import { Box, Button, FormGroup, Grid, LoadingButton } from 'ui';
import { useAuth } from '@/context/AuthContext';
import FileUploadField from '@/modules/common/FileField';
import AddressInput, {
  AddressInputValues,
} from '@/modules/common/address-input';
import PageLayout from '@/modules/common/components/page-layout';
import { defaultRoles, messages } from '@/modules/common/constant/messages';
import Link from '@/modules/common/elements/link';
import PageContainer from '@/modules/common/elements/page/page-container';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { User } from '@/modules/common/models/user';
import TextField from '@/modules/common/text-field';
import PersonIcon from '@mui/icons-material/Person';
import {
  Button,
  FormGroup,
  Grid,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../../../../packages/ui';
import { createUser } from '../api';
import NumberField from '@/modules/common/NumberField';

interface CustomerFormValues extends Partial<User> {
  aadhar_card: File | null;
  reference_aadhar: File | null;
}

const AddUser = () => {
  const invalidate = useInvalidate();
  const router = useRouter();
  const { user } = useAuth();

  const handleFormSubmit = async (
    values: CustomerFormValues,
    { resetForm }: FormikHelpers<CustomerFormValues>,
  ) => {
    const payload = cloneDeep(values);
    payload.role_id = String(defaultRoles.customer_role_id);
    payload.account_id = user?.account_id;
    payload.branch_id = user?.branch_id;

    const perm = values?.permanent_address;
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

    try {
      const res = await createUser(formData);
      if (res.status) {
        resetForm();
        toast.success(messages.COMMONADDED('Customer'));
        await invalidate(['getUser']);
        router.push('/customer');
      }
    } catch (e) {
    }
  };

  const initialValues: CustomerFormValues = {
    name: '',
    email: '',
    mobile: '',
    role_id: String(defaultRoles.customer_role_id),
    account_id: user?.account_id,
    branch_id: user?.branch_id,

    permanent_address: {
      line1: '',
      line2: '',
      pinCode: '',
      country: null,
      state: null,
      city: null,
    } as AddressInputValues,
    age: '',
    gender: '',
    aadhar_number: '',
    aadhar_card: null,
    reference_relationship: '',
    reference_mobile_1: '',
    reference_mobile_2: '',
    reference_aadhar: null,
  };

  return (
    <Formik
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
        age: Yup.string()
          .matches(/^\d+$/, 'Age must contain only digits')
          .length(2, 'Age must be 2 digits'),
        gender: Yup.string()
          .oneOf(['male', 'female'])
          .nullable(),
        aadhar_number: Yup.string()
          .nullable()
          .test('aadhar-digits', 'Aadhaar must contain only digits', function (value) {
            if (!value || value.length === 0) return true;
            return /^\d+$/.test(value);
          })
          .test('aadhar-length', 'Aadhaar must be 12 digits', function (value) {
            if (!value || value.length === 0) return true;
            return value.length === 12;
          }),
        aadhar_card: Yup.mixed().nullable(),
        reference_relationship: Yup.string().nullable(),
        reference_mobile_1: Yup.string()
          .nullable()
          .test('ref-mobile-1-digits', 'Mobile number must contain only digits', function (value) {
            if (!value || value.length === 0) return true;
            return /^\d+$/.test(value);
          })
          .test('ref-mobile-1-length', 'Mobile number must be 10 digits', function (value) {
            if (!value || value.length === 0) return true;
            return value.length === 10;
          }),
        reference_mobile_2: Yup.string()
          .nullable()
          .test('ref-mobile-2-digits', 'Mobile number must contain only digits', function (value) {
            if (!value || value.length === 0) return true;
            return /^\d+$/.test(value);
          })
          .test('ref-mobile-2-length', 'Mobile number must be 10 digits', function (value) {
            if (!value || value.length === 0) return true;
            return value.length === 10;
          }),
        reference_aadhar: Yup.mixed().nullable(),
      })}
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({ handleBlur, handleSubmit, isSubmitting, setFieldValue, values }) => (
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
            title={'Add customer'}
            breadcrumbs={[
              {
                href: '/customer',
                name: 'Customers',
              },
              {
                name: 'Add',
              },
            ]}
            back={
              <Link href={`/customer`}>
                <Button type="button" variant="text">
                  Back to List
                </Button>
              </Link>
            }
          ></PageLayout.Header>

          <PageLayout.Content>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <PersonIcon sx={{ color: 'blue' }} />

                <h2 className="text-lg font-semibold">Customer Details</h2>
              </div>
              <PageLayout.FormSection
                blur={false}
                title={''}
                editable={false}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={[2, 2]}>
                  {/* <div className="w-full border rounded-xl p-4 mb-6 shadow-sm"> */}
                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >
                    <h3 className="text-base font-semibold mb-2">
                      General Information
                    </h3>
                  </Grid>
                  <Grid
                    size={{
                      sm: 6,
                    }}
                  >
                    <FormGroup>
                      <TextField fullWidth label="Name" name="name" />
                    </FormGroup>
                  </Grid>
                  <Grid
                    size={{
                      sm: 6,
                    }}
                  >
                    <FormGroup>
                      <TextField fullWidth label="Email" name="email" />
                    </FormGroup>
                  </Grid>
                  <Grid
                    size={{
                      sm: 6,
                    }}
                  >
                    <FormGroup>
                      <NumberField
                        fullWidth
                        label="Mobile"
                        name="mobile"
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
                      xs: 12,
                    }}
                  >
                    <FormGroup>
                      <TextField
                        fullWidth
                        select
                        label="Gender"
                        name="gender"
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </TextField>
                    </FormGroup>
                  </Grid>
                
                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >
                    <h3 className="text-base font-semibold mb-2">Address</h3>
                    <AddressInput
                      namePrefix="permanent_address."
                      values={values.permanent_address as AddressInputValues}
                    />
                  </Grid>
                  {/* </Grid> */}
                  {/* </div> */}

                  {/* Document Uploads */}
                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >
                    <h3 className="text-base font-semibold mb-2 mt-4">
                      Documents
                    </h3>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormGroup>
                      <NumberField
                        fullWidth
                        label="Aadhaar Number"
                        name="aadhar_number"
                        slotProps={{
                          htmlInput: {
                            maxLength: 12
                          }
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
                        initialVal=""
                        width={200}
                        height={120}
                      />
                    </FormGroup>
                  </Grid>

                  {/* Reference Details */}
                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >
                    <h3 className="text-base font-semibold mb-2 mt-4">
                      Reference Details
                    </h3>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormGroup>
                      <TextField
                        fullWidth
                        label="Reference Relationship"
                        name="reference_relationship"
                        placeholder="e.g., Father, Mother, Friend"
                        onChange={(e) =>
                          setFieldValue('reference_relationship', e.target.value)
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
                            maxLength: 10
                          }
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
                            maxLength: 10
                          }
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
                        initialVal=""
                        width={200}
                        height={120}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </PageLayout.FormSection>
            </div>
          </PageLayout.Content>

          {/* <PageLayout.Footer> */}
          <PageContainer sx={{ px: 0 }}>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              sx={{ mr: 2 }}
            >
              Save
            </LoadingButton>
            <Button
              onClick={() => router.push(`/customer`)}
              disabled={isSubmitting}
              type="button"
              variant="text"
              sx={{ px: 3, color: 'neutral.200' }}
            >
              Cancel
            </Button>
          </PageContainer>
          {/* </PageLayout.Footer> */}
        </PageLayout>
      )}
    </Formik>
  );
};

export default AddUser;
