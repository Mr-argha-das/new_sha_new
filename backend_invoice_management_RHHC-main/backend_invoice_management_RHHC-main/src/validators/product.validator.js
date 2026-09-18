const Joi = require("joi");

const validateCreateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    base_price: Joi.number().required(),
    sale_price: Joi.number().allow(null),
    hour_rent_price: Joi.number().allow(null),
    images: Joi.string().allow(null, ""),
    status: Joi.string().valid("active", "inactive").optional(),
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    purchase_date: Joi.date().allow("", null).optional(),
    total_stock: Joi.number().allow(null).optional().default(0),
    available_stock: Joi.number().allow(null).optional().default(0),
    rented_stock: Joi.number().allow(null).optional().default(0),
    sold_stock: Joi.number().allow(null).optional().default(0),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};
const validateUpdateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    base_price: Joi.number().required(),
    sale_price: Joi.number().allow(null),
    hour_rent_price: Joi.number().allow(null),
    images: Joi.string().allow(null, ""),
    status: Joi.string().valid("active", "inactive").optional(),
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    purchase_date: Joi.date().allow("", null).optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetAllProducts = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    q: Joi.alternatives().try(Joi.string(), Joi.number()).optional().allow(null, ""),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    status: Joi.string().optional().allow(null, ""),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetAllAvailableProducts = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    q: Joi.alternatives().try(Joi.string(), Joi.number()).optional().allow(null, ""),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetProductById = (data) => {
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

const validateDeleteProduct = (data) => {
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

const validateGetProductTrackingHistory = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    deal_type: Joi.string().valid('rent', 'sell', '').optional().allow(null, ''),
    from_date: Joi.date().optional().allow(null, ''),
    to_date: Joi.date().optional().allow(null, ''),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateIncDecProductStock = (data) => {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
    type: Joi.string().valid("increment", "decrement").required(),
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
  validateCreateProduct,
  validateUpdateProduct,
  validateGetAllProducts,
  validateGetAllAvailableProducts,
  validateGetProductById,
  validateDeleteProduct,
  validateGetProductTrackingHistory,
  validateIncDecProductStock,
};
