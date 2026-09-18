const db = require("../config/db");
const { toYYYYMMDD } = require("../utils/util");
const productTrackingService = require("./productTracking.service");

exports.createLead = async (data, conn = db) => {
  try {
    const now = new Date();

    const sql = `
        INSERT INTO lead_generate (
        account_id, branch_id, customer_id, lead_name, start_date,
        security_deposit, status, lead_status, notes,
        is_deleted, created_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
        `;

    const params = [
      data.account_id,
      data.branch_id,
      data.customer_id,
      data.lead_name,
      data.start_date,
      data.security_deposit || 0,
      data.status,
      "created",
      data.notes || null,
      data.created_by,
      now,
    ];
    console.log("create lead params", params);

    const [result] = await conn.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.log("Create lead error: ", error);
    throw new Error("Failed to create lead");
  }
};

exports.addLeadItem = async (itemData, conn = db) => {
  try {
    const now = new Date();

    const sql = `
            INSERT INTO lead_items (
                lead_id, account_id, branch_id, item_type, deal_type, item_id,
                item_name, quantity, unit_price, hours_per_day, notes, is_deleted,
                start_date, end_date, status,
                created_by, updated_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    // Item status lifecycle:
    // - 0 => ongoing (default, no end_date)
    // - 1 => completed (end_date present) and eligible for invoicing once
    // - 2 => billed (excluded from future invoices)
    const status =
      itemData.status !== undefined &&
        itemData.status !== null &&
        itemData.status !== ""
        ? Number(itemData.status)
        : itemData.end_date
          ? 1
          : 0;

    const params = [
      itemData.lead_id,
      itemData.account_id,
      itemData.branch_id,
      itemData.item_type,
      itemData.deal_type || null,
      itemData.item_id,
      itemData.item_name,
      itemData.quantity,
      itemData.unit_price,
      itemData.hours_per_day,
      itemData.notes,
      0,
      itemData.start_date || null,
      itemData.end_date || null,
      status,
      itemData.created_by,
      itemData.updated_by,
      now,
    ];

    const [result] = await conn.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Create lead item Error: ", error);
    throw new Error("Failed to create lead item");
  }
};

exports.getLeadById = async (id, conn = db) => {
  try {
    const sql = `
   SELECT
    l.*,
    u.name AS customer_name,
    u.mobile AS customer_mobile
FROM lead_generate l
JOIN users u ON u.id = l.customer_id
WHERE l.id = ?;
        `;

    const [rows] = await conn.execute(sql, [id]);

    if (!rows.length) return null;

    const lead = rows[0];

    const [items] = await conn.execute(
      `
        SELECT *
        FROM lead_items
        WHERE lead_id = ? AND is_deleted = 0
      `,
      [id],
    );

    const [invoices] = await conn.execute(
      `
        SELECT id, lead_id, due_amount, invoice_number, total_amount, invoice_status, invoice_date
        FROM invoices
        WHERE lead_id = ? AND is_deleted = 0
        ORDER BY invoice_date DESC
      `,
      [id],
    );

    lead.items = items;
    lead.invoices = invoices;

    return lead;
  } catch (error) {
    console.error("Get Lead By ID Error:", error);
    throw new Error("Failed to fetch lead");
  }
};

/**
 * Invoice eligibility:
 * - status 0 => ongoing => NOT invoice-eligible
 * - status 1 with end_date => completed but not yet billed => include once
 * - status 2 => already billed => never include again
 */
exports.getInvoiceEligibleLeadItems = async (
  { lead_id, account_id, branch_id },
  conn = db,
) => {
  try {
    const [rows] = await conn.execute(
      `
        SELECT *
        FROM lead_items
        WHERE lead_id = ?
          AND account_id = ?
          AND branch_id = ?
          AND is_deleted = 0
          AND COALESCE(status, 0) = 1
          AND end_date IS NOT NULL
          AND CAST(strftime('%Y', end_date) AS INTEGER) > 0
      `,
      [lead_id, account_id, branch_id],
    );
    return rows || [];
  } catch (error) {
    console.error("Get invoice eligible lead items error:", error);
    throw new Error("Failed to fetch invoice eligible lead items");
  }
};

exports.assertInvoiceItemsEligibleToBill = async (
  { lead_id, account_id, branch_id, invoiceItems },
  conn = db,
) => {
  try {
    const items = Array.isArray(invoiceItems) ? invoiceItems : [];
    if (!items.length) return true;

    const hasIds = items.every((it) => it.lead_item_id !== undefined && it.lead_item_id !== null);
    const cond = hasIds
      ? items.map(() => `id = ?`).join(" OR ")
      : items.map(() => `(item_type = ? AND COALESCE(deal_type, '') = ? AND item_id = ?)`).join(" OR ");

    const params = [lead_id, account_id, branch_id];
    for (const it of items) {
      if (hasIds) {
        params.push(Number(it.lead_item_id));
      } else {
        params.push(String(it.item_type));
        params.push(String(it.deal_type || ""));
        params.push(String(it.item_id));
      }
    }

    // Any matched lead_item that is not one of:
    // - status=0 AND end_date is empty (ongoing; can be billed repeatedly by invoice date range)
    // - status=1 AND end_date is present (completed; can be billed once)
    // - status=1 AND end_date is empty (data inconsistency; treat as ongoing)
    // is not billable.
    const [rows] = await conn.execute(
      `
        SELECT id
        FROM lead_items
        WHERE lead_id = ?
          AND account_id = ?
          AND branch_id = ?
          AND is_deleted = 0
          AND (${cond})
          AND NOT (
            (
              COALESCE(status, 0) IN (0, 1)
              AND (
                end_date IS NULL
                OR CAST(strftime('%Y', end_date) AS INTEGER) = 0
              )
            )
            OR
            (
              -- Completed items (real end_date) are billable once even if status wasn't updated correctly (0/1)
              COALESCE(status, 0) IN (0, 1)
              AND end_date IS NOT NULL
              AND CAST(strftime('%Y', end_date) AS INTEGER) > 0
            )
            OR
            (
              -- status=2 (already billed) is handled by a separate check; don't fail eligibility here
              COALESCE(status, 0) = 2
            )
          )
        LIMIT 1
      `,
      params,
    );

    return !rows?.length;
  } catch (error) {
    console.error("Assert invoice items eligible to bill error:", error);
    throw new Error("Failed to validate invoice items eligibility");
  }
};

exports.assertInvoiceItemsNotAlreadyBilled = async (
  { lead_id, account_id, branch_id, invoiceItems },
  conn = db,
) => {
  try {
    const items = Array.isArray(invoiceItems) ? invoiceItems : [];
    if (!items.length) return true;

    const hasIds = items.every((it) => it.lead_item_id !== undefined && it.lead_item_id !== null);
    const cond = hasIds
      ? items.map(() => `id = ?`).join(" OR ")
      : items.map(() => `(item_type = ? AND COALESCE(deal_type, '') = ? AND item_id = ?)`).join(" OR ");
    const params = [lead_id, account_id, branch_id];
    for (const it of items) {
      if (hasIds) {
        params.push(Number(it.lead_item_id));
      } else {
        params.push(String(it.item_type));
        params.push(String(it.deal_type || ""));
        params.push(String(it.item_id));
      }
    }

    const [rows] = await conn.execute(
      `
        SELECT id
        FROM lead_items
        WHERE lead_id = ?
          AND account_id = ?
          AND branch_id = ?
          AND is_deleted = 0
          AND COALESCE(status, 0) = 2
          AND (${cond})
        LIMIT 1
      `,
      params,
    );

    if (rows?.length) return false;
    return true;
  } catch (error) {
    console.error("Assert invoice items not already billed error:", error);
    throw new Error("Failed to validate invoice items");
  }
};

/**
 * After invoice is published:
 * - Update completed items (status=1 + end_date not null) that were included in the invoice to status=2
 * - Active items (status=0) remain status=0 (so they continue into future invoices)
 */
exports.markCompletedItemsAsBilledAfterInvoice = async (
  { lead_id, account_id, branch_id, invoiceItems, updated_by },
  conn = db,
) => {
  try {
    const items = Array.isArray(invoiceItems) ? invoiceItems : [];
    if (!items.length) return 0;

    const hasIds = items.every((it) => it.lead_item_id !== undefined && it.lead_item_id !== null);
    const cond = hasIds
      ? items.map(() => `id = ?`).join(" OR ")
      : items.map(() => `(item_type = ? AND COALESCE(deal_type, '') = ? AND item_id = ?)`).join(" OR ");

    const params = [updated_by || null, lead_id, account_id, branch_id];
    for (const it of items) {
      if (hasIds) {
        params.push(Number(it.lead_item_id));
      } else {
        params.push(String(it.item_type));
        params.push(String(it.deal_type || ""));
        params.push(String(it.item_id));
      }
    }

    const [result] = await conn.execute(
      `
        UPDATE lead_items
        SET status = 2, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE lead_id = ?
          AND account_id = ?
          AND branch_id = ?
          AND is_deleted = 0
          AND COALESCE(status, 0) IN (0, 1)
          AND end_date IS NOT NULL
          AND CAST(strftime('%Y', end_date) AS INTEGER) > 0
          AND (${cond})
      `,
      params,
    );

    return Number(result?.affectedRows || 0);
  } catch (error) {
    console.error("Mark completed lead items as billed error:", error);
    throw new Error("Failed to update lead items billed status");
  }
};

/**
 * After a published invoice for ongoing items (status=0, no end_date),
 * roll their start_date forward so next invoice starts from last invoice date.
 *
 * We set start_date = invoice_date + 1 day to avoid double-billing the same date
 * (since the UI day counting is inclusive).
 */
exports.rollForwardOngoingItemsStartDateAfterInvoice = async (
  { lead_id, account_id, branch_id, invoiceItems, invoice_date, updated_by },
  conn = db,
) => {
  try {
    const items = Array.isArray(invoiceItems) ? invoiceItems : [];
    if (!items.length) return 0;

    const invDate = invoice_date ? new Date(invoice_date) : null;
    if (!invDate || Number.isNaN(invDate.getTime())) return 0;

    const hasIds = items.every((it) => it.lead_item_id !== undefined && it.lead_item_id !== null);
    const cond = hasIds
      ? items.map(() => `id = ?`).join(" OR ")
      : items.map(() => `(item_type = ? AND COALESCE(deal_type, '') = ? AND item_id = ?)`).join(" OR ");

    // IMPORTANT: param order must match the SQL placeholders exactly.
    // 1) start_date (invoice_date)
    // 2) updated_by
    // 3) lead_id, account_id, branch_id
    // 4) item match params (cond...)
    const params = [
      invoice_date,
      updated_by || null,
      lead_id,
      account_id,
      branch_id,
    ];
    for (const it of items) {
      if (hasIds) {
        params.push(Number(it.lead_item_id));
      } else {
        params.push(String(it.item_type));
        params.push(String(it.deal_type || ""));
        params.push(String(it.item_id));
      }
    }

    const [result] = await conn.execute(
      `
        UPDATE lead_items
        SET
          start_date = DATE_ADD(DATE(?), INTERVAL 1 DAY),
          status = 0,
          updated_by = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE lead_id = ?
          AND account_id = ?
          AND branch_id = ?
          AND is_deleted = 0
          AND COALESCE(status, 0) IN (0, 1)
          AND (
            end_date IS NULL
            OR CAST(strftime('%Y', end_date) AS INTEGER) = 0
          )
          AND (${cond})
      `,
      params,
    );

    return Number(result?.affectedRows || 0);
  } catch (error) {
    console.error("Roll forward ongoing items start_date error:", error);
    throw new Error("Failed to roll forward ongoing items start_date");
  }
};

exports.deleteLeadItem = async (leadId, itemId, updated_by) => {
  try {
    const sql = `
        UPDATE lead_items
        SET is_deleted = 1, updated_by =?, updated_at =?
        WHERE lead_id = ? AND id =?
        `;
    const params = [updated_by, new Date(), leadId, itemId];
    const [result] = await db.execute(sql, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Delete Lead Item Error:", error);
    throw new Error("Failed to delete lead item");
  }
};

exports.endLeadItem = async (
  { lead_id, item_id, end_date, updated_by },
  conn = db,
) => {
  try {
    const end = end_date ? new Date(end_date) : new Date();
    if (Number.isNaN(end.getTime())) {
      throw new Error("Invalid end_date");
    }

    const [result] = await conn.execute(
      `
        UPDATE lead_items
        SET
          end_date = DATE(?),
          status = CASE WHEN COALESCE(status, 0) = 2 THEN 2 ELSE 1 END,
          updated_by = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND lead_id = ?
          AND is_deleted = 0
      `,
      [end, updated_by || null, item_id, lead_id],
    );
    return Number(result?.affectedRows || 0) > 0;
  } catch (error) {
    console.error("End lead item error:", error);
    throw error;
  }
};

exports.deleteLead = async (leadId, updated_by, hasToDeleteInvoice, leadStatus = null) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const now = new Date();

    // If lead was finalized, reverse product tracking (restore stock)
    // leadStatus is passed from controller to avoid duplicate query
    if (leadStatus === "finalised") {
      await productTrackingService.reverseProductTrackingForLead(
        leadId,
        updated_by,
        conn
      );
    }

    // Soft delete lead
    const deleteLeadSql = `
            UPDATE lead_generate
            SET is_deleted = 1, updated_by = ?, updated_at = ?
            WHERE id = ?
        `;
    const [leadDeleteResult] = await conn.execute(deleteLeadSql, [
      updated_by,
      now,
      leadId,
    ]);

    if (leadDeleteResult.affectedRows === 0) {
      await conn.rollback();
      return false;
    }

    // Soft delete lead items in one go
    const deleteLeadItemsSql = `
            UPDATE lead_items
            SET is_deleted = 1, updated_by = ?, updated_at = ?
            WHERE lead_id = ?
        `;
    await conn.execute(deleteLeadItemsSql, [updated_by, now, leadId]);

    // Handle invoices + invoice_items
    if (hasToDeleteInvoice) {
      // Soft delete invoices
      const deleteInvoicesSql = `
                UPDATE invoices
                SET is_deleted = 1, updated_by = ?, updated_at = ?
                WHERE lead_id = ?
            `;
      const [deleteInvoiceResult] = await conn.execute(deleteInvoicesSql, [
        updated_by,
        now,
        leadId,
      ]);

      if (deleteInvoiceResult.affectedRows > 0) {
        // Soft delete invoice_items in bulk (via JOIN)
        const deleteInvoiceItemsSql = `
                    UPDATE invoice_items ii
                    INNER JOIN invoices i ON ii.invoice_id = i.id
                    SET ii.is_deleted = 1, ii.updated_by = ?, ii.updated_at = ?
                    WHERE i.lead_id = ?
                `;
        await conn.execute(deleteInvoiceItemsSql, [updated_by, now, leadId]);
      }
    }

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    console.error("Delete lead error", err);
    throw new Error("Failed to delete lead");
  } finally {
    conn.release();
  }
};

exports.getAllLeadsByAccountBranchId = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;
    let where = `WHERE l.is_deleted = 0  AND l.account_id = ? AND l.branch_id = ?`;
    const params = [data.account_id, data.branch_id];

    if (data.q) {
      where += ` AND (l.lead_name LIKE '%${data.q}%' OR c.name LIKE '%${data.q}%' OR l.lead_status LIKE '%${data.q}%' OR l.status LIKE '%${data.q}%' OR l.security_deposit = '${data.q}' `;

      const isDate = /^\d{2}-\d{2}-\d{4}$/.test(data.q);
      if (isDate) {
        where += ` OR l.start_date = '${toYYYYMMDD(
          data.q,
          "DD-MM-YYYY"
        )}' OR l.end_date = '${toYYYYMMDD(data.q, "DD-MM-YYYY")}' `;
      }
      where += " )";
    }

    if (data.customer_id) {
      where += ` AND l.customer_id = ?`;
      params.push(data.customer_id);
    }

    if (data.status) {
      where += ` AND l.status = ?`;
      params.push(data.status);
    }

    if (data.lead_status) {
      where += ` AND l.lead_status = ?`;
      params.push(data.lead_status);
    }

    if (data.start_date) {
      where += ` AND DATE(l.start_date) >= ?`;
      params.push(data.start_date);
    }

    if (data.end_date) {
      where += ` AND DATE(l.end_date) <= ?`;
      params.push(data.end_date);
    }

    let orderBy = "";
    if (data.sort && data.order) {
      orderBy = `ORDER BY ${data.sort} ${data.order}`;
    }

    const sql = `
      SELECT l.*,
      c.name AS customer_name
      FROM lead_generate l
      LEFT JOIN users c ON l.customer_id =  c.id
       ${where}
       ${orderBy ? orderBy : "ORDER BY l.created_at DESC"}
        LIMIT ${limit} OFFSET ${offset}
    `;
    const [rows] = await db.execute(sql, params);

    const countSql = `
        SELECT COUNT(*) AS total
         FROM lead_generate l
         LEFT JOIN users c ON l.customer_id = c.id
        ${where}
      `;
    const [countResult] = await db.execute(countSql, params);
    const total = countResult[0]?.total || 0;

    return {
      currentPage: page,
      pageSize: limit,
      totalRecords: total,
      data: rows,
    };
  } catch (error) {
    console.log("Get All leads error: ", error);
    throw new Error("Failed to get all leads");
  }
};

exports.updateLead = async (id, data) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const now = new Date();

    const [existingRows] = await conn.execute(
      `SELECT * FROM lead_generate WHERE id = ? AND is_deleted = 0 LIMIT 1`,
      [id],
    );
    const existingLeadRow = existingRows?.[0] || null;
    if (!existingLeadRow) {
      await conn.rollback();
      return false;
    }

    const leadStartAt = existingLeadRow.start_date
      ? new Date(existingLeadRow.start_date)
      : null;

    const assertItemDatesAgainstLeadStart = (item) => {
      if (!leadStartAt || Number.isNaN(leadStartAt.getTime())) return;
      if (item?.start_date) {
        const s = new Date(item.start_date);
        if (!Number.isNaN(s.getTime()) && s.getTime() < leadStartAt.getTime()) {
          throw new Error("Lead item start_date cannot be before lead start_date");
        }
      }
      if (item?.end_date) {
        const e = new Date(item.end_date);
        if (!Number.isNaN(e.getTime()) && e.getTime() < leadStartAt.getTime()) {
          throw new Error("Lead item end_date cannot be before lead start_date");
        }
      }
    };

    // Upsert lead items (preserve ids/status) instead of delete-all when items are provided
    if (data.leadItems && Array.isArray(data.leadItems) && data.leadItems.length > 0) {
      for (const item of data.leadItems) {
        assertItemDatesAgainstLeadStart(item);

        if (item?.id) {
          const [liRows] = await conn.execute(
            `SELECT id FROM lead_items
             WHERE id = ? AND lead_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
             LIMIT 1`,
            [item.id, id, data.account_id, data.branch_id],
          );
          if (!liRows?.length) {
            throw new Error("Lead item not found");
          }

          const [stRows] = await conn.execute(
            `SELECT COALESCE(status, 0) AS status, start_date, end_date
             FROM lead_items
             WHERE id = ? AND lead_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
             LIMIT 1`,
            [item.id, id, data.account_id, data.branch_id],
          );
          const existingItemStatus = Number(stRows?.[0]?.status ?? 0);
          const existingStartDate = stRows?.[0]?.start_date ?? null;
          const existingEndDate = stRows?.[0]?.end_date ?? null;
          const derivedStatus = item.end_date ? 1 : 0;
          const nextStatus = existingItemStatus === 2 ? 2 : derivedStatus;
          const nextStartDate = existingItemStatus === 2 ? existingStartDate : (item.start_date || null);
          const nextEndDate = existingItemStatus === 2 ? existingEndDate : (item.end_date || null);

          await conn.execute(
            `
              UPDATE lead_items
              SET
                item_type = ?,
                deal_type = ?,
                item_id = ?,
                item_name = ?,
                quantity = ?,
                unit_price = ?,
                hours_per_day = ?,
                notes = ?,
                start_date = ?,
                end_date = ?,
                status = ?,
                updated_by = ?,
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ? AND lead_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
            `,
            [
              item.item_type,
              item.deal_type || null,
              item.item_id,
              item.item_name,
              item.quantity,
              item.unit_price,
              item.hours_per_day,
              item.notes || null,
              nextStartDate,
              nextEndDate,
              nextStatus,
              data.updated_by || null,
              item.id,
              id,
              data.account_id,
              data.branch_id,
            ],
          );
        } else {
          const itemData = {
            lead_id: id,
            account_id: data.account_id,
            branch_id: data.branch_id,
            item_type: item.item_type,
            deal_type: item.deal_type || null,
            item_id: item.item_id,
            item_name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            hours_per_day: item.hours_per_day,
            notes: item.notes || null,
            start_date: item.start_date || null,
            end_date: item.end_date || null,
            created_by: data.updated_by,
            updated_by: null,
          };
          await exports.addLeadItem(itemData, conn);
        }
      }
    }

    const wasFinalized = data.existingLeadStatus === "finalised";
    const willBeFinalized = data.status === "finalised";

    // When finalising, DO NOT override existing item start_date.
    // Only fill missing start_date using the lead start_date (to avoid defaulting to "today").
    if (!wasFinalized && willBeFinalized) {
      const leadStart = data.start_date || null;
      if (leadStart) {
        await conn.execute(
          `
            UPDATE lead_items
            SET start_date = ?
            WHERE lead_id = ?
              AND account_id = ?
              AND branch_id = ?
              AND is_deleted = 0
              AND COALESCE(status, 0) <> 2
              AND (start_date IS NULL OR CAST(strftime('%Y', start_date) AS INTEGER) = 0)`,
          [leadStart, id, data.account_id, data.branch_id],
        );
      }
    }

    // If lead is being finalized, create product tracking
    if (!wasFinalized && willBeFinalized) {
      const leadItemsForTracking =
        data.leadItems && Array.isArray(data.leadItems) && data.leadItems.length > 0
          ? data.leadItems
          : (await conn.execute(
            `SELECT * FROM lead_items WHERE lead_id = ? AND is_deleted = 0`,
            [id]
          ))[0];

      if (leadItemsForTracking && leadItemsForTracking.length > 0) {
        const stockValidation = await productTrackingService.validateProductStock(
          leadItemsForTracking,
          data.account_id,
          data.branch_id,
          conn
        );

        if (!stockValidation.valid) {
          await conn.rollback();
          throw new Error(stockValidation.errors.join(", "));
        }

        const [leadDataRows] = await conn.execute(
          `SELECT * FROM lead_generate WHERE id = ?`,
          [id]
        );

        if (leadDataRows.length > 0) {
          const leadData = {
            ...leadDataRows[0],
            account_id: data.account_id,
            branch_id: data.branch_id,
            updated_by: data.updated_by,
            created_by: data.updated_by,
          };

          await productTrackingService.createProductTrackingForLead(
            leadData,
            leadItemsForTracking,
            conn
          );
        }
      }
    }

    let updatedRows = 0;
    if (String(existingLeadRow.status) !== "finalised") {
      const updateSql = `
        UPDATE lead_generate
        SET customer_id = ?, lead_name = ?, start_date = ?,
         security_deposit = ?, status = ?, notes = ?, updated_by = ?, updated_at = ?
        WHERE id = ?
        `;
      const params = [
        data.customer_id,
        data.lead_name,
        data.start_date,
        data.security_deposit || 0,
        data.status,
        data.notes || null,
        data.updated_by,
        now,
        id,
      ];

      const [result] = await conn.execute(updateSql, params);
      updatedRows = result.affectedRows;
    } else {
      // Finalised leads: do not mutate lead_generate header fields from this endpoint.
      // Item changes are handled above.
      updatedRows = 1;
    }

    await conn.commit();
    return updatedRows > 0;
  } catch (error) {
    await conn.rollback();
    console.log("Updating lead error: ", error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.updateLeadDeposit = async (id, security_deposit, conn = db) => {
  try {
    const sql = `
      UPDATE lead_generate
      SET security_deposit = ?, updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `;

    const params = [
      security_deposit ?? null, // ✅ avoid undefined error
      new Date(),
      id,
    ];

    const [result] = await conn.execute(sql, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.log("Update deposit error:", error);
    throw new Error("Failed to update deposit");
  }
};

exports.getAllLeadsByCustomerId = async (data) => {
  try {
    let where = `WHERE l.is_deleted = 0  AND l.account_id = ? AND l.branch_id = ? AND customer_id = ?`;

    let isFinalished = data.is_finalished ?? null;
    let isCompleted = data.is_completed ?? null;
    let productReturnPending = data.productReturnPending ?? null;
    if (isFinalished && parseInt(data.is_finalished) === 1) {
      where += ` AND l.status = 'finalised'`;
    }

    if (isCompleted && parseInt(data.is_completed) === 0) {
      where += ` AND l.lead_status != 'completed'`;
    }

    if (productReturnPending && parseInt(data.productReturnPending) === 0) {
      where += ` AND l.lead_status != 'productReturnPending'`;
    }

    const sql = `
      SELECT l.*,
      c.name AS customer_name,

      -- Lead items as JSON
    (
        SELECT IFNULL(CONCAT('[', GROUP_CONCAT(
            CONCAT(
                '{"id":', lt.id,
                ',"lead_id":', lt.lead_id,
                ',"item_type":"', lt.item_type, '"',
                ',"deal_type":"', IFNULL(lt.deal_type, ''), '"',
                ',"item_id":"', lt.item_id, '"',
                ',"item_name":"', REPLACE(lt.item_name, '"', '\\"'), '"',
                ',"quantity":', lt.quantity,
                ',"unit_price":', lt.unit_price,
                ',"hours_per_day":', IFNULL(lt.hours_per_day, 0),
                ',"notes":"', REPLACE(IFNULL(lt.notes, ''), '"', '\\"'), '"',
                ',"start_date":', IFNULL(CONCAT('"', lt.start_date, '"'), 'null'),
                ',"end_date":', IFNULL(CONCAT('"', lt.end_date, '"'), 'null'),
                ',"status":', COALESCE(lt.status, 0),
                ',"is_deleted":', lt.is_deleted,
                '}'
            )
        ), ']'), '[]')
        FROM lead_items lt
        WHERE lt.lead_id = l.id AND lt.is_deleted = 0
    ) AS items_json

      FROM lead_generate l
      LEFT JOIN users c ON l.customer_id =  c.id
     ${where}
      ORDER BY ${data.orderBy ? data.orderBy : "customer_name"}
      
    `;
    const params = [data.account_id, data.branch_id, data.customer_id];
    const [rows] = await db.execute(sql, params);

    let parsedRows = [];
    if (rows.length) {
      parsedRows = rows.map((row) => {
        if (row.items_json) {
          row.item_list = JSON.parse(row.items_json);
          delete row.items_json;
        }
        return row;
      });
    }

    return parsedRows;
  } catch (error) {
    console.log("Get All leads error: ", error);
    throw new Error("Failed to get all leads");
  }
};

exports.updateLeadStatus = async (data, conn = db) => {
  try {
    const sql = `UPDATE lead_generate
        SET lead_status = ?, updated_by = ?, updated_at = ?
        WHERE id =  ?
        `;
    await conn.execute(sql, [
      data.lead_status,
      data.updated_by,
      new Date(),
      data.lead_id,
    ]);
    return true;
  } catch (error) {
    console.log("Mark lead completed Error", error);
    throw new Error("Failed to mark lead as completed");
  }
};

exports.leadHasRentedProducts = async (leadId, conn = db) => {
  if (!leadId) return false;
  const [rows] = await conn.execute(
    `SELECT 1
     FROM lead_items li
     WHERE li.lead_id = ?
       AND li.is_deleted = 0
       AND li.item_type = 'product'
       AND li.deal_type = 'rent'
     LIMIT 1`,
    [leadId]
  );
  return rows.length > 0;
};
