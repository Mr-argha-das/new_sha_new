import { FieldArray, Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SellIcon from '@mui/icons-material/Sell';
import { Checkbox, FormControlLabel, FormGroup, FormControl, FormLabel, Radio, RadioGroup, Grid } from '@mui/material';
import * as Yup from 'yup';
import { updateAccountSettings } from '../../../api';
import { useAccountSettingsEditPageContext } from '../../context';
import { useAuth } from '@/context/AuthContext';
import { AccountSettingsEditData } from '../../../api/schema';
import FileUploadField from '@/modules/common/FileField';
import { AddIcon, DeleteIcon } from '../../../../../../../../packages/ui/icons';
import NumberField from '@/modules/common/NumberField';
import { InputAdornment } from '@mui/material';

interface EditGeneralInformationProps {
  onSave: () => void;

  onCancel: () => void;
}


const EditGeneralInformation = ({
  onSave,
  onCancel,
}: EditGeneralInformationProps) => {
  const { accountSettings, setLoading, loading } = useAccountSettingsEditPageContext();
  const invalidate = useInvalidate();
  const { user, refreshAccountSettings } = useAuth();

  const initialValues: AccountSettingsEditData = {
    name: accountSettings?.name || "",
    logo: accountSettings?.logo || null,
    stamp: accountSettings?.stamp || null,
    qr_scanner: accountSettings?.qr_scanner || null,
    stamp_signature: accountSettings?.stamp_signature || null,
    use_stamp_image: accountSettings?.use_stamp_image ?? 0,
    address_lines: accountSettings?.address_lines || "",
    mobile: accountSettings?.mobile || "",
    email: accountSettings?.email || "",
    extra_ids: accountSettings?.extra_ids
      ? Object.entries(accountSettings.extra_ids).map(([key, value]) => ({
        key,
        value,
      }))
      : [],
    service_type: accountSettings?.service_type || "",
    bank_details: {
      bank_name: accountSettings?.bank_details?.bank_name || "",
      account_holder_name: accountSettings?.bank_details?.account_holder_name || "",
      account_number: accountSettings?.bank_details?.account_number || "",
      ifsc: accountSettings?.bank_details?.ifsc || "",
    },
    account_id: user?.account_id as number,
    branch_id: user?.branch_id as number,
  };
  const handleFormSubmit = async (values: AccountSettingsEditData) => {

    try {
      const payload = new FormData();

      // Append normal fields
      payload.append("name", values.name);
      payload.append("address_lines", values.address_lines);
      payload.append("mobile", values.mobile);
      payload.append("email", values.email);
      payload.append("service_type", values.service_type);
      payload.append("account_id", String(values.account_id));
      payload.append("branch_id", String(values.branch_id));

      payload.append("bank_details", JSON.stringify(values.bank_details));

      const extraIdsObj = (values.extra_ids as { key: string; value: string | number }[])
        .reduce((acc, { key, value }) => {
          if (key) acc[key] = value;
          return acc;
        }, {} as Record<string, string | number>);
      payload.append("extra_ids", JSON.stringify(extraIdsObj));

      // Append files (if File else keep string value) — only when not null
      if (values.logo != null) payload.append("logo", values.logo as string | Blob);
      if (values.stamp != null) payload.append("stamp", values.stamp as string | Blob);
      if (values.qr_scanner != null) payload.append("qr_scanner", values.qr_scanner as string | Blob);
      if (values.stamp_signature != null) payload.append("stamp_signature", values.stamp_signature as string | Blob);
      payload.append("use_stamp_image", String(values.use_stamp_image ?? 0));

      setLoading(true);
      const res = await updateAccountSettings(accountSettings?.id as ID, payload);
      if (res.status) {
        setLoading(false);
        toast.success(messages.COMMONUPDATE('AccountSettings'));

        await invalidate(['getAccountSettingsById']);
        refreshAccountSettings();
        onSave();
      } else {
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(messages.REQUIRED),

        address_lines: Yup.string().required(messages.REQUIRED),

        mobile: Yup.string()
          .required(messages.REQUIRED)
          .matches(/^\d+$/, 'Mobile number must contain only digits')
          .length(10, 'Mobile number must be 10 digits'),

        email: Yup.string().email("Invalid email").required(messages.REQUIRED),

        extra_ids: Yup.array().of(
          Yup.object({
            key: Yup.string().required("Key is required"),
            value: Yup.string().required("Value is required"),
          })
        ),

        service_type: Yup.string().required(messages.REQUIRED),

        bank_details: Yup.object({
          bank_name: Yup.string().optional(),
          account_holder_name: Yup.string().optional(),
          account_number: Yup.string().optional(),
          ifsc: Yup.string()
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
            .optional(),
        }),
      })}
    >
      {({ handleSubmit, handleReset, values, setFieldValue }) => {
        return (
          <Form onReset={handleReset} onSubmit={handleSubmit}>
            <PageLayout.FormSection
              loading={loading}
              mode={Mode.EDIT}
              onCancel={onCancel}
              title="General Information"
              sx={{ mt: 3 }}
            >
              {/* General Info Card */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <Inventory2Icon sx={{ color: 'white', fontSize: '12px' }} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Account Settings Details</h3>
                  </div>
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={{ sm: 6 }}>
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
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                        />
                      </FormGroup>
                    </Grid>

                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Service Type"
                          name="service_type"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FileUploadField name="logo" label="Logo" initialVal={initialValues.logo as string} accept="images" />
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FileUploadField name="stamp" label="Stamp" initialVal={initialValues.stamp as string} accept="images" />
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FileUploadField name="qr_scanner" label="Scanner for paying online" initialVal={initialValues.qr_scanner as string} accept="images" />
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FileUploadField name="stamp_signature" label="Stamp Signature" initialVal={initialValues.stamp_signature as string} accept="images" />
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <FormControl >
                          <FormLabel>Invoice stamp type</FormLabel>
                          <RadioGroup
                            row
                            value={values.use_stamp_image || 0}
                            onChange={(e) => setFieldValue('use_stamp_image', e.target.value)}
                          >
                            <FormControlLabel value="0" control={<Radio />} label="Stamp image" />
                            <FormControlLabel value="1" control={<Radio />} label="Stamp signature image" />
                          </RadioGroup>
                        </FormControl>

                      </FormGroup>
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Address Lines"
                          name="address_lines"
                        />
                        {/* You may want to use a dynamic field array for address_lines if multiple lines are needed */}
                      </FormGroup>
                    </Grid>

                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <h4 className="text-md font-semibold mb-2">Extra IDs</h4>
                        <FieldArray name="extra_ids">
                          {({ push, remove, form }) => (
                            <div className="space-y-3">
                              {form.values.extra_ids?.map((_: null, index: number) => (
                                <Grid container spacing={2} key={index}>
                                  <Grid size={{ sm: 5 }}>
                                    <TextField
                                      fullWidth
                                      label="Key"
                                      name={`extra_ids.${index}.key`}
                                    />
                                  </Grid>
                                  <Grid size={{ sm: 5 }}>
                                    <TextField
                                      fullWidth
                                      label="Value"
                                      name={`extra_ids.${index}.value`}
                                    />
                                  </Grid>
                                  <Grid size={{ sm: 2 }} sx={{ alignSelf: "end" }}>
                                    {/* <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="px-2 bg-red-500 text-white rounded"
                                    > */}
                                    <DeleteIcon sx={{ fontSize: '20px', color: 'red' }} onClick={() => remove(index)} />
                                    {/* </button> */}
                                  </Grid>
                                </Grid>
                              ))}

                              <button
                                type="button"
                                onClick={() => push({ key: "", value: "" })}
                                className="px-1 py-1 bg-blue-500 text-white rounded"
                              >
                                <AddIcon sx={{ fontSize: '20px' }} />
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </FormGroup>
                    </Grid>
                  </Grid>
                </div>
              </div>
              {/* Bank Details Card */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
                      <SellIcon sx={{ color: 'white', fontSize: '12px' }} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                  </div>
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Bank Name"
                          name="bank_details.bank_name"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Account Holder Name"
                          name="bank_details.account_holder_name"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Account Number"
                          name="bank_details.account_number"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="IFSC"
                          name="bank_details.ifsc"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </PageLayout.FormSection>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditGeneralInformation;
