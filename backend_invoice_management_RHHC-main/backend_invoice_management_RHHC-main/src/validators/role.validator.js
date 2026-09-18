const Joi = require("joi");

const validateCreateRole = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    menu_map: Joi.object().required(),
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

const validateGetAll = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    q: Joi.string().allow("").optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    exclude_id: Joi.number().optional()
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetRole = (data) => {
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

const validateDeleteRole = (data) => {
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
  validateCreateRole,
  validateGetAll,
  validateGetRole,
  validateDeleteRole,
};
