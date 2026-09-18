import * as Yup from 'yup';
import { messages } from '@/modules/common/constant/messages';

type LeadForValidation = { id: string | number; name: string; available_stock: number };


export const createLeadValidationSchema = (products: LeadForValidation[]) => {
    return Yup.object({
        leadDetails: Yup.object({
            lead_name: Yup.string().required(messages.REQUIRED),
            customer_id: Yup.number().required(messages.REQUIRED),
            start_date: Yup.string().trim().required(messages.REQUIRED),
            security_deposit: Yup.number().optional(),
            status: Yup.mixed<'draft' | 'finalised' | 'onhold' | 'invalid'>().oneOf(['draft', 'finalised', 'invalid', 'onhold']).required(messages.REQUIRED),
            notes: Yup.string().nullable(),
        }),
        leadItems: Yup.array()
            .of(
                Yup.object({
                    item_type: Yup.mixed<'product' | 'service'>().oneOf(['product', 'service']).required(messages.REQUIRED),
                    deal_type: Yup.string()
                        .oneOf(['rent', 'sell'])
                        .nullable()
                        .when('item_type', {
                            is: 'product',
                            then: schema => schema.required(messages.REQUIRED),
                            otherwise: schema => schema.notRequired()
                        }),
                    item_id: Yup.mixed<string | number>()
                        .required(messages.REQUIRED)
                        .test('itemIdRequired', messages.REQUIRED, (value) => {
                            if (value === null || value === undefined) return false;
                            if (String(value).trim() === '') return false;
                            const n = Number(value);
                            return Number.isFinite(n) && n > 0;
                        }),
                    item_name: Yup.string().required(messages.REQUIRED),
                    start_date: Yup.string().trim().required(messages.REQUIRED),
                    end_date: Yup.string()
                        .nullable()
                        .test('end-after-start', 'End date must be after start date', function (value) {
                            if (!value) return true;
                            const start = this.parent.start_date;
                            if (!start) return true;
                            return String(value) >= String(start);
                        }),
                    quantity: Yup.string()
                        .min(1, 'Min 1 unit')
                        .required(messages.REQUIRED)
                        .test('availableQuantity', 'Quantity exceeds available stock', function (value) {
                            const { item_type, item_id } = this.parent;
                            if (item_type !== 'product') return true;
                            const val = value as unknown;
                            if (val == null || val === '') return true;
                            const qty = Number(val);
                            if (!Number.isFinite(qty)) return true;
                            const product = products.find(p => p.id == item_id);
                            if (!product) return true; // product not in list, let required/item_id handle it
                            const available = Number(product.available_stock) || 0;
                            return qty <= available;
                        }),
                    unit_price: Yup.string().min(0, 'Must be ≥ 0').required(messages.REQUIRED),
                    hours_per_day: Yup.string()
                        .nullable()
                        .test('hoursPerDay', 'Must be ≥ 0 and ≤ 24', (value) => {
                            if (value == null || value === '') return true;
                            const n = Number(value);
                            return Number.isFinite(n) && n >= 0 && n <= 24;
                        }),
                    total_price: Yup.string().min(0, 'Must be ≥ 0').required(messages.REQUIRED),
                    notes: Yup.string().nullable(),
                })
            )
            .test(
                'itemStartNotBeforeLeadStart',
                'Item start date cannot be before lead start date',
                function (items) {
                    const leadStart = this.parent?.leadDetails?.start_date;
                    if (!leadStart || !Array.isArray(items)) return true;
                    for (let i = 0; i < items.length; i += 1) {
                        const it = items[i] as { start_date?: string };
                        if (!it?.start_date) continue;
                        if (String(it.start_date) < String(leadStart)) {
                            return this.createError({
                                path: `leadItems[${i}].start_date`,
                                message: 'Item start date cannot be before lead start date',
                            });
                        }
                    }
                    return true;
                },
            )
            .test(
                'availableQuantityTotal',
                'Total quantity exceeds available stock',
                function (items) {
                    if (!items || !Array.isArray(items)) return true;

                    const totals = new Map<string, number>();

                    for (const it of items as Array<Record<string, unknown>>) {
                        if (!it || it.item_type !== 'product') continue;
                        const id = it.item_id;
                        if (id == null || id === '') continue;
                        const key = String(id);

                        const rawQty = it.quantity;
                        if (rawQty == null || rawQty === '') continue;
                        const qty = Number(rawQty);
                        if (!Number.isFinite(qty)) continue;

                        totals.set(key, (totals.get(key) || 0) + qty);
                    }

                    for (const [productId, totalQty] of totals.entries()) {
                        const product = products.find(p => String(p.id) === productId);
                        if (!product) continue;
                        const available = Number(product.available_stock) || 0;
                        if (totalQty > available) {
                            return this.createError({
                                path: 'leadItems',
                                message: `${product.name} total quantity (${totalQty}) exceeds available stock (${available})`,
                            });
                        }
                    }

                    return true;
                },
            )
            .optional(),
    })
}