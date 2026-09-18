const Joi = require("joi");

const validateCreateAccountSettings = (data) => {
    const schema = Joi.object({
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        name: Joi.string().required(),
        logo: Joi.string().optional(),
        stamp: Joi.string().optional(),
        qr_scanner: Joi.string().optional(),
        stamp_signature: Joi.string().optional(),
        use_stamp_image: Joi.number().valid(0, 1).optional().default(0),
        address_lines: Joi.string().required(),
        mobile: Joi.string().optional(),
        email: Joi.string().email().optional(),
        website: Joi.string().uri().optional(),
        bank_details: Joi.string().optional(),
        extra_ids: Joi.string().optional(),
        service_type: Joi.string().optional(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateUpdateAccountSettings = (data) => {
    const schema = Joi.object({
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        name: Joi.string().required(),
        logo: Joi.string().optional(),
        stamp: Joi.string().optional(),
        qr_scanner: Joi.string().optional(),
        stamp_signature: Joi.string().optional(),
        use_stamp_image: Joi.number().valid(0, 1).optional().default(0),
        address_lines: Joi.string().required(),
        mobile: Joi.string().optional(),
        email: Joi.string().email().optional(),
        website: Joi.string().uri().optional(),
        bank_details: Joi.string().optional(),
        extra_ids: Joi.string().optional(),
        service_type: Joi.string().optional(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateGetAll = (data) => {
    const schema = Joi.object({
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        q: Joi.string().allow("").optional(),
        sort: Joi.string().optional(),
        order: Joi.string().valid("asc", "desc").optional(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateGetAccountSettings = (data) => {
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

const validateDeleteAccountSettings = (data) => {
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

const validateGetByAccountAndBranch = (data) => {
    const schema = Joi.object({
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        q: Joi.string().allow("").optional(),
        sort: Joi.string().optional(),
        order: Joi.string().valid("asc", "desc").optional(),
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
    validateCreateAccountSettings,
    validateUpdateAccountSettings,
    validateGetAll,
    validateGetAccountSettings,
    validateDeleteAccountSettings,
    validateGetByAccountAndBranch,
};
