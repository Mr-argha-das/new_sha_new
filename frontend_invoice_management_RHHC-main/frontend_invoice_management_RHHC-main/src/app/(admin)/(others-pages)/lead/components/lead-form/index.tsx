'use client';

import { useAuth } from '@/context/AuthContext';
import { useHorizontalInfiniteList } from '@/hooks/useHorizontalInfiniteList';
import PageLayout from '@/modules/common/components/page-layout';
import CustomerSearchAutocomplete from '@/modules/common/customer-search-autocomplete';
import DatePicker from '@/modules/common/date-picker';
import PageContainer from '@/modules/common/elements/page/page-container';
import { Product } from '@/modules/common/models/product';
import { Service } from '@/modules/common/models/service';
import NumberField from '@/modules/common/NumberField';
import TextField from '@/modules/common/text-field';
import { Alert, Button, Grid, MenuItem } from '@mui/material';
import { FieldArray, Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { LoadingButton } from '../../../../../../../packages/ui';
import { DeleteIcon } from '../../../../../../../packages/ui/icons';
import { getAvailableProducts } from '../../../product/api';
import { getService } from '@/app/(admin)/(others-pages)/service/api';
import { createLeadValidationSchema } from '../../validators/createLead.validator';
import { emptyLeadItemForm, LeadFormValues } from './types';
import dayjs from 'dayjs';

const toNumber = (v: unknown): number => {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const computeItemTotal = (qty: number, unit: number, hoursPerDay?: number) => {
  const q = Number.isFinite(qty) ? qty : 0;
  const u = Number.isFinite(unit) ? unit : 0;
  const h =
    hoursPerDay === undefined || hoursPerDay === null
      ? 1
      : Number.isFinite(hoursPerDay)
        ? hoursPerDay
        : 1;
  return Math.round(q * u * h);
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export type LeadFormProps = {
  initialValues: LeadFormValues;
  onSubmit: (values: LeadFormValues) => Promise<void>;
  title?: string;
  breadcrumbs?: { href?: string; name: string }[];
  back?: React.ReactNode;
  submitLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  showHeader?: boolean;
  lockLeadDetails?: boolean;
};

const LeadForm: React.FC<LeadFormProps> = ({
  initialValues,
  onSubmit,
  title,
  breadcrumbs,
  back,
  submitLabel = 'Save',
  showCancel = false,
  onCancel,
  showHeader = true,
  lockLeadDetails = false,
}) => {
  const { user } = useAuth();

  const {
    items: productItems,
    isFetchingNextPage: productsFetchingMore,
    hasMore: productsHasMore,
    fetchNextPage: fetchMoreProducts,
  } = useHorizontalInfiniteList<
    Product,
    {
      account_id?: number | string;
      branch_id?: number | string;
      status?: string;
    }
  >({
    queryKey: ['getAvailableProducts'],
    fetcher: async (params) => {
      const res = await getAvailableProducts(
        params as unknown as { limit: number } & Record<string, unknown>,
      );
      return {
        data: {
          data: res.data.data,
          meta: { total: res.data.meta.totalRecords || 0 },
        },
      };
    },
    params: {
      account_id: user?.account_id,
      branch_id: user?.branch_id,
    },
    limit: 20,
    enabled: !!user?.account_id && !!user?.branch_id,
  });

  const {
    items: serviceItems,
    isFetchingNextPage: servicesFetchingMore,
    hasMore: servicesHasMore,
    fetchNextPage: fetchMoreServices,
  } = useHorizontalInfiniteList<
    Service,
    { account_id?: number | string; branch_id?: number | string }
  >({
    queryKey: ['getServices'],
    fetcher: async (params) => {
      const res = await getService(
        params as unknown as { limit: number } & Record<string, unknown>,
      );
      return {
        data: {
          data: res.data.data,
          meta: { total: res.data.meta.totalRecords || 0 },
        },
      };
    },
    params: {
      account_id: user?.account_id,
      branch_id: user?.branch_id,
    },
    limit: 20,
    enabled: !!user?.account_id && !!user?.branch_id,
  });

  const products = useMemo(
    () =>
      (productItems || []).map((p) => ({
        id: p.id,
        name: p.name,
        hour_rent_price: p.hour_rent_price ?? 0,
        sale_price: p.sale_price ?? 0,
        available_stock: p.available_stock ?? 0,
      })),
    [productItems],
  );

  const services = useMemo(
    () =>
      (serviceItems || []).map((s) => ({
        id: s.id,
        name: s.name,
        hour_price: s.hour_price ?? 0,
      })),
    [serviceItems],
  );

  const validationSchema = useMemo(
    () => createLeadValidationSchema(products),
    [products],
  );

  return (
    <Formik<LeadFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Never overwrite user-selected item start dates.
          // But if a start date is missing, send lead start date to avoid backend defaulting to "today".
          const safeLeadStart = String(values.leadDetails.start_date || '').trim();
          const normalized: LeadFormValues = {
            ...values,
            leadItems: values.leadItems.map((it) => {
              const cur = String(it.start_date || '').trim();
              return {
                ...it,
                start_date: cur !== '' ? cur : safeLeadStart,
              };
            }),
          };

          await onSubmit(normalized);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        errors,
        touched,
        submitCount,
      }) => (
        <PageLayout component={Form}>
          {showHeader && (
            <PageLayout.Header
              isListHeader={false}
              title={title ?? ''}
              breadcrumbs={breadcrumbs}
              back={back}
            />
          )}
          <PageLayout.Content>
            {/* Lead Details */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 my-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Lead Details
                </h3>
                <Grid container spacing={[2, 2]}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomerSearchAutocomplete
                      label="Customer"
                      name="leadDetails.customer_id"
                      value={values.leadDetails.customer_id ?? ''}
                      disabled={lockLeadDetails}
                      onChange={(customerId) => {
                        setFieldValue('leadDetails.customer_id', customerId);
                      }}
                      onBlur={() => {
                        setFieldTouched('leadDetails.customer_id', true);
                      }}
                      error={Boolean(
                        touched.leadDetails?.customer_id &&
                        errors.leadDetails?.customer_id,
                      )}
                      helperText={
                        touched.leadDetails?.customer_id &&
                        errors.leadDetails?.customer_id
                      }
                      slotProps={{
                        root: {
                          sx: { width: '100%' },
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Lead Name"
                      name="leadDetails.lead_name"
                      fullWidth
                      disabled={lockLeadDetails}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      name="leadDetails.start_date"
                      label="Start Date"
                      disabled={lockLeadDetails}
                      onChange={(e) => {
                        const next = e ? dayjs(e).format('YYYY-MM-DD') : '';
                        setFieldValue('leadDetails.start_date', next);

                        // Ensure no item start date is earlier than lead start date
                        if (!next) return;
                        values.leadItems.forEach((it, idx) => {
                          const cur = String(it.start_date || '');
                          if (!cur) {
                            setFieldValue(`leadItems.${idx}.start_date`, next, false);
                            return;
                          }
                          if (cur < next) {
                            setFieldValue(`leadItems.${idx}.start_date`, next, false);
                          }
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberField
                      name="leadDetails.security_deposit"
                      label="Security deposit"
                      fullWidth
                      allowDecimal={true}
                      allowNegative={false}
                      decimalScale={4}
                      disabled={lockLeadDetails}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      name="leadDetails.status"
                      label="Status"
                      fullWidth
                      select
                      disabled={lockLeadDetails}
                      id="leadDetails-status"
                      slotProps={{
                        select: { id: 'leadDetails-status' },
                        inputLabel: { htmlFor: 'leadDetails-status' },
                      }}
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="finalised">Finalised</MenuItem>
                      <MenuItem value="onhold">On Hold</MenuItem>
                      <MenuItem value="invalid">In valid</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="leadDetails.notes"
                      label="Note"
                      fullWidth
                      multiline
                      minRows={4}
                      disabled={lockLeadDetails}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Items
                </h3>

                {typeof errors.leadItems === 'string' && submitCount > 0 && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.leadItems}
                  </Alert>
                )}

                <FieldArray name="leadItems">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.leadItems.map((item, idx) => {
                        const catalog: Array<{ id: number; name: string }> =
                          item.item_type === 'product'
                            ? (products as unknown as Array<{
                              id: number;
                              name: string;
                            }>)
                            : (services as unknown as Array<{
                              id: number;
                              name: string;
                            }>);

                        return (
                          <div key={idx} className="border rounded-md p-4">
                            <Grid
                              container
                              spacing={[2, 2]}
                              alignItems="center"
                            >
                              <Grid size={{ xs: 12, sm: 2.5 }}>
                                <TextField
                                  select
                                  fullWidth
                                  label="Type"
                                  name={`leadItems.${idx}.item_type`}
                                  id={`leadItems-${idx}-item_type`}
                                  slotProps={{
                                    select: { id: `leadItems-${idx}-item_type` },
                                    inputLabel: {
                                      htmlFor: `leadItems-${idx}-item_type`,
                                    },
                                  }}
                                  onChange={(e) => {
                                    const nextType = e.target.value as
                                      | 'product'
                                      | 'service';
                                    setFieldValue(
                                      `leadItems.${idx}.item_type`,
                                      nextType,
                                      false,
                                    );
                                    // Don't overwrite an existing start date.
                                    // For new items, default to lead start date (or today if blank).
                                    if (!values.leadItems[idx].start_date) {
                                      setFieldValue(
                                        `leadItems.${idx}.start_date`,
                                        values.leadDetails.start_date || todayISO(),
                                        false,
                                      );
                                    }
                                    setFieldValue(
                                      `leadItems.${idx}.end_date`,
                                      '',
                                      false,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.item_id`,
                                      '',
                                      false,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.item_name`,
                                      '',
                                      false,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.unit_price`,
                                      '0',
                                      false,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.hours_per_day`,
                                      '1',
                                      false,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.total_price`,
                                      '0',
                                      false,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.quantity`,
                                      '1',
                                      false,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.deal_type`,
                                      nextType === 'product' ? 'rent' : null,
                                      false,
                                    );
                                    setFieldTouched(
                                      `leadItems.${idx}.item_id`,
                                      false,
                                      false,
                                    );
                                    setFieldTouched(
                                      `leadItems.${idx}.quantity`,
                                      false,
                                      false,
                                    );
                                  }}
                                >
                                  <MenuItem value="product">Product</MenuItem>
                                  <MenuItem value="service">Service</MenuItem>
                                </TextField>
                              </Grid>
                              {item.item_type === 'product' && (
                                <Grid size={{ xs: 12, sm: 1.5 }}>
                                  <TextField
                                    select
                                    fullWidth
                                    name={`leadItems.${idx}.deal_type`}
                                    label="Deal type"
                                    id={`leadItems-${idx}-deal_type`}
                                    slotProps={{
                                      select: { id: `leadItems-${idx}-deal_type` },
                                      inputLabel: {
                                        htmlFor: `leadItems-${idx}-deal_type`,
                                      },
                                    }}
                                    onChange={(e) => {
                                      const next = e.target.value as
                                        | 'rent'
                                        | 'sell';
                                      setFieldValue(
                                        `leadItems.${idx}.deal_type`,
                                        next,
                                        false,
                                      );
                                      if (item.item_id) {
                                        const found = products.find(
                                          (p) =>
                                            String(p.id) ===
                                            String(item.item_id),
                                        );
                                        const price = toNumber(
                                          next === 'sell'
                                            ? (found as Product)?.sale_price
                                            : (found as Product)
                                              ?.hour_rent_price,
                                        );
                                        const qty =
                                          item.quantity === ''
                                            ? 1
                                            : toNumber(item.quantity);
                                        const hours =
                                          toNumber(item.hours_per_day) || 1;
                                        const total = computeItemTotal(
                                          qty,
                                          price,
                                          hours,
                                        );
                                        if (item.quantity === '')
                                          setFieldValue(
                                            `leadItems.${idx}.quantity`,
                                            1,
                                            false,
                                          );
                                        setFieldValue(
                                          `leadItems.${idx}.unit_price`,
                                          price?.toString(),
                                          false,
                                        );
                                        setFieldValue(
                                          `leadItems.${idx}.total_price`,
                                          total?.toString(),
                                          false,
                                        );
                                      }
                                    }}
                                  >
                                    <MenuItem value="rent">Rent</MenuItem>
                                    <MenuItem value="sell">Sell</MenuItem>
                                  </TextField>
                                </Grid>
                              )}

                              <Grid size={{ xs: 12, sm: 2 }}>
                                <TextField
                                  select
                                  fullWidth
                                  id={`leadItems-${idx}-item_id`}
                                  label={
                                    item.item_type === 'product'
                                      ? 'Product'
                                      : 'Service'
                                  }
                                  name={`leadItems.${idx}.item_id`}
                                  slotProps={{
                                    inputLabel: {
                                      htmlFor: `leadItems-${idx}-item_id`,
                                    },
                                    select: {
                                      id: `leadItems-${idx}-item_id`,
                                      inputProps: {
                                        id: `leadItems-${idx}-item_id`,
                                        name: `leadItems.${idx}.item_id`,
                                      },
                                      MenuProps: {
                                        PaperProps: {
                                          onScroll: (
                                            e: React.UIEvent<HTMLDivElement>,
                                          ) => {
                                            const el = e.currentTarget;
                                            const remaining =
                                              el.scrollHeight -
                                              el.scrollTop -
                                              el.clientHeight;
                                            if (
                                              item.item_type === 'product'
                                            ) {
                                              if (
                                                remaining < 160 &&
                                                productsHasMore &&
                                                !productsFetchingMore
                                              )
                                                fetchMoreProducts();
                                            } else {
                                              if (
                                                remaining < 160 &&
                                                servicesHasMore &&
                                                !servicesFetchingMore
                                              )
                                                fetchMoreServices();
                                            }
                                          },
                                        },
                                      },
                                    },
                                  }}
                                  onChange={(e) => {
                                    const id = e.target.value;
                                    const found = catalog.find(
                                      (c) => String(c.id) === String(id),
                                    );
                                    const name = found?.name || '';
                                    const price =
                                      item.item_type === 'product'
                                        ? toNumber(
                                          ((item.deal_type || 'rent') ===
                                            'sell'
                                            ? (found as unknown as Product)
                                              ?.sale_price
                                            : (found as unknown as Product)
                                              ?.hour_rent_price) ?? 0,
                                        )
                                        : toNumber(
                                          (found as unknown as Service)
                                            ?.hour_price,
                                        );
                                    const quantity =
                                      toNumber(item.quantity) || 1;
                                    const hours =
                                      toNumber(item.hours_per_day) || 1;
                                    const total = computeItemTotal(
                                      quantity,
                                      price,
                                      hours,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.item_id`,
                                      id,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.item_name`,
                                      name,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.unit_price`,
                                      price.toString(),
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.quantity`,
                                      '1',
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.total_price`,
                                      total.toString(),
                                    );
                                  }}
                                >
                                  {(catalog || []).map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                      {c.name}{' '}
                                      {item.item_type === 'product'
                                        ? `- Stock ${(c as unknown as Product).available_stock}`
                                        : ''}
                                    </MenuItem>
                                  ))}
                                  {item.item_type === 'product' &&
                                    productsFetchingMore && (
                                      <MenuItem disabled value="">
                                        Loading more...
                                      </MenuItem>
                                    )}
                                  {item.item_type === 'service' &&
                                    servicesFetchingMore && (
                                      <MenuItem disabled value="">
                                        Loading more...
                                      </MenuItem>
                                    )}
                                </TextField>
                              </Grid>

                              <Grid size={{ xs: 12, sm: 2 }}>
                                <DatePicker
                                  name={`leadItems.${idx}.start_date`}
                                  label="Start Date"
                                  disabled={lockLeadDetails || !values.leadDetails.start_date}
                                  minDate={
                                    values.leadDetails.start_date
                                      ? dayjs(values.leadDetails.start_date)
                                      : undefined
                                  }
                                  onChange={(e) => {
                                    const next = e ? dayjs(e).format('YYYY-MM-DD') : '';
                                    setFieldValue(`leadItems.${idx}.start_date`, next);

                                    const end = String(values.leadItems[idx].end_date || '');
                                    if (end && next && end < next) {
                                      setFieldValue(`leadItems.${idx}.end_date`, '', false);
                                    }
                                  }}
                                />
                              </Grid>

                              <Grid size={{ xs: 12, sm: 2 }}>
                                <DatePicker
                                  name={`leadItems.${idx}.end_date`}
                                  label="End Date"
                                  disabled={lockLeadDetails || !values.leadItems[idx].start_date}
                                  minDate={
                                    values.leadItems[idx].start_date
                                      ? dayjs(values.leadItems[idx].start_date)
                                      : values.leadDetails.start_date
                                        ? dayjs(values.leadDetails.start_date)
                                        : undefined
                                  }
                                  onChange={(e) => {
                                    const next = e ? dayjs(e).format('YYYY-MM-DD') : '';
                                    setFieldValue(`leadItems.${idx}.end_date`, next);
                                  }}
                                />
                              </Grid>

                              {values.leadItems[idx].item_type ===
                                'product' && (
                                  <Grid size={{ xs: 12, sm: 1.5 }}>
                                    <NumberField
                                      fullWidth
                                      allowDecimal={false}
                                      allowNegative={false}
                                      decimalScale={0}
                                      label="Qty"
                                      disabled={
                                        item.item_name === '' ||
                                        item.item_id === ''
                                      }
                                      name={`leadItems.${idx}.quantity`}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const qty =
                                          inputValue === ''
                                            ? ''
                                            : Math.max(
                                              1,
                                              Number(inputValue) || 0,
                                            );
                                        setFieldValue(
                                          `leadItems.${idx}.quantity`,
                                          qty.toString(),
                                        );
                                        if (qty !== '' && qty > 0) {
                                          const price = toNumber(
                                            item.unit_price,
                                          );
                                          const hours =
                                            toNumber(item.hours_per_day) || 1;
                                          const total = computeItemTotal(
                                            qty,
                                            price,
                                            hours,
                                          );
                                          setFieldValue(
                                            `leadItems.${idx}.total_price`,
                                            total.toString(),
                                            false,
                                          );
                                        } else {
                                          setFieldValue(
                                            `leadItems.${idx}.total_price`,
                                            '0',
                                            false,
                                          );
                                        }
                                      }}
                                    />
                                  </Grid>
                                )}

                              <Grid size={{ xs: 12, sm: 1.5 }}>
                                <NumberField
                                  fullWidth
                                  allowDecimal={true}
                                  allowNegative={false}
                                  decimalScale={4}
                                  label={
                                    values.leadItems[idx].item_type ===
                                      'product'
                                      ? values.leadItems[idx].deal_type ===
                                        'sell'
                                        ? 'Sale Price'
                                        : 'Hour Rent Price'
                                      : 'Hour Price'
                                  }
                                  disabled={
                                    item.item_name === '' ||
                                    item.item_id === ''
                                  }
                                  name={`leadItems.${idx}.unit_price`}
                                  onChange={(e) => {
                                    const price = e.target.value;
                                    setFieldValue(
                                      `leadItems.${idx}.unit_price`,
                                      price,
                                    );
                                    const qty = toNumber(item.quantity);
                                    const hours =
                                      toNumber(item.hours_per_day) || 1;
                                    const total = computeItemTotal(
                                      qty,
                                      toNumber(price),
                                      hours,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.total_price`,
                                      total.toString(),
                                      false,
                                    );
                                  }}
                                  slotProps={{
                                    htmlInput: { min: 0 },
                                  }}
                                />
                              </Grid>

                              <Grid size={{ xs: 12, sm: 1.5 }}>
                                <NumberField
                                  fullWidth
                                  allowDecimal={true}
                                  allowNegative={false}
                                  decimalScale={2}
                                  label="Hours/Day"
                                  disabled={
                                    item.item_name === '' ||
                                    item.item_id === ''
                                  }
                                  name={`leadItems.${idx}.hours_per_day`}
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    setFieldValue(
                                      `leadItems.${idx}.hours_per_day`,
                                      raw,
                                    );
                                    const qty = toNumber(item.quantity) || 1;
                                    const unit = toNumber(item.unit_price);
                                    const hours = toNumber(raw) || 0;
                                    const total = computeItemTotal(
                                      qty,
                                      unit,
                                      hours || 1,
                                    );
                                    setFieldValue(
                                      `leadItems.${idx}.total_price`,
                                      total.toString(),
                                      false,
                                    );
                                  }}
                                  slotProps={{
                                    htmlInput: { min: 0, max: 24 },
                                  }}
                                />
                              </Grid>

                              <Grid size={{ xs: 12, sm: 1.5 }}>
                                <NumberField
                                  fullWidth
                                  allowDecimal={true}
                                  allowNegative={false}
                                  decimalScale={4}
                                  label="Total"
                                  disabled
                                  name={`leadItems.${idx}.total_price`}
                                  onChange={(e) => {
                                    const t = toNumber(e.target.value);
                                    setFieldValue(
                                      `leadItems.${idx}.total_price`,
                                      t.toString(),
                                    );
                                    const qty = toNumber(item.quantity) || 1;
                                    const hours =
                                      toNumber(item.hours_per_day) || 1;
                                    const denom = qty * (hours || 1);
                                    const newUnitPrice = denom
                                      ? +(t / denom).toFixed(2)
                                      : 0;
                                    setFieldValue(
                                      `leadItems.${idx}.unit_price`,
                                      newUnitPrice.toString(),
                                    );
                                  }}
                                />
                              </Grid>

                              <Grid size={{ xs: 8.5 }} sx={{ flexGrow: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  minRows={3}
                                  type="text"
                                  label="Notes"
                                  name={`leadItems.${idx}.notes`}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `leadItems.${idx}.notes`,
                                      e.target.value,
                                    );
                                  }}
                                />
                              </Grid>

                              {values.leadItems.length > 1 && (
                                <Grid size={{ xs: 12, sm: 1.5 }}>
                                  <DeleteIcon
                                    sx={{ cursor: 'pointer', color: 'red' }}
                                    onClick={() => remove(idx)}
                                  />
                                </Grid>
                              )}
                            </Grid>
                          </div>
                        );
                      })}

                      <Button
                        variant="contained"
                        onClick={() =>
                          push({
                            ...emptyLeadItemForm(),
                            item_type: 'service',
                            deal_type: 'rent',
                            quantity: '1',
                            unit_price: '0',
                            hours_per_day: '24',
                            total_price: '0',
                            // default to Lead start date so submit isn't blocked
                            start_date: values.leadDetails.start_date || todayISO(),
                            end_date: '',
                          })
                        }
                      >
                        + Add Item
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>
          </PageLayout.Content>

          <PageContainer sx={{ px: 0 }}>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              sx={{ mr: 2 }}
            >
              {submitLabel}
            </LoadingButton>
            {showCancel && onCancel && (
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
                type="button"
                variant="text"
                sx={{ px: 3, color: 'neutral.200' }}
              >
                Cancel
              </Button>
            )}
          </PageContainer>
        </PageLayout>
      )}
    </Formik>
  );
};

export default LeadForm;
