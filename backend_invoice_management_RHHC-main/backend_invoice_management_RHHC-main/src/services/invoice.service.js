const db = require("../config/db");
const constVar = require("../utils/constantVariables");
const { toYYYYMMDD } = require("../utils/util");

exports.createInvoice = async (data, conn = db) => {
  try {
    const now = new Date();
    const [rows] = await conn.execute(
      `SELECT COUNT(*) AS count FROM invoices WHERE account_id = ? AND branch_id = ?`,
      [data.account_id, data.branch_id]
    );
    const count = rows[0].count + 1;

    const invoiceNumber = `RH_${data.invoiceNoPrefixWithDate}_${count
      .toString()
      .padStart(4, "0")}`;
    const sql = `
            INSERT INTO invoices (
                account_id, branch_id, invoice_number, lead_id,
                customer_id, invoice_date,  total_amount, sub_total,
                paid_amount, due_amount, last_invoice_due, transportation_charge,
                other_charges, discount_amount, payment_status, invoice_status,
                notes, is_deposit_counted, settlement_amount, security_deposit,
                is_deleted, created_by, updated_by, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?,  ?, ?, ?, ?,  ?, ?, ?, ?,  ?, ?, ?, ?,  ?, ?, ?, ?)
        `;

    const params = [
      data.account_id,
      data.branch_id,
      invoiceNumber,
      data.lead_id,

      data.customer_id,
      data.invoice_date,
      data.total_amount,
      data.sub_total,

      data.paid_amount,
      data.due_amount,
      data.last_invoice_due,
      data.transportation_charge,

      data.other_charges,
      data.discount_amount,
      constVar.payment_status[data.payment_status],
      data.invoice_status,

      data.notes || null,
      data.is_deposit_counted,
      data.settlement_amount ?? null,
      data.security_deposit ?? null,

      0,
      data.created_by,
      data.updated_by || null,
      now,
      now,
    ];
    console.log(params);

    console.log("bd", params);
    const [result] = await conn.execute(sql, params);
    return {
      newInvoiceId: result.insertId,
      newInvoiceNumber: invoiceNumber,
    };
  } catch (error) {
    console.error("Create invoice Error: ", error);
    throw new Error("Failed to create invoice");
  }
};

exports.createInvoiceItem = async (itemData, conn = db) => {
  try {
    console.log(itemData);

    const now = new Date();

    const sql = `
        INSERT INTO invoice_items (
            invoice_id, account_id, branch_id, item_type, deal_type, item_id,
            item_name, quantity, days, unit_price, hours_per_day, notes, is_deleted,
            created_by, updated_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      itemData.invoice_id,
      itemData.account_id,
      itemData.branch_id,
      itemData.item_type,
      itemData.deal_type || null,
      itemData.item_id,
      itemData.item_name,
      itemData.quantity,
      itemData.days,
      itemData.unit_price,
      itemData.hours_per_day,
      itemData.notes,
      0,
      itemData.created_by,
      itemData.updated_by,
      now,
    ];

    const [result] = await conn.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Create invoice item Error: ", error);
    throw new Error("Failed to create invoice item");
  }
};

exports.createPaymentRecord = async (paymentData, conn = db) => {
  try {
    const now = new Date();
    const sql = `
        INSERT INTO payment_history (
          invoice_id, account_id, branch_id, payment_date,
          amount, payment_method, other_details, notes, is_deleted, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
      `;

    const params = [
      paymentData.invoice_id,
      paymentData.account_id,
      paymentData.branch_id,
      paymentData.payment_date,
      paymentData.amount,
      paymentData.payment_method,
      paymentData.other_details ?? null,
      paymentData.notes,
      now,
    ];

    const [result] = await conn.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Invoice Payment adding error: ", error);
    throw new Error("Failed to add payment information");
  }
};

exports.getAllInvoicesByAccount = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;
    let where =
      "WHERE i.is_deleted = 0 AND i.account_id =? AND i.branch_id =?";
    if (data.q) {
      const isDate = /^\d{2}-\d{2}-\d{4}$/.test(data.q);
      where += ` AND (i.invoice_number LIKE '%${data.q}%' OR i.total_amount = '${data.q}'
                         OR u.name LIKE '%${data.q}%' OR u.mobile LIKE '%${data.q}%'
                            OR i.invoice_status LIKE '%${data.q}%' OR l.lead_name LIKE '%${data.q}%' OR i.payment_status LIKE '%${data.q}%' OR i.paid_amount = '${data.q}'`;
      if (isDate) {
        where += ` OR i.invoice_date = '${toYYYYMMDD(data.q, "DD-MM-YYYY")}'`;
      }
      where += `)`;
    }
    const params = [data.account_id, data.branch_id];

    if (data.lead_id) {
      where += ` AND i.lead_id = ?`;
      params.push(data.lead_id);
    }

    if (data.customer_id) {
      where += ` AND i.customer_id = ?`;
      params.push(data.customer_id);
    }

    if (data.invoice_status) {
      where += ` AND i.invoice_status = ?`;
      params.push(data.invoice_status);
    }

    if (data.payment_status) {
      where += ` AND i.payment_status = ?`;
      params.push(data.payment_status);
    }

    if (data.from_date) {
      where += ` AND DATE(i.invoice_date) >= ?`;
      params.push(data.from_date);
    }

    if (data.to_date) {
      where += ` AND DATE(i.invoice_date) <= ?`;
      params.push(data.to_date);
    }

    if (data.is_deposit_counted !== undefined && data.is_deposit_counted !== '' && data.is_deposit_counted !== null) {
      where += ` AND i.is_deposit_counted = ?`;
      params.push(data.is_deposit_counted);
    }

    if (data.has_rent_products !== undefined && data.has_rent_products !== '' && data.has_rent_products !== null) {
      const hasRented = Number(data.has_rent_products) === 1;
      if (hasRented) {
        where += ` AND EXISTS (
          SELECT 1 FROM lead_items li
          WHERE li.lead_id = l.id AND li.is_deleted = 0
            AND li.item_type = 'product' AND li.deal_type = 'rent'
        )`;
      } else {
        where += ` AND NOT EXISTS (
          SELECT 1 FROM lead_items li
          WHERE li.lead_id = l.id AND li.is_deleted = 0
            AND li.item_type = 'product' AND li.deal_type = 'rent'
        )`;
      }
    }

    let orderBy = "";
    if (data.sort && data.order) {
      orderBy = `ORDER BY ${data.sort} ${data.order}`;
    }

    const sql = `
      SELECT
          i.*,
          u.name AS customer_name,
          u.mobile AS customer_mobile,
          l.id AS lead_id,
          l.lead_name AS lead_name,
          l.lead_status AS lead_status,
          EXISTS (
            SELECT 1
            FROM lead_items li
            WHERE li.lead_id = l.id
              AND li.is_deleted = 0
              AND li.item_type = 'product'
              AND li.deal_type = 'rent'
      ) AS has_rent_product,
          
          COALESCE(ii.total_quantity, 0) AS total_quantity,
          (
              SELECT CONCAT(
                  '[',
                  GROUP_CONCAT(
                      CONCAT(
                          '{"id":', p.id,
                          ',"payment_date":"', p.payment_date, '"',
                          ',"amount":', p.amount,
                          ',"notes":"', IFNULL(p.notes, ''), '"',
                          ',"payment_method":"', p.payment_method, '"}'
                      )
                      ORDER BY p.created_at ASC
                  ),
                  ']'
              )
              FROM payment_history p
              WHERE p.invoice_id = i.id
                AND p.is_deleted = 0
          ) AS payment_json
      FROM invoices i
      LEFT JOIN users u
          ON i.customer_id = u.id
      LEFT JOIN (
          SELECT invoice_id, SUM(quantity) AS total_quantity
          FROM invoice_items
          WHERE is_deleted = 0
          GROUP BY invoice_id
      ) ii
          ON ii.invoice_id = i.id
      JOIN lead_generate l
          ON l.id = i.lead_id
      ${where}
      ${orderBy ? orderBy : "ORDER BY i.created_at DESC"}
      LIMIT ${limit} OFFSET ${offset}
      `;

    const [rows] = await db.execute(sql, params);

    const countSql = `
          SELECT COUNT(DISTINCT i.id) AS total FROM invoices i
            LEFT JOIN users u ON i.customer_id = u.id
            LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
            JOIN lead_generate l ON l.id = i.lead_id
            ${where}
              
        `;
    const [countResult] = await db.execute(countSql, params);

    const total = countResult[0]?.total || 0;
    let formatedData = [];
    if (rows.length) {
      formatedData = rows.map((row) => {
        if (row.payment_json) {
          row.paymentLength = JSON.parse(row.payment_json).length;
          delete row.payment_json;
        }
        return row;
      });
    }
    return {
      currentPage: page,
      pageSize: limit,
      totalRecords: total,
      data: formatedData,
    };
  } catch (error) {
    console.error("Get All Invoice (Paginated) Error:", error);
    throw new Error("Failed to fetch Invoices");
  }
};

exports.getInvoiceById = async (id, conn = db) => {
  try {
    const sql = `
    SELECT
        inv.*,
        u.name AS customer_name,
        u.mobile AS customer_mobile,
        u.email AS customer_email,
        l.id AS lead_id,
        l.lead_name AS lead_name,
        l.start_date AS lead_start_date,
        l.end_date AS lead_end_date,
        l.lead_status AS lead_status,
        l.security_deposit AS lead_security_deposit,
        ud.permanent_address AS customer_address,
        ud.gender AS customer_gender,
        ud.age AS customer_age,

        -- Items JSON aggregated separately
        (
        SELECT 
            CONCAT('[', GROUP_CONCAT(
            CONCAT(
                '{"id":', it.id,
                ',"invoice_id":', it.invoice_id,
                ',"item_type":"', it.item_type, '"',
                ',"deal_type":"', IFNULL(it.deal_type, ''), '"',
                ',"item_id":"', it.item_id, '"',
                ',"item_name":"', it.item_name, '"',
                ',"quantity":', it.quantity,
                ',"unit_price":', it.unit_price,
                ',"hours_per_day":', IFNULL(it.hours_per_day, 0),
                ',"days":', it.days,
                ',"notes":"', IFNULL(it.notes, ''), '"',
                ',"is_deleted":', it.is_deleted,
                '}'
            )
            ), ']')
        FROM invoice_items it
        WHERE it.invoice_id = inv.id AND it.is_deleted = 0
        ) AS items_json,

        -- Payments JSON aggregated separately
        (
        SELECT 
            CONCAT('[', GROUP_CONCAT(
            CONCAT(
                '{"id":', p.id,
                ',"payment_date":"', p.payment_date, '"',
                ',"amount":', p.amount,
                ',"notes":"', IFNULL(p.notes, ''), '"',
                ',"other_details":', IFNULL(JSON_QUOTE(p.other_details), 'null'),
                ',"payment_method":"', p.payment_method, '"',
                '}'
            )  ORDER BY p.payment_date DESC
            ), ']')
        FROM payment_history p
        WHERE p.invoice_id = inv.id AND is_deleted = 0
        ORDER BY p.payment_date DESC
        ) AS payment_json

    FROM invoices inv
    JOIN users u ON u.id = inv.customer_id
    JOIN user_details ud ON ud.user_id = inv.customer_id
    JOIN lead_generate l ON l.id = inv.lead_id
    WHERE inv.id = ?;
    `;

    const params = [id];

    const result = await conn.execute(sql, params);
    const [rows] = result;
    console.log(rows);
    if (rows.length) {
      const invoice = rows[0];
      invoice.items = invoice.items_json
        ? JSON.parse(`${invoice.items_json}`)
        : [];
      delete invoice.items_json;
      invoice.payment = invoice.payment_json
        ? JSON.parse(`${invoice.payment_json}`)
        : [];

      console.log("invoice.payment_json", invoice.payment);
      console.log(
        "inoice other details",
        typeof invoice?.payment?.other_details,
        invoice?.payment?.other_details
      );

      invoice.payment = invoice.payment.map((p) => ({
        ...p,
        other_details: p.other_details ? JSON.parse(p.other_details) : null,
      }));

      delete invoice.payment_json;
      return invoice;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Get Invoice By ID Error:", error);
    throw new Error("Failed to fetch invoice");
  }
};

exports.deleteInvoice = async (id, updated_by, conn = db) => {
  try {
    const sql = `
        UPDATE invoices
        SET is_deleted = 1, updated_by =?, updated_at =?
        WHERE id = ?
        `;
    const params = [updated_by, new Date(), id];
    const [result] = await conn.execute(sql, params);

    const invoiceItemsSql = `
        UPDATE invoice_items
        SET is_deleted = 1, updated_by =?, updated_at =?
        WHERE invoice_id =?
        `;
    const invoiceItemsParams = [updated_by, new Date(), id];
    await conn.execute(invoiceItemsSql, invoiceItemsParams);
    return { message: "Invoice deleted successfully" };
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    throw new Error("Failed to delete invoice");
  }
};

exports.updateInvoice = async (id, data, conn = db) => {
  try {
    const now = new Date();
    const sql = `
        UPDATE invoices
        SET  total_amount = ?, due_amount = ?, paid_amount = ?,
            payment_status =?, is_deposit_counted = ?, settlement_amount = ?, security_deposit = ?,
            invoice_status =?, notes =?, updated_by =?, updated_at =?
            WHERE id =  ?
        `;

    const params = [
      data.total_amount,
      data.due_amount,
      data.paid_amount,
      constVar.payment_status[data.payment_status],
      data.is_deposit_counted,
      data.settlement_amount ?? null,
      data.security_deposit ?? null,
      data.invoice_status,
      data.notes,
      data.updated_by,
      now,
      id,
    ];
    const [result] = await conn.execute(sql, params);
    return { message: "Invoice updated successfully" };
  } catch (error) {
    console.error("Update Invoice Error:", error);
    throw new Error("Failed to update invoice");
  }
};

exports.updateInvoiceAmount = async (id, data) => {
  try {
    let set =
      "SET total_amount =?, due_amount = ?,  updated_by =?, updated_at =?";
    const params = [
      data.total_amount,
      data.total_amount,
      data.updated_by,
      new Date(),
    ];
    if (data.paid_amount && data.due_amount) {
      set += ", paid_amount =?, due_amount =?";
      params.push(data.paid_amount, data.due_amount);
    }
    params.push(id);

    const sql = `
        UPDATE invoices
        ${set}
        WHERE id = ? AND is_deleted = 0
        `;
    const [result] = await db.execute(sql, params);
    return { message: "Invoice total amount updated successfully" };
  } catch (error) {
    console.error("Update Invoice Total Amount Error:", error);
    throw new Error("Failed to update invoice total amount");
  }
};

exports.deleteInvoiceItem = async (invoiceId, itemId, updated_by) => {
  try {
    const sql = `
        UPDATE invoice_items
        SET is_deleted = 1, updated_by =?, updated_at =?
        WHERE invoice_id = ? AND id =?
        `;
    const params = [updated_by, new Date(), invoiceId, itemId];
    const [result] = await db.execute(sql, params);
    console.log(result);
    const [rows] = await db.execute(
      `SELECT * FROM invoice_items WHERE invoice_id = ? AND id = ?`,
      [invoiceId, itemId]
    );

    return rows[0];
  } catch (error) {
    console.error("Delete Invoice Item Error:", error);
    throw new Error("Failed to delete invoice item");
  }
};

exports.addPaymentRecord = async (invoiceId, data, conn = db) => {
  try {
    const now = new Date();
    const sql = `
        INSERT INTO payment_history (
          invoice_id, account_id, branch_id, payment_date,
          amount, payment_method, notes, is_deleted, created_at
        ) VALUES (?,?,?,?,?,?,?, 0,?)
        `;
    console.log("data", data);
    const params = [
      invoiceId,
      data.account_id,
      data.branch_id,
      data.payment_date,
      data.amount,
      data.payment_method,
      data.notes,
      now,
    ];
    console.log(params);
    const [result] = await conn.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Invoice Payment adding error: ", error);
    throw new Error("Failed to add payment information");
  }
};

exports.updateInvoicePaymentRecord = async (id, data, conn = db) => {
  try {
    const now = new Date();
    const sql = `
     UPDATE invoices
     SET paid_amount = ?, due_amount =?, payment_status =?, updated_by =?, updated_at =?
     WHERE id = ? AND is_deleted = 0
 `;
    const params = [
      data.paid_amount,
      data.due_amount,
      constVar.payment_status[data.payment_status],
      data.updated_by,
      now,
      id,
    ];
    const [result] = await conn.execute(sql, params);
    return { message: "Invoice payment information updated successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update invoice payment information");
  }
};

exports.getCustomerLastInvoice = async (
  customer_id,
  lead_id,
  exclude_id = null
) => {
  try {
    let where = `WHERE customer_id = ? AND lead_id = ? AND is_deleted = 0`;
    if (exclude_id) {
      where += ` AND id != ${exclude_id}`;
    }

    const sql = `
        SELECT *
        FROM invoices
        ${where}
        ORDER BY id DESC
        LIMIT 1
        `;
    const [result] = await db.execute(sql, [customer_id, lead_id]);
    return result[0] ? result[0] : null;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get last invoice due amount");
  }
};

exports.getInvoiceItemsByInvoiceId = async (invoiceId, conn = db) => {
  try {
    const [rows] = await conn.execute(
      `
        SELECT item_type, deal_type, item_id
        FROM invoice_items
        WHERE invoice_id = ? AND is_deleted = 0
      `,
      [invoiceId],
    );
    return rows || [];
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get invoice items");
  }
};

exports.createCarryForwardRecord = async (data, conn = db) => {
  try {
    const now = new Date();

    const sql = `
        INSERT INTO invoice_carry_forward(
       account_id, branch_id, from_invoice_id, to_invoice_id, customer_id, lead_id, amount, created_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const params = [
      data.account_id,
      data.branch_id,
      data.from_invoice_id,
      data.to_invoice_id,
      data.customer_id,
      data.lead_id,
      data.amount,
      data.userId,
      now,
    ];

    const [result] = await conn.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create carry forward record");
  }
};

exports.getCarryForwardBYInvoiceId = async (data, conn = db) => {
  try {
    let where = `WHERE is_deleted = 0 AND customer_id = ${data.customer_id} AND lead_id = ${data.lead_id}`;
    if (data.from_invoice_id) {
      console.log("from_invoice_id", data.from_invoice_id);
      where += ` AND from_invoice_id = ${data.from_invoice_id}`;
    } else {
      console.log("to_invoice_id", data.to_invoice_id);
      where += ` AND to_invoice_id = ${data.to_invoice_id}`;
    }

    const sql = `
        SELECT * FROM invoice_carry_forward
        ${where}
        `;

    const [result] = await conn.execute(sql);
    return result[0] ?? null;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get carry forward record");
  }
};

exports.updateCarryForwardRecord = async (data) => {
  try {
    const sql = `
       UPDATE invoice_carry_forward
       SET from_invoice_id = ?, customer_id = ?, amount = ?, updated_by= ?, updated_at = ?
       WHERE is_deleted = 0 AND  to_invoice_id = ?
        `;
    const params = [
      data.from_invoice_id,
      data.customer_id,
      data.amount,
      data.userId,
      new Date(),
      data.to_invoice_id,
    ];

    const [result] = await db.execute(sql, params);
    console.log("update carry result", result);
    return result.affectedRows > 0;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get carry forward record");
  }
};

exports.deleteCarryForwardRecord = async (data, conn = db) => {
  try {
    const sql = `
       UPDATE  invoice_carry_forward
       SET is_deleted = 1
       WHERE is_deleted = 0 AND  to_invoice_id = ? AND customer_id = ? AND lead_id = ?
        `;
    const params = [data.to_invoice_id, data.customer_id, data.lead_id];

    const [result] = await conn.execute(sql, params);
    console.log("update carry result", result);
    return result.affectedRows > 0;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get carry forward record");
  }
};

exports.updateInvoicePaymentStauts = async (id, data, conn = db) => {
  try {
    const now = new Date();
    const sql = `
     UPDATE invoices
     SET  payment_status =?, updated_by =?, updated_at =?
     WHERE id = ? AND is_deleted = 0
 `;
    const params = [
      constVar.payment_status[data.payment_status],
      data.updated_by,
      now,
      id,
    ];
    const [result] = await conn.execute(sql, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to updateInvoicePaymentStauts");
  }
};

exports.deleteLastPaymentHistory = async (id, conn = db) => {
  try {
    const sql = `
            UPDATE payment_history
            SET is_deleted = 1
            WHERE payment_method = 'carry-forward' 
              AND invoice_id = ? 
              AND is_deleted = 0
                ORDER BY created_at DESC
                LIMIT 1
        `;

    const [result] = await conn.execute(sql, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete invoice payment history");
  }
};

exports.updateLeadAndProductTrackingEndDate =  async (date, conn = db) => {
  try {
    const {leadId, endDate } = date;
    const sql =  `UPDATE lead_generate SET end_date = ? WHERE id = ? AND is_deleted = 0`;
    const params = [endDate, leadId];
    const [result] = await conn.execute(sql, params);
    
    const productTrackingSql = `UPDATE product_tracking SET rent_end_date = ? WHERE lead_id = ? AND is_deleted = 0`;
    const productTrackingParams = [endDate, leadId];
    const [productTrackingResult] = await conn.execute(productTrackingSql, productTrackingParams);
    return {
      leadResult: result.affectedRows > 0,
      productTrackingResult: productTrackingResult.affectedRows > 0,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update lead and product tracking end date");
  }
}
