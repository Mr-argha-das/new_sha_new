const Joi = require('joi');

const invoiceDetailsSchema = Joi.object({
    customer_id: Joi.number().required(),
    lead_id: Joi.number().required(),
    invoice_date: Joi.date().required(),
    total_amount: Joi.number().required(),
    sub_total: Joi.number().required(),
    paid_amount: Joi.number().required(),
    due_amount: Joi.number().required(),
    discount_amount: Joi.number().optional().default(0),
    transportation_charge: Joi.number().optional().default(0),
    other_charges: Joi.number().optional().default(0),
    last_invoice_due: Joi.number().optional().default(0),
    payment_status: Joi.valid(0, 1, 2).required(), // 0: unpaid, 1: partial, 2: paid
    invoice_status: Joi.string().valid('draft', 'published').required(),
    notes: Joi.string().allow('', null),
    is_deposit_counted: Joi.number().required(), // 0 = not,  1 = yes
    is_first_invoice: Joi.number().required(), //first invoice for lead => 0 = not,  1 = yes
    settlement_amount: Joi.number().optional().allow('', null),
    security_deposit: Joi.number().optional().allow('', null),
    payment_method: Joi.string().valid('cash', 'card', 'bank_transfer', 'cheque', 'upi', 'other').optional(),
    other_details: Joi.object().allow('', null).optional(),
}).custom((value, helpers) => {
    if (value.is_deposit_counted === 1 && value.payment_status !== 2) {
        return helpers.message(
            'If deposit is counted, payment_status must be paid'
        );
    }
    if (value.invoice_status === "draft" && value.payment_status == 2) {
        return helpers.message(
            'If invoice status is draft, payment_status cannot be paid'
        );
    }
    if (value.payment_status === 2 && value.invoice_status === "draft") {
        return helpers.message(
            'If payment_status is paid, invoice status cannot be draft'
        );
    }
    return value;
});

const invoiceItemSchema = Joi.object({
    lead_item_id: Joi.number().optional(),
    item_type: Joi.string().valid('product', 'service', 'payslip').required(),
    deal_type: Joi.string()
        .valid('rent', 'sell')
        .allow('', null)
        .when('item_type', {
            is: 'product',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
    item_id: Joi.number().required(),
    item_name: Joi.string().required(),
    quantity: Joi.number().required(),
    days: Joi.number().required(),
    hours_per_day: Joi.number().min(0).max(24).required(),
    unit_measure: Joi.string().optional(),
    unit_price: Joi.number().required(),
    total_price: Joi.number().required(),
    notes: Joi.string().allow('', null),

});

const validateCreateInvoioce = (data) => {
    const schema = Joi.object({
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        invoiceDetails: invoiceDetailsSchema.required(),
        invoiceItems: Joi.array().items(invoiceItemSchema).min(1).required(),
        // paymentDetails: paymentDetailsSchema
    }).custom((value, helpers) => {
        const status = value.invoiceDetails?.invoice_status;

        if (status === 'published') {
            if (!value.invoiceDetails) {
                return helpers.message('"invoiceDetails" is required when invoice_status is "published"');
            }
            if (!value.invoiceItems || !value.invoiceItems.length) {
                return helpers.message('"invoiceItems" must have at least 1 item when invoice_status is "published"');
            }
        }
        if (status === "draft") {
            if (value.paymentDetails) {
                return helpers.message('"PaymentDetails" only me added after invoice status is published');
            }
        }

        return value;
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateGetAllInvoices = (data) => {
    const schema = Joi.object({
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        q: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
        sort: Joi.string().optional(),
        order: Joi.string().valid("asc", "desc").optional(),
        from_date: Joi.date().optional().allow(null, ''),
        to_date: Joi.date().optional().allow(null, ''),
        lead_id: Joi.number().optional().allow(null, ''),
        customer_id: Joi.number().optional().allow(null, ''),
        invoice_status: Joi.string().valid('draft', 'published', 'cancelled').optional().allow(null, ''),
        payment_status: Joi.string().valid('paid', 'unpaid', 'partial', 'carry-forward').optional().allow(null, ''),
        is_deposit_counted: Joi.alternatives().try(Joi.number().valid(0, 1), Joi.allow('', null)).optional(),
        has_rent_products: Joi.alternatives().try(Joi.number().valid(0, 1), Joi.allow('', null)).optional(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateGetInvoiceById = (data) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateDeleteInvoice = (data) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateUpdateInvoice = (data) => {
    const schema = Joi.object({
        customer_id: Joi.number().required(),
        lead_id: Joi.number().required(),
        payment_status: Joi.valid(0, 1, 2).required(), // 0: unpaid, 1: partial, 2: paid
        invoice_status: Joi.string().valid('draft', 'published').required(),
        notes: Joi.string().allow('', null),
        total_amount: Joi.number().required(),
        // last_invoice_due: Joi.number().required(),
        due_amount: Joi.number().required(),
        is_deposit_counted: Joi.number().required(), // 0 = not,  1 = yes
        is_first_invoice: Joi.number().required(), //first invoice for lead => 0 = not,  1 = yes
        settlement_amount: Joi.number().optional().allow('', null),
        security_deposit: Joi.number().optional().allow('', null),
        payment_method: Joi.string().valid('cash', 'card', 'bank_transfer', 'cheque', 'upi', 'other').optional(),
        other_details: Joi.object().allow('', null).optional(),

    }).custom((value, helpers) => {
        if (value.is_deposit_counted === 1 && value.payment_status !== 2) {
            return helpers.message(
                'If deposit is counted, payment_status must be paid'
            );
        }
        if (value.invoice_status === "draft" && value.payment_status == 2) {
            return helpers.message(
                'If invoice status is draft, payment_status cannot be paid'
            );
        }
        if (value.payment_status === 2 && value.invoice_status === "draft") {
            return helpers.message(
                'If payment_status is paid, invoice status cannot be draft'
            );
        }
        return value;
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};


const validateAddPaymentRecord = (data) => {
    const schema = Joi.object({
        payment_date: Joi.date()
            .required()
            .custom((value, helpers) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const payment = new Date(value);
                payment.setHours(0, 0, 0, 0);
                if (payment > today) {
                    return helpers.message('Payment date cannot be in the future');
                }
                return value;
            }),
        amount: Joi.number().min(1).required(),
        payment_method: Joi.string().valid('cash', 'card', 'bank_transfer', 'cheque', 'upi', 'other').required(),
        notes: Joi.string().allow('', null),
        other_details: Joi.object().allow('', null),
    });
    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateGetCustomerLastInvoiceDueAmount = (data) => {
    const schema = Joi.object({
        exclude_id: Joi.number().optional(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateMarkRentedProductsReturned = (data) => {
    const schema = Joi.object({
        note: Joi.string().optional().allow('', null),
        return_date: Joi.date().required(),
        lead_id: Joi.number().required(),
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
    });
    const { error } = schema.validate(data);

    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};
module.exports = {
    validateCreateInvoioce,
    validateGetAllInvoices,
    validateGetInvoiceById,
    validateDeleteInvoice,
    validateUpdateInvoice,
    validateAddPaymentRecord,
    validateGetCustomerLastInvoiceDueAmount,
    validateMarkRentedProductsReturned,
}