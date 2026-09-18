const db = require("../config/db");

exports.checkCategoryByName = async (name, account_id, id = null) => {
  try {
    let params = [];
    let sql;
    if (id) {
      sql = `
      SELECT * FROM staff_experience_category
      WHERE is_deleted = 0 AND LOWER(TRIM(name)) = ? AND account_id = ? AND id != ?
      `;
      params = [name.trim().toLowerCase(), account_id, id];
    } else {
      sql = `
      SELECT * FROM staff_experience_category
      WHERE is_deleted = 0 AND LOWER(TRIM(name)) = ? AND account_id = ?
      `;
      params = [name.trim().toLowerCase(), account_id];
    }

    const [result] = await db.execute(sql, params);
    return result[0];
  } catch (error) {
    console.error("Check category by name Error: ", error);
    throw new Error("Failed to check category by name.");
  }
};

exports.createCategory = async (data) => {
  try {
    const now = new Date();
    const sql = `
      INSERT INTO staff_experience_category (account_id, branch_id, name, description, is_deleted, created_by, updated_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)
    `;
    const params = [
      data.account_id,
      data.branch_id,
      data.name,
      data.description || null,
      data.created_by,
      data.updated_by,
      now,
      now,
    ];
    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Create category Error: ", error);
    throw new Error("Failed to create category");
  }
};

exports.getAllCategoriesByAccount = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;

    let where = "WHERE is_deleted = 0 AND account_id = ? AND branch_id = ?";

    if (data.q) {
      where += ` AND (name LIKE '%${data.q}%' OR description LIKE '%${data.q}%')`;
    }

    let orderBy = "";
    if (data.sort && data.order) {
      orderBy = `ORDER BY ${data.sort} ${data.order}`;
    } else {
      orderBy = "ORDER BY name ASC";
    }

    const sql = `
      SELECT * FROM staff_experience_category
       ${where}
       ${orderBy}
        LIMIT ${limit} OFFSET ${offset}
    `;
    const params = [data.account_id, data.branch_id];
    const [rows] = await db.execute(sql, params);

    const countSql = `
        SELECT COUNT(*) AS total FROM staff_experience_category
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
    console.error("Get Category List Error: ", error);
    throw new Error("Failed to get category list");
  }
};

exports.getCategoryById = async (id) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM staff_experience_category WHERE id = ? AND is_deleted = 0`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Get single category Error: ", error);
    throw new Error("Failed to get single category");
  }
};

exports.updateCategory = async (id, data) => {
  try {
    const sql = `
      UPDATE staff_experience_category
      SET name = ?, description = ?, updated_by = ?, updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `;
    const params = [
      data.name,
      data.description || null,
      data.updated_by,
      new Date(),
      id,
    ];
    await db.execute(sql, params);
    return { message: "Category updated" };
  } catch (error) {
    console.error("Update category Error: ", error);
    throw new Error("Failed to update category");
  }
};

exports.deleteCategory = async (id) => {
  try {
    await db.execute(
      `UPDATE staff_experience_category SET is_deleted = 1 WHERE id = ?`,
      [id]
    );
    return { message: "Category deleted" };
  } catch (error) {
    console.error("Delete category Error: ", error);
    throw new Error("Failed to delete category");
  }
};

exports.getCategoriesForDropdown = async (account_id, branch_id) => {
  try {
    const sql = `
      SELECT id, name FROM staff_experience_category
      WHERE is_deleted = 0 AND account_id = ? AND branch_id = ?
      ORDER BY name ASC
    `;
    const [rows] = await db.execute(sql, [account_id, branch_id]);
    return rows;
  } catch (error) {
    console.error("Get categories for dropdown Error: ", error);
    throw new Error("Failed to get categories for dropdown");
  }
};
