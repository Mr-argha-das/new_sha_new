const Joi = require("joi");

const validateAddStaffExperience = (data) => {
  console.log(data);

  // Parse referral_details if it's a JSON string (from FormData)
  if (data.referral_details && typeof data.referral_details === 'string') {
    try {
      data.referral_details = JSON.parse(data.referral_details);
    } catch (error) {
      // If parsing fails, set to null
      data.referral_details = null;
    }
  }

  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    staff_id: Joi.number().required(),
    org_name: Joi.string().required(),
    category_id: Joi.number().required(),
    from_month_year: Joi.date().required(),
    to_month_year: Joi.date()
      .min(Joi.ref("from_month_year"))
      .when("is_currently_working", {
        is: 1,
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
    total_experience_month: Joi.number().required(),
    is_currently_working: Joi.number().valid(0, 1).default(0),
    referral_details: Joi.object({
      name: Joi.string().optional(),
      designation: Joi.string().optional(),
      contact_no: Joi.string().optional(),
    }).optional().allow(null),
    worked_in: Joi.string().valid('icu', 'non-icu').optional().allow(null),
    description: Joi.string().allow('', null).optional(),
    documents: Joi.alternatives()
      .try(
        Joi.string(), // allow plain string
        Joi.array().items(
          Joi.object({
            id: Joi.string().uuid().optional(), // for updating existing docs
            name: Joi.string().required(),
            path: Joi.string().optional(),
          })
        )
      )
      .optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateStaffDeleteExperience = (data) => {
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

const validateGetStaffExperience = (data) => {
  const schema = Joi.object({
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

const validateAddStaffQualification = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    staff_id: Joi.number().required(),
    qualification_type: Joi.string().required(),
    qualification_name: Joi.string().required(),
    registration_no: Joi.string().allow("", null).optional(),
    year_of_passout: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateUpdateStaffQualification = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    qualification_type: Joi.string().required(),
    qualification_name: Joi.string().required(),
    registration_no: Joi.string().allow("", null).optional(),
    year_of_passout: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateDeleteStaffQualification = (data) => {
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

const validateAddStaffActivity = (data) => {
  const schema = Joi.array()
    .items(
      Joi.object({
        user_id: Joi.number().required(),
        account_id: Joi.number().required(),
        branch_id: Joi.number().required(),
        customer_id: Joi.number().required(),
        from_date_time: Joi.date().required(),
        to_date_time: Joi.date().min(Joi.ref("from_date_time")).required(),
        start_date_time: Joi.date().allow(null),
        end_date_time: Joi.date().allow(null),
        status: Joi.string().valid("todo"),
        service_id: Joi.number().required(),
        service_price: Joi.number().precision(2).required(),
        staff_working_hours: Joi.number().min(0).optional().allow(null),
      })
    )
    .min(1)
    .required();

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateStaffActivityUpdate = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid("todo", "onHold").required(),
    from_date_time: Joi.date().required(),
    to_date_time: Joi.date().required(),
    staff_working_hours: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateAdjustStaffActivityTime = (data) => {
  const schema = Joi.object({
    start_date_time: Joi.date().required(),
    end_date_time: Joi.date()
    .min(Joi.ref("start_date_time"))
    .required(),
    total_hour: Joi.number().min(0).required(),
    task_holds: Joi.array()
      .items(
        Joi.object({
          hold_start_at: Joi.date().required(),
          hold_end_at: Joi.date().allow(null).optional(),
          is_carry_forward: Joi.number().valid(0, 1).optional(),
          notes: Joi.string().allow("", null).optional(),
        }),
      )
      .optional(),
  });
  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateUpdateStaffActivityStatus = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    status: Joi.string().valid("inProgress", "done", "onHold").required(),
    note_by_staff: Joi.string().allow("", null).optional(),
    is_carry_forward: Joi.number().valid(0, 1).optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetStaffActivities = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    q: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    staff_id: Joi.number().optional(),
    status: Joi.string().optional(),
    payment_status: Joi.number().optional(),
    customer_id: Joi.number().optional(),
    service_id: Joi.number().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().min(Joi.ref("start_date")).optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateStaffQuickPay = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().required(),
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    date: Joi.date()
      .required()
      .custom((value, helpers) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        if (date > today) {
          return helpers.message("Date cannot be in the future");
        }
        return value;
      }),
    description: Joi.string().allow("", null),
    amount: Joi.number().precision(2).required(),
    status: Joi.number().valid(0, 1).default(0),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateUpdateStaffQuickPayStatus = (data) => {
  const schema = Joi.object({
    status: Joi.number().valid(0, 1).required(),
  });
  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateDeleteStaffActivity = (data) => {
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

const validateDeleteStaffInvoice = (data) => {
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

const validateStaffInvoice = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().required(),
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    from_date: Joi.date().required(),
    to_date: Joi.date().min(Joi.ref("from_date")).required(),
    invoice_status: Joi.string().valid("draft", "finalised").required(),

    // totals from frontend
    total_hours: Joi.number().precision(2).min(0).when("invoice_status", {
      is: "finalised",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    hour_price: Joi.number().precision(2).min(0).when("invoice_status", {
      is: "finalised",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    total_price: Joi.number().precision(2).min(0).when("invoice_status", {
      is: "finalised",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

    // new: ids and qp override flags
    activity_ids: Joi.array().items(Joi.number()).default([]),
    quickpay_ids: Joi.array().items(Joi.number()).default([]),
    quickpay_total_amount: Joi.number().precision(2).min(0).optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetStaffInvoices = (data) => {
  const schema = Joi.object({
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

const validateGetStaffQuickPays = (data) => {
  const schema = Joi.object({
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

const validateGetStaffInvoiceData = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().required(),
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    from_date: Joi.date().required(),
    to_date: Joi.date().min(Joi.ref("from_date")).required(),
    invoice_status: Joi.string().valid("draft", "finalised").optional(),
    q: Joi.string().allow("").optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    staff_id: Joi.number().optional(),
    status: Joi.string().optional(),
    payment_status: Joi.number().optional(),
    customer_id: Joi.number().optional(),
    service_id: Joi.number().optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetStaffActivityById = (data) => {
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

const validateGetAllStaffInvoices = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    staff_id: Joi.alternatives().try(Joi.number()).optional(),
    invoice_status: Joi.string().valid("draft", "finalised").optional(),
    q: Joi.string().allow("").optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    from_date: Joi.date().optional(),
    to_date: Joi.date().optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateStaffDashboardSummary = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    from_date: Joi.string().allow("", null).optional(),
    to_date: Joi.string().allow("", null).optional(),
  });

  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    }
    : null;
};

const validateGetBlockedStaffListByAccountBranch = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
  });
  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    } :
    null;
};

const validateGetAllInProgressStaffActivities = (data) => {
  const schema = Joi.object({
    account_id: Joi.number().required(),
    branch_id: Joi.number().required(),
    fetchAll: Joi.number().valid(0, 1).optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  });
  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    } :
    null;
};

const validateChangeStaffPasswordByAdmin = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(data);
  return error
    ? {
      error: true,
      message: error.details[0].message.replace(/['"]+/g, ""),
    } :
    null;
};

module.exports = {
  validateAddStaffActivity,
  validateStaffActivityUpdate,
  validateUpdateStaffActivityStatus,
  validateGetStaffActivities,
  validateStaffQuickPay,
  validateUpdateStaffQuickPayStatus,
  validateDeleteStaffActivity,
  validateStaffInvoice,
  validateGetStaffInvoices,
  validateAddStaffExperience,
  validateStaffDeleteExperience,
  validateGetStaffExperience,
  validateAddStaffQualification,
  validateUpdateStaffQualification,
  validateDeleteStaffQualification,
  validateGetStaffQuickPays,
  validateGetStaffInvoiceData,
  validateDeleteStaffInvoice,
  validateGetStaffActivityById,
  validateGetAllStaffInvoices,
  validateStaffDashboardSummary,
  validateGetBlockedStaffListByAccountBranch,
  validateGetAllInProgressStaffActivities,
  validateChangeStaffPasswordByAdmin,
  validateAdjustStaffActivityTime,
};
