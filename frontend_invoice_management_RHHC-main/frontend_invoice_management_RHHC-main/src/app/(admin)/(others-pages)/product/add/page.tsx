'use client';

import { Form, Formik } from 'formik';
// import { Box, Button, FormGroup, Grid, LoadingButton } from 'ui';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import { messages } from '@/modules/common/constant/messages';
import DatePicker from '@/modules/common/date-picker';
import Link from '@/modules/common/elements/link';
import PageContainer from '@/modules/common/elements/page/page-container';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import { Product, ProductStatus } from '@/modules/common/models/product';
import NumberField from '@/modules/common/NumberField';
import TextField from '@/modules/common/text-field';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SellIcon from '@mui/icons-material/Sell';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { Button, FormGroup, Grid, MenuItem } from '@mui/material';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../../../../packages/ui';
import { createProduct } from '../api';

const AddProduct = () => {
  const invalidate = useInvalidate();
  const router = useRouter();
  const { user } = useAuth();

  const handleFormSubmit = async (
    values: Partial<Product>,
    { resetForm }: { resetForm: () => void },
  ) => {
    const payload = cloneDeep(values);
    payload.sale_price = payload.sale_price || 0;
    payload.base_price = payload.base_price ?? null;
    payload.hour_rent_price = payload.hour_rent_price || null;
    payload.account_id = Number(user?.account_id);
    payload.branch_id = Number(user?.branch_id);
    payload.available_stock = payload.total_stock || 0;
    payload.rented_stock = 0;
    payload.sold_stock = 0;
    try {
      const res = await createProduct(payload);
      if (res.status) {
        resetForm();
        toast.success(messages.COMMONADDED('Product'));
        await invalidate(['getProduct']);
        router.push('/product');
      }
    } catch (e) { }
  };

  const initialValues: Partial<Product> = {
    name: '',
    description: '',
    base_price: '',
    sale_price: '',
    hour_rent_price: '',
    status: ProductStatus.ACTIVE,
    account_id: Number(user?.account_id),
    branch_id: Number(user?.branch_id),
    purchase_date: '',
    total_stock: 0,
    available_stock: 0,
    rented_stock: 0,
    sold_stock: 0,
  };

  return (
    <Formik
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
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({
        handleBlur,
        handleSubmit,
        isSubmitting,
        errors,
        touched,
        setFieldValue,
        values,
      }) => (
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
            title={'Add product'}
            breadcrumbs={[
              {
                href: '/product',
                name: 'Products',
              },
              {
                name: 'Add',
              },
            ]}
            back={
              <Link href={`/product`}>
                <Button type="button" variant="text">
                  Back to List
                </Button>
              </Link>
            }
          />

          <PageLayout.Content>
            {/* Product Details Card */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <Inventory2Icon sx={{ color: 'white', fontSize: '12px' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product Details
                  </h3>
                </div>

                <PageLayout.FormSection
                  blur={false}
                  title={''}
                  editable={false}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormGroup>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          onChange={(e) =>
                            setFieldValue('name', e.target.value)
                          }
                        />
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
                </PageLayout.FormSection>
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

                <PageLayout.FormSection
                  blur={false}
                  title={''}
                  editable={false}
                  sx={{ mt: 3 }}
                >
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
                </PageLayout.FormSection>
              </div>
            </div>

            {/* Stock Information Card */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                    <Inventory2Icon sx={{ color: 'white', fontSize: '12px' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Stock Information
                  </h3>
                </div>

                <PageLayout.FormSection
                  blur={false}
                  title={''}
                  editable={false}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ sm: 4 }}>
                      <NumberField
                        fullWidth
                        label="Total Stock"
                        name="total_stock"
                        allowNegative={false}
                        allowDecimal={false}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </PageLayout.FormSection>
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

                <PageLayout.FormSection
                  blur={false}
                  title={''}
                  editable={false}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={[2, 2]}>
                    <Grid size={{ sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Status"
                        name="status"
                        value={values.status}
                        sx={{
                          width: '100%',
                          '& .MuiSelect-select': {
                            width: '100%',
                          },
                        }}
                        onChange={(e) =>
                          setFieldValue('status', e.target.value)
                        }
                        error={!!(errors.status && touched.status)}
                        helperText={
                          errors.status && touched.status ? errors.status : ''
                        }
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </PageLayout.FormSection>
              </div>
            </div>
          </PageLayout.Content>

          {/* Footer */}
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
              onClick={() => router.push(`/product`)}
              disabled={isSubmitting}
              type="button"
              variant="text"
              sx={{ px: 3, color: 'neutral.200' }}
            >
              Cancel
            </Button>
          </PageContainer>
        </PageLayout>
      )}
    </Formik>
  );
};

export default AddProduct;
