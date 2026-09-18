module.exports = {
  supAdmin_role_id: 1,
  customer_role_id: 2,
  staff_role_id: 3,
  payment_status: {
    0: "unpaid",
    1: "partial",
    2: "paid",
    3: "carry-forward",
  },
  default_role_account_id: 0,
  default_role_branch_id: 0,
  lead_progress_status: {
    0: "created",
    1: "inProgress",
    2: "completed",
  },
  lead_draft_status: {
    0: "draft",
    1: "finalised",
    2: "onhold",
    3: "invalid",
  },
  product_tracking_status: {
    0: "on_rent",
    1: "returned",
    3: "sold",
  },
};
