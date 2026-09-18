const dashboardService = require('../services/dashboard.service');
const serverResponse = require('../utils/serverResponse');

exports.getDashboardData = async (req, res) => {
    try {
        const data = req.body;
        const userCountPayload = {
            account_id: data.account_id,
            branch_id: data.branch_id,
            excluded_id: data.excluded_id,
        }
        const totalUsers = await dashboardService.getAllUsersCountbyAccount(userCountPayload);
        const invoicPayload = {
            account_id: data.account_id,
            branch_id: data.branch_id,
            from_date: data.from_date,
            to_date: data.to_date
        }

        const invoices = await dashboardService.getInvoiceSummary(invoicPayload)
        return serverResponse.success(req, res, {
            data: {
                invoiceData: invoices,
                totalUserCount: totalUsers
            }
        });

    } catch (error) {
        console.log(error)
        return serverResponse.internalServerError(req, res, {
            message: error.message || "Something went wrong",
        });
    }
}