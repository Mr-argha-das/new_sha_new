const express = require("express");
const upload = require("../middlewares/upload");
const {
  createProduct,
  getAllProducts,
  getAllAvailableProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductTrackingHistory,
  incDecProductStock,
} = require("../controllers/product.controller");

const { authenticate } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");

const {
  validateCreateProduct,
  validateGetAllProducts,
  validateGetAllAvailableProducts,
  validateGetProductById,
  validateDeleteProduct,
  validateGetProductTrackingHistory,
  validateIncDecProductStock,
  validateUpdateProduct,
} = require("../validators/product.validator");

const router = express.Router();

router.post(
  "/create",
  [authenticate, upload.single("images"), validateBody(validateCreateProduct)],
  createProduct
);

router.get(
  "/getAll",
  [authenticate, validateBody(validateGetAllProducts, "query")],
  getAllProducts
);

router.get(
  "/getAllAvailable",
  [authenticate, validateBody(validateGetAllAvailableProducts, "query")],
  getAllAvailableProducts
);

router.get(
  "/get/:id",
  [authenticate, validateBody(validateGetProductById, "params")],
  getProductById
);

router.patch(
  "/update/:id",
  [authenticate, upload.single("images"), validateBody(validateUpdateProduct)],
  updateProduct
);

router.delete(
  "/delete/:id",
  [authenticate, validateBody(validateDeleteProduct, "params")],
  deleteProduct
);

router.get(
  "/getProductTrackingHistory",
  [authenticate, validateBody(validateGetProductTrackingHistory, "query")],
  getProductTrackingHistory
);

router.post(
  "/incDecProductStock",
  [authenticate, validateBody(validateIncDecProductStock)],
  incDecProductStock
)
module.exports = router;
