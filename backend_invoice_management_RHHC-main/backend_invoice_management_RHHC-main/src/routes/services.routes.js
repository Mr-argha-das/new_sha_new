const express = require("express");
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/services.controller");
const { validateBody } = require("../middlewares/validate");
const {
  validateCreateService,
  validateGetAllServices,
  validateGetServiceById,
  validateDeleteService,
} = require("../validators/services.validator");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/create",
  [authenticate, validateBody(validateCreateService)],
  createService
);

router.get(
  "/getAll",
  [authenticate, validateBody(validateGetAllServices, "query")],
  getAllServices
);

router.get(
  "/get/:id",
  [authenticate, validateBody(validateGetServiceById, "params")],
  getServiceById
);

router.patch(
  "/update/:id",
  [authenticate, validateBody(validateCreateService)],
  updateService
);

router.delete(
  "/delete/:id",
  [authenticate, validateBody(validateDeleteService, "params")],
  deleteService
);

module.exports = router;
