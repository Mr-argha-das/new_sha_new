const db = require("../config/db");
const constantVariables = require("../utils/constantVariables");

exports.createRole = async (data) => {
  const now = new Date();

  console.log("data ============", data);
  try {
    const sql =
      "INSERT INTO roles (name, alias, menu_map, account_id, branch_id, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const params = [
      data.name,
      data.name.replaceAll(" ", "_"),
      JSON.stringify(data.menu_map),
      data.account_id,
      data.branch_id,
      data.created_by,
      data.updated_by,
      now,
      now,
    ];
    const [roleResult] = await db.execute(sql, params);
    return roleResult.insertId || null;
  } catch (error) {
    console.error("createRole Error:", error);
    throw new Error("createRole failed");
  }
};

exports.getAllRolesByAccount = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;
    let orderBy = "";
    if (data.sort && data.order) {
      orderBy = `ORDER BY ${data.sort} ${data.order}`;
    }
    let where =
      "WHERE account_id IN (?,?)  AND branch_id IN (?,?)  AND isDeleted = 0";
    if (data.q) {
      where += ` AND name LIKE '%${data.q}%'`;
    }
    if (data.exclude_id) {
      where += ` AND id != ${data.exclude_id}`;
    }
    const sql = `
      SELECT * FROM roles
      ${where}
      ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const params = [
      constantVariables.default_role_account_id,
      data.account_id,
      constantVariables.default_role_branch_id,
      data.branch_id,
    ];
    const [rows] = await db.execute(sql, params);

    // Optional: total count for frontend pagination
    const countSql = `
      SELECT COUNT(*) AS total FROM roles
     ${where}
    `;
    const [countResult] = await db.execute(countSql, [
      constantVariables.default_role_account_id,
      data.account_id,
      constantVariables.default_role_branch_id,
      data.branch_id,
    ]);
    const total = countResult[0]?.total || 0;

    return {
      currentPage: page,
      pageSize: limit,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      data: rows,
    };
  } catch (error) {
    console.error("Get All Roles (Paginated) Error:", error);
    throw new Error("Failed to fetch all roles");
  }
};

exports.getRoleById = async (id) => {
  try {
    const sql = "SELECT * FROM roles WHERE id = ? AND isDeleted = 0";
    const params = [id];
    const result = await db.execute(sql, params);
    const [rows] = result;
    return rows[0];
  } catch (error) {
    console.error("Get Role By ID Error:", error);
    throw new Error("Failed to fetch Role By ID");
  }
};

exports.updateRole = async (id, data) => {
  try {
    // Step 1: Check if rolename already exists for a different role
    const checkSql =
      "SELECT id FROM roles WHERE name = ? AND account_id = ? AND branch_id = ? AND id != ?";
    const checkParams = [data.name, data.account_id, data.branch_id, id];
    const [existing] = await db.execute(checkSql, checkParams);

    if (existing.length > 0) {
      throw new Error("Role Name already exists");
    }
    // Step 2: Update the role data

    const sql =
      "UPDATE roles SET name = ?, alias = ?, menu_map = ?, account_id = ?, branch_id = ?,updated_by = ? WHERE id = ?";
    const params = [
      data.name,
      data.name.replaceAll(" ", "_"),
      JSON.stringify(data.menu_map),
      data.account_id,
      data.branch_id,
      data.updated_by,
      id,
    ];
    await db.execute(sql, params);
    return { message: "Role updated successfully" };
  } catch (error) {
    console.error("Update Role Error:", error);
    throw new Error(error);
  }
};

exports.deleteRole = async (id) => {
  try {
    const sql = "UPDATE roles SET isDeleted = 1 WHERE id = ?";
    const params = [id];
    const result = await db.execute(sql, params);
    return { message: "Role deleted successfully" };
  } catch (error) {
    console.error("Delete Role Error:", error);
    throw new Error("Failed to delete Role");
  }
};

exports.checkRoleByName = async (name) => {
  try {
    const sql = "SELECT * FROM roles WHERE name = ? AND isDeleted = 0";
    const params = [name];
    const result = await db.execute(sql, params);
    const [rows] = result;

    const role = rows[0];
    return role;
  } catch (error) {
    console.error("checkRoleByName Error:", error);
    throw new Error("Failed checkRoleByName Error");
  }
};
