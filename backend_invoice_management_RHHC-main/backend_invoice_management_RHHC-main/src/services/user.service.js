const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const constVar = require("../utils/constantVariables");
const { toYYYYMMDD } = require("../utils/util");

exports.createUser = async (data) => {
  const now = new Date();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : null;

    const sql =
      "INSERT INTO users (name, mobile, email, username, password, mpin, role_id, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const params = [
      data.name,
      data.mobile,
      data?.email || null,
      data.username || "",
      hashedPassword,
      data.mpin || null,
      data.role_id,
      data.created_by,
      data.updated_by,
      now,
      now,
    ];
    const [userResult] = await conn.execute(sql, params);
    if (userResult.insertId) {
      // add reocrd in user_account_mappings table
      const insertMapSQL =
        "INSERT INTO user_account_mappings (user_id, account_id, branch_id, created_by, updated_by) VALUES (?, ?, ?, ?, ?)";
      const mapParams = [
        userResult.insertId,
        data.account_id,
        data.branch_id,
        data.created_by,
        data.updated_by,
      ];

      const userAccountMap = await conn.execute(insertMapSQL, mapParams);
    }

    const userDetailsSql = `
    INSERT INTO user_details (
    account_id, branch_id, user_id, hour_price, working_hours, permanent_address,
     temporary_address, aadhar_number, pan_number, driving_license_number,
      age, gender, date_of_birth, marital_status, designation, police_verification, medical_verification, has_driving_license, has_vehicle, status, block_reason,
      reference_relationship, reference_mobile_1, reference_mobile_2, reference_aadhar_url,
       created_by, updated_by, created_at, updated_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const userDetailParams = [
      data.account_id,
      data.branch_id,
      userResult.insertId,
      Number(data.hour_price) || null,
      Number(data.working_hours) || null,
      data.permanent_address,
      data.temporary_address || null,
      data.aadhar_number || null,
      data.pan_number || null,
      data.driving_license_number || null,
      data.age || null,
      data.gender || null,
      data.date_of_birth || null,
      data.marital_status || null,
      data.designation || null,
      data.police_verification || null,
      data.medical_verification || null,
      data.has_driving_license,
      data.has_vehicle,
      data.status,
      data.block_reason || null,
      data.reference_relationship || null,
      data.reference_mobile_1 || null,
      data.reference_mobile_2 || null,
      data.reference_aadhar_url || null,
      data.created_by,
      data.updated_by,
      now,
      now,
    ];
    const [userDetailResult] = await conn.execute(
      userDetailsSql,
      userDetailParams
    );


    await conn.commit();
    return userResult.insertId || null;
  } catch (error) {
    await conn.rollback();
    console.error("createUser Error:", error);
    throw new Error("createUser failed");
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

exports.login = async ({ mobile, password }) => {
  try {
    const sql = `
      SELECT u.*, uam.account_id, uam.branch_id
      FROM users u
      JOIN user_account_mappings uam ON u.id = uam.user_id
      WHERE u.mobile = ? AND u.isDeleted = 0
      LIMIT 1
    `;
    const params = [mobile];
    const result = await db.execute(sql, params);
    const [rows] = result;

    const user = rows[0];
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password if it exists (new users), otherwise fallback to mpin for backward compatibility
    let isValid = false;
    if (user.password) {
      isValid = await bcrypt.compare(password, user.password);
    } else if (user.mpin) {
      // Backward compatibility: allow mpin login for old users
      isValid = user.mpin === password;
    }

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { token };
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error("Login failed");
  }
};

exports.checkUserByPhone = async (mobile, exclude_id = null) => {
  console.log(mobile, exclude_id);
  try {
    let where = "WHERE u.mobile = ? AND u.isDeleted = 0";
    if (exclude_id) {
      where += ` AND u.id != ${exclude_id}`;
    }
    const sql = `
    SELECT u.*, uam.account_id, uam.branch_id
    FROM users u
    JOIN user_account_mappings uam  ON u.id = uam.user_id
    ${where}
    `;
    const params = [mobile];
    const result = await db.execute(sql, params);
    const [rows] = result;

    const user = rows[0];
    return user;
  } catch (error) {
    console.error("checkUserByPhone Error:", error);
    throw new Error("checkUserByPhone");
  }
};

exports.checkUserByEmail = async (email, exclude_id = null) => {
  try {
    let where = "WHERE u.email = ? AND u.isDeleted = 0";
    if (exclude_id) {
      where += ` AND u.id != ${exclude_id}`;
    }
    const sql = `
    SELECT u.*, uam.account_id, uam.branch_id
    FROM users u
    JOIN user_account_mappings uam ON u.id = uam.user_id
    ${where}
    LIMIT 1
    `;
    const params = [email];
    const result = await db.execute(sql, params);
    const [rows] = result;

    return rows[0] || null;
  } catch (error) {
    console.error("checkUserByEmail Error:", error);
    throw new Error("checkUserByEmail failed");
  }
};

exports.getAllUsersByAccount = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const offset = (page - 1) * limit;

    let where = `WHERE uam.account_id = ? AND uam.branch_id = ? AND u.isDeleted = 0`;

    const isRoleIncluded = String(data.isRoleIncluded).toLowerCase() === "true";
    if (isRoleIncluded) {
      where += ` AND u.role_id = ${constVar.customer_role_id}`;
    } else {
      where += ` AND u.role_id NOT IN (${constVar.customer_role_id}, ${constVar.supAdmin_role_id})`;
    }

    if (data.q) {
      where += ` AND ( LOWER(u.name) LIKE '%${data.q}%' OR LOWER(u.mobile) LIKE '%${data.q}%'
      OR LOWER(u.email) LIKE '%${data.q}%'
      OR LOWER(stexp.total_experience_month) LIKE '%${data.q}%' `;

      if (isRoleIncluded) {
        where += `OR ( ud.permanent_address IS NOT NULL AND (
        LOWER(JSON_UNQUOTE(JSON_EXTRACT(ud.permanent_address, '$.city.label'))) LIKE '%${data.q}%'
        OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(ud.permanent_address, '$.pinCode'))) LIKE '%${data.q}%'
      ))`;
      }

      where += " )";
    }
    if (data.status) {
      where += ` AND ud.status = '${data.status}'`;
    }

    if (data.has_vehicle) {
      where += ` AND ud.has_vehicle = ${parseInt(data.has_vehicle)}`;
    }

    if (data.has_driving_license) {
      where += ` AND ud.has_driving_license = ${parseInt(data.has_driving_license)}`;
    }

    if (data.designation) {
      where += ` AND ud.designation = '${data.designation}'`;
    }

    if (data.police_verification) {
      where += ` AND ud.police_verification = ${parseInt(data.police_verification)}`;
    }

    if (data.medical_verification) {
      where += ` AND ud.medical_verification = ${parseInt(data.medical_verification)}`;
    }

    let orderBy = "";
    if (data.sort && data.order) {
      const order = data.order.toUpperCase() === "DESC" ? "DESC" : "ASC";

      if (data.sort === "city") {
        orderBy = `ORDER BY JSON_UNQUOTE(JSON_EXTRACT(ud.permanent_address, '$.city.label')) ${order}`;
      } else if (data.sort === "pincode") {
        orderBy = `ORDER BY JSON_UNQUOTE(JSON_EXTRACT(ud.permanent_address, '$.pinCode')) ${order}`;
      } else {
        orderBy = `ORDER BY ${data.sort} ${order}`;
      }
    } else {
      orderBy = "ORDER BY u.id DESC";
    }

    const sql = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.mobile,
        role.name AS role_name,
        SUM(COALESCE(stexp.total_experience_month, 0)) AS total_experience_in_months,
       ud.permanent_address AS permanent_address,
      ud.temporary_address AS temporary_address,
      ud.working_hours AS working_hours,
      ud.status AS status,
      ud.has_vehicle AS has_vehicle,
      ud.has_driving_license AS has_driving_license,
      ud.designation AS designation,
      ud.police_verification AS police_verification,
      ud.medical_verification AS medical_verification,
      ud.photo_url AS photo_url
      FROM users u
      JOIN user_account_mappings uam
        ON u.id = uam.user_id
      LEFT JOIN staff_experience stexp
        ON u.id = stexp.user_id
        AND stexp.is_deleted = 0
      LEFT JOIN roles role
        ON u.role_id = role.id
      LEFT JOIN user_details ud
        ON u.id = ud.user_id
      ${where}
      GROUP BY  u.id,
                u.name,
                u.email,
                u.mobile,
                role.name,
                ud.permanent_address,
                ud.temporary_address,
                ud.working_hours,
                ud.status,
                ud.has_vehicle,
                ud.has_driving_license,
                ud.designation,
                ud.police_verification,
                ud.medical_verification,
                ud.photo_url
      ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const params = [data.account_id, data.branch_id];
    let [rows] = await db.execute(sql, params);

    rows = rows.map((row) => {
      try {
        if (row.permanent_address) {
          row.permanent_address = JSON.parse(row.permanent_address);
        }
        if (row.temporary_address) {
          row.temporary_address = JSON.parse(row.temporary_address);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
      }
      return row;
    });

    // Optional: total count for frontend pagination
    const countSql = `
     SELECT COUNT(DISTINCT u.id) AS total
       FROM users u
       JOIN user_account_mappings uam ON u.id = uam.user_id
       LEFT JOIN staff_experience stexp ON u.id = stexp.user_id
       LEFT JOIN roles role ON u.role_id = role.id
       LEFT JOIN user_details ud ON u.id = ud.user_id
       ${where}
`;

    const [countResult] = await db.execute(countSql, [
      data.account_id,
      data.branch_id,
    ]);
    console.log(countResult);

    const total = countResult[0]?.total || 0;

    return {
      currentPage: page,
      pageSize: limit,
      totalRecords: total,
      data: rows,
    };
  } catch (error) {
    console.error("Get All Users (Paginated) Error:", error);
    throw new Error("Failed to fetch users");
  }
};

exports.getUserById = async (id, withRole = false) => {
  try {
    let sql = "";
    const params = [Number(id)];

    if (withRole) {
      sql = `
        SELECT 
          users.id,
          users.name,
          users.email,
          users.mobile,
          users.role_id,
          roles.id AS role_id,
          roles.name AS role_name,
          roles.menu_map AS menu_map,
          uam.account_id AS account_id,
          uam.branch_id AS branch_id
        FROM users
        LEFT JOIN roles ON users.role_id = roles.id
        JOIN user_account_mappings uam ON users.id =  uam.user_id
        WHERE users.id = ? AND users.isDeleted = 0
      `;
    } else {
      sql = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.mobile,
          u.role_id,
          r.name AS role_name,
          ud.permanent_address,
          ud.temporary_address,
          ud.hour_price,
          ud.working_hours,
          ud.age,
          ud.gender,
          ud.has_driving_license,
          ud.has_vehicle,
          ud.status,
          ud.block_reason,
          ud.reference_relationship,
          ud.reference_mobile_1,
          ud.reference_mobile_2,
          ud.reference_aadhar_url,
          ud.aadhar_card_url,
          ud.pan_card_url,
          ud.driving_license_url,
          ud.aadhar_number,
          ud.pan_number,
          ud.driving_license_number,
          ud.photo_url,
          ud.date_of_birth,
          ud.marital_status,
          ud.designation,
          ud.police_verification,
          ud.medical_verification,
           -- Lead as JSON
    (
        SELECT IFNULL(CONCAT('[', GROUP_CONCAT(
            CONCAT(
                '{"id":', l.id,
                ',"customer_id":', l.customer_id,
                ',"lead_name":"', REPLACE(l.lead_name, '"', '\\"'), '"',
                ',"start_date":"', IFNULL(l.start_date,''), '"',
                ',"end_date":"', IFNULL(l.end_date,''), '"',
                ',"security_deposit":', IFNULL(l.security_deposit,0),
                ',"status":"', IFNULL(l.status,''), '"',
                ',"lead_status":"', IFNULL(l.lead_status,''), '"',
                '}'
            ) ORDER BY l.id DESC
        ), ']'), '[]')
        FROM lead_generate l
        WHERE l.customer_id = u.id AND l.is_deleted = 0
    ) AS lead_json

        FROM users u
          LEFT JOIN roles r ON u.role_id = r.id
          LEFT JOIN user_details ud ON u.id = ud.user_id
        WHERE u.id = ? AND u.isDeleted = 0
      `;
    }

    const [rows] = await db.execute(sql, params);
    let data = rows[0] ?? null;
    if (data && !withRole) {
      data.leads = data.lead_json ? JSON.parse(data.lead_json) : [];
      delete data.lead_json;
    }
    if (data) {
      try {
        if (data.permanent_address) {
          data.permanent_address = JSON.parse(data.permanent_address);
        }
        if (data.temporary_address) {
          data.temporary_address = JSON.parse(data.temporary_address);
        }
      } catch (error) {
        console.error("JSON parse error:", error);
        data.permanent_address = data.permanent_address;
        data.temporary_address = data.temporary_address;
      }

      // Fetch qualifications
      const qualSql = `
        SELECT id, qualification_type, qualification_name, registration_no, year_of_passout
        FROM staff_qualifications
        WHERE staff_id = ? AND is_deleted = 0
        ORDER BY id ASC
      `;
      const [qualRows] = await db.execute(qualSql, [id]);
      data.qualifications = qualRows || [];
    }
    return data;
  } catch (error) {
    console.error("Get User By ID Error:", error);
    throw new Error("Failed to fetch user");
  }
};

exports.updateUser = async (id, data) => {
  try {
    const {
      account_id: accountId,
      branch_id: branchID,
      temporary_address,
      permanent_address,
      hour_price,
      working_hours,
      age = null,
      gender = null,
      date_of_birth = null,
      marital_status = null,
      designation = null,
      police_verification = null,
      medical_verification = null,
      has_driving_license = null,
      has_vehicle = null,
      status = null,
      block_reason = null,
      aadhar_card_url = null,
      pan_card_url = null,
      driving_license_url = null,
      reference_aadhar_url = null,
      reference_mobile_1 = null,
      reference_mobile_2 = null,
      reference_relationship = null,
      aadhar_number = null,
      pan_number = null,
      driving_license_number = null,
      photo_url = null,
      ...dataToUpdate
    } = data;
    // Step 2: Dynamically construct SQL
    const keys = Object.keys(dataToUpdate); // <-- dynamic
    if (keys.length > 0) {
      const fields = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => data[key]);

      const sql = `UPDATE users SET ${fields} WHERE id = ?`;
      values.push(id); // add id at the end

      await db.execute(sql, values);
    }
    const userDetailsSql = `
  UPDATE user_details
  SET permanent_address = ?,
      temporary_address = ?,
      hour_price = ?,
      working_hours = ?,
      age = ?,
      gender = ?,
      date_of_birth = ?,
      marital_status = ?,
      designation = ?,
      police_verification = ?,
      medical_verification = ?,
      has_driving_license = ?,
      has_vehicle = ?,
      status = ?,
      block_reason = ?,
      reference_relationship = ?,
      reference_mobile_1 = ?,
      reference_mobile_2 = ?,
      reference_aadhar_url = ?,
      aadhar_card_url = ?,
      pan_card_url = ?,
      driving_license_url = ?,
      aadhar_number = ?,
      pan_number = ?,
      driving_license_number = ?,
      photo_url = ?,
      updated_by = ?,
      updated_at = ?
  WHERE user_id = ?
`;

    const userDetailParams = [
      permanent_address,
      temporary_address,
      hour_price,
      working_hours,
      age || null,
      gender || null,
      date_of_birth ? toYYYYMMDD(date_of_birth) : null,
      marital_status || null,
      designation || null,
      police_verification || 0,
      medical_verification || 0,
      has_driving_license,
      has_vehicle,
      status,
      block_reason || null,
      reference_relationship || null,
      reference_mobile_1 || null,
      reference_mobile_2 || null,
      reference_aadhar_url || null,
      aadhar_card_url || null,
      pan_card_url || null,
      driving_license_url || null,
      aadhar_number || null,
      pan_number || null,
      driving_license_number || null,
      photo_url || null,
      data.updated_by,
      new Date(),
      id,
    ];

    const [userDetailResult] = await db.execute(
      userDetailsSql,
      userDetailParams
    );


    console.log(userDetailParams);
    console.log(userDetailResult);
    return { message: "User updated successfully" };
  } catch (error) {
    console.error("Update User Error:", error);
    throw new Error(error.message || "Failed to update user");
  }
};

exports.updateProfile = async (id, data) => {
  try {
    // Only update allowed fields in users table
    const userFields = ['name', 'email', 'mobile', 'password'];
    const userUpdateData = {};

    userFields.forEach(field => {
      if (data[field] !== undefined) {
        userUpdateData[field] = data[field];
      }
    });

    // Update users table if there are fields to update
    if (Object.keys(userUpdateData).length > 0) {
      userUpdateData.updated_by = data.updated_by;
      const keys = Object.keys(userUpdateData);
      const fields = keys.map((key) => `${key} = ?`).join(", ");
      const values = keys.map((key) => userUpdateData[key]);
      const sql = `UPDATE users SET ${fields}, updated_at = ? WHERE id = ?`;
      values.push(new Date());
      values.push(id);
      await db.execute(sql, values);
    }

    return { message: "Profile updated successfully" };
  } catch (error) {
    console.error("Update Profile Error:", error);
    throw new Error(error.message || "Failed to update profile");
  }
};

exports.deleteUser = async (id) => {
  try {
    const sql = "UPDATE users SET isDeleted = 1 WHERE id = ?";
    const params = [id];
    const result = await db.execute(sql, params);

    const sql1 = "UPDATE user_details SET is_deleted = 1 WHERE user_id = ?";
    const params1 = [id];
    const result1 = await db.execute(sql1, params1);
    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Delete User Error:", error);
    throw new Error("Failed to delete user");
  }
};

exports.getAllCustomerByAccount = async (data) => {
  try {
    const page = parseInt(data.page) || 0;
    const limit = parseInt(data.limit) || 0;
    const offset = (page - 1) * limit;

    let where = `WHERE uam.account_id = ? AND uam.branch_id = ? AND u.isDeleted = 0 AND u.role_id = ${constVar.customer_role_id}`;
    if (data.q) {
      where += ` AND LOWER(u.name) LIKE '%${data.q}%'`;
    }

    const sql = `
      SELECT u.* FROM users u
      JOIN user_account_mappings uam ON u.id = uam.user_id
      ${where}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const params = [data.account_id, data.branch_id];
    const [rows] = await db.execute(sql, params);

    const countSql = `
      SELECT COUNT(*) AS total FROM users u
      JOIN user_account_mappings uam ON u.id = uam.user_id
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
    console.error("Get Customer Error: ", error);
    throw new Error("Get customer list error");
  }
};

exports.updateUserDetailsDocs = async (userId, data) => {
  try {
    const sql = `
      UPDATE user_details
      SET
        aadhar_card_url = COALESCE(?, aadhar_card_url),
        pan_card_url = COALESCE(?, pan_card_url),
        driving_license_url = COALESCE(?, driving_license_url),
        photo_url = COALESCE(?, photo_url),
        reference_aadhar_url = COALESCE(?, reference_aadhar_url),
        updated_by = ?,
        updated_at = ?
      WHERE user_id = ?`;
    const params = [
      data.aadhar_card_url || null,
      data.pan_card_url || null,
      data.driving_license_url || null,
      data.photo_url || null,
      data.reference_aadhar_url || null,
      data.updated_by,
      new Date(),
      userId,
    ];
    await db.execute(sql, params);
  } catch (error) {
    console.error("updateUserDetailsDocs Error:", error);
    throw new Error("Failed to update user details docs");
  }
};

exports.getDesignations = async (data) => {
  // Default designations - always included
  const defaultDesignations = ['nurse', 'attendant'];

  try {
    // Get unique designations from database (excluding null and empty strings)
    const sql = `
      SELECT DISTINCT designation 
      FROM user_details 
      WHERE designation IS NOT NULL 
        AND designation != '' 
        AND is_deleted = 0
        AND account_id = ?
        AND branch_id = ?
      ORDER BY designation ASC
    `;

    const [rows] = await db.execute(sql, [data.account_id, data.branch_id]);

    // Extract designation values
    const dbDesignations = rows.map(row => row.designation).filter(Boolean);

    // Combine default and database designations, remove duplicates
    const allDesignations = [...new Set([...defaultDesignations, ...dbDesignations])];

    return allDesignations;
  } catch (error) {
    console.error("Get Designations Error:", error);
    // Return defaults even if database query fails
    return defaultDesignations;
  }
};