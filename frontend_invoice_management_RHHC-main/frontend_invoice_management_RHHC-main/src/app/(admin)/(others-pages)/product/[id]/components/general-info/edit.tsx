import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Product, ProductStatus } from '@/modules/common/models/product';
import NumberField from '@/modules/common/NumberField';
import TextField from '@/modules/common/text-field';
import { Mode } from '@/modules/common/types/enum';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SellIcon from '@mui/icons-material/Sell';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { FormGroup, Grid, MenuItem } from '@mui/material';
import { Form, Formik } from 'formik';
import { cloneDeep } from 'lodash-es';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { updateProduct } from '../../../api';
import { useProductEditPageContext } from '../../context';

interface EditGeneralInformationProps {
  onSave: () => void;

  onCancel: () => void;
}

const EditGeneralInformation = ({
  onSave,
  onCancel,
}: EditGeneralInformationProps) => {
  const { product, setLoading, loading } = useProductEditPageContext();
  const invalidate = useInvalidate();
  const { user } = useAuth();
  const initialValues: Partial<Product> = {
    name: product?.name,
    description: product?.description || '',
    base_price: product?.base_price || 0,
    sale_price: product?.sale_price || 0,
    hour_rent_price: product?.hour_rent_price || 0,
    status: product?.status || ProductStatus.ACTIVE,
    account_id: user?.account_id,
    branch_id: user?.branch_id,
    purchase_date: product?.purchase_date || '',
  };
  const handleFormSubmit = async (values: Partial<Product>) => {
    try {
      const payload = cloneDeep(values);
      payload.account_id = user?.account_id;
      payload.branch_id = user?.branch_id;
      setLoading(true);
      const res = await updateProduct(String(product?.id), values);
      if (res.status) {
        setLoading(false);
        toast.success(messages.COMMONUPDATE('Product'));

        await invalidate(['getProductById', String(product?.id)]);

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
        status: Yup.string()
          .oneOf(['active', 'inactive'])
          .required(messages.REQUIRED),
        base_price: Yup.number().required(messages.REQUIRED),
        total_stock: Yup.number().min(0, 'Stock cannot be negative').nullable(),
        available_stock: Yup.number()
          .min(0, 'Stock cannot be negative')
          .nullable(),
        rented_stock: Yup.number()
          .min(0, 'Stock cannot be negative')
          .nullable(),
        sold_stock: Yup.number().min(0, 'Stock cannot be negative').nullable(),
      })}
    >
      {({ handleSubmit, handleReset, setFieldValue, errors, values }) => {
        return (
          <Form onReset={handleReset} onSubmit={handleSubmit}>
            <PageLayout.FormSection
              loading={loading}
              mode={Mode.EDIT}
              onCancel={onCancel}
              title="General Information"
              sx={{ mt: 3 }}
            >
              {/* Product Details Card */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <Inventory2Icon
                        sx={{ color: 'white', fontSize: '12px' }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Details
                    </h3>
                  </div>

                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormGroup>
                        <TextField fullWidth label="Name" name="name" />
                      </FormGroup>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        name="description"
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>

              {/* Pricing Details Card */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
                      <SellIcon sx={{ color: 'white', fontSize: '12px' }} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pricing Details
                    </h3>
                  </div>

                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ sm: 6 }}>
                      <NumberField
                        fullWidth
                        label="Base Price"
                        name="base_price"
                        allowNegative={false}
                        allowDecimal={true}
                        decimalScale={4}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ sm: 6 }}>
                      <NumberField
                        fullWidth
                        label="Sale Price"
                        name="sale_price"
                        allowNegative={false}
                        allowDecimal={true}
                        decimalScale={4}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ sm: 6 }}>
                      <NumberField
                        fullWidth
                        label="Hour Rent Price"
                        name="hour_rent_price"
                        allowNegative={false}
                        allowDecimal={true}
                        decimalScale={4}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ sm: 6 }}>
                      <FormGroup>
                        <DatePicker
                          name="purchase_date"
                          label="Purchase Date"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </div>
              </div>

              {/* Additional Information Card */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                      <SettingsApplicationsIcon
                        sx={{ color: 'white', fontSize: '12' }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Additional Information
                    </h3>
                  </div>

                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Status"
                        name="status"
                        sx={{
                          width: '100%',
                          '& .MuiSelect-select': {
                            width: '100%',
                          },
                        }}
                        onChange={(e) =>
                          setFieldValue('status', e.target.value)
                        }
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </TextField>
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
