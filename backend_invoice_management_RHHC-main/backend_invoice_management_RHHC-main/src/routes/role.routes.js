const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/role.controller");
const { validateBody } = require("../middlewares/validate");
const {
  validateCreateRole,
  validateGetAll,
  validateGetRole,
  validateDeleteRole,
} = require("../validators/role.validator");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/create",
  [authenticate, validateBody(validateCreateRole)],
  createRole
);

router.get("/getAll", [validateBody(validateGetAll, "query")], getAllRoles);

router.get("/get/:id", [validateBody(validateGetRole, "params")], getRoleById);

router.patch(
  "/update/:id",
  [authenticate, validateBody(validateCreateRole)],
  updateRole
);

router.delete(
  "/delete/:id",
  [authenticate, validateBody(validateDeleteRole, "params")],
  deleteRole
);

module.exports = router;
