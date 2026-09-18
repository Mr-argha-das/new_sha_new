const Joi = require("joi");

const validateCreateService = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    hour_price: Joi.number().precision(2).required(),
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

const validateGetAllServices = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    q: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetServiceById = (data) => {
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

const validateDeleteService = (data) => {
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
  validateCreateService,
  validateGetAllServices,
  validateGetServiceById,
  validateDeleteService,
};
