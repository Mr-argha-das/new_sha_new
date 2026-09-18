const db = require("../config/db");

exports.checkServiceByName = async (name, account_id, id = null) => {
  try {
    let params = [];
    let sql;
    if (id) {
      sql = `
      SELECT * FROM services
      WHERE is_deleted = 0 AND LOWER(TRIM(name)) = ? AND account_id = ? AND id != ?
      `;
      params = [name.trim().toLowerCase(), account_id, id];
    } else {
      sql = `
      SELECT * FROM services
      WHERE is_deleted = 0 AND LOWER(TRIM(name)) = ? AND account_id = ?
      `;
      params = [name.trim().toLowerCase(), account_id];
    }

    const [result] = await db.execute(sql, params);
    return result[0];
  } catch (error) {
    console.error("Check service by name Error: ", error);
    throw new Error("Failed to  check service by name.");
  }
};

exports.createService = async (data) => {
  try {
    const now = new Date();
    const sql = `
      INSERT INTO services (account_id, branch_id, name, description, hour_price, is_deleted, created_by, updated_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
    `;
    const params = [
      data.account_id,
      data.branch_id,
      data.name,
      data.description || null,
      data.hour_price,
      data.created_by,
      data.updated_by,
      now,
      now,
    ];
    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Create service Error: ", error);
    throw new Error("Failed to create service");
  }
};

exports.getAllServicesByAccount = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;

    let where = "WHERE is_deleted = 0 AND account_id = ? AND branch_id = ?";

    if (data.q) {
      where += ` AND (name LIKE '%${data.q}%' OR hour_price = '${data.q}' OR description LIKE '%${data.q}%' )`;
    }

    let orderBy = "";
    if (data.sort && data.order) {
      orderBy = `ORDER BY ${data.sort} ${data.order}`;
    }

    const sql = `
      SELECT * FROM services
       ${where}
       ${orderBy}
        LIMIT ${limit} OFFSET ${offset}
    `;
    const params = [data.account_id, data.branch_id];
    const [rows] = await db.execute(sql, params);

    const countSql = `
        SELECT COUNT(*) AS total FROM services
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
    console.error("Get Service List Error: ", error);
    throw new Error("Failed to  get service list");
  }
};

exports.getServiceById = async (id) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM services WHERE id = ? AND is_deleted = 0`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Get single service  Error: ", error);
    throw new Error("Failed to  get single service");
  }
};

exports.updateService = async (id, data) => {
  try {
    const sql = `
      UPDATE services
      SET name = ?, description = ?, hour_price = ?, updated_by = ?, updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `;
    const params = [
      data.name,
      data.description || null,
      data.hour_price,
      data.updated_by,
      new Date(),
      id,
    ];
    await db.execute(sql, params);
    return { message: "Service updated" };
  } catch (error) {
    console.error("Update service  Error: ", error);
    throw new Error("Failed to update service");
  }
};

exports.deleteService = async (id) => {
  try {
    await db.execute(`UPDATE services SET is_deleted = 1 WHERE id = ?`, [id]);
    return { message: "Service deleted" };
  } catch (error) {
    console.error("Delete service  Error: ", error);
    throw new Error("Failed to service");
  }
};
