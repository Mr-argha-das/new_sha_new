'use client';

import { Form, Formik, useFormikContext } from 'formik';
// import { Box, Button, FormGroup, Grid, LoadingButton } from 'ui';
import { useAuth } from '@/context/AuthContext';
import FileUploadField from '@/modules/common/FileField';
import NumberField from '@/modules/common/NumberField';
import AddressInput, {
  AddressInputValues,
} from '@/modules/common/address-input';
import PageLayout from '@/modules/common/components/page-layout';
import { defaultRoles, messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import Link from '@/modules/common/elements/link';
import PageContainer from '@/modules/common/elements/page/page-container';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import TextField from '@/modules/common/text-field';
import PersonIcon from '@mui/icons-material/Person';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../../../../packages/ui';
import { createUser, getDesignations } from '../api';

// Component to handle sameAsPermanent logic
const AddressSyncComponent: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<{
    sameAsPermanent: boolean;
    permanent_address: AddressInputValues;
    temporary_address: AddressInputValues;
  }>();

  useEffect(() => {
    if (values.sameAsPermanent) {
      setFieldValue('temporary_address', values.permanent_address);
    }
  }, [values.sameAsPermanent, values.permanent_address, setFieldValue]);

  return null;
};

export interface AddressRegion {
  label: string;
  value: string;
}

export interface Address {
  title: string;
  line1: string;
  line2?: string;
  city: AddressRegion;
  state: AddressRegion;
  country: AddressRegion;
  pinCode: string;
  default_shipping?: boolean;
  default_billing?: boolean;
}

const AddUser = () => {
  const invalidate = useInvalidate();
  const router = useRouter();
  const { user } = useAuth();

  // Fetch designations using useQuery
  const { data: designationsResponse, isLoading: loadingDesignations } =
    useQuery({
      queryKey: ['getDesignations', user?.account_id, user?.branch_id],
      queryFn: () => {
        if (!user?.account_id || !user?.branch_id) {
          return Promise.resolve({
            data: { data: { designations: ['nurse', 'attendant'] } },
          });
        }
        return getDesignations({
          account_id: user.account_id,
          branch_id: user.branch_id,
        });
      },
      enabled: !!user?.account_id && !!user?.branch_id,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

  const designations = designationsResponse?.data?.data?.designations || [
    'nurse',
    'attendant',
  ];

  type AddStaffFormValues = typeof initialValues;

  const handleFormSubmit = async (
    values: AddStaffFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    const payload = cloneDeep(values);
    payload.account_id = user?.account_id;
    payload.branch_id = user?.branch_id;

    // If "other" is selected, use customDesignation value
    if (payload.designation === 'other') {
      payload.designation = payload.customDesignation;
    }

    // Normalize booleans to 0/1 if backend expects numbers
    payload.has_vehicle = values.has_vehicle ? 1 : 0;
    payload.has_driving_license = values.has_driving_license ? 1 : 0;
    payload.police_verification = values.police_verification ? 1 : 0;
    payload.medical_verification = values.medical_verification ? 1 : 0;
    payload.mobile = payload.mobile;
    payload.role_id = defaultRoles.staff_role_id;

    // Map structured address to existing flat fields for backend compatibility
    const perm = values.permanent_address;
    const temp = values.sameAsPermanent
      ? values.permanent_address
      : values.temporary_address;

    payload.permanent_address = perm;
    payload.temporary_address = temp;

    // Qualifications are now handled separately via qualification APIs

    // Build FormData
    const formData = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      // Skip sameAsPermanent and customDesignation as they're only for UI state
      if (key === 'sameAsPermanent' || key === 'customDesignation') return;
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
        toast.success(messages.COMMONADDED('Staff'));
        await invalidate(['getUser']);
        router.push('/staff');
      }
    } catch (e) { }
  };

  const initialValues = {
    name: '',
    email: '',
    mobile: '',
    role_id: defaultRoles.staff_role_id,
    hour_price: '',
    account_id: user?.account_id,
    branch_id: user?.branch_id,

    // NEW
    working_hours: 8,
    aadhar_number: '',
    pan_number: '',
    driving_license_number: '',

    permanent_address: {
      title: '',
      line1: '',
      line2: '',
      pinCode: '',
      country: null,
      state: null,
      city: null,
      default_shipping: false,
      default_billing: false,
    } as AddressInputValues,
    temporary_address: {
      title: '',
      line1: '',
      line2: '',
      pinCode: '',
      country: null,
      state: null,
      city: null,
      default_shipping: false,
      default_billing: false,
    } as AddressInputValues,
    sameAsPermanent: false,

    // other fields
    has_vehicle: 0,
    has_driving_license: 0,
    status: 'active',
    aadhar_card: null,
    pan_card: null,
    driving_license: null,
    photo: null,
    date_of_birth: '',
    marital_status: '',
    gender: '',
    designation: '',
    customDesignation: '',
    block_reason: '',
    reference_relationship: '',
    reference_mobile_1: '',
    reference_mobile_2: '',
    reference_aadhar: null,
    police_verification: 0,
    medical_verification: 0,
  };

  return (
    <Formik
      validationSchema={Yup.object().shape({
        name: Yup.string().required(messages.REQUIRED),
        email: Yup.string()
          .optional()
          .test('email', 'Invalid', function (value) {
            if (!value || value.length === 0) return true;
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }),
        mobile: Yup.string()
          .required(messages.REQUIRED)
          .test(
            'mobile',
            'Mobile number must contain only digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return /^\d+$/.test(value);
            },
          )
          .test(
            'mobile-length',
            'Mobile number must be 10 digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return value.length === 10;
            },
          ),
        hour_price: Yup.number().nullable(),
        permanent_address: Yup.object().shape({
          line1: Yup.string().nullable(),
          pinCode: Yup.string().nullable(),
          country: Yup.object().nullable(),
          state: Yup.object().nullable(),
          city: Yup.object().nullable(),
        }),

        sameAsPermanent: Yup.boolean(),

        temporary_address: Yup.object().when('sameAsPermanent', {
          is: false,
          then: (schema) =>
            schema.shape({
              line1: Yup.string().nullable(),
              pinCode: Yup.string().nullable(),
              country: Yup.object().nullable(),
              state: Yup.object().nullable(),
              city: Yup.object().nullable(),
            }),
          otherwise: (schema) => schema,
        }),

        has_vehicle: Yup.number().oneOf([0, 1]).nullable(),
        has_driving_license: Yup.number().oneOf([0, 1]).nullable(),
        status: Yup.string().oneOf(['active', 'inactive', 'block']).nullable(),
        block_reason: Yup.string().optional().nullable(),
        gender: Yup.string().oneOf(['male', 'female']).nullable(),
        aadhar_card: Yup.mixed().nullable(),
        pan_card: Yup.mixed().nullable(),
        driving_license: Yup.mixed().nullable(),
        working_hours: Yup.number().nullable(),

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

        pan_number: Yup.string()
          .nullable()
          .test('pan-length', 'PAN must be 10 characters', function (value) {
            if (!value || value.length === 0) return true;
            return value.length === 10;
          })
          .test('pan-format', 'Invalid PAN', function (value) {
            if (!value || value.length === 0) return true;
            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value);
          }),

        driving_license_number: Yup.string()
          .nullable()
          .test(
            'dl-digits',
            'Driving license must contain only digits',
            function (value) {
              if (!value || value.length === 0) return true;
              return /^\d+$/.test(value);
            },
          )
          .test('dl-length', 'Max 16 digits', function (value) {
            if (!value || value.length === 0) return true;
            return value.length <= 16;
          }),
        date_of_birth: Yup.string().nullable(),
        marital_status: Yup.string().oneOf(['married', 'unmarried']).nullable(),
        designation: Yup.string().nullable(),
        customDesignation: Yup.string().nullable(),
        police_verification: Yup.number().oneOf([0, 1]).nullable(),
        medical_verification: Yup.number().oneOf([0, 1]).nullable(),
        photo: Yup.mixed().nullable(),
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
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({ handleBlur, handleSubmit, isSubmitting, values, setFieldValue }) => {
        return (
          <PageLayout
            component={Form}
            onBlur={handleBlur}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          >
            <AddressSyncComponent />
            <PageLayout.Header
              isListHeader={false}
              title={'Add staff'}
              breadcrumbs={[
                {
                  href: '/staff',
                  name: 'Staff',
                },
                {
                  name: 'Add',
                },
              ]}
              back={
                <Link href={`/staff`}>
                  <Button type="button" variant="text">
                    Back to List
                  </Button>
                </Link>
              }
            ></PageLayout.Header>

            <PageLayout.Content>
              <div className="bg-white rounded-lg shadow-lg border  my-6 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <PersonIcon sx={{ color: 'blue' }} />

                  <h2 className="text-lg font-semibold">Staff Details</h2>
                </div>
                <PageLayout.FormSection
                  blur={false}
                  title={''}
                  editable={false}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={[2, 2]}>
                    {/* Box 1: Basic Info */}
                    <div className="w-full border rounded-xl p-4 pt-0 mb-6 shadow-sm">
                      <h3 className="text-base font-semibold py-4">
                        Basic Info
                      </h3>

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
                                  inputMode: 'numeric',
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
                              label="Working Hours"
                              name="working_hours"
                              placeholder="8"
                              allowNegative={false}
                              allowDecimal={true}
                            />
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
                              label="Hour Price"
                              name="hour_price"
                              placeholder="0"
                              allowNegative={false}
                              allowDecimal
                              decimalScale={4}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <DatePicker
                              name="date_of_birth"
                              label="Date of Birth"
                              maxDate={dayjs()}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <TextField
                              fullWidth
                              select
                              label="Marital Status"
                              name="marital_status"
                              onChange={(e) =>
                                setFieldValue('marital_status', e.target.value)
                              }
                            >
                              <MenuItem value="married">Married</MenuItem>
                              <MenuItem value="unmarried">Unmarried</MenuItem>
                            </TextField>
                          </FormGroup>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <TextField
                              fullWidth
                              select
                              label="Gender"
                              name="gender"
                              onChange={(e) =>
                                setFieldValue('gender', e.target.value)
                              }
                            >
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                            </TextField>
                          </FormGroup>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <TextField
                              fullWidth
                              select
                              label="Designation"
                              name="designation"
                              disabled={loadingDesignations}
                              onChange={(e) => {
                                setFieldValue('designation', e.target.value);
                                // Clear custom designation when switching away from "other"
                                if (e.target.value !== 'other') {
                                  setFieldValue('customDesignation', '');
                                }
                              }}
                            >
                              {designations.map((designation) => (
                                <MenuItem key={designation} value={designation}>
                                  {designation.charAt(0).toUpperCase() +
                                    designation.slice(1)}
                                </MenuItem>
                              ))}
                              <MenuItem value="other">Other</MenuItem>
                            </TextField>
                          </FormGroup>
                        </Grid>
                        {values.designation === 'other' && (
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormGroup>
                              <TextField
                                fullWidth
                                label="Enter Designation"
                                name="customDesignation"
                                placeholder="Enter custom designation"
                                onChange={(e) =>
                                  setFieldValue(
                                    'customDesignation',
                                    e.target.value,
                                  )
                                }
                              />
                            </FormGroup>
                          </Grid>
                        )}
                        <Grid
                          size={{
                            xl: 6,
                            lg: 6,
                          }}
                        >
                          <FormGroup>
                            <FileUploadField
                              name="photo"
                              label="Upload Photo"
                              initialVal=""
                              width={200}
                              height={120}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </div>

                    {/* Box 2: Address Info */}
                    <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                      <Grid container spacing={[2, 2]}>
                        <Grid
                          size={{
                            xs: 12,
                          }}
                        >
                          <h3 className="text-base font-semibold  pb-4">
                            Permanent Address
                          </h3>
                          <AddressInput
                            namePrefix="permanent_address."
                            values={values.permanent_address}
                          />
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                          }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!values.sameAsPermanent}
                                  onChange={(e) => {
                                    setFieldValue(
                                      'sameAsPermanent',
                                      e.target.checked,
                                    );
                                    if (e.target.checked) {
                                      setFieldValue(
                                        'temporary_address',
                                        values.permanent_address,
                                      );
                                    }
                                  }}
                                />
                              }
                              label="Temporary address same as permanent"
                            />
                          </FormGroup>
                        </Grid>

                        {!values.sameAsPermanent && (
                          <Grid
                            size={{
                              xs: 12,
                            }}
                          >
                            <h3 className="text-base font-semibold mb-2">
                              Temporary Address
                            </h3>
                            <AddressInput
                              namePrefix="temporary_address."
                              values={values.temporary_address}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </div>

                    {/* Box 3: Status & Options */}
                    <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                      <h3 className="text-base font-semibold pb-4">
                        Status and Options
                      </h3>
                      <Grid container spacing={[2, 2]} alignContent="center">
                        <Grid
                          size={{
                            xl: 6,
                            lg: 6,
                            xs: 12,
                          }}
                        >
                          <FormGroup>
                            <TextField
                              fullWidth
                              type="status"
                              label="Status"
                              select
                              name="status"
                              onChange={(e) => {
                                setFieldValue('status', e.target.value);
                                // Clear block_reason when switching away from "block"
                                if (e.target.value !== 'block') {
                                  setFieldValue('block_reason', '');
                                }
                              }}
                            >
                              <MenuItem value="active">Active</MenuItem>
                              <MenuItem value="inactive">Inactive</MenuItem>
                              <MenuItem value="block">Block</MenuItem>
                            </TextField>
                          </FormGroup>
                        </Grid>
                        {values.status === 'block' && (
                          <Grid
                            size={{
                              xl: 6,
                              lg: 6,
                              xs: 12,
                            }}
                          >
                            <FormGroup>
                              <TextField
                                fullWidth
                                label="Block Reason"
                                name="block_reason"
                                placeholder="Enter reason for blocking"
                                multiline
                                rows={3}
                                onChange={(e) =>
                                  setFieldValue('block_reason', e.target.value)
                                }
                              />
                            </FormGroup>
                          </Grid>
                        )}
                        <Grid
                          size={{
                            xl: 6,
                            lg: 6,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!values.has_vehicle}
                                onChange={(e) => {
                                  setFieldValue(
                                    'has_vehicle',
                                    e.target.checked ? 1 : 0,
                                  );
                                }}
                              />
                            }
                            label="Has Vehicle"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!values.has_driving_license}
                                onChange={(e) => {
                                  setFieldValue(
                                    'has_driving_license',
                                    e.target.checked ? 1 : 0,
                                  );
                                }}
                              />
                            }
                            label="Has Driving License"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!values.police_verification}
                                onChange={(e) => {
                                  setFieldValue(
                                    'police_verification',
                                    e.target.checked ? 1 : 0,
                                  );
                                }}
                              />
                            }
                            label="Police Verification"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!values.medical_verification}
                                onChange={(e) => {
                                  setFieldValue(
                                    'medical_verification',
                                    e.target.checked ? 1 : 0,
                                  );
                                }}
                              />
                            }
                            label="Medical Verification"
                          />
                        </Grid>
                      </Grid>
                    </div>

                    {/* Box 4: Document Uploads */}
                    <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                      <h3 className="text-base font-semibold pb-4 ">
                        Documents
                      </h3>
                      <Grid container spacing={[2, 2]}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <NumberField
                              fullWidth
                              label="Aadhaar Number"
                              name="aadhar_number"
                              allowNegative={false}
                              slotProps={{
                                htmlInput: {
                                  maxLength: 12,
                                },
                              }}
                              allowDecimal={false}
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
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <TextField
                              fullWidth
                              label="PAN Number"
                              name="pan_number"
                              onChange={(e) =>
                                setFieldValue('pan_number', e.target.value)
                              }
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
                              name="pan_card"
                              label="Upload Pan Card"
                              initialVal=""
                              width={200}
                              height={120}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <TextField
                              fullWidth
                              label="Driving License Number"
                              name="driving_license_number"
                              disabled={values.has_driving_license === 0}
                              onChange={(e) =>
                                setFieldValue(
                                  'driving_license_number',
                                  e.target.value,
                                )
                              }
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
                              name="driving_license"
                              label="Upload Driving License"
                              initialVal=""
                              width={200}
                              height={120}
                              disabled={values.has_driving_license === 0}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </div>

                    {/* Box 5: Reference Details */}
                    <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                      <h3 className="text-base font-semibold pb-4">
                        Reference Details
                      </h3>
                      <Grid container spacing={[2, 2]}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormGroup>
                            <TextField
                              fullWidth
                              label="Staff Relationship"
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
                              placeholder="Enter mobile number"
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
                                  inputMode: 'numeric',
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
                              placeholder="Enter mobile number"
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
                                  inputMode: 'numeric',
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
                              initialVal=""
                              width={200}
                              height={120}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </div>
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
                onClick={() => router.push(`/staff`)}
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
        );
      }}
    </Formik>
  );
};

export default AddUser;
