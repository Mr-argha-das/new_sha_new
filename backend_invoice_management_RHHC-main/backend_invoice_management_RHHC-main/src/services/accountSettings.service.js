const db = require("../config/db");

exports.createAccountSettings = async (data) => {
    try {
        const sql = `
            INSERT INTO account_settings (
                account_id, branch_id, name, logo, stamp, qr_scanner, stamp_signature, use_stamp_image, address_lines, 
                mobile, email, website, bank_details, extra_ids, service_type,
                created_by, updated_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const params = [
            data.account_id,
            data.branch_id,
            data.name,
            data.logo || null,
            data.stamp || null,
            data.qr_scanner || null,
            data.stamp_signature || null,
            data.use_stamp_image != null ? Number(data.use_stamp_image) : 0,
            data.address_lines,
            data.mobile || null,
            data.email || null,
            data.website || null,
            data.bank_details ? JSON.stringify(data.bank_details) : null,
            data.extra_ids ? JSON.stringify(data.extra_ids) : null,
            data.service_type || null,
            data.created_by,
            data.updated_by,
        ];


        const [result] = await db.execute(sql, params);

        if (result.insertId) {
            return await this.getAccountSettingsById(result.insertId);
        }

        return null;
    } catch (error) {
        console.error("createAccountSettings Error:", error);
        throw new Error("Failed to create account settings");
    }
};

exports.getAllAccountSettings = async ({ account_id, branch_id, page, limit, q, sort, order }) => {
    try {
        let conditions = [];
        let params = [];

        if (account_id) {
            conditions.push("account_id = ?");
            params.push(account_id);
        }

        if (branch_id) {
            conditions.push("branch_id = ?");
            params.push(branch_id);
        }

        if (q) {
            conditions.push("(name LIKE ? OR email LIKE ? OR mobile LIKE ?)");
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";


        const offset = (page - 1) * limit;

        const countSql = `SELECT COUNT(*) as total FROM account_settings ${whereClause}`;
        const [countResult] = await db.execute(countSql, params);
        const total = countResult[0].total;

        const sql = `
      SELECT * FROM account_settings 
      ${whereClause}
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
    `;

        params.push(limit, offset);
        const [rows] = await db.execute(sql, params);

        // Parse JSON fields
        const formattedRows = rows.map(row => ({
            ...row,
            address_lines: row.address_lines ? JSON.parse(row.address_lines) : [],
            extra_ids: row.extra_ids ? JSON.parse(row.extra_ids) : null,
        }));

        return {
            data: formattedRows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("getAllAccountSettings Error:", error);
        throw new Error("Failed to retrieve account settings");
    }
};

exports.getAccountSettingsById = async (id) => {
    try {
        const sql = "SELECT * FROM account_settings WHERE id = ?";
        const [rows] = await db.execute(sql, [id]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];
        return {
            ...row,
            extra_ids: row.extra_ids ? JSON.parse(row.extra_ids) : null,
            bank_details: row.bank_details ? JSON.parse(row.bank_details) : null,
        };
    } catch (error) {
        console.error("getAccountSettingsById Error:", error);
        throw new Error("Failed to retrieve account settings");
    }
};

exports.getAccountSettingsByAccountAndBranch = async (account_id, branch_id) => {
    try {
        const sql = "SELECT * FROM account_settings WHERE account_id = ? AND branch_id = ?";
        const [rows] = await db.execute(sql, [account_id, branch_id]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        if (row.extra_ids) row.extra_ids = JSON.parse(row.extra_ids) || null;

        if (row.bank_details) row.bank_details = JSON.parse(row.bank_details) || null;

        return row;

    } catch (error) {
        console.error("getAccountSettingsByAccountAndBranch Error:", error);
        throw new Error("Failed to retrieve account settings");
    }
};

exports.updateAccountSettings = async (id, data) => {
    try {
        const sql = `
    UPDATE account_settings
    SET 
        name = ?,
        logo = ?,
        stamp = ?,
        qr_scanner = ?,
        stamp_signature = ?,
        use_stamp_image = ?,
        address_lines = ?,
        mobile = ?,
        email = ?,
        website = ?,
        bank_details = ?,
        extra_ids = ?,
        service_type = ?,
        updated_by = ?,
        updated_at = NOW()
    WHERE id = ? 
`;
        const params = [
            data.name,
            data.logo || null,
            data.stamp || null,
            data.qr_scanner || null,
            data.stamp_signature || null,
            data.use_stamp_image != null ? Number(data.use_stamp_image) : 0,
            data.address_lines,
            data.mobile || null,
            data.email || null,
            data.website || null,
            data.bank_details ? JSON.stringify(data.bank_details) : null,
            data.extra_ids ? JSON.stringify(data.extra_ids) : null,
            data.service_type || null,
            data.updated_by,
            id
        ];
        console.log(params)
        // return
        const [result] = await db.execute(sql, params);
        return result.affectedRows > 0
    } catch (error) {
        console.error("updateAccountSettings Error:", error);
        throw new Error("Failed to update account settings");
    }
};

exports.deleteAccountSettings = async (id, userId) => {
    try {
        const sql = "UPDATE account_settings SET  updated_by = ?, updated_at = NOW() WHERE id = ?";
        const [result] = await db.execute(sql, [userId, id]);

        if (result.affectedRows === 0) {
            throw new Error("Account settings not found");
        }

        return true;
    } catch (error) {
        console.error("deleteAccountSettings Error:", error);
        throw new Error("Failed to delete account settings");
    }
};
