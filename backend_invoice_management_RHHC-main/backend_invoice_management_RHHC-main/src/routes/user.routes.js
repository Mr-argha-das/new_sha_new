const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshToken,
  getMe,
  updateProfile,
  getDesignations,
} = require("../controllers/user.controller");
const { validateBody } = require("../middlewares/validate");
const {
  validateCreateUser,
  validateLogin,
  validateGetAll,
  validateGetUser,
  validateDeleteUser,
} = require("../validators/user.validator");
const {
  validateRequestPasswordReset,
  validateResetPassword,
} = require("../validators/passwordReset.validator");
const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/passwordReset.controller");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/temp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const sanitized = base.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filename = `${file.fieldname}_${sanitized}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});
const uploadUserDocs = multer({ storage: tempStorage });

router.post("/login", [validateBody(validateLogin)], login);

router.post(
  "/forgot-password",
  [validateBody(validateRequestPasswordReset)],
  requestPasswordReset
);

router.post(
  "/reset-password",
  [validateBody(validateResetPassword)],
  resetPassword
);

router.get("/me", [authenticate], getMe);

router.patch(
  "/update-profile",
  [authenticate],
  updateProfile
);

router.post("/refresh-token", refreshToken);

router.post(
  "/create",
  [authenticate,
    uploadUserDocs.fields([
      { name: "photo", maxCount: 1 },
      { name: "aadhar_card", maxCount: 1 },
      { name: "pan_card", maxCount: 1 },
      { name: "driving_license", maxCount: 1 },
      { name: "reference_aadhar", maxCount: 1 },
    ]),
    validateBody(validateCreateUser)],
  createUser
);

router.get("/getAll", [authenticate, validateBody(validateGetAll, "query")], getAllUsers);

router.get("/get/:id", [authenticate, validateBody(validateGetUser, "params")], getUserById);

router.patch(
  "/update/:id",
  [authenticate,
    uploadUserDocs.fields([
      { name: "photo", maxCount: 1 },
      { name: "aadhar_card", maxCount: 1 },
      { name: "pan_card", maxCount: 1 },
      { name: "driving_license", maxCount: 1 },
      { name: "reference_aadhar", maxCount: 1 },
    ]),
    validateBody(validateCreateUser)],
  updateUser
);

router.delete(
  "/delete/:id",
  [authenticate, validateBody(validateDeleteUser, "params")],
  deleteUser
);



router.get(
  "/designations",
  [authenticate],
  getDesignations
);

module.exports = router;
