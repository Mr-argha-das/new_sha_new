const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const {
  validateAddStaffActivity,
  validateStaffActivityUpdate,
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
  validateUpdateStaffActivityStatus,
  validateChangeStaffPasswordByAdmin,
  validateAdjustStaffActivityTime,
} = require("../validators/staff.validator");
const { validateBody } = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.userId;
    const tempPath = path.join(
      __dirname,
      "../uploads/staff/experience",
      String(userId)
    );

    // create directory if not exists
    fs.mkdirSync(tempPath, { recursive: true });
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/addExperience",
  [
    authenticate,
    upload.array("document_files"),
    validateBody(validateAddStaffExperience),
  ],
  staffController.addExperience
);

router.put(
  "/updateExperiance/:id",
  [
    authenticate,
    upload.array("document_files"),
    validateBody(validateAddStaffExperience),
  ],
  staffController.updateExperience
);

router.delete(
  "/deleteExperiance/:id",
  [authenticate, validateBody(validateStaffDeleteExperience, "params")],
  staffController.deleteExperience
);

router.get(
  "/getStaffExperience/:user_id",
  [authenticate, validateBody(validateGetStaffExperience, "query")],
  staffController.getExperiences
);

router.post(
  "/addQualification",
  [authenticate, validateBody(validateAddStaffQualification)],
  staffController.addQualification
);

router.put(
  "/updateQualification/:id",
  [authenticate, validateBody(validateUpdateStaffQualification)],
  staffController.updateQualification
);

router.delete(
  "/deleteQualification/:id",
  [authenticate, validateBody(validateDeleteStaffQualification, "params")],
  staffController.deleteQualification
);

router.post(
  "/addActivity",
  [authenticate, validateBody(validateAddStaffActivity)],
  staffController.addStaffActivity
);

//admin update activity
router.patch(
  "/updateActivity/:id",
  [authenticate, validateBody(validateStaffActivityUpdate)],
  staffController.updateStaffActivity
);

router.patch(
  "/adjustActivityTime/:id",
  [authenticate, validateBody(validateAdjustStaffActivityTime)],
  staffController.adjustStaffActivityTime
)
//staff update status
router.put(
  "/updateActivityStatus",
  [authenticate, validateBody(validateUpdateStaffActivityStatus)],
  staffController.updateStaffActivityStatus
);

router.get(
  "/activities",
  [authenticate, validateBody(validateGetStaffActivities, "query")],
  staffController.getAllStaffActivitiesofAccount
);

router.get(
  "/pastActivities",
  [authenticate, validateBody(validateGetStaffActivities, "query")],
  staffController.getAllStaffPastActivitiesofAccount
);
router.get(
  "/todayActivities",
  [authenticate, validateBody(validateGetStaffActivities, "query")],
  staffController.getAllStaffTodayActivitiesofAccount
);
router.get(
  "/getAllFutureTasks",
  [authenticate, validateBody(validateGetStaffActivities, "query")],
  staffController.getAllStaffFutureActivitiesofAccount
);

router.delete(
  "/deleteStaffActivity/:id",
  [authenticate, validateBody(validateDeleteStaffActivity, "params")],
  staffController.deleteStaffActivity
);

router.post(
  "/addStaffQuickPay",
  [authenticate, validateBody(validateStaffQuickPay)],
  staffController.addStaffQuickPay
);

router.post(
  "/updateStaffQuickPayStatus/:id",
  [authenticate, validateBody(validateUpdateStaffQuickPayStatus)],
  staffController.updateStaffQuickPayStatus
);

router.delete(
  "/deleteStaffQuickpay/:id",
  [authenticate, validateBody(validateDeleteStaffActivity, "params")],
  staffController.deleteStaffQuickPay
);

router.post(
  "/createStaffInvoice",
  [authenticate, validateBody(validateStaffInvoice)],
  staffController.createStaffInvoice
);

router.put(
  "/updateStaffInvoice/:id",
  [authenticate],
  staffController.updateStaffInvoice
);

router.post(
  "/getStaffInvoiceCreateData",
  [authenticate, validateBody(validateGetStaffInvoiceData)],
  staffController.getStaffInvoiceCreateData
);

router.get(
  "/getStaffInvoices/:userId",
  [authenticate, validateBody(validateGetStaffInvoices, "query")],
  staffController.getAllInvoiceStaffById
);

router.delete(
  "/deleteStaffInvoice/:id",
  [authenticate, validateBody(validateDeleteStaffInvoice, "params")],
  staffController.deleteStaffInvoice
);

router.get(
  "/getStaffInvoiceById/:id",
  [authenticate],
  staffController.getStaffInvoiceById
);

router.post(
  "/getLastInvoiceDateOfStaff/:userId",
  [authenticate, validateBody(validateGetStaffInvoices)],
  staffController.getLastInvoiceDateOfStaff
);

router.get(
  "/getStaffQuickPays/:userId",
  [authenticate, validateBody(validateGetStaffQuickPays, "query")],
  staffController.getAllQuickPaysByStaffId
);

router.get(
  "/getAllStaffInvoices",
  [authenticate, validateBody(validateGetAllStaffInvoices, "query")],
  staffController.getAllStaffInvoices
);

// Get staff activity by ID
router.get(
  "/activity/:id",
  [authenticate, validateBody(validateGetStaffActivityById, "params")],
  staffController.getStaffActivityById
);

// Admin: soft-delete a task hold row
router.delete(
  "/taskHold/:id",
  [authenticate, validateBody(validateDeleteStaffActivity, "params")],
  staffController.softDeleteTaskHold
);

router.post(
  "/dashboardSummary",
  [authenticate, validateBody(validateStaffDashboardSummary, "body")],
  staffController.getStaffDashboardSummary
);

// Get blocked staff list by account branch
router.get(
  "/getBlockedStaffListByAccountBranch",
  [authenticate, validateBody(validateGetBlockedStaffListByAccountBranch, "query")],
  staffController.getBlockedStaffListByAccountBranch
);

// Get all in-progress staff activities by account branch
router.get(
  "/getAllInProgressStaffActivities",
  [authenticate, validateBody(validateGetAllInProgressStaffActivities, "query")],
  staffController.getAllInProgressStaffActivities
);

// Change staff password admin. 
router.post(
  "/changeStaffPassword",
  [authenticate, validateBody(validateChangeStaffPasswordByAdmin)],
  staffController.changeStaffPasswordByAdmin
);
module.exports = router;
