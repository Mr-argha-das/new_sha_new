const accountSettingsService = require("../services/accountSettings.service");
const serverResponse = require("../utils/serverResponse");
const fs = require("fs");
const path = require("path");

exports.createAccountSettings = async (req, res) => {
    try {
        const body = req.body;
        const { userId } = req.user;
        const existingSettings = await accountSettingsService.getAccountSettingsByAccountAndBranch(
            body.account_id,
            body.branch_id
        );

        if (body.extra_ids) body.extra_ids = JSON.parse(body.extra_ids);
        if (body.bank_details) body.bank_details = JSON.parse(body.bank_details);

        if (existingSettings) {
            return serverResponse.badRequest(req, res, {
                message: "Account settings already exist for this account and branch",
            });
        }

        let saveData = body;
        saveData["created_by"] = userId;
        saveData["updated_by"] = userId;


        ["logo", "qr_scanner", "stamp", "stamp_signature"].forEach(file => {
            if (req.files && req.files[file] && req.files[file][0]) {
                const fileDetails = req.files[file][0];
                saveData[file] = `/uploads/accountSettings/${body.account_id}-${body.branch_id}/${fileDetails.filename}`;
            }
        });

        const newAccountSettings = await accountSettingsService.createAccountSettings(saveData);

        return serverResponse.success(req, res, {
            message: "Account settings created successfully",
            data: newAccountSettings,
        });
    } catch (error) {
        console.log(error)
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};

exports.getAllAccountSettings = async (req, res) => {
    try {
        const { account_id, branch_id, page = 1, limit = 10, q = "", sort = "created_at", order = "desc" } = req.query;

        const result = await accountSettingsService.getAllAccountSettings({
            account_id: parseInt(account_id),
            branch_id: parseInt(branch_id),
            page: parseInt(page),
            limit: parseInt(limit),
            q,
            sort,
            order,
        });

        return serverResponse.success(req, res, {
            message: "Account settings retrieved successfully",
            data: result,
        });
    } catch (error) {
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};

exports.getAccountSettingsById = async (req, res) => {
    try {
        const { id } = req.params;

        const accountSettings = await accountSettingsService.getAccountSettingsById(id);

        if (!accountSettings) {
            return serverResponse.notFound(req, res, {
                message: "Account settings not found",
            });
        }

        return serverResponse.success(req, res, {
            message: "Account settings retrieved successfully",
            data: accountSettings,
        });
    } catch (error) {
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};

exports.updateAccountSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const { userId } = req.user;

        // Check if account settings exist
        const existingSettings = await accountSettingsService.getAccountSettingsById(id);

        if (!existingSettings) {
            return serverResponse.notFound(req, res, {
                message: "Account settings not found",
            });
        }

        let updateData = body;
        updateData["updated_by"] = userId;

        // Handle logo upload
        ["logo", "qr_scanner", "stamp", "stamp_signature"].forEach(file => {
            if (req.files && req.files[file] && req.files[file][0]) {
                const fileDetails = req.files[file][0];
                // Delete old file if it exists
                if (existingSettings[file]) {
                    const oldFilePath = path.join(__dirname, "..", existingSettings[file]);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                // Set new file URL
                const fileUrl = `/uploads/accountSettings/${existingSettings.account_id}-${existingSettings.branch_id}/${fileDetails.filename}`;
                updateData[file] = fileUrl;
            }
        });

        if (updateData?.extra_ids) updateData.extra_ids = JSON.parse(updateData.extra_ids);
        if (updateData?.bank_details) updateData.bank_details = JSON.parse(updateData.bank_details);

        const updatedAccountSettings = await accountSettingsService.updateAccountSettings(id, updateData);

        return serverResponse.success(req, res, {
            message: "Account settings updated successfully",
            data: updatedAccountSettings,
        });
    } catch (error) {
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};

exports.deleteAccountSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        // Check if account settings exist
        const existingSettings = await accountSettingsService.getAccountSettingsById(id);

        if (!existingSettings) {
            return serverResponse.notFound(req, res, {
                message: "Account settings not found",
            });
        }

        // Delete logo file if exists
        if (existingSettings.logo) {
            const logoPath = path.join(__dirname, "..", existingSettings.logo);
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);
            }
        }

        await accountSettingsService.deleteAccountSettings(id, userId);

        return serverResponse.success(req, res, {
            message: "Account settings deleted successfully",
        });
    } catch (error) {
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};

exports.getAccountSettingsByAccountAndBranch = async (req, res) => {
    try {
        const { account_id, branch_id } = req.query;

        const accountSettings = await accountSettingsService.getAccountSettingsByAccountAndBranch(
            parseInt(account_id),
            parseInt(branch_id)
        );

        if (!accountSettings) {
            return serverResponse.notFound(req, res, {
                message: "Account settings not found for this account and branch",
            });
        }

        const meta = {
            total: 1,
            limit: 1,
            currentPage: 1,
        }
        return serverResponse.paginationRes(req, res, {
            message: "Account settings retrieved successfully",
            data: [accountSettings],
        }, meta
        );
    } catch (error) {
        console.log(error)
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
};
