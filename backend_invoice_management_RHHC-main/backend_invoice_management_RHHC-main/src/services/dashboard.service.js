const db = require('../config/db');
const dayjs = require("dayjs");
const constVariable = require("../utils/constantVariables");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

exports.getAllUsersCountbyAccount = async (data) => {
    try {

        let where =
            `WHERE uam.account_id = ? AND uam.branch_id = ? AND u.isDeleted = 0 AND u.id != ? AND u.role_id = ${constVariable.customer_role_id}`;

        const countSql = `
        SELECT COUNT(*) AS total
      FROM users u
      JOIN user_account_mappings uam ON u.id = uam.user_id
      ${where}
    `;
        const [countResult] = await db.execute(countSql, [
            data.account_id,
            data.branch_id,
            data.excluded_id
        ]);

        const total = countResult[0]?.total || 0;

        return total;
    } catch (error) {
        console.error("Get All Users (Paginated) Error:", error);
        throw new Error("Failed to fetch users");
    }
};

exports.getInvoiceSummary = async (data) => {
    console.log("s", data);
    try {
        let where = 'WHERE i.is_deleted = 0 AND i.account_id = ? AND i.branch_id = ?';
        if (data.from_date && data.to_date) {
            const from = dayjs(data.from_date, "DD-MM-YYYY", true);
            const to = dayjs(data.to_date, "DD-MM-YYYY", true);

            if (from.isValid() && to.isValid()) {
                where += ` AND i.invoice_date BETWEEN '${from.format("YYYY-MM-DD")}' AND '${to.format("YYYY-MM-DD")}'`;
            } else {
                console.error("Invalid date(s)", { from: data.from_date, to: data.to_date });
            }
        } else if (data.from_date) {
            const from = dayjs(data.from_date, "DD-MM-YYYY", true);
            if (from.isValid()) {
                where += ` AND i.invoice_date >= '${from.format("YYYY-MM-DD")}'`;
            } else {
                console.error("Invalid from_date:", data.from_date);
            }
        } else if (data.to_date) {
            const to = dayjs(data.to_date, "DD-MM-YYYY", true);
            if (to.isValid()) {
                // console.log("to date", data.to_date, to.format("YYYY-MM-DD"));
                where += ` AND i.invoice_date <= '${to.format("YYYY-MM-DD")}'`;
            } else {
                console.error("Invalid to_date:", data.to_date);
            }
        }


        // ---------- total amount ----------
        const totalAmountSql = `
      SELECT COALESCE(SUM(i.total_amount),0) AS totalAmount
      FROM invoices i
      ${where}
    `;
        const [totalAmountResult] = await db.execute(totalAmountSql, [
            data.account_id,
            data.branch_id,
        ]);
        const totalAmount = totalAmountResult[0]?.totalAmount || 0;

        // ---------- monthly summary ----------
        let baseDate;
        if (data.to_date) {
            baseDate = dayjs(data.to_date, "DD-MM-YYYY");
        } else if (data.from_date) {
            baseDate = dayjs(data.from_date, "DD-MM-YYYY");
        } else {
            baseDate = dayjs(); // today
        }

        let startDate, endDate;
        if (data.from_date && data.to_date) {
            startDate = dayjs(data.from_date, "DD-MM-YYYY").startOf("month");
            endDate = dayjs(data.to_date, "DD-MM-YYYY").endOf("month");
        } else if (data.to_date) {
            // past 6 months ending at to_date
            startDate = baseDate.subtract(5, "month").startOf("month");
            endDate = baseDate.endOf("month");
        } else if (data.from_date) {
            // next 6 months starting at from_date
            startDate = baseDate.startOf("month");
            endDate = baseDate.add(5, "month").endOf("month");
        } else {
            // default: past 6 months ending today
            startDate = baseDate.subtract(5, "month").startOf("month");
            endDate = baseDate.endOf("month");
        }

        const monthlySql = `
      SELECT strftime('%Y-%m', i.invoice_date) AS month,
             COUNT(i.id) AS invoiceCount
      FROM invoices i
      WHERE i.is_deleted = 0 
        AND i.account_id = ? 
        AND i.branch_id = ?
        AND i.invoice_date BETWEEN ? AND ?
      GROUP BY strftime('%Y-%m', i.invoice_date)
      ORDER BY month ASC
    `;
        const [monthlyRows] = await db.execute(monthlySql, [
            data.account_id,
            data.branch_id,
            startDate.format("YYYY-MM-DD"),
            endDate.format("YYYY-MM-DD"),
        ]);
        // console.log(monthlyRows)
        const monthlySummary = {};
        monthlyRows.forEach((row) => {
            monthlySummary[row.month] = row.invoiceCount;
        });

        // ---------- latest 10 invoices ----------
        const latestSql = `
      SELECT i.id, i.invoice_number, i.invoice_date, i.total_amount, i.invoice_status
      FROM invoices i
     WHERE i.is_deleted = 0 AND i.account_id = ? AND i.branch_id = ?
      ORDER BY i.created_at DESC
      LIMIT 10
    `;
        const [latestInvoices] = await db.execute(latestSql, [
            data.account_id,
            data.branch_id,
        ]);

        return {
            totalAmount,
            monthlySummary,
            latestInvoices,
        };
    } catch (error) {
        console.error("Get Invoice Summary Error:", error);
        throw new Error("Failed to fetch invoice summary");
    }
};

