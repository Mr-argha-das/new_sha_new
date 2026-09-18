const express = require("express");
const invoiceController = require("../controllers/invoice.controller");
const { authenticate } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const {
    validateCreateInvoioce,
    validateGetAllInvoices,
    validateGetInvoiceById,
    validateDeleteInvoice,
    validateUpdateInvoice,
    validateAddPaymentRecord,
    validateGetCustomerLastInvoiceDueAmount,
    validateMarkRentedProductsReturned

} = require("../validators/invoice.validator");

const router = express.Router();

router.post(
    "/create",
    [authenticate, validateBody(validateCreateInvoioce)],
    invoiceController.createInvoice
);

router.get(
    "/getAll",
    [authenticate, validateBody(validateGetAllInvoices, "query")],
    invoiceController.getAllInvoicesOfAccount
);

router.get(
    "/get/:id",
    [authenticate, validateBody(validateGetInvoiceById, "params")],
    invoiceController.getInvoiceById
);
router.delete(
    "/delete/:id",
    [authenticate, validateBody(validateDeleteInvoice, "params")],
    invoiceController.deleteInvoice
);

router.put(
    "/update/:id",
    [authenticate, validateBody(validateUpdateInvoice)],
    invoiceController.updateInvoice
);

router.post(
    "/addPaymenet/:invoiceId",
    [authenticate, validateBody(validateAddPaymentRecord)],
    invoiceController.addPaymentRecord
);

router.post(
    "/getCustomerLastInvoiceDueAmount/:customerId/:leadId",
    [authenticate, validateBody(validateGetCustomerLastInvoiceDueAmount, "body")],
    invoiceController.getCustomerLastInvoiceDueAmount
);

router.post(
    "/markRentedProductsReturned",
    [authenticate, validateBody(validateMarkRentedProductsReturned)],
    invoiceController.markRentedProductsReturned
);

module.exports = router;