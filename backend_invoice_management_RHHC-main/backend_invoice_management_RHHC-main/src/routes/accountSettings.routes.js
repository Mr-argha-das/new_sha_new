const express = require("express");
const {
    createAccountSettings,
    getAllAccountSettings,
    getAccountSettingsById,
    updateAccountSettings,
    deleteAccountSettings,
    getAccountSettingsByAccountAndBranch,
} = require("../controllers/accountSettings.controller");
const { validateBody } = require("../middlewares/validate");
const {
    validateCreateAccountSettings,
    validateUpdateAccountSettings,
    validateGetAll,
    validateGetAccountSettings,
    validateDeleteAccountSettings,
    validateGetByAccountAndBranch,
} = require("../validators/accountSettings.validator");
const { authenticate } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { account_id, branch_id } = req.body;
        if (!account_id || !branch_id) {
            return cb(new Error("account_id and branch_id are required"), null);
        }

        const uploadDir = path.join(__dirname, "../uploads/accountSettings", `${account_id}-${branch_id}`);

        // Ensure folder exists
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
    },
});

const uploadAccountSettings = multer({
    storage: storage,
});


const router = express.Router();

router.post(
    "/create",
    [
        authenticate,
        uploadAccountSettings.fields([
            { name: "logo", maxCount: 1 },
            { name: "qr_scanner", maxCount: 1 },
            { name: "stamp", maxCount: 1 },
            { name: "stamp_signature", maxCount: 1 }
        ]),
        validateBody(validateCreateAccountSettings)
    ],
    createAccountSettings
);

router.get(
    "/getAll",
    [authenticate, validateBody(validateGetAll, "query")],
    getAllAccountSettings
);

router.get(
    "/get/:id",
    [authenticate, validateBody(validateGetAccountSettings, "params")],
    getAccountSettingsById
);

router.patch(
    "/update/:id",
    [
        authenticate,
        uploadAccountSettings.fields([
            { name: "logo", maxCount: 1 },
            { name: "qr_scanner", maxCount: 1 },
            { name: "stamp", maxCount: 1 },
            { name: "stamp_signature", maxCount: 1 }
        ]),
        validateBody(validateUpdateAccountSettings)
    ],
    updateAccountSettings
);

router.delete(
    "/delete/:id",
    [authenticate, validateBody(validateDeleteAccountSettings, "params")],
    deleteAccountSettings
);

router.get(
    "/getByAccountAndBranch",
    [authenticate, validateBody(validateGetByAccountAndBranch, "query")],
    getAccountSettingsByAccountAndBranch
);

module.exports = router;
