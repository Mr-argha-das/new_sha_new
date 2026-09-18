const Joi = require("joi");

const validateCreateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional().allow("", null),
    mobile: Joi.string().required(),
    hour_price: Joi.number().optional().allow("", null),
    working_hours: Joi.number().optional().allow("", null),
    role_id: Joi.number().required(),
    permanent_address: Joi.alternatives()
      .try(Joi.object(), Joi.string()).optional().allow("", null),
    temporary_address: Joi.alternatives()
      .try(Joi.object(), Joi.string()).optional().allow("", null),
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    age: Joi.number().optional().allow("", null),
    date_of_birth: Joi.date().optional().allow("", null),
    marital_status: Joi.string().valid("married", "unmarried").optional().allow("", null),
    designation: Joi.string().optional().allow("", null),
    police_verification: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional(),
    medical_verification: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional(),
    gender: Joi.string().optional().allow("", null),
    aadhar_number: Joi.string().optional().allow("", null),
    pan_number: Joi.string().optional().allow("", null),
    driving_license_number: Joi.string().optional().allow("", null),
    aadhar_card_url: Joi.string().optional().allow(null, ""),
    photo_url: Joi.string().optional().allow(null, ""),
    pan_card_url: Joi.string().optional().allow(null, ""),
    driving_license_url: Joi.string().optional().allow(null, ""),
    has_driving_license: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional(),
    has_vehicle: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional(),
    status: Joi.string().valid("active", "inactive", "block").optional(),
    block_reason: Joi.string().optional().allow("", null),
    reference_relationship: Joi.string().optional().allow("", null),
    reference_mobile_1: Joi.string().optional().allow("", null),
    reference_mobile_2: Joi.string().optional().allow("", null),
    reference_aadhar_url: Joi.string().optional().allow("", null),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateLogin = (data) => {
  const schema = Joi.object({
    mobile: Joi.string().required(),
    password: Joi.string().required(),
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
    role_id: Joi.alternatives().try(Joi.number()).required(),
    isRoleIncluded: Joi.boolean().required(),
    status: Joi.string().optional().allow("", null),//staff status
    q: Joi.string().allow("").optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    has_vehicle: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional()
      .allow("", null),
    has_driving_license: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional()
      .allow("", null),
    designation: Joi.string().optional().allow("", null),
    police_verification: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional()
      .allow("", null),
    medical_verification: Joi.alternatives()
      .try(Joi.number().valid(0, 1), Joi.string().valid("0", "1"))
      .optional()
      .allow("", null),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetUser = (data) => {
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

const validateDeleteUser = (data) => {
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

module.exports = {
  validateCreateUser,
  validateLogin,
  validateGetAll,
  validateGetUser,
  validateDeleteUser,
};
