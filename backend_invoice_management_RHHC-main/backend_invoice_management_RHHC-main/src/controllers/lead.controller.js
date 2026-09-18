const leadService = require('../services/lead.service');
const productTrackingService = require('../services/productTracking.service');
const serverResponse = require('../utils/serverResponse');
const db = require('../config/db');
const { validateAddLeadItems } = require("../validators/lead.validator");

const createLead = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const { userId } = req.user;
        const body = req.body;
        const leadPayload = {
            ...body.leadDetails,
            created_by: userId,
            account_id: body.account_id,
            branch_id: body.branch_id,
        };

        if (
            body.leadDetails.status === "finalised" &&
            (!Array.isArray(body.leadItems) || body.leadItems.length === 0)
        ) {
            return serverResponse.badRequest(req, res, {
                message: "At least one lead item is required to finalised the lead.",
            });
        }

        const newLeadId = await leadService.createLead(leadPayload, conn);

        if (!newLeadId) {
            return serverResponse.badRequest(req, res, {
                message: 'Failed to create lead'
            });
        };

        if (body.leadItems && Array.isArray(body.leadItems) && body.leadItems.length) {
            const itemPromises = body.leadItems.map((item) => {
                const itemData = {
                    lead_id: newLeadId,
                    account_id: body.account_id,
                    branch_id: body.branch_id,
                    item_type: item.item_type,
                    deal_type: item.deal_type,
                    item_id: item.item_id,
                    item_name: item.item_name,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    hours_per_day: item.hours_per_day,
                    notes: item.notes || null,
                    start_date: item.start_date || null,
                    end_date: item.end_date || null,
                    created_by: userId,
                    updated_by: null,
                };

                return leadService.addLeadItem(itemData, conn);
            });

            await Promise.all(itemPromises);
        };

        // If lead is created with status 'finalised', create product tracking
        if (body.leadDetails.status === "finalised") {
            // Validate product stock before finalizing
            const stockValidation = await productTrackingService.validateProductStock(
                body.leadItems,
                body.account_id,
                body.branch_id,
                conn
            );
            if (!stockValidation.valid) {
                await conn.rollback();
                return serverResponse.badRequest(req, res, {
                    message: stockValidation.errors.join(", ")
                });
            }

            // Prepare lead data for tracking
            const leadData = {
                id: newLeadId,
                account_id: body.account_id,
                branch_id: body.branch_id,
                customer_id: body.leadDetails.customer_id,
                start_date: body.leadDetails.start_date,
                created_by: userId,
                updated_by: userId,
            };

            // Create product tracking entries
            await productTrackingService.createProductTrackingForLead(
                leadData,
                body.leadItems,
                conn
            );
        }
        await conn.commit();
        return serverResponse.success(req, res, {
            data:
            {
                newLeadId
            },
            message: "Lead Created Successfully"
        });

    } catch (error) {
        console.log(error);
        await conn.rollback();
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to create lead",
        });
    } finally {
        conn.release();
    }
};

const addLeadItems = async (req, res) => {
    try {

        const leadId = req.params.id;
        const { userId } = req.user;
        const data = req.body;
        if (!Array.isArray(data)) {
            return serverResponse.badRequest(req, res, {
                message: "Invalid payload",
            });
        }
        const existingLead = await leadService.getLeadById(leadId);
        if (!existingLead) {
            return serverResponse.notFound(req, res, {
                message: "Lead not found",
            });
        }
        const normalizedItems = (Array.isArray(data) ? data : []).map((it) => ({
            ...it,
            lead_start_date: existingLead.start_date,
        }));

        const validationError = validateAddLeadItems(normalizedItems);
        if (validationError?.error) {
            return serverResponse.badRequest(req, res, {
                message: validationError.message,
            });
        }

        const itemPromises = normalizedItems.map((item) => {
            const { lead_start_date, ...rest } = item || {};
            const itemData = {
                lead_id: leadId,
                account_id: rest.account_id,
                branch_id: rest.branch_id,
                item_type: rest.item_type,
                deal_type: rest.deal_type || null,
                item_id: rest.item_id,
                item_name: rest.item_name,
                quantity: rest.quantity,
                unit_price: rest.unit_price,
                hours_per_day: rest.hours_per_day,
                notes: rest.notes || null,
                start_date: rest.start_date || null,
                end_date: rest.end_date || null,
                created_by: userId,
                updated_by: null,

            };

            return leadService.addLeadItem(itemData);
        });

        await Promise.all(itemPromises);

        return serverResponse.success(req, res, {
            message: "Lead items added successfully",
        });


    } catch (error) {
        console.log(error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to add lead items",
        });
    }
};

const deleteLeadItem = async (req, res) => {
    try {
        const leadId = req.params.leadId;
        const itemId = req.params.itemId;
        const { userId } = req.user;

        const existingLead = await leadService.getLeadById(leadId);
        if (!existingLead) {
            return serverResponse.notFound(req, res, {
                message: "Lead not found",
            });
        }
        if (existingLead.status === 'finalised') {
            return serverResponse.badRequest(req, res, {
                message: "Lead items cannot be deleted once the lead is finalised.",
            });
        }

        const deleteLeadItem = await leadService.deleteLeadItem(leadId, itemId, userId);

        if (!deleteLeadItem) {
            return serverResponse.notFound(req, res, {
                message: "Lead item not found",
            });
        }

        return serverResponse.success(req, res, {
            message: "Lead item deleted successfully",
        });

    } catch (error) {
        console.error(error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to delete lead item",
        });
    }
};

const endLeadItem = async (req, res) => {
    try {
        const leadId = req.params.leadId;
        const itemId = req.params.itemId;
        const { userId } = req.user;
        const { end_date } = req.body || {};

        const existingLead = await leadService.getLeadById(leadId);
        if (!existingLead) {
            return serverResponse.notFound(req, res, {
                message: "Lead not found",
            });
        }

        const ok = await leadService.endLeadItem(
            {
                lead_id: Number(leadId),
                item_id: Number(itemId),
                end_date: end_date || null,
                updated_by: userId,
            }
        );

        if (!ok) {
            return serverResponse.notFound(req, res, {
                message: "Lead item not found",
            });
        }

        return serverResponse.success(req, res, {
            message: "Lead item ended successfully",
        });
    } catch (error) {
        console.error(error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to end lead item",
        });
    }
};

const deleteLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const { userId } = req.user;

        const existingLead = await leadService.getLeadById(leadId);

        if (!existingLead) {
            return serverResponse.notFound(req, res, {
                message: "Lead not found",
            });
        };

        const hasToDeleteInvoice = existingLead.status === 'finalised' && existingLead.lead_status !== 'created';

        // Pass leadStatus to avoid duplicate query in service
        const deleteLeadResult = await leadService.deleteLead(leadId, userId, hasToDeleteInvoice, existingLead.status);

        if (!deleteLeadResult) {
            return serverResponse.badRequest(req, res, {
                message: "Failed to delete lead"
            });
        }
        return serverResponse.success(req, res, {
            message: "Lead deleted successfully"
        });

    } catch (error) {
        console.log("delete lead error", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to delete lead"
        })
    }
};

const getAllLeadsByAccountBranchId = async (req, res) => {
    try {
        const allLeads = await leadService.getAllLeadsByAccountBranchId(req.query);
        const result = {
            message: "Leads fetched successfully",
            data: allLeads.data,
        };

        const meta = {
            total: allLeads.totalRecords,
            limit: allLeads.pageSize,
            currentPage: allLeads.currentPage
        };

        return serverResponse.paginationRes(req, res, result, meta);

    } catch (error) {
        console.log("Get all lead error", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to get leads"
        });
    }
};

const getLeadById = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await leadService.getLeadById(id);

        if (lead) {
            return serverResponse.success(req, res, { data: lead });
        } else {
            return serverResponse.notFound(req, res, {
                message: "Lead not found",
            });
        }
    } catch (error) {
        console.log("Get lead by lead error", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to get lead"
        });
    }
};

const updateLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const { userId } = req.user;

        const existingLead = await leadService.getLeadById(leadId);

        if (!existingLead) {
            return serverResponse.notFound(req, res, {
                message: "Lead not found",
            });
        };

        const itemsToCheck = Array.isArray(req.body.leadItems)
            ? req.body.leadItems
            : existingLead.items;
        if (
            req.body.status === "finalised" &&
            (!Array.isArray(itemsToCheck) || itemsToCheck.length === 0)
        ) {
            return serverResponse.badRequest(req, res, {
                message: "At least one lead item is required to finalised the lead.",
            });
        }

        const updatePayload = {
            ...req.body,
            account_id: existingLead.account_id,
            branch_id: existingLead.branch_id,
            existingLeadStatus: existingLead.status,
            updated_by: userId
        };

        await leadService.updateLead(leadId, updatePayload);

        return serverResponse.success(req, res, {
            message: "Lead updated successfully"
        })
    } catch (error) {
        console.log("Update lead error", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to update lead"
        });
    }
};

const getAllLeadsByCustomerId = async (req, res) => {
    try {
        const allLeads = await leadService.getAllLeadsByCustomerId(req.query);
        const result = {
            message: "Leads fetched successfully",
            data: allLeads,
        };

        return serverResponse.success(req, res, result);

    } catch (error) {
        console.log("Get all lead error", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to get leads"
        });
    }
};

const updateLeadDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        let { security_deposit } = req.body;

        if (security_deposit === undefined) {
            return serverResponse.badRequest(req, res, {
                message: "security_deposit is required",
            });
        }

        security_deposit = Number(security_deposit);

        const updated = await leadService.updateLeadDeposit(id, security_deposit);

        if (!updated) {
            return serverResponse.notFound(req, res, {
                message: "Lead not found",
            });
        }

        return serverResponse.success(req, res, {
            message: "Deposit updated successfully",
        });

    } catch (error) {
        console.log("Update deposit controller error:", error);
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Failed to update deposit",
        });
    }
};

module.exports = {
    createLead,
    addLeadItems,
    deleteLeadItem,
    endLeadItem,
    deleteLead,
    getAllLeadsByAccountBranchId,
    getLeadById,
    updateLead,
    updateLeadDeposit,
    getAllLeadsByCustomerId
};