const db = require("../config/db");
const constVar = require("../utils/constantVariables");

exports.createProductTrackingForLead = async (leadData, leadItems, conn = db) => {
    try {
        const now = new Date();
        const trackingEntries = [];

        // Filter only product items
        const productItems = leadItems.filter(
            (item) => item.item_type === "product"
        );

        if (productItems.length === 0) {
            return trackingEntries;
        }

        for (const item of productItems) {
            const [productRows] = await conn.execute(
                `SELECT id, available_stock, total_stock FROM products 
         WHERE id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
                [item.item_id, leadData.account_id, leadData.branch_id]
            );

            if (productRows.length === 0) {
                throw new Error(`Product with id ${item.item_id} not found`);
            }

            const product = productRows[0];
            const quantity = item.quantity || 1;

            // Validate stock availability
            if (product.available_stock < quantity) {
                throw new Error(
                    `Insufficient stock for ${item.item_name}. Available: ${product.available_stock}, Required: ${quantity}`
                );
            }

            // Determine status based on deal_type
            // 0 = on_rent, 1 = returned, 3 = sold
            const status = item.deal_type === "sell" ? 3 : 0;
            const soldDate = item.deal_type === "sell" ? leadData.start_date : null;

            // Create product tracking entry
            const trackingSql = `
        INSERT INTO product_tracking (
          account_id, branch_id, lead_id, product_id, customer_id,
         deal_type, status, quantity,
          rent_start_date, sold_date,
          notes, is_deleted, created_by, updated_by,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
      `;

            const trackingParams = [
                leadData.account_id,
                leadData.branch_id,
                leadData.id,
                item.item_id,
                leadData.customer_id,
                item.deal_type,
                status,
                quantity,
                leadData.start_date,
                soldDate,
                item.notes || null,
                leadData.created_by || leadData.updated_by,
                leadData.updated_by || leadData.created_by,
                now,
                now,
            ];

            const [trackingResult] = await conn.execute(trackingSql, trackingParams);
            trackingEntries.push(trackingResult.insertId);

            // Update product stock
            if (item.deal_type === "sell") {
                // For sell: decrease available_stock and total_stock, increase sold_stock
                await conn.execute(
                    `UPDATE products 
                        SET available_stock = available_stock - ?, 
                            total_stock = total_stock - ?,
                            sold_stock = COALESCE(sold_stock, 0) + ?,
                            updated_at = ?
                        WHERE id = ? AND is_deleted = 0`,
                    [quantity, quantity, quantity, now, item.item_id]
                );
            } else {
                // For rent: decrease available_stock, increase rented_stock
                await conn.execute(
                    `UPDATE products 
                        SET available_stock = available_stock - ?, 
                            rented_stock = rented_stock + ?,
                            updated_at = ?
                        WHERE id = ? AND is_deleted = 0`,
                    [quantity, quantity, now, item.item_id]
                );
            }
        }

        return trackingEntries;
    } catch (error) {
        console.error("Create product tracking error: ", error);
        throw error;
    }
};

/**
 * Reverse product tracking when finalized lead is deleted
 * This restores stock and soft deletes tracking entries
 */
exports.reverseProductTrackingForLead = async (leadId, updatedBy, conn = db) => {
    try {
        const now = new Date();

        const [trackingRows] = await conn.execute(
            `SELECT id, product_id, deal_type, status, quantity 
       FROM product_tracking 
       WHERE lead_id = ? AND is_deleted = 0`,
            [leadId]
        );

        if (trackingRows.length === 0) {
            return;
        }

        // Reverse stock for each tracking entry
        for (const tracking of trackingRows) {
            const quantity = tracking.quantity || 1;

            // 0 = on_rent, 1 = returned, 3 = sold
            if (tracking.status === 3) {
                // For sold: restore available_stock and total_stock, decrease sold_stock
                await conn.execute(
                    `UPDATE products 
           SET available_stock = available_stock + ?, 
               total_stock = total_stock + ?,
               sold_stock = GREATEST(COALESCE(sold_stock, 0) - ?, 0),
               updated_at = ?
           WHERE id = ? AND is_deleted = 0`,
                    [quantity, quantity, quantity, now, tracking.product_id]
                );
            } else if (tracking.status === 0) {
                // For rent: restore available_stock, decrease rented_stock
                await conn.execute(
                    `UPDATE products 
           SET available_stock = available_stock + ?, 
               rented_stock = rented_stock - ?,
               updated_at = ?
           WHERE id = ? AND is_deleted = 0`,
                    [quantity, quantity, now, tracking.product_id]
                );
            }

            // Soft delete tracking entry
            await conn.execute(
                `UPDATE product_tracking 
         SET is_deleted = 1, updated_by = ?, updated_at = ? 
         WHERE id = ?`,
                [updatedBy, now, tracking.id]
            );
        }

        return true;
    } catch (error) {
        console.error("Reverse product tracking error: ", error);
        throw error;
    }
};

/**
 * Get product tracking history for a product
 */
exports.getProductTrackingHistory = async (productId, accountId, branchId, page = 1, limit = 10, filters = {}) => {
    try {
        const currentPage = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const offset = (currentPage - 1) * pageSize;

        let whereCondition = `pt.product_id = ? AND pt.account_id = ? AND pt.branch_id = ? AND pt.is_deleted = 0`;
        const params = [productId, accountId, branchId];

        if (filters.deal_type && filters.deal_type !== '') {
            whereCondition += ` AND pt.deal_type = ?`;
            params.push(filters.deal_type);
        }

        if (filters.from_date && filters.from_date !== '') {
            whereCondition += ` AND DATE(pt.rent_start_date) >= ?`;
            params.push(filters.from_date);
        }

        if (filters.to_date && filters.to_date !== '') {
            whereCondition += ` AND DATE(pt.rent_start_date) <= ?`;
            params.push(filters.to_date);
        }

        const sql = `
            SELECT 
                pt.*,
                u.name AS customer_name,
                u.id AS customer_id,
                lg.lead_name,
                lg.id AS lead_id,
                lg.start_date AS lead_start_date,
                lg.end_date AS lead_end_date
            FROM product_tracking pt
            LEFT JOIN users u ON u.id = pt.customer_id
            LEFT JOIN lead_generate lg ON lg.id = pt.lead_id
            WHERE ${whereCondition}
            ORDER BY pt.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset}
    `;

        const [rows] = await db.execute(sql, params);

        // Get total count
        const countSql = `
            SELECT COUNT(*) AS total FROM product_tracking pt
            WHERE ${whereCondition}
        `;

        const [countResult] = await db.execute(countSql, params);
        const totalRecords = countResult[0]?.total || 0;

        return {
            data: rows,
            totalRecords,
            pageSize,
            currentPage,
        };
    } catch (error) {
        console.error("Get product tracking history error: ", error);
        throw new Error("Failed to get product tracking history");
    }
};

/**
 * Get product tracking for a customer
 */
exports.getProductTrackingByCustomer = async (customerId, accountId, branchId) => {
    try {
        const sql = `
      SELECT 
        pt.*,
        p.name AS product_name,
        p.sku_code,
        lg.lead_name,
        inv.invoice_number
      FROM product_tracking pt
      JOIN products p ON p.id = pt.product_id
      JOIN lead_generate lg ON lg.id = pt.lead_id
      LEFT JOIN invoices inv ON inv.id = pt.invoice_id
      WHERE pt.customer_id = ? 
        AND pt.account_id = ? 
        AND pt.branch_id = ?
        AND pt.is_deleted = 0
      ORDER BY pt.created_at DESC
    `;

        const [rows] = await db.execute(sql, [customerId, accountId, branchId]);
        return rows;
    } catch (error) {
        console.error("Get product tracking by customer error: ", error);
        throw new Error("Failed to get product tracking by customer");
    }
};

/**
 * Get active rentals for a product (currently on rent)
 */
exports.getActiveRentalsForProduct = async (productId, accountId, branchId) => {
    try {
        const sql = `
      SELECT 
        pt.*,
        u.name AS customer_name,
        u.mobile AS customer_mobile,
        lg.lead_name
      FROM product_tracking pt
      JOIN users u ON u.id = pt.customer_id
      JOIN lead_generate lg ON lg.id = pt.lead_id
      WHERE pt.product_id = ? 
        AND pt.account_id = ? 
        AND pt.branch_id = ?
        AND pt.status = 0
        AND pt.is_deleted = 0
      ORDER BY pt.rent_start_date ASC
    `;

        const [rows] = await db.execute(sql, [productId, accountId, branchId]);
        return rows;
    } catch (error) {
        console.error("Get active rentals error: ", error);
        throw new Error("Failed to get active rentals");
    }
};

/**
 * Get product tracking by lead_id
 */
exports.getProductTrackingByLeadId = async (leadId) => {
    try {
        const sql = `
      SELECT 
        pt.*,
        p.name AS product_name,
        p.sku_code,
        u.name AS customer_name
      FROM product_tracking pt
      JOIN products p ON p.id = pt.product_id
      JOIN users u ON u.id = pt.customer_id
      WHERE pt.lead_id = ? AND pt.is_deleted = 0
      ORDER BY pt.created_at ASC
    `;

        const [rows] = await db.execute(sql, [leadId]);
        return rows;
    } catch (error) {
        console.error("Get product tracking by lead_id error: ", error);
        throw new Error("Failed to get product tracking by lead_id");
    }
};

/**
 * Validate product stock before finalizing lead
 */
exports.validateProductStock = async (leadItems, accountId, branchId, conn = db) => {
    try {

        const productItems = leadItems.filter(
            (item) => item.item_type === "product" && (item.is_deleted ?? 0) === 0
        );

        if (productItems.length === 0) {
            return { valid: true }; // No products to validate
        }

        const errors = [];

        for (const item of productItems) {
            const [productRows] = await conn.execute(
                `SELECT id, name, available_stock FROM products 
         WHERE id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
                [item.item_id, accountId, branchId]
            );

            if (productRows.length === 0) {
                errors.push(`Product "${item.item_name}" not found`);
                continue;
            }

            const product = productRows[0];
            const quantity = item.quantity || 1;

            if (product.available_stock < quantity) {
                errors.push(
                    `Insufficient stock for "${item.item_name}". Available: ${product.available_stock}, Required: ${quantity}`
                );
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
        };
    } catch (error) {
        console.error("Validate product stock error: ", error);
        throw error;
    }
};

/**
 * Free up rented products when invoice is published and deposit is counted
 * This marks products as returned and makes them available for rent again
 */
exports.returnRentedProductsForInvoice = async (accountId, branchId, leadId, returnDate, note = null, updatedBy, conn = db) => {
    try {
        const now = new Date();

        // Get all on_rent product tracking entries for this lead
        // 0 = on_rent, 1 = returned, 3 = sold
        const [trackingRows] = await conn.execute(
            `SELECT id, product_id, quantity 
             FROM product_tracking 
             WHERE lead_id = ? AND account_id = ? AND branch_id = ? AND status = 0 AND is_deleted = 0`,
            [leadId, accountId, branchId]
        );

        if (trackingRows.length === 0) {
            return { returned: 0 };
        }

        let returnedCount = 0;

        // Mark each tracking entry as returned and update stock
        for (const tracking of trackingRows) {
            const quantity = tracking.quantity || 0;

            await conn.execute(
                `UPDATE product_tracking 
                 SET status = 1,
                     return_date = ?,
                     notes = ?,
                     updated_by = ?,
                     updated_at = ?
                 WHERE id = ? AND account_id = ? AND branch_id = ?`,
                [returnDate, note, updatedBy, now, tracking.id, accountId, branchId]
            );

            // Update product stock: increase available_stock, decrease rented_stock
            await conn.execute(
                `UPDATE products 
                 SET available_stock = available_stock + ?,
                     rented_stock = rented_stock - ?,
                     updated_at = ?
                 WHERE id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
                [quantity, quantity, now, tracking.product_id, accountId, branchId]
            );

            returnedCount++;
        }

        return { returned: returnedCount };
    } catch (error) {
        console.error("Return rented products error: ", error);
        throw error;
    }
};