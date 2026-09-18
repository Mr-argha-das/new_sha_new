import { Form, Formik, useFormikContext } from 'formik';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import FileUploadField from '@/modules/common/FileField';
import NumberField from '@/modules/common/NumberField';
import AddressInput, {
  AddressInputValues,
} from '@/modules/common/address-input';
import PageLayout from '@/modules/common/components/page-layout';
import { defaultRoles, messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { User } from '@/modules/common/models/user';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import {
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
import { useEffect } from 'react';
import * as Yup from 'yup';
import { getDesignations, updateUser } from '../../../api';
import { useUserEditPageContext } from '../../context';

// Component to handle sameAsPermanent logic
const AddressSyncComponent: React.FC = () => {
  const { values, setFieldValue } =
    useFormikContext<GeneralInformationFormValues>();

  useEffect(() => {
    if (values.sameAsPermanent) {
      setFieldValue('temporary_address', values.permanent_address);
    }
  }, [values.sameAsPermanent, values.permanent_address, setFieldValue]);

  return null;
};

interface GeneralInformationFormValues extends Omit<
  User,
  'designation' | 'status'
> {
  sameAsPermanent?: boolean;
  customDesignation?: string;
  designation?: string; // Override to allow any string including 'other'
  status?: string; // Override to allow 'block' option
  block_reason?: string; // Block reason field

  // File uploads
  aadhar_card: File | null;
  pan_card: File | null;
  driving_license: File | null;
  photo: File | null;
  reference_aadhar: File | null;
}

interface EditGeneralInformationProps {
  onSave: () => void;

  onCancel: () => void;
}

const EditGeneralInformation = ({
  onSave,
  onCancel,
}: EditGeneralInformationProps) => {
  const { user, setLoading, loading } = useUserEditPageContext();
  const invalidate = useInvalidate();
  const { user: loggeduser } = useAuth();

  // Fetch designations using useQuery
  const { data: designationsResponse, isLoading: loadingDesignations } =
    useQuery({
      queryKey: [
        'getDesignations',
        loggeduser?.account_id,
        loggeduser?.branch_id,
      ],
      queryFn: () => {
        if (!loggeduser?.account_id || !loggeduser?.branch_id) {
          return Promise.resolve({
            data: { data: { designations: ['nurse', 'attendant'] } },
          });
        }
        return getDesignations({
          account_id: loggeduser.account_id,
          branch_id: loggeduser.branch_id,
        });
      },
      enabled: !!loggeduser?.account_id && !!loggeduser?.branch_id,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

  const designations = designationsResponse?.data?.data?.designations || [
    'nurse',
    'attendant',
  ];

  const initialValues: Partial<GeneralInformationFormValues> = {
    name: user?.name ?? '',
    mobile: user?.mobile ?? '',
    email: user?.email ?? '',
    hour_price: user?.hour_price,
    role_id: user?.role_id,
    account_id: loggeduser?.account_id,
    branch_id: loggeduser?.branch_id,

    working_hours: user?.working_hours ?? 8,
    aadhar_number: user?.aadhar_number ?? '',
    pan_number: user?.pan_number ?? '',
    driving_license_number: user?.driving_license_number ?? '',
    // structured addresses
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
    } as AddressInputValues,
    temporary_address: {
      title: user?.temporary_address?.title || '',
      line1: user?.temporary_address?.line1 || '',
      line2: user?.temporary_address?.line2 || '',
      pinCode: user?.temporary_address?.pinCode || '',
      country: user?.temporary_address?.country || null,
      state: user?.temporary_address?.state || null,
      city: user?.temporary_address?.city || null,
      default_shipping: !!user?.temporary_address?.default_shipping,
      default_billing: !!user?.temporary_address?.default_billing,
    } as AddressInputValues,
    sameAsPermanent:
      !!user?.temporary_address &&
      JSON.stringify(user?.temporary_address) ===
      JSON.stringify(user?.permanent_address),

    // other fields
    has_vehicle: user?.has_vehicle,
    has_driving_license: user?.has_driving_license,
    aadhar_card: null,
    pan_card: null,
    driving_license: null,
    photo: null,
    aadhar_card_url: user?.aadhar_card_url,
    pan_card_url: user?.pan_card_url,
    driving_license_url: user?.driving_license_url,
    photo_url: user?.photo_url,
    date_of_birth: user?.date_of_birth ?? '',
    marital_status: user?.marital_status || '',
    gender: user?.gender ?? '',
    designation: user?.designation ?? '',
    customDesignation: '',
    status: user?.status ?? 'active',
    block_reason: user?.block_reason ?? '',
    reference_relationship: user?.reference_relationship ?? '',
    reference_mobile_1: user?.reference_mobile_1 ?? '',
    reference_mobile_2: user?.reference_mobile_2 ?? '',
    reference_aadhar: null,
    reference_aadhar_url: user?.reference_aadhar_url,
    police_verification: user?.police_verification ?? 0,
    medical_verification: user?.medical_verification ?? 0,
  };

  const handleFormSubmit = async (values: GeneralInformationFormValues) => {
    try {
      const payload = cloneDeep(values);
      payload.role_id = String(defaultRoles.staff_role_id);
      payload.account_id = loggeduser?.account_id;
      payload.branch_id = loggeduser?.branch_id;

      // If "other" is selected, use customDesignation value
      if (payload.designation === 'other') {
        payload.designation = payload.customDesignation;
      }

      // normalize booleans to 0/1
      payload.has_vehicle = values.has_vehicle ? 1 : 0;
      payload.has_driving_license = values.has_driving_license ? 1 : 0;
      payload.police_verification = values.police_verification ? 1 : 0;
      payload.medical_verification = values.medical_verification ? 1 : 0;

      // Use structured addresses only
      const temp = values.sameAsPermanent
        ? values.permanent_address
        : values.temporary_address;

      payload.temporary_address = temp || null;

      delete payload.sameAsPermanent;

      // Qualifications are now handled separately via qualification APIs

      const formData = new FormData();

      // always send *_url; send file only if a new File is chosen
      formData.append('aadhar_card_url', payload.aadhar_card_url || '');
      if (typeof File !== 'undefined' && payload.aadhar_card instanceof File) {
        formData.append('aadhar_card', payload.aadhar_card as File);
      }

      formData.append('pan_card_url', payload.pan_card_url || '');
      if (typeof File !== 'undefined' && payload.pan_card instanceof File) {
        formData.append('pan_card', payload.pan_card as File);
      }

      formData.append('driving_license_url', payload.driving_license_url || '');
      if (
        typeof File !== 'undefined' &&
        payload.driving_license instanceof File
      ) {
        formData.append('driving_license', payload.driving_license as File);
      }

      formData.append('photo_url', payload.photo_url || '');
      if (typeof File !== 'undefined' && payload.photo instanceof File) {
        formData.append('photo', payload.photo as File);
      }

      formData.append(
        'reference_aadhar_url',
        payload.reference_aadhar_url || '',
      );
      if (
        typeof File !== 'undefined' &&
        payload.reference_aadhar instanceof File
      ) {
        formData.append('reference_aadhar', payload.reference_aadhar as File);
      }

      // append other non-file fields (skip file fields already handled)
      Object.entries(payload).forEach(([key, val]) => {
        if (
          key === 'aadhar_card' ||
          key === 'pan_card' ||
          key === 'driving_license' ||
          key === 'photo' ||
          key === 'reference_aadhar' ||
          key === 'aadhar_card_url' ||
          key === 'pan_card_url' ||
          key === 'driving_license_url' ||
          key === 'photo_url' ||
          key === 'reference_aadhar_url' ||
          key === 'customDesignation'
        )
          return;

        if (val === null || typeof val === 'undefined') return;

        if (typeof val === 'object') formData.append(key, JSON.stringify(val));
        else formData.append(key, String(val));
      });

      setLoading(true);
      const res = await updateUser(user?.id ?? '', formData);
      if (res.status) {
        setLoading(false);
        toast.success(messages.COMMONUPDATE('Staff'));
        await invalidate(['getUserById']);
        onSave();
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues as unknown as GeneralInformationFormValues}
      onSubmit={handleFormSubmit}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(messages.REQUIRED),
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
        email: Yup.string()
          .optional()
          .test('email', 'Invalid', function (value) {
            if (!value || value.length === 0) return true;
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }),
        role_id: Yup.string().nullable(),

        permanent_address: Yup.object().shape({
          line1: Yup.string().nullable(),
          pinCode: Yup.string().nullable(),
          country: Yup.object().nullable(),
          state: Yup.object().nullable(),
          city: Yup.object().nullable(),
        }),

        sameAsPermanent: Yup.boolean(),
        working_hours: Yup.number().nullable().typeError('Must be a number'),

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
        date_of_birth: Yup.string().nullable(),
        marital_status: Yup.string().oneOf(['married', 'unmarried']).nullable(),
        gender: Yup.string().oneOf(['male', 'female']).nullable(),
        designation: Yup.string().nullable(),
        customDesignation: Yup.string().nullable(),
        status: Yup.string().oneOf(['active', 'inactive', 'block']).nullable(),
        block_reason: Yup.string().optional().nullable(),
        police_verification: Yup.number().oneOf([0, 1]).nullable(),
        medical_verification: Yup.number().oneOf([0, 1]).nullable(),
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
        // If current designation is not in the list, set to "other" and populate customDesignation
        useEffect(() => {
          if (
            !loadingDesignations &&
            designations.length > 0 &&
            user?.designation
          ) {
            const currentDesignation = user.designation;
            if (!designations.includes(currentDesignation)) {
              setFieldValue('customDesignation', currentDesignation);
              setFieldValue('designation', 'other');
            }
          }
        }, [
          loadingDesignations,
          designations,
          user?.designation,
          setFieldValue,
        ]);

        return (
          <Form onReset={handleReset} onSubmit={handleSubmit}>
            <AddressSyncComponent />
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
                              setFieldValue('customDesignation', e.target.value)
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
                          initialVal={initialValues?.photo_url}
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
                      <h3 className="text-base font-semibold mb-2">
                        Permanent Address
                      </h3>
                      <AddressInput
                        namePrefix="permanent_address."
                        values={values.permanent_address as AddressInputValues}
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
                          values={
                            values.temporary_address as AddressInputValues
                          }
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>

                {/* Box 3: Status & Options */}
                <div className="w-full border rounded-xl p-4 mb-6 shadow-sm">
                  <Grid container spacing={[2, 2]} alignContent="center">
                    <Grid
                      size={{
                        xl: 6,
                        lg: 6,
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
                          initialVal={initialValues?.aadhar_card_url}
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
                          initialVal={initialValues?.pan_card_url}
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
                          initialVal={initialValues?.driving_license_url}
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
                          initialVal={initialValues?.reference_aadhar_url}
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
