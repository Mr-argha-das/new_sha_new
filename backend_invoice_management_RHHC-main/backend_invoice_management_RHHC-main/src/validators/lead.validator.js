const Joi = require("joi");

const assertItemDatesNotBeforeLeadStart = (leadStart, item, labelPrefix) => {
  if (!leadStart) return;
  const ls = new Date(leadStart);
  if (Number.isNaN(ls.getTime())) return;

  if (item?.start_date) {
    const s = new Date(item.start_date);
    if (!Number.isNaN(s.getTime()) && s.getTime() < ls.getTime()) {
      throw new Error(
        `${labelPrefix} start_date cannot be before lead start_date`,
      );
    }
  }
  if (item?.end_date) {
    const e = new Date(item.end_date);
    if (!Number.isNaN(e.getTime()) && e.getTime() < ls.getTime()) {
      throw new Error(
        `${labelPrefix} end_date cannot be before lead start_date`,
      );
    }
  }
};

const validateCreateLead = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    leadDetails: Joi.object({
      customer_id: Joi.number().required(),
      lead_name: Joi.string().required(),
      start_date: Joi.date().required(),
      security_deposit: Joi.number().required(),
      status: Joi.string()
        .valid("draft", "finalised", "onhold", "invalid")
        .required(),
      notes: Joi.string().optional().allow("", null),
    }).required(),
    leadItems: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().optional(),
          item_type: Joi.string()
            .valid("product", "service", "payslip")
            .required(),
          deal_type: Joi.string()
            .valid("rent", "sell")
            .allow("", null)
            .when("item_type", {
              is: "product",
              then: Joi.required(),
              otherwise: Joi.optional(),
            }),
          item_id: Joi.number().required(),
          item_name: Joi.string().required(),
          start_date: Joi.alternatives()
            .try(Joi.date(), Joi.string().trim().allow("", null))
            .optional(),
          end_date: Joi.alternatives()
            .try(Joi.date(), Joi.string().trim().allow("", null))
            .optional(),
          quantity: Joi.number().required(),
          unit_price: Joi.number().required(),
          hours_per_day: Joi.number().min(0).max(24).required(),
          total_price: Joi.number().required(),
          notes: Joi.string().allow("", null),
        })
      )
      .optional()
      .custom((items, helpers) => {
        const leadStart = helpers.state.ancestors?.[0]?.leadDetails?.start_date;
        if (!Array.isArray(items)) return items;
        items.forEach((it, idx) => {
          try {
            assertItemDatesNotBeforeLeadStart(leadStart, it, `leadItems[${idx}]`);
          } catch (e) {
            throw helpers.message({ custom: e.message });
          }
        });
        return items;
      }),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

// Validate for getting a lead by ID
const validateGetLeadById = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

// Validate for deleting a lead
const validateDeleteLead = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

// Validate for updating a lead
const validateUpdateLead = (data) => {
  const schema = Joi.object({
    customer_id: Joi.number().required(),
    lead_name: Joi.string().required(),
    start_date: Joi.date().required(),
    security_deposit: Joi.number().required(),
    status: Joi.string()
      .valid("draft", "finalised", "onhold", "invalid")
      .required(),
    notes: Joi.string().optional().allow("", null),
    leadItems: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().optional(),
          item_type: Joi.string()
            .valid("product", "service", "payslip")
            .required(),
          deal_type: Joi.string()
            .valid("rent", "sell")
            .allow("", null)
            .when("item_type", {
              is: "product",
              then: Joi.required(),
              otherwise: Joi.optional(),
            }),
          item_id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
          item_name: Joi.string().required(),
          start_date: Joi.alternatives()
            .try(Joi.date(), Joi.string().trim().allow("", null))
            .optional(),
          end_date: Joi.alternatives()
            .try(Joi.date(), Joi.string().trim().allow("", null))
            .optional(),
          quantity: Joi.number().required(),
          unit_price: Joi.number().required(),
          hours_per_day: Joi.number().min(0).max(24).required(),
          total_price: Joi.number().required(),
          notes: Joi.string().allow("", null),
        })
      )
      .optional()
      .custom((items, helpers) => {
        const leadStart = helpers.state.ancestors?.[0]?.start_date;
        if (!Array.isArray(items)) return items;
        items.forEach((it, idx) => {
          try {
            assertItemDatesNotBeforeLeadStart(leadStart, it, `leadItems[${idx}]`);
          } catch (e) {
            throw helpers.message({ custom: e.message });
          }
        });
        return items;
      }),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

const validateAddLeadItems = (data) => {
  const schema = Joi.array()
    .items(
      Joi.object({
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        lead_start_date: Joi.alternatives()
          .try(Joi.date(), Joi.string().trim().allow("", null))
          .optional(),
        item_type: Joi.string()
          .valid("product", "service", "payslip")
          .required(),
        deal_type: Joi.string()
          .valid("rent", "sell")
          .allow("", null)
          .when("item_type", {
            is: "product",
            then: Joi.required(),
            otherwise: Joi.optional(),
          }),
        item_id: Joi.number().required(),
        item_name: Joi.string().required(),
        start_date: Joi.alternatives()
          .try(Joi.date(), Joi.string().trim().allow("", null))
          .optional(),
        end_date: Joi.alternatives()
          .try(Joi.date(), Joi.string().trim().allow("", null))
          .optional(),
        quantity: Joi.number().required(),
        unit_price: Joi.number().required(),
        hours_per_day: Joi.number().min(0).max(24).required(),
        total_price: Joi.number().required(),
        notes: Joi.string().allow("", null),
      })
    )
    .min(1)
    .required()
    .custom((items, helpers) => {
      if (!Array.isArray(items)) return items;
      items.forEach((it, idx) => {
        try {
          assertItemDatesNotBeforeLeadStart(
            it?.lead_start_date,
            it,
            `leadItems[${idx}]`,
          );
        } catch (e) {
          throw helpers.message({ custom: e.message });
        }
      });
      return items;
    });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

// Validate for deleting a lead item
const validateDeleteLeadItem = (data) => {
  const schema = Joi.object({
    leadId: Joi.number().required(),
    itemId: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

// Validate for ending a lead item
const validateEndLeadItem = (data) => {
  const schema = Joi.object({
    leadId: Joi.number().required(),
    itemId: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

const validateEndLeadItemBody = (data) => {
  const schema = Joi.object({
    end_date: Joi.date().optional().allow(null, ""),
  });
  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

// Validate for getting all leads by account/branch
const validateGetAllLeadsByAccountBranchId = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    q: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    customer_id: Joi.number().optional(),
    start_date: Joi.string().optional(),
    end_date: Joi.string().optional(),
    status: Joi.string().valid("draft", "finalised", "onhold", "invalid").optional(),
    lead_status: Joi.string().valid("created", "inProgress", "completed").optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

// Validate for getting all leads by customer
const validateGetAllLeadsByCustomerId = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    customer_id: Joi.number().required(),
    orderBy: Joi.string().optional(),
    is_finalished: Joi.number().optional(),
    is_completed: Joi.number().optional(),
    productReturnPending: Joi.number().optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? { error: true, message: error.details[0].message.replace(/['"]+/g, "") }
    : null;
};

module.exports = {
  validateCreateLead,
  validateGetLeadById,
  validateDeleteLead,
  validateUpdateLead,
  validateAddLeadItems,
  validateDeleteLeadItem,
  validateEndLeadItem,
  validateEndLeadItemBody,
  validateGetAllLeadsByAccountBranchId,
  validateGetAllLeadsByCustomerId,
};
