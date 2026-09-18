const db = require("../config/db");
const { toDDMMYYYY } = require("../utils/util");

// Generate unique SKU code
const generateSKUCode = async (account_id, branch_id) => {
  try {
    // Count existing products for this account and branch
    const [rows] = await db.execute(
      `SELECT COUNT(*) AS count FROM products WHERE account_id = ? AND branch_id = ? AND is_deleted = 0`,
      [account_id, branch_id]
    );
    const count = rows[0].count + 1;

    // Format date as DD_MM_YYYY (with underscores)
    const dateStr = toDDMMYYYY(new Date()).replace(/-/g, "_");

    // Generate SKU: PRD_{date}_{count} where count is padded to 4 digits
    const skuCode = `PRD_${dateStr}_${count.toString().padStart(4, "0")}`;

    return skuCode;
  } catch (error) {
    console.error("Generate SKU code Error: ", error);
    throw new Error("Failed to generate SKU code");
  }
};

exports.checkProductByName = async (name, account_id, id = null) => {
  try {
    let sql;
    let params;

    if (id) {
      sql = `
        SELECT * FROM products
        WHERE is_deleted = 0 AND LOWER(TRIM(name)) = ? AND account_id = ? AND id != ?
    `;
      params = [name.trim().toLowerCase(), account_id, id];
    } else {
      sql = `
        SELECT * FROM products
        WHERE is_deleted = 0 AND LOWER(TRIM(name)) = ? AND account_id = ?
      `;
      params = [name.trim().toLowerCase(), account_id];
    }

    const [result] = await db.execute(sql, params);
    return result[0];
  } catch (error) {
    console.error("Check product by name Error: ", error);
    throw new Error("Failed to  check product by name.");
  }
};

exports.createProduct = async (data) => {
  try {
    const now = new Date();

    // Generate unique SKU code
    const skuCode = await generateSKUCode(data.account_id, data.branch_id);

    const sql = `
      INSERT INTO products (
        account_id, branch_id, sku_code, name, description, base_price, sale_price,
        hour_rent_price, purchase_date, total_stock, available_stock,
        rented_stock, sold_stock, images, status, is_deleted,
        created_by, updated_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
    `;

    const params = [
      data.account_id,
      data.branch_id,
      skuCode,
      data.name,
      data.description || null,
      data.base_price,
      data.sale_price != null ? data.sale_price : null,
      data.hour_rent_price != null ? data.hour_rent_price : null,
      data.purchase_date || null,
      data.total_stock != null ? Number(data.total_stock) : 0,
      data.available_stock != null ? Number(data.available_stock) : 0,
      data.rented_stock != null ? Number(data.rented_stock) : 0,
      data.sold_stock != null ? Number(data.sold_stock) : 0,
      data.images || null,
      data.status || "active",
      data.created_by,
      data.updated_by,
      now,
      now,
    ];

    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Create product Error: ", error);
    throw new Error("Failed to create product");
  }
};

exports.getAllProducts = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;

    let where = "WHERE  is_deleted = 0 AND account_id = ? AND branch_id = ?";
    if (data.q) {
      const q = data.q.toLowerCase();
      where += ` AND (LOWER(name) LIKE '%${q}%' OR status LIKE '%${q}%'`;

      if (!isNaN(Number(data.q))) {
        where += ` OR base_price = ${Number(data.q)}`;
      }

      where += `)`;
    }
    if (data.status) {
      where += ` AND status = '${data.status}'`;
    }

    if (data.available_stock) {
      where += ` AND available_stock > 0`;
    }

    let orderBy = "";
    if (data.sort && data.order) {
      orderBy = `ORDER BY ${data.sort} ${data.order}`;
    }

    const sql = `
     SELECT * FROM products
     ${where}
     ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
      `;
    const params = [data.account_id, data.branch_id];
    const [rows] = await db.execute(sql, params);

    const countSql = `
       SELECT COUNT(*) AS total FROM products
      ${where}
     `;

    const [countResult] = await db.execute(countSql, [
      data.account_id,
      data.branch_id,
    ]);
    const total = countResult[0]?.total || 0;

    return {
      currentPage: page,
      pageSize: limit,
      totalRecords: total,
      data: rows,
    };
  } catch (error) {
    console.error("Get product List Error: ", error);
    throw new Error("Failed to  get product list");
  }
};

exports.getAllAvailableProducts = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;

    let where = "WHERE  is_deleted = 0 AND account_id = ? AND branch_id = ? AND available_stock > 0 AND status = 'active'";
    if (data.q) {
      const q = data.q.toLowerCase();
      where += ` AND (LOWER(name) LIKE '%${q}%')`;
    }

    const sql = `
     SELECT * FROM products
     ${where}
     ORDER BY name ASC
      LIMIT ${limit} OFFSET ${offset}
      `;
    const params = [data.account_id, data.branch_id];
    const [rows] = await db.execute(sql, params);

    const countSql = `
       SELECT COUNT(*) AS total FROM products
      ${where}
     `;

    const [countResult] = await db.execute(countSql, [
      data.account_id,
      data.branch_id,
    ]);
    const total = countResult[0]?.total || 0;

    return {
      currentPage: page,
      pageSize: limit,
      totalRecords: total,
      data: rows,
    };
  } catch (error) {
    console.error("Get product List Error: ", error);
    throw new Error("Failed to  get product list");
  }
};

exports.getProductById = async (id) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM products WHERE id = ? AND is_deleted = 0`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Get single product  Error: ", error);
    throw new Error("Failed to  get single product");
  }
};

exports.updateProduct = async (id, data) => {
  try {
    const sql = `
      UPDATE products
      SET name = ?, description = ?, base_price = ?, sale_price = ?, hour_rent_price = ?,
          purchase_date = ?, images = ?, status = ?, updated_by = ?, updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `;

    const params = [
      data.name,
      data.description || null,
      data.base_price,
      data.sale_price != null ? data.sale_price : null,
      data.hour_rent_price != null ? data.hour_rent_price : null,
      data.purchase_date || null,
      data.images || null,
      data.status || "active",
      data.updated_by,
      new Date(),
      id,
    ];

    await db.execute(sql, params);
    return { message: "Product updated" };
  } catch (error) {
    console.error("Update product  Error: ", error);
    throw new Error("Failed to update product");
  }
};

exports.deleteProduct = async (id) => {
  try {
    await db.execute(`UPDATE products SET is_deleted = 1 WHERE id = ?`, [id]);
    return { message: "Product deleted" };
  } catch (error) {
    nsole.error("Delete product  Error: ", error);
    throw new Error("Failed to product");
  }
};

/**
 * Get available products (where available_stock > 0)
 * Used for product selection in lead add/edit
 */
exports.getAvailableProducts = async (accountId, branchId, filters = {}) => {
  try {
    let where = `WHERE p.is_deleted = 0 
                  AND p.account_id = ? 
                  AND p.branch_id = ? 
                  AND p.status = 'active' 
                  AND p.available_stock > 0`;

    const params = [accountId, branchId];

    if (filters.search) {
      where += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.sku_code) LIKE ?)`;
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      params.push(searchTerm, searchTerm);
    }

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.sku_code,
        p.description,
        p.available_stock,
        p.total_stock,
        p.rented_stock,
        p.sold_stock,
        p.hour_rent_price,
        p.sale_price,
        p.base_price,
      FROM products p
      ${where}
      ORDER BY p.name ASC
    `;

    const [rows] = await db.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Get available products error: ", error);
    throw new Error("Failed to get available products");
  }
};

exports.incDecProductStock = async (data) => {
  try {
    const { product_id, available_stock, total_stock, updated_by, updated_at } = data;

    const sql = `
    UPDATE products
    SET available_stock = ?, total_stock = ?, updated_by = ?, updated_at = ?
    WHERE id = ?
    `;

    const params = [available_stock, total_stock, updated_by, updated_at, product_id];

    const [result] = await db.execute(sql, params);
    return result.affectedRows;

  } catch (error) {
    console.error("Increment/Decrement product stock error: ", error);
    throw new Error("Failed to increment/decrement product stock");
  }
}