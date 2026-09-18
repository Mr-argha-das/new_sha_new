const express = require('express');
const { authenticate } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const leadController = require('../controllers/lead.controller');
const {
    validateCreateLead,
    validateGetLeadById,
    validateDeleteLead,
    validateUpdateLead,
    validateDeleteLeadItem,
    validateGetAllLeadsByAccountBranchId,
    validateGetAllLeadsByCustomerId,
    validateEndLeadItem,
    validateEndLeadItemBody,
} = require('../validators/lead.validator');

const router = express.Router();

router.post(
    "/create",
    [authenticate, validateBody(validateCreateLead)],
    leadController.createLead
);

router.get(
    "/get/:id",
    [authenticate, validateBody(validateGetLeadById, "params")],
    leadController.getLeadById
);

router.delete(
    "/delete/:id",
    [authenticate, validateBody(validateDeleteLead, "params")],
    leadController.deleteLead
);

router.patch(
    "/update/:id",
    [authenticate, validateBody(validateUpdateLead)],
    leadController.updateLead
);

router.post(
    "/addLeadItem/:id",
    [authenticate],
    leadController.addLeadItems
);

router.delete(
    "/:leadId/item/:itemId",
    [authenticate, validateBody(validateDeleteLeadItem, "params")],
    leadController.deleteLeadItem
);

router.patch(
    "/:leadId/item/:itemId/end",
    [authenticate, validateBody(validateEndLeadItem, "params"), validateBody(validateEndLeadItemBody, "body")],
    leadController.endLeadItem
);

router.get(
    "/getAll",
    [authenticate, validateBody(validateGetAllLeadsByAccountBranchId, "query")],
    leadController.getAllLeadsByAccountBranchId
);

router.get(
    "/getAllLeadsByCustomer",
    [authenticate, validateBody(validateGetAllLeadsByCustomerId, "query")],
    leadController.getAllLeadsByCustomerId
);

router.patch(
    "/update-deposit/:id",
    [authenticate],
    leadController.updateLeadDeposit
);

module.exports = router;