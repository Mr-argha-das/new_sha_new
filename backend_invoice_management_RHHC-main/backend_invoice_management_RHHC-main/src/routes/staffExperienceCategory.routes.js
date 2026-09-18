const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesForDropdown,
} = require("../controllers/staffExperienceCategory.controller");
const { validateBody } = require("../middlewares/validate");
const {
  validateCreateCategory,
  validateGetAllCategories,
  validateGetCategoryById,
  validateDeleteCategory,
  validateGetCategoriesForDropdown,
} = require("../validators/staffExperienceCategory.validator");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/create",
  [authenticate, validateBody(validateCreateCategory)],
  createCategory
);

router.get(
  "/getAll",
  [authenticate, validateBody(validateGetAllCategories, "query")],
  getAllCategories
);

router.get(
  "/getDropdown",
  [authenticate, validateBody(validateGetCategoriesForDropdown, "query")],
  getCategoriesForDropdown
);

router.get(
  "/get/:id",
  [authenticate, validateBody(validateGetCategoryById, "params")],
  getCategoryById
);

router.put(
  "/update/:id",
  [authenticate, validateBody(validateCreateCategory)],
  updateCategory
);

router.delete(
  "/delete/:id",
  [authenticate, validateBody(validateDeleteCategory, "params")],
  deleteCategory
);

module.exports = router;
