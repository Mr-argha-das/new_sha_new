import * as Yup from 'yup';
import { messages } from '@/modules/common/constant/messages';

export const addInvoiceValidationSchema = Yup.object({
    invoiceDetails: Yup.object({
        lead_id: Yup.number().required(messages.REQUIRED),
        customer_id: Yup.number().required(messages.REQUIRED),

        invoice_date: Yup.string().required(messages.REQUIRED),

        discount_amount: Yup.number().min(0, 'Must be ≥ 0').nullable(),
        transportation_charge: Yup.number().min(0, 'Must be ≥ 0').nullable(),
        other_charges: Yup.number().min(0, 'Must be ≥ 0').nullable(),
        last_invoice_due: Yup.number().min(0, 'Must be ≥ 0').nullable(),
        payment_status: Yup.number()
            .oneOf([0, 1, 2])
            .required(messages.REQUIRED)
            .when('is_deposit_counted', {
                is: 1,
                then: (schema) =>
                    schema.test(
                        'deposit-paid-check',
                        "If deposit is counted, payment status must be 'Paid'",
                        (value) => value === 2,
                    ),
            })
            .test(
                'paid-invoice-status-check',
                "If payment status is 'Paid', invoice must be 'Published'",
                function (value) {
                    const { invoice_status } = this.parent;
                    if (value === 2 && invoice_status !== 'published') {
                        return this.createError({
                            message:
                                "If payment status is 'Paid', invoice must be 'Published'",
                        });
                    }
                    return true;
                },
            ),
        invoice_status: Yup.string()
            .oneOf(['draft', 'published'])
            .required(messages.REQUIRED),
        notes: Yup.string().nullable(),
        security_deposit: Yup.number().nullable(),
        settlement_amount: Yup.number().nullable(),
        is_deposit_counted: Yup.number().oneOf([0, 1]),
    }),
    invoiceItems: Yup.array()
        .of(
            Yup.object({
                item_type: Yup.string()
                    .oneOf(['product', 'service'])
                    .required(messages.REQUIRED),
                deal_type: Yup.string()
                    .oneOf(['rent', 'sell'])
                    .nullable()
                    .when('item_type', {
                        is: 'product',
                        then: (schema) => schema.required(messages.REQUIRED),
                        otherwise: (schema) => schema.notRequired(),
                    }),
                item_id: Yup.string().required(messages.REQUIRED),
                item_name: Yup.string().required(messages.REQUIRED),
                start_date: Yup.string().nullable(),
                end_date: Yup.string()
                    .nullable()
                    .test('end-after-start', 'End date must be after start date', function (value) {
                        if (!value) return true;
                        const start = this.parent?.start_date;
                        if (!start) return true;
                        return String(value) >= String(start);
                    }),
                quantity: Yup.number().transform((v) => (v === '' || v == null ? undefined : Number(v))).min(1, 'Min 1').required(messages.REQUIRED),
                days: Yup.number().transform((v) => (v === '' || v == null ? 1 : Number(v))).min(1, 'Min 1').nullable(),
                hours_per_day: Yup.number()
                    .transform((v) => (v === '' || v == null ? 1 : Number(v)))
                    .min(0, 'Must be ≥ 0')
                    .max(24, 'Must be ≤ 24')
                    .nullable(),
                unit_price: Yup.number().transform((v) => (v === '' || v == null ? undefined : Number(v))).min(0, 'Must be ≥ 0').required(messages.REQUIRED),
                total_price: Yup.number().transform((v) => (v === '' || v == null ? undefined : Number(v))).min(0, 'Must be ≥ 0').required(messages.REQUIRED),
                notes: Yup.string().nullable(),
            }),
        )
        .test(
            'invoiceDateNotBeforeItemStart',
            'Invoice date cannot be before item start date',
            function (items) {
                const invoiceDate = this.parent?.invoiceDetails?.invoice_date;
                if (!invoiceDate || !Array.isArray(items)) return true;

                for (let i = 0; i < items.length; i += 1) {
                    const it = items[i] || {};
                    const start = it.start_date;
                    if (!start) continue;
                    if (String(invoiceDate) < String(start)) {
                        return this.createError({
                            path: 'invoiceDetails.invoice_date',
                            message: 'Invoice date cannot be before an item start date',
                        });
                    }
                }
                return true;
            },
        )
        .min(1, 'Add at least 1 item')
        .required(messages.REQUIRED),
});
