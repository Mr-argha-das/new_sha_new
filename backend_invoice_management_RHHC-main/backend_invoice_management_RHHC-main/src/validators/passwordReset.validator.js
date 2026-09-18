const Joi = require("joi");

const validateRequestPasswordReset = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });

    const { error } = schema.validate(data);
    return error
        ? {
            error: true,
            message: error.details[0].message.replace(/['"]+/g, ""),
        }
        : null;
};

const validateResetPassword = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
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
    validateRequestPasswordReset,
    validateResetPassword,
};

