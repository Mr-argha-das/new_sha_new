const serverResponse = require("../utils/serverResponse");
const invoiceService = require("../services/invoice.service");
const leadService = require("../services/lead.service");
const productTrackingService = require("../services/productTracking.service");
const db = require("../config/db");
const { toDDMMYYYY, parseJsontoString } = require("../utils/util");



exports.createInvoice = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { userId } = req.user;
    const body = req.body;

    const invoiceData = {
      ...body.invoiceDetails,
      created_by: userId,
      account_id: body.account_id,
      branch_id: body.branch_id,
    };


    // --- Validation: Payment vs. Status ---
    if (
      Number(invoiceData.payment_status) === 2 &&
      invoiceData.invoice_status === "draft"
    ) {
      await conn.rollback();
      return serverResponse.badRequest(req, res, {
        message:
          "Please set invoice status to 'published' before marking payment as 'paid'.",
      });
    }

    // --- Validation: Last invoice must be published ---
    const lastInvoice = await invoiceService.getCustomerLastInvoice(
      invoiceData.customer_id,
      invoiceData.lead_id,
      null
    );
    if (lastInvoice && lastInvoice.invoice_status === "draft") {
      await conn.rollback();
      return serverResponse.badRequest(req, res, {
        message:
          "Please publish the previous invoice for this customer lead before creating a new one.",
      });
    }
    // --- Handle Deposit / Settlement ---
    if (Number(invoiceData.is_deposit_counted) === 0) {
      invoiceData.settlement_amount = null;
      invoiceData.security_deposit = null;
    }

    let hasProduct = false;
    let hasService = false;

    for (const item of body.invoiceItems) {
      if (item.item_type === "product") hasProduct = true;
      else if (item.item_type === "service") hasService = true;

      if (hasProduct && hasService) break;
    }

    let invoiceNoPrefix;
    if (hasProduct && hasService) invoiceNoPrefix = "S_P";
    else if (hasProduct) invoiceNoPrefix = "P";
    else if (hasService) invoiceNoPrefix = "S";

    let invoiceNoPrefixWithDate = `${invoiceNoPrefix}_${toDDMMYYYY(
      new Date()
    ).replace(/-/g, "_")}`;
    invoiceData.invoiceNoPrefixWithDate = invoiceNoPrefixWithDate;
    // --- Create New Invoice ---
    const { newInvoiceId, newInvoiceNumber } =
      await invoiceService.createInvoice(invoiceData, conn);

    // --- Handle Carry Forward from Last Invoice ---
    if (lastInvoice && Number(invoiceData.last_invoice_due) > 0) {
      // only update status
      await invoiceService.updateInvoicePaymentRecord(
        lastInvoice.id,
        {
          paid_amount: lastInvoice.paid_amount,
          due_amount: lastInvoice.due_amount,
          payment_status: 3,
          updated_by: userId,
        },
        conn
      );

      const carryForwardPayload = {
        account_id: body.account_id,
        branch_id: body.branch_id,
        from_invoice_id: lastInvoice.id,
        to_invoice_id: newInvoiceId,
        customer_id: invoiceData.customer_id,
        lead_id: invoiceData.lead_id,
        amount: invoiceData.last_invoice_due,
        userId,
      };

      await invoiceService.createCarryForwardRecord(carryForwardPayload, conn);
    }

    // --- Create Invoice Items ---
    // Prevent duplicate billing: block already-billed lead_items (status = 2)
    const okToBill = await leadService.assertInvoiceItemsNotAlreadyBilled(
      {
        lead_id: invoiceData.lead_id,
        account_id: body.account_id,
        branch_id: body.branch_id,
        invoiceItems: body.invoiceItems,
      },
      conn,
    );
    if (!okToBill) {
      await conn.rollback();
      return serverResponse.badRequest(req, res, {
        message:
          "Some lead items are already billed (status = 2). Please refresh and generate invoice again.",
      });
    }

    // Allow billing:
    // - ongoing items (status = 0, end_date empty) => billed by invoice date range
    // - completed items (status = 1, end_date present) => billed once, then status -> 2 on publish
    const eligibleToBill = await leadService.assertInvoiceItemsEligibleToBill(
      {
        lead_id: invoiceData.lead_id,
        account_id: body.account_id,
        branch_id: body.branch_id,
        invoiceItems: body.invoiceItems,
      },
      conn,
    );
    if (!eligibleToBill) {
      await conn.rollback();
      return serverResponse.badRequest(req, res, {
        message:
          "Some lead items are not eligible to bill (must be ongoing with no end_date, or completed with end_date). Please refresh and generate invoice again.",
      });
    }

    // if (Array.isArray(body.invoiceItems) && body.invoiceItems.length) {
    const itemPromises = body.invoiceItems.map((item) => {
      const itemData = {
        invoice_id: newInvoiceId,
        account_id: body.account_id,
        branch_id: body.branch_id,
        item_type: item.item_type,
        deal_type: item.deal_type,
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        days: item.days,
        unit_price: item.unit_price,
        hours_per_day: item.hours_per_day,
        notes: item.notes || null,
        created_by: userId,
        updated_by: userId,
      };
      return invoiceService.createInvoiceItem(itemData, conn);
    });

    await Promise.all(itemPromises);
    // }

    if (invoiceData.invoice_status === "published") {
      // Mark completed items (status=1) as billed (status=2) once included in an invoice
      await leadService.markCompletedItemsAsBilledAfterInvoice(
        {
          lead_id: invoiceData.lead_id,
          account_id: body.account_id,
          branch_id: body.branch_id,
          invoiceItems: body.invoiceItems,
          updated_by: userId,
        },
        conn,
      );

      // --- Update Lead Status ---
      let lead_status = null;
      if (Number(invoiceData.is_deposit_counted)) {
        const hasRentProduct = await leadService.leadHasRentedProducts(invoiceData.lead_id, conn);
        lead_status = hasRentProduct ? "productReturnPending" : "completed";

        // update lead and product tracking end date
        await invoiceService.updateLeadAndProductTrackingEndDate({
          leadId: invoiceData.lead_id,
          endDate: new Date(invoiceData.invoice_date),
        }, conn)
        
      } else if (Number(invoiceData.is_first_invoice)) {
        lead_status = "inProgress";
      }

      if (lead_status) {
        await leadService.updateLeadStatus(
          {
            lead_status,
            lead_id: invoiceData.lead_id,
            updated_by: userId,
          },
          conn
        );
      }

      // Add payment record to last invoice (carry-forward)
      if (lastInvoice && Number(invoiceData.last_invoice_due) > 0) {
        const oldInvoicePaymentData = {
          invoice_id: lastInvoice.id,
          created_by: userId,
          account_id: body.account_id,
          branch_id: body.branch_id,
          payment_date: invoiceData.invoice_date,
          amount: invoiceData.last_invoice_due,
          notes: `Invoice due amount carried forward to invoice ${newInvoiceNumber}.`,
          payment_method: "carry-forward",
        };
        await invoiceService.createPaymentRecord(oldInvoicePaymentData, conn);

        await invoiceService.updateInvoicePaymentRecord(
          lastInvoice.id,
          {
            paid_amount: lastInvoice.total_amount,
            due_amount: 0,
            payment_status: 3,
            updated_by: userId,
          },
          conn
        );
      }
    }

    // --- Handle Payments ---
    if (Number(invoiceData.payment_status) === 2) {

      const paymentMethod =
        invoiceData.payment_method && String(invoiceData.payment_method).trim()
          ? String(invoiceData.payment_method).toLowerCase()
          : "cash";
      let otherDetails = null;
      if (invoiceData.other_details && typeof invoiceData.other_details === "object") {
        otherDetails = JSON.stringify(invoiceData.other_details);
      }

      const paymentData = {
        invoice_id: newInvoiceId,
        account_id: body.account_id,
        branch_id: body.branch_id,
        payment_date: invoiceData.invoice_date,
        amount: invoiceData.total_amount,
        payment_method: paymentMethod.toLowerCase(),
        other_details: otherDetails,
        notes: null,
      };

      await invoiceService.createPaymentRecord(paymentData, conn);
      await invoiceService.updateInvoicePaymentRecord(
        newInvoiceId,
        {
          paid_amount: invoiceData.total_amount,
          due_amount: 0,
          payment_status: 2,
          updated_by: userId,
        },
        conn
      );
    }

    // ✅ Commit
    await conn.commit();

    return serverResponse.success(req, res, {
      message: "Invoice created successfully",
      data: { invoiceId: newInvoiceId },
    });
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    await conn.rollback();
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to create invoice",
    });
  } finally {
    conn.release();
  }
};

exports.getAllInvoicesOfAccount = async (req, res) => {
  try {
    const data = req.query;
    const invoices = await invoiceService.getAllInvoicesByAccount(data);
    const result = {
      message: "Invoices fetch successfully",
      data: invoices.data,
    };
    const meta = {
      total: invoices.totalRecords,
      limit: invoices.pageSize,
      currentPage: invoices.currentPage,
    };
    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to get invoice",
    });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) {
      return serverResponse.notFound(req, res, {
        message: "Invoice not found",
      });
    }
    console.log(invoice);
    return serverResponse.success(req, res, {
      message: "Invoice fetch successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to get invoice",
    });
  }
};

exports.deleteInvoice = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const updated_by = req.user.userId;
    const invoiceId = req.params.id;

    // Get the invoice to check for carry forward
    const invoice = await invoiceService.getInvoiceById(invoiceId, conn);
    if (!invoice) {
      return serverResponse.notFound(req, res, {
        message: "Invoice not found",
      });
    }

    // Check if this invoice has carry forward records
    const carryForward = await invoiceService.getCarryForwardBYInvoiceId(
      {
        to_invoice_id: invoiceId,
        customer_id: invoice.customer_id,
        lead_id: invoice.lead_id,
      },
      conn
    );

    if (carryForward) {
      // Revert the from_invoice back to its original state
      const fromInvoice = await invoiceService.getInvoiceById(
        carryForward.from_invoice_id,
        conn
      );
      let updateData = {};
      if (invoice.invoice_status === "draft") {
        console.log("draft invoice so just updating... pay st of last invoice");
        updateData.paid_amount = Number(fromInvoice.paid_amount);
        updateData.due_amount = Number(fromInvoice.due_amount);
        updateData.payment_status = 1;
        updateData.updated_by = updated_by;
      } else {
        console.log("published invoice so updating amount also...");
        updateData.paid_amount =
          Number(fromInvoice.paid_amount) - Number(carryForward.amount);
        updateData.due_amount =
          Number(fromInvoice.due_amount) + Number(carryForward.amount);
        updateData.payment_status =
          Number(fromInvoice.paid_amount) - Number(carryForward.amount) > 0
            ? 1
            : 0; // partial or unpaid
        updateData.updated_by = updated_by;

        await invoiceService.deleteLastPaymentHistory(fromInvoice.id, conn);
      }
      // Revert payment status and amounts
      await invoiceService.updateInvoicePaymentRecord(
        carryForward.from_invoice_id,
        updateData,
        conn
      );

      // Delete carry forward record
      await invoiceService.deleteCarryForwardRecord(
        {
          to_invoice_id: invoiceId,
          customer_id: invoice.customer_id,
          lead_id: invoice.lead_id,
        },
        conn
      );
    }

    const deleteInvoice = await invoiceService.deleteInvoice(
      invoiceId,
      updated_by,
      conn
    );

    if (invoice.is_deposit_counted == 1) {
      await leadService.updateLeadStatus(
        {
          lead_status: "inProgress",
          lead_id: invoice.lead_id,
          updated_by,
        },
        conn
      );
    }
    await conn.commit();

    return serverResponse.success(req, res, {
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to delete invoice",
    });
  } finally {
    conn.release();
  }
};

exports.updateInvoice = async (req, res) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const data = req.body;
    const id = req.params.id;
    const { userId } = req.user;

    const existingInvoice = await invoiceService.getInvoiceById(id, conn);
    if (!existingInvoice) {
      await conn.rollback();
      return serverResponse.notFound(req, res, {
        message: "Invoice not found",
      });
    }

    // Prevent updates to published invoices
    if (existingInvoice.invoice_status === "published") {
      await conn.rollback();
      return serverResponse.badRequest(req, res, {
        message: "Cannot update invoice once it is published",
      });
    }

    // Prevent publishing without items
    if (
      data.invoice_status === "published" &&
      (!Array.isArray(existingInvoice.items) ||
        existingInvoice.items.length === 0)
    ) {
      await conn.rollback();
      return serverResponse.badRequest(req, res, {
        message:
          "At least one invoice item is required to publish the invoice.",
      });
    }

    // --- Handle Publishing Logic ---
    if (data.invoice_status === "published") {
      console.log("Publishing invoi`ce...");

      // Mark completed items (status=1) as billed (status=2) and roll forward ongoing items (status=0)
      // when a draft invoice is published later.
      const itemsForLeadUpdate = Array.isArray(existingInvoice.items) ? existingInvoice.items : [];
      if (itemsForLeadUpdate.length) {
        await leadService.markCompletedItemsAsBilledAfterInvoice(
          {
            lead_id: existingInvoice.lead_id,
            account_id: existingInvoice.account_id,
            branch_id: existingInvoice.branch_id,
            invoiceItems: itemsForLeadUpdate,
            updated_by: userId,
          },
          conn,
        );
      }

      const cf = await invoiceService.getCarryForwardBYInvoiceId(
        {
          to_invoice_id: existingInvoice.id,
          customer_id: data.customer_id,
          lead_id: data.lead_id,
        },
        conn
      );

      if (cf) {
        console.log("Carry-forward found:", cf.id);

        const fromInvoice = await invoiceService.getInvoiceById(
          cf.from_invoice_id,
          conn
        );

        await invoiceService.updateInvoicePaymentRecord(
          fromInvoice.id,
          {
            paid_amount: fromInvoice.total_amount,
            due_amount: 0,
            payment_status: 3,
            updated_by: userId,
          },
          conn
        );

        // Add payment record for carry-forward
        await invoiceService.createPaymentRecord(
          {
            invoice_id: fromInvoice.id,
            created_by: userId,
            account_id: existingInvoice.account_id,
            branch_id: existingInvoice.branch_id,
            payment_date: existingInvoice.invoice_date,
            amount: cf.amount,
            notes: `Invoice due amount carried forward to invoice ${existingInvoice.invoice_number}`,
            payment_method: "carry-forward",
          },
          conn
        );
      }
      // --- Lead Status Update ---
      const isFirstInvoice = Number(data.is_first_invoice);
      const isDepositCounted = Number(data.is_deposit_counted);

      let lead_status = null;
      if (isDepositCounted) {
        const hasRentProduct = await leadService.leadHasRentedProducts(data.lead_id, conn);
        lead_status = hasRentProduct ? "productReturnPending" : "completed";
          // update lead and product tracking end date
          await invoiceService.updateLeadAndProductTrackingEndDate({
            leadId: existingInvoice.lead_id,
            endDate: new Date(existingInvoice.invoice_date),
          }, conn)
      }
      else if (isFirstInvoice) lead_status = "inProgress";

      if (lead_status) {
        await leadService.updateLeadStatus(
          {
            lead_status,
            lead_id: data.lead_id,
            updated_by: userId,
          },
          conn
        );
      }

      // --- Handle Full Payment ---
      if (Number(data.payment_status) === 2) {
        const paymentMethod =
          data.payment_method && String(data.payment_method).trim()
            ? String(data.payment_method).toLowerCase()
            : "cash";
        let otherDetails = null;
        if (data.other_details && typeof data.other_details === "object") {
          otherDetails = JSON.stringify(data.other_details);
        }

        const paymentData = {
          invoice_id: existingInvoice.id,
          account_id: existingInvoice.account_id,
          branch_id: existingInvoice.branch_id,
          payment_date: data.invoice_date || existingInvoice.invoice_date,
          amount: data.total_amount,
          payment_method: paymentMethod,
          other_details: otherDetails,
          notes: null,
        };

        await invoiceService.createPaymentRecord(paymentData, conn);
        // await invoiceService.updateInvoicePaymentRecord(existingInvoice.id, {
        //     paid_amount: data.total_amount,
        //     due_amount: 0,
        //     payment_status: 2,
        //     updated_by: userId
        // }, conn);
        data.due_amount = 0;
        data.paid_amount = data.total_amount;
        data.payment_status = 2;
      } else {
        data.paid_amount = 0;
      }
    }

    // --- Update Invoice Record ---
    data.updated_by = userId;
    await invoiceService.updateInvoice(id, data, conn);

    // ✅ Commit the transaction
    await conn.commit();

    return serverResponse.success(req, res, {
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    await conn.rollback();
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to update invoice",
    });
  } finally {
    conn.release();
  }
};

exports.addPaymentRecord = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    console.log(req.body, invoiceId);
    const { userId } = req.user;
    const existingInvoice = await invoiceService.getInvoiceById(invoiceId);
    if (!existingInvoice) {
      return serverResponse.notFound(req, res, {
        message: "Invoice not found",
      });
    }
    if (existingInvoice.invoice_status !== "published") {
      return serverResponse.badRequest(req, res, {
        message: "Cannot add payment record once it is draft",
      });
    }
    if (existingInvoice.payment_status === "paid") {
      return serverResponse.badRequest(req, res, {
        message: "Cannot add payment record once it is paid",
      });
    }
    if (req.body.amount > Number(existingInvoice.due_amount)) {
      return serverResponse.badRequest(req, res, {
        message: "Payment amount exceeds due amount",
      });
    }

    const other_details = req.body.other_details
      ? parseJsontoString(req.body.other_details)
      : null;
    const paymentData = {
      ...req.body,
      created_by: userId,
      account_id: existingInvoice.account_id,
      branch_id: existingInvoice.branch_id,
      invoice_id: invoiceId,
      other_details,
    };

    const addPaymentRecord = await invoiceService.createPaymentRecord(
      paymentData
    );
    if (addPaymentRecord) {
      const invoiceAmount = Number(existingInvoice.total_amount);
      const paidAmount = Number(existingInvoice.paid_amount);
      const dueAmount = Number(existingInvoice.due_amount);
      const newPaidAmount = paidAmount + Number(paymentData.amount);
      const newDueAmount = dueAmount - Number(paymentData.amount);
      if (newDueAmount == 0 && newPaidAmount == invoiceAmount) {
        await invoiceService.updateInvoicePaymentRecord(invoiceId, {
          paid_amount: newPaidAmount,
          due_amount: 0,
          payment_status: 2,
          updated_by: userId,
        });
      } else {
        await invoiceService.updateInvoicePaymentRecord(invoiceId, {
          paid_amount: newPaidAmount,
          due_amount: newDueAmount,
          payment_status: 1,
          updated_by: userId,
        });
      }
    }
    const resData = {
      receiptNo: addPaymentRecord,
      date: paymentData.payment_date,
      from: existingInvoice.customer_name,
      rupees: paymentData.amount,
      againstBillNo: existingInvoice.invoice_number,
      onAccountOf: "RHHC",
      paymentMethod: paymentData.payment_method,
      other_details: other_details ? req.body.other_details : null,
    };
    return serverResponse.success(req, res, {
      message: "Payment record added successfully",
      data: resData,
    });
  } catch (error) {
    console.error(error);
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to add payment record",
    });
  }
};

exports.getCustomerLastInvoiceDueAmount = async (req, res) => {
  try {
    const { customerId, leadId } = req.params;
    const { exclude_id = null } = req.body; // id of invoice that will not invluded(current invoice)
    const lastInvoice = await invoiceService.getCustomerLastInvoice(
      customerId,
      leadId,
      exclude_id
    );
    if (!lastInvoice) {
      return serverResponse.success(req, res, {
        data: {
          dueAmount: 0,
          lastInvoiceDate: null,
          lastInvoiceItems: [],
        },
      });
    }

    if (lastInvoice.invoice_status === "draft") {
      return serverResponse.badRequest(req, res, {
        message:
          "Please update the invoice status of the previous invoice for this customer lead to Published.",
      });
    }

    const lastInvoiceItems = await invoiceService.getInvoiceItemsByInvoiceId(
      lastInvoice.id,
    );

    return serverResponse.success(req, res, {
      data: {
        dueAmount: parseFloat(lastInvoice.due_amount),
        lastInvoiceDate: lastInvoice.invoice_date,
        lastInvoiceItems,
      },
    });
  } catch (error) {
    console.error(error);
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to get last invoice due amount",
    });
  }
};

exports.markRentedProductsReturned = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { note, return_date, lead_id, account_id, branch_id } = req.body;
    const userId = req.user.userId;
    const existingLead = await leadService.getLeadById(lead_id);
    if (!existingLead) {
      await conn.rollback();
      return serverResponse.notFound(req, res, {
        message: "Lead not found",
      });
    }
    if (existingLead.lead_status !== "productReturnPending") {
      await conn.rollback();
      return serverResponse.badRequest(req, res, {
        message: "Lead is not in product return pending status",
      });
    }
    const productTracking = await productTrackingService.returnRentedProductsForInvoice(
      account_id,
      branch_id,
      lead_id,
      return_date,
      note,
      userId,
      conn
    );
    console.log({ lead_id, lead_status: "completed", updated_by: userId })
    await leadService.updateLeadStatus({
      lead_status: "completed",
      lead_id: lead_id,
      updated_by: userId,
    }, conn);
    await conn.commit();
    return serverResponse.success(req, res, {
      message: "Rented products marked as returned successfully",
    });
  } catch (error) {
    console.error(error);
    await conn.rollback();
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to mark rented products returned",
    });
  } finally {
    conn.release();
  }
}