const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const cron = require("node-cron");

dayjs.extend(customParseFormat);

const DATE_INPUT_FORMAT = "DD-MM-YYYY";

const normaliseDateRange = (fromDate, toDate) => {
  const today = dayjs();

  let start = fromDate
    ? dayjs(fromDate, DATE_INPUT_FORMAT, true)
    : today.subtract(1, "month");
  let end = toDate ? dayjs(toDate, DATE_INPUT_FORMAT, true) : today;

  if (!start.isValid()) {
    start = today.subtract(1, "month");
  }
  if (!end.isValid()) {
    end = today;
  }

  if (start.isAfter(end)) {
    const temp = start;
    start = end;
    end = temp;
  }

  return {
    startDate: start.startOf("day"),
    endDate: end.endOf("day"),
  };
};

const getTaskStartDay = (row) => {
  const d = dayjs(row.from_date_time);
  return d.isValid() ? d.startOf("day") : null;
};

const getTaskEndDay = (row) => {
  const d = dayjs(row.end_date_time || row.to_date_time);
  return d.isValid() ? d.startOf("day") : null;
};

const getHoursPerDay = (row) => {
  const working = Number(row.staff_working_hours);
  if (Number.isFinite(working) && working > 0) return working;

  const start = getTaskStartDay(row);
  const end = getTaskEndDay(row);
  const totalHour = Number(row.total_hour) || 0;
  if (!start || !end) return totalHour;

  const fullDays = Math.max(1, end.diff(start, "day") + 1);
  return totalHour / fullDays;
};

const calcActivityAmountInRange = (row, rangeStart, rangeEnd) => {
  const taskStart = getTaskStartDay(row);
  if (!taskStart) return 0;

  // Count each activity on its from-date only (matches payslip activity rows).
  if (taskStart.isBefore(rangeStart, "day") || taskStart.isAfter(rangeEnd, "day")) {
    return 0;
  }

  const totalHour = Number(row.total_hour) || 0;
  const hours = totalHour > 0 ? totalHour : getHoursPerDay(row);
  const hourPrice = Number(row.hour_price) || 0;
  // return Math.round(hours * hourPrice);
  return hours * hourPrice;
};

let dailyAutoCompleteCronTask = null;

const safeToDate = (v) => {
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Runs at 08:00 AM India time to auto-complete all active tasks.
 * - Completes tasks in 'todo' | 'inProgress' | 'onHold' when to_date_time has passed
 * - Closes any open hold row
 * - Recalculates total_hour = (now - start_date_time) - (total_hold_minutes/60)
 */
exports.completeAllStaffTasksAtTime = async ({ now = new Date() } = {}) => {
  try {
    const endAt = safeToDate(now) || new Date();

    const [rows] = await db.execute(
      `
        SELECT
          id,
          account_id,
          branch_id,
          start_date_time,
          from_date_time,
          status
        FROM staff_activity
        WHERE is_deleted = 0
          AND status IN ('inProgress')
          AND from_date_time IS NOT NULL
          AND from_date_time <= ?
      `,
      [endAt],
    );

    for (const r of rows || []) {
      const taskId = Number(r.id);
      const account_id = Number(r.account_id);
      const branch_id = Number(r.branch_id);
      const startAt = safeToDate(r.start_date_time) || safeToDate(r.from_date_time);

      // no start => skip (avoid bad data)
      if (!startAt) continue;

      // If task is currently on hold, close the latest open hold row first.
      await exports.closeLatestOpenTaskHold({
        task_id: taskId,
        account_id,
        branch_id,
        hold_end_at: endAt,
        updated_by: null,
      });

      const totalHoldMinutes = await exports.getTaskHoldMinutesSum({
        task_id: taskId,
        account_id,
        branch_id,
      });

      const grossHours = Math.max(
        0,
        (endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60),
      );
      const netHours = Math.max(0, grossHours - Number(totalHoldMinutes || 0) / 60);

      await db.execute(
        `
          UPDATE staff_activity
          SET
            status = 'done',
            end_date_time = ?,
            total_hour = ?,
            updated_by = NULL,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND is_deleted = 0
        `,
        [endAt, parseFloat(netHours.toFixed(4)), taskId],
      );
    }

    return { updated: (rows || []).length };
  } catch (error) {
    console.error("Complete all staff tasks at time error:", error);
    throw new Error("failed to complete tasks");
  }
};

/**
 * Starts a daily cron at 08:00 AM Asia/Kolkata.
 * Idempotent: calling multiple times won't schedule multiple tasks.
 */
exports.startDailyAutoCompleteCron = () => {
  if (dailyAutoCompleteCronTask) return dailyAutoCompleteCronTask;

  dailyAutoCompleteCronTask = cron.schedule(
    // "* * * * *",
    "0 8 * * *",
    async () => {
      try {
        await exports.completeAllStaffTasksAtTime({ now: new Date() });
      } catch (e) {
        console.error("Daily auto complete cron failed:", e);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );

  return dailyAutoCompleteCronTask;
};

exports.addExperience = async (data) => {
  try {
    const sql = `
      INSERT INTO staff_experience
        (account_id, branch_id, user_id, category_id, from_month_year,
         to_month_year, total_experience_month, org_name, referral_details, worked_in,
         description, is_deleted, created_by, is_currently_working, documents)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `;

    const params = [
      data.account_id,
      data.branch_id,
      data.staff_id,
      data.category_id || null,
      data.from_month_year,
      data.to_month_year || null,
      data.total_experience_month,
      data.org_name,
      data.referral_details ? JSON.stringify(data.referral_details) : null,
      data.worked_in || null,
      data.description || null,
      data.created_by,
      data.is_currently_working,
      null,
    ];

    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Add experience error:", error);
    throw new Error("Failed to add experience");
  }
};

exports.updateExperience = async (id, data) => {
  try {
    const sql = `UPDATE staff_experience SET
     category_id = ?, from_month_year = ?, to_month_year = ?, total_experience_month = ?,
      org_name = ?, referral_details = ?, worked_in = ?, description = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP,
      is_currently_working = ?
      WHERE id = ? AND is_deleted = 0`;

    const params = [
      data.category_id || null,
      data.from_month_year,
      data.to_month_year || null,
      data.total_experience_month,
      data.org_name,
      data.referral_details ? JSON.stringify(data.referral_details) : null,
      data.worked_in || null,
      data.description || null,
      data.updated_by,
      data.is_currently_working,
      id,
    ];

    const [result] = await db.execute(sql, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Update experience error:", error);
    throw new Error("Failed to update experience");
  }
};

exports.updateExperienceDocuments = async (id, documents) => {
  try {
    const sql = `UPDATE staff_experience SET documents = ? WHERE id = ?`;
    const params = [JSON.stringify(documents), id];
    await db.execute(sql, params);
  } catch (error) {
    console.error("Update documents error:", error);
    throw new Error("Failed to update documents");
  }
};

exports.deleteExperience = async (id, updatedBy) => {
  try {
    const sql = `UPDATE staff_experience 
        SET is_deleted = 1, updated_by = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND is_deleted = 0`;
    const [result] = await db.execute(sql, [updatedBy, id]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Delete experience error:", error);
    throw new Error("Failed to delete experience");
  }
};

exports.getExperiences = async (data) => {
  try {
    const sql = `SELECT se.*,
     u.name AS staff_name,
     u.email AS staff_email,
     u.mobile AS staff_mobile,
     ct.name AS category_name
         FROM staff_experience se
         LEFT JOIN users u ON se.user_id = u.id
         LEFT JOIN staff_experience_category ct ON se.category_id = ct.id
        WHERE se.user_id = ? AND se.is_deleted = 0 AND se.account_id = ? AND se.branch_id = ? AND ct.is_deleted = 0
         ORDER BY se.from_month_year DESC`;
    const [rows] = await db.execute(sql, [
      data.user_id,
      data.account_id,
      data.branch_id,
    ]);

    // Parse referral_details JSON if present
    return rows.map(row => {
      if (row.referral_details && typeof row.referral_details === 'string') {
        try {
          row.referral_details = JSON.parse(row.referral_details);
        } catch (e) {
          row.referral_details = null;
        }
      }
      return row;
    });
  } catch (error) {
    console.error("Get experiences error:", error);
    throw new Error("Failed to get experiences");
  }
};

exports.getExperienceDocuments = async (id) => {
  try {
    const [rows] = await db.execute(
      `SELECT documents FROM staff_experience WHERE id = ? AND is_deleted = 0 LIMIT 1`,
      [id]
    );
    if (!rows.length) return [];
    const docs = rows[0].documents;
    if (!docs) return [];
    return typeof docs === "string"
      ? JSON.parse(docs)
      : Array.isArray(docs)
        ? docs
        : [];
  } catch (error) {
    console.error("Get experience documents error:", error);
    return [];
  }
};

exports.getSingleExperience = async (id) => {
  try {
    const [rows] = await db.execute(
      `SELECT documents FROM staff_experience WHERE id = ? AND is_deleted = 0 LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  } catch (error) {
    console.error("Get experience documents error:", error);
    return [];
  }
};

// Staff Qualifications
exports.addQualification = async (data) => {
  try {
    const now = new Date();
    const sql = `
      INSERT INTO staff_qualifications 
      (account_id, branch_id, staff_id, qualification_type, qualification_name, registration_no, year_of_passout, is_deleted, created_by, updated_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
    `;

    const params = [
      data.account_id,
      data.branch_id,
      data.staff_id,
      data.qualification_type,
      data.qualification_name,
      data.registration_no || null,
      data.year_of_passout,
      data.created_by,
      data.updated_by || data.created_by,
      now,
      now,
    ];

    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Add qualification error:", error);
    throw new Error("Failed to add qualification");
  }
};

exports.updateQualification = async (id, data) => {
  try {
    const now = new Date();
    const sql = `
      UPDATE staff_qualifications 
      SET qualification_type = ?, qualification_name = ?, registration_no = ?, year_of_passout = ?, updated_by = ?, updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `;

    const params = [
      data.qualification_type,
      data.qualification_name,
      data.registration_no || null,
      data.year_of_passout,
      data.updated_by,
      now,
      id,
    ];

    await db.execute(sql, params);
    return { message: "Qualification updated successfully" };
  } catch (error) {
    console.error("Update qualification error:", error);
    throw new Error("Failed to update qualification");
  }
};

exports.getQualificationById = async (id) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM staff_qualifications WHERE id = ? AND is_deleted = 0 LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  } catch (error) {
    console.error("Get qualification by id error:", error);
    throw new Error("Failed to get qualification");
  }
};

exports.deleteQualification = async (id, updated_by) => {
  try {
    const now = new Date();
    const sql = `
      UPDATE staff_qualifications 
      SET is_deleted = 1, updated_by = ?, updated_at = ?
      WHERE id = ? AND is_deleted = 0
    `;
    await db.execute(sql, [updated_by, now, id]);
    return { message: "Qualification deleted successfully" };
  } catch (error) {
    console.error("Delete qualification error:", error);
    throw new Error("Failed to delete qualification");
  }
};

exports.checkStaffisAssignedOnDateTime = async (data, exclude_activity_id = null) => {
  try {
    console.log("data", data);
    console.log("exclude_activity_id", exclude_activity_id);
    data.from_date_time = new Date(data.from_date_time)
    data.to_date_time = new Date(data.to_date_time)
    const sql = `
      SELECT id, from_date_time, to_date_time FROM staff_activity
      WHERE 
        user_id = ? AND 
        account_id = ? AND 
        branch_id = ? AND 
        is_deleted = 0 AND
        status != 'onHold' AND
        id != ? AND
        (
          (? BETWEEN from_date_time AND to_date_time) OR
          (? BETWEEN from_date_time AND to_date_time) OR
          (from_date_time BETWEEN ? AND ?) OR
          (to_date_time BETWEEN ? AND ?)
        )
      LIMIT 1
    `;

    const params = [
      data.staff_id,
      data.account_id,
      data.branch_id,
      exclude_activity_id,
      data.from_date_time,
      data.to_date_time,
      data.from_date_time,
      data.to_date_time,
      data.from_date_time,
      data.to_date_time,
    ];

    const [rows] = await db.execute(sql, params);
    return rows[0] ? rows[0] : null;
  } catch (error) {
    console.error("Get staff ongoing activity error:", error);
    throw new Error("Failed to get staff ongoing activity");
  }
};

exports.createStaffActivity = async (data) => {
  try {
    const now = new Date();
    const sql = `
      INSERT INTO staff_activity (
        user_id,
        account_id,
        branch_id,
        customer_id,
        from_date_time,
        to_date_time,
        status,
        service_id,
        service_price,
        staff_working_hours,
        is_deleted,
        created_by,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `;

    const params = [
      data.staff_id,
      data.account_id,
      data.branch_id,
      data.customer_id || null,
      new Date(data.from_date_time),
      new Date(data.to_date_time),
      data.status || "todo",
      data.service_id,
      data.service_price,
      data.staff_working_hours || null,
      data.created_by,
      now,
    ];

    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Add staff activity error:", error);
    throw new Error("failed to add staff activity");
  }
};

exports.getCurrentStaffActivity = async (id) => {
  try {
    const sql = `
        SELECT * FROM staff_activity
        WHERE id = ? AND is_deleted = 0
        `;
    const [row] = await db.execute(sql, [id]);
    return row[0] ? row[0] : null;
  } catch (error) {
    console.error("Get current staff activity error:", error);
    throw new Error("failed to get current staff activity");
  }
};

exports.updateStaffActivity = async (id, data) => {
  try {
    const now = new Date();
    const sql = `
    UPDATE staff_activity
    SET status = ?, from_date_time = ?, to_date_time = ?, staff_working_hours = ?, updated_by = ?, updated_at = ?
    WHERE id = ? AND is_deleted = 0
    `;
    const params = [
      data.status,
      new Date(data.from_date_time),
      new Date(data.to_date_time),
      data.staff_working_hours,
      data.updated_by,
      now,
      id,
    ];
    const [result] = await db.execute(sql, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Update staff activity error:", error);
    throw new Error("failed to update staff activity");
  }
};

exports.updateStaffActivityStatus = async (id, data) => {
  try {
    const now = new Date();
    let set =
      "SET status = ?, note_by_staff = ?, updated_by = ?, updated_at = ?";
    let params = [
      data.status,
      data.note_by_staff || null,
      data.updated_by,
      now,
    ];

    if (data.start_date_time) {
      set += ", start_date_time = ?";
      params.push(data.start_date_time);
    } else if (data.end_date_time) {
      set += ", end_date_time = ?, total_hour = ?";
      params.push(data.end_date_time, data.total_hour);
    }
    params.push(id);
    const sql = `
        UPDATE staff_activity
        ${set}
        WHERE id = ? AND is_deleted = 0
      `;

    const [result] = await db.execute(sql, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Update staff activity error:", error);
    throw new Error("failed to update staff activity");
  }
};

exports.createTaskHold = async (data) => {
  try {
    const sql = `
      INSERT INTO task_holds (
        task_id,
        account_id,
        branch_id,
        hold_start_at,
        hold_end_at,
        duration_minutes,
        is_carry_forward,
        notes,
        created_by,
        updated_by,
        is_deleted
      ) VALUES (?, ?, ?, ?, NULL, 0, ?, ?, ?, ?, 0)
    `;

    const params = [
      data.task_id,
      data.account_id,
      data.branch_id,
      data.hold_start_at,
      data.is_carry_forward ?? 0,
      data.notes || null,
      data.created_by || null,
      data.updated_by || null,
    ];

    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Create task hold error:", error);
    throw new Error("failed to create task hold");
  }
};

exports.closeLatestOpenTaskHold = async (data) => {
  try {
    const [openRows] = await db.execute(
      `
        SELECT id, hold_start_at, is_carry_forward
        FROM task_holds
        WHERE task_id = ? AND account_id = ? AND branch_id = ? AND hold_end_at IS NULL
          AND COALESCE(is_deleted, 0) = 0
        ORDER BY hold_start_at DESC
        LIMIT 1
      `,
      [data.task_id, data.account_id, data.branch_id]
    );
    const openHold = openRows?.[0] || null;
    if (!openHold) return null;

    const startAt = new Date(openHold.hold_start_at);
    const endAt = new Date(data.hold_end_at);
    const durationMinutes = Math.max(
      0,
      Math.floor((endAt.getTime() - startAt.getTime()) / (1000 * 60))
    );

    const sql = `
      UPDATE task_holds
      SET
        hold_end_at = ?,
        duration_minutes = ?,
        updated_by = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ? AND COALESCE(is_deleted, 0) = 0
    `;

    const params = [
      data.hold_end_at,
      durationMinutes,
      data.updated_by || null,
      openHold.id,
    ];

    const [result] = await db.execute(sql, params);
    if (!result.affectedRows) return null;

    return {
      id: openHold.id,
      duration_minutes: durationMinutes,
      is_carry_forward: Number(openHold.is_carry_forward) === 1 ? 1 : 0,
    };
  } catch (error) {
    console.error("Close task hold error:", error);
    throw new Error("failed to close task hold");
  }
};

exports.extendTaskToDateTimeByMinutes = async ({
  task_id,
  account_id,
  branch_id,
  minutes,
  updated_by,
}) => {
  try {
    const mins = Number(minutes) || 0;
    if (mins <= 0) return false;

    const sql = `
      UPDATE staff_activity
      SET to_date_time = DATE_ADD(to_date_time, INTERVAL ? MINUTE),
          updated_by = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
    `;

    const [result] = await db.execute(sql, [
      mins,
      updated_by || null,
      task_id,
      account_id,
      branch_id,
    ]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Extend task end time error:", error);
    throw new Error("failed to extend task end time");
  }
};

exports.getTaskHoldMinutesSum = async ({ task_id, account_id, branch_id }) => {
  try {
    const sql = `
      SELECT COALESCE(SUM(duration_minutes), 0) AS total_hold_minutes
      FROM task_holds
      WHERE task_id = ? AND account_id = ? AND branch_id = ?
        AND COALESCE(is_deleted, 0) = 0
    `;
    const [rows] = await db.execute(sql, [task_id, account_id, branch_id]);
    return Number(rows?.[0]?.total_hold_minutes ?? 0);
  } catch (error) {
    console.error('Get task hold minutes sum error:', error);
    throw new Error('failed to get task hold minutes sum');
  }
};

exports.getTaskHoldsByTaskId = async ({ task_id, account_id, branch_id }) => {
  try {
    const sql = `
      SELECT
        id,
        task_id,
        account_id,
        branch_id,
        hold_start_at,
        hold_end_at,
        duration_minutes,
        is_carry_forward,
        notes,
        created_by,
        updated_by,
        created_at,
        updated_at
      FROM task_holds
      WHERE task_id = ? AND account_id = ? AND branch_id = ?
        AND COALESCE(is_deleted, 0) = 0
      ORDER BY hold_start_at ASC
    `;
    const [rows] = await db.execute(sql, [task_id, account_id, branch_id]);
    return rows || [];
  } catch (error) {
    console.error("Get task holds by task id error:", error);
    throw new Error("failed to get task holds");
  }
};

exports.getTaskHoldActivityMeta = async (holdId) => {
  try {
    const [rows] = await db.execute(
      `
        SELECT th.id,
               th.task_id,
               COALESCE(th.is_deleted, 0) AS is_deleted,
               sa.staff_invoice_id
        FROM task_holds th
        INNER JOIN staff_activity sa
          ON sa.id = th.task_id
         AND sa.account_id = th.account_id
         AND sa.branch_id = th.branch_id
        WHERE th.id = ? AND sa.is_deleted = 0
        LIMIT 1
      `,
      [holdId],
    );
    return rows?.[0] || null;
  } catch (error) {
    console.error("Get task hold activity meta error:", error);
    throw new Error("failed to resolve task hold");
  }
};

const recalculateStaffActivityNetTotalHourConn = async (conn, task_id) => {
  const [rows] = await conn.execute(
    `SELECT start_date_time, end_date_time, account_id, branch_id
     FROM staff_activity WHERE id = ? AND is_deleted = 0 LIMIT 1`,
    [task_id],
  );
  const activity = rows?.[0] || null;
  if (!activity?.start_date_time || !activity?.end_date_time) return;

  const start = new Date(activity.start_date_time);
  const end = new Date(activity.end_date_time);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

  const grossHours = Math.max(
    0,
    (end.getTime() - start.getTime()) / (1000 * 60 * 60),
  );
  const [sumRows] = await conn.execute(
    `SELECT COALESCE(SUM(duration_minutes), 0) AS total_hold_minutes
     FROM task_holds
     WHERE task_id = ? AND account_id = ? AND branch_id = ?
       AND COALESCE(is_deleted, 0) = 0`,
    [task_id, activity.account_id, activity.branch_id],
  );
  const totalHoldMinutes = Number(sumRows?.[0]?.total_hold_minutes ?? 0);
  const netHours = Math.max(0, grossHours - totalHoldMinutes / 60);
  await conn.execute(
    `UPDATE staff_activity SET total_hour = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_deleted = 0`,
    [parseFloat(netHours.toFixed(2)), task_id],
  );
};

/**
 * Soft-delete a single hold and refresh staff_activity.total_hour from gross − active holds.
 */
exports.softDeleteTaskHold = async ({ id, updated_by }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [holdRows] = await conn.execute(
      `SELECT id, task_id FROM task_holds WHERE id = ? LIMIT 1`,
      [id],
    );
    const hold = holdRows?.[0] || null;
    if (!hold) {
      await conn.rollback();
      return false;
    }

    const [upd] = await conn.execute(
      `UPDATE task_holds
       SET is_deleted = 1, updated_by = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND COALESCE(is_deleted, 0) = 0`,
      [updated_by || null, id],
    );
    if (!upd.affectedRows) {
      await conn.rollback();
      return false;
    }

    await recalculateStaffActivityNetTotalHourConn(conn, hold.task_id);

    await conn.commit();
    return true;
  } catch (error) {
    try {
      await conn.rollback();
    } catch { }
    console.error("Soft delete task hold error:", error);
    throw new Error("failed to soft delete task hold");
  } finally {
    conn.release();
  }
};

exports.getStaffActivityById = async (id) => {
  try {
    const sql = `
               SELECT sa.*,
               u.name as staff_name,
               cu.name as customer_name,
               cu.mobile as customer_mobile,
               cud.permanent_address as customer_address, 
               s.name as service_name,
               (
                 SELECT COALESCE(SUM(th.duration_minutes), 0)
                 FROM task_holds th
                 WHERE th.task_id = sa.id
                   AND th.account_id = sa.account_id
                   AND th.branch_id = sa.branch_id
                   AND COALESCE(th.is_deleted, 0) = 0
               ) AS total_hold_minutes
               FROM staff_activity sa 
               LEFT JOIN users u ON sa.user_id = u.id 
               LEFT JOIN users cu ON sa.customer_id = cu.id 
               LEFT JOIN services s ON sa.service_id = s.id 
               LEFT JOIN user_details cud ON cu.id = cud.user_id
               WHERE sa.id = ? AND sa.is_deleted = 0
               `;

    const [rows] = await db.execute(sql, [id]);
    if (rows.length) {
      rows[0].customer_address = rows[0].customer_address
        ? JSON.parse(rows[0].customer_address)
        : null;
    }

    const activity = rows[0] || null;
    if (!activity) return null;

    activity.task_holds = await exports.getTaskHoldsByTaskId({
      task_id: Number(activity.id),
      account_id: Number(activity.account_id),
      branch_id: Number(activity.branch_id),
    });

    return activity;
  } catch (error) {
    console.error("Get staff activity by id error:", error);
    throw new Error("Failed to get staff activity");
  }
};

exports.deleteStaffActivity = async (id, updated_by) => {
  try {
    const sql = `
        UPDATE staff_activity
        SET is_deleted = 1, updated_at = ?, updated_by = ?
        WHERE id = ? AND is_deleted = 0
      `;
    const [result] = await db.execute(sql, [new Date(), updated_by, id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Delete staff activity error:", error);
    throw new Error("failed to delete staff activity");
  }
};

exports.getAllStaffActivitiesofAccount = async (data) => {
  try {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;
    const now = new Date().toISOString().slice(0, 10);
    let where =
      " WHERE sa.account_id = ? AND sa.branch_id = ? AND sa.is_deleted = 0";
    if (data.q) {
      where += ` AND (s.name LIKE '%${data.q}%' OR u.name LIKE '%${data.q}%' OR sn.name LIKE '%${data.q}%' OR sa.status LIKE '%${data.q}%' OR sa.service_price = '${data.q}' )`;
    }

    const params = [data.account_id, data.branch_id];
    // 🕓 Filter by time (past / today / future)
    if (data.dayFilter) {
      if (data.dayFilter === "past") {
        console.log("Past filter applied");
        where += " AND DATE(sa.to_date_time) < ?";
        params.push(now);
      } else if (data.dayFilter === "today") {
        console.log("Today filter applied");
        where +=
          " AND DATE(sa.from_date_time) <= ? AND DATE(sa.to_date_time) >= ?";
        params.push(now, now);
      } else if (data.dayFilter === "future") {
        console.log("Future filter applied");
        where += " AND DATE(sa.from_date_time) > ?";
        params.push(now);
      }
    }

    // 📅 Custom date range filter (ONLY for "all" data i.e. when dayFilter is not used)
    // Expected query params from frontend: start_date=YYYY-MM-DD, end_date=YYYY-MM-DD
    if (!data.dayFilter) {
      if (data.start_date) {
        where += " AND DATE(sa.from_date_time) >= ?";
        params.push(data.start_date);
      }
      if (data.end_date) {
        where += " AND DATE(sa.from_date_time) <= ?";
        params.push(data.end_date);
      }
    }

    let orderBy = "";
    if (data.sort && data.order) {
      orderBy = `ORDER BY ${data.sort} ${data.order}`;
    }
    if (data.staff_id) {
      where += ` AND sa.user_id = ${data.staff_id}`;
    }
    if (data.status) {
      where += ` AND sa.status = '${data.status}'`;
    }
    if (data.payment_status) {
      console.log(
        "Payment status filter applied",
        data.payment_status,
        typeof data.payment_status
      );
      where += ` AND sa.payment_status = '${data.payment_status}'`;
    }
    if (data.customer_id) {
      where += ` AND sa.customer_id = ${data.customer_id}`;
    }
    if (data.service_id) {
      where += ` AND sa.service_id = ${data.service_id}`;
    }

    const sql = `
        SELECT
          sa.*,
          s.name AS service_name,
          u.name AS customer_name,
          sn.name AS staff_name
        FROM staff_activity sa
        LEFT JOIN services s ON sa.service_id = s.id
        LEFT JOIN users u ON sa.customer_id = u.id
        LEFT JOIN users sn ON sa.user_id = sn.id
       ${where}
       ${orderBy}
        LIMIT ${limit} OFFSET ${offset}
      `;
    const [rows] = await db.execute(sql, params);

    const countSql = `
       SELECT COUNT(*) AS total
        FROM staff_activity sa
        LEFT JOIN services s ON sa.service_id = s.id
        LEFT JOIN users u ON sa.customer_id = u.id
        LEFT JOIN users sn ON sa.user_id = sn.id
       ${where}
        ORDER BY sa.created_at DESC
        `;
    const [countRows] = await db.execute(countSql, params);

    const total = countRows[0].total;

    return {
      currentPage: page,
      pageSize: limit,
      totalRecords: total,
      data: rows,
    };
  } catch (error) {
    console.error("Get staff activities error:", error);
    throw new Error("failed to get staff activities");
  }
};

exports.addStaffQuickPay = async (data) => {
  try {
    const now = new Date();
    const sql = `
        INSERT INTO staff_quick_pay(
        user_id,
        account_id,
        branch_id,
        date,
        description,
        amount,
        status,
        is_deleted,
        created_by,
        created_at
        ) VALUES (?,?,?,?,?,?,?,0,?,?)
        `;
    const params = [
      data.staff_id,
      data.account_id,
      data.branch_id,
      data.date,
      data.description || null,
      data.amount,
      data.status,
      data.created_by,
      now,
    ];
    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error("Add staff quick pay error:", error);
    throw new Error("failed to add staff quick pay");
  }
};

exports.updateQuickPayStatus = async (id, updated_by, status) => {
  try {
    const sql = `
        UPDATE staff_quick_pay
        SET status = ?, updated_by = ?, updated_at = ?
        WHERE id = ? AND is_deleted = 0
        `;
    const params = [status, updated_by, new Date(), id];
    const [result] = await db.execute(sql, params);
    console.log("Update quick pay result:", result);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Add staff quick pay error:", error);
    throw new Error("failed to add staff quick pay");
  }
};

exports.getStaffQuickPays = async ({ user_id, account_id, branch_id }) => {
  try {
    const [rows] = await db.execute(
      `
            SELECT id, user_id, account_id, branch_id, date, description, amount, status, created_at, updated_at
            FROM staff_quick_pay
            WHERE user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
            ORDER BY date DESC, created_at DESC
        `,
      [user_id, account_id, branch_id]
    );
    return rows;
  } catch (error) {
    console.error("Get Staff Quick Pays Service Error:", error);
    throw new Error("Failed to fetch staff quick pays");
  }
};

exports.deleteQuickPay = async (id, updated_by) => {
  try {
    const sql = `
        UPDATE staff_quick_pay
        SET is_deleted = 1, updated_at = ?, updated_by = ?
        WHERE id = ? AND is_deleted = 0
        `;
    const [result] = await db.execute(sql, [new Date(), updated_by, id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Delete staff quick pay error:", error);
    throw new Error("failed to delete staff quick pay");
  }
};

exports.checkStaffAlreadyInProgress = async (data) => {
  try {
    let sql = `
      SELECT id FROM staff_activity
      WHERE user_id = ? 
      AND account_id = ? 
      AND branch_id = ? 
      AND status = 'inProgress'
      AND is_deleted = 0
      AND id != ?
      LIMIT 1
    `;

    const params = [
      data.staff_id,
      data.account_id,
      data.branch_id,
      data.exclude_activity_id,
    ];

    const [rows] = await db.execute(sql, params);
    return rows[0] || null;
  } catch (error) {
    console.error("Get staff ongoing activity error:", error);
    throw new Error("failed to get staff ongoing activity");
  }
};

exports.createStaffInvoice = async (data) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const {
      user_id,
      account_id,
      branch_id,
      from_date,
      to_date,
      created_by,
      invoice_status,
      total_hours,
      total_price,
      activity_ids = null,
      quickpay_ids = null,
      hour_price,
      quickpay_total_amount,
    } = data;
    const now = new Date();

    // Insert header using provided totals
    const [insertResult] = await conn.execute(
      `
          INSERT INTO staff_invoice (
            user_id, account_id, branch_id,
            from_date, to_date,
            total_hours, hour_price, deduct_price, total_price,
            invoice_status,
            created_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        account_id,
        branch_id,
        from_date,
        to_date,
        total_hours,
        hour_price ?? 0,
        quickpay_total_amount,
        total_price,
        invoice_status,
        created_by,
        now,
      ]
    );

    const staff_invoice_id = insertResult.insertId;

    // Draft: store provided snapshot into meta (no DB recomputation)
    const [existing] = await conn.execute(
      `SELECT id FROM staff_invoice_draft_meta WHERE staff_invoice_id = ? LIMIT 1`,
      [staff_invoice_id]
    );
    if (existing.length) {
      await conn.execute(
        `UPDATE staff_invoice_draft_meta
          SET activity_ids = ?, quickpay_ids = ?,
              hour_rate = ?, total_amount = ?, quickpay_total_amount = ?,
                updated_at = CURRENT_TIMESTAMP
          WHERE staff_invoice_id = ?
        `,
        [
          activity_ids.length ? JSON.stringify(activity_ids) : null,
          quickpay_ids.length ? JSON.stringify(quickpay_ids) : null,
          hour_price ?? 0,
          total_price ?? 0,
          quickpay_total_amount ?? 0,
          staff_invoice_id,
        ]
      );
    } else {
      await conn.execute(
        `
                  INSERT INTO staff_invoice_draft_meta
                  (account_id, branch_id, staff_invoice_id,
                   activity_ids, quickpay_ids,
                   hour_rate, total_amount, quickpay_total_amount)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `,
        [
          account_id,
          branch_id,
          staff_invoice_id,
          activity_ids.length ? JSON.stringify(activity_ids) : null,
          quickpay_ids.length ? JSON.stringify(quickpay_ids) : null,
          hour_price ?? 0,
          total_price ?? 0,
          quickpay_total_amount ?? 0,
        ]
      );
    }

    if (invoice_status === "finalised") {
      const payment_status = '1';
      if (Array.isArray(activity_ids) && activity_ids.length) {
        const activityPlaceholders = activity_ids.map(() => "?").join(",");
        await conn.execute(
          `UPDATE staff_activity SET staff_invoice_id = ?, payment_status = ?
               WHERE id IN (${activityPlaceholders})
                 AND user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
          [
            staff_invoice_id,
            payment_status,
            ...activity_ids,
            user_id,
            account_id,
            branch_id,
          ]
        );

        // const [activityRows] = await conn.execute(
        //   `
        //       SELECT id AS staff_activity_id, service_id, service_price AS price, total_hour AS quantity
        //       FROM staff_activity
        //       WHERE id IN (${activityPlaceholders})
        //   `,
        //   [...activity_ids]
        // );

        // currently not using this. see staff_invoice_draft_meta table for invoice items
        // if (activityRows.length) {
        // const invoiceItemValues = activityRows.map((row) => [
        //   account_id,
        //   branch_id,
        //   staff_invoice_id,
        //   row.service_id,
        //   hour_price,
        //   row.quantity,
        //   row.staff_activity_id,
        //   0,
        //   created_by,
        //   now,
        // ]);

        // const itemPlaceholders = invoiceItemValues
        //   .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        //   .join(", ");
        // const flatParams = invoiceItemValues.flat();

        // await conn.execute(
        //   `
        //         INSERT INTO staff_invoice_items (
        //             account_id, branch_id, staff_invoice_id,
        //             service_id, hour_price, quantity,
        //             staff_activity_id, is_deleted,
        //             created_by, created_at
        //         ) VALUES ${itemPlaceholders}
        //     `,
        //   flatParams
        // );
        // }
      }

      if (Array.isArray(quickpay_ids) && quickpay_ids.length) {
        const quickpayPlaceholders = quickpay_ids.map(() => "?").join(",");
        await conn.execute(
          `UPDATE staff_quick_pay SET status = 1
               WHERE id IN (${quickpayPlaceholders})
                 AND user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
          [...quickpay_ids, user_id, account_id, branch_id]
        );
      }
    }

    await conn.commit();
    return staff_invoice_id;
  } catch (error) {
    await conn.rollback();
    console.log("Create staff invioice error: ", error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.checkStaffHasDraftInvoice = async ({
  user_id,
  account_id,
  branch_id,
  exclude_id,
}) => {
  const params = [user_id, account_id, branch_id];
  let sql = `SELECT id 
    FROM staff_invoice
    WHERE user_id = ? AND account_id = ? AND branch_id = ?
    AND is_deleted = 0 AND invoice_status = 'draft'
    `;
  if (exclude_id) {
    sql += ` AND id != ?`;
    params.push(exclude_id);
  }
  sql += ` LIMIT 1`;
  const [rows] = await db.execute(sql, params);
  return rows.length > 0 ? rows[0] : null;
};

exports.updateStaffInvoice = async (staff_invoice_id, data) => {
  const conn = await db.getConnection();
  try {
    const now = new Date();

    await conn.beginTransaction();

    const {
      user_id,
      account_id,
      branch_id,
      from_date,
      to_date,
      updated_by,
      total_hours,
      total_price,
      activity_ids = null,
      quickpay_ids = null,
      invoice_status,
      created_by,
      hour_price,
      quickpay_total_amount,
    } = data;

    const updateMetaSql = `
                   UPDATE staff_invoice_draft_meta
                   SET activity_ids = ?, quickpay_ids = ?,
                       hour_rate = ?, total_amount = ?, quickpay_total_amount = ?,
                        updated_by = ?, updated_at = CURRENT_TIMESTAMP
                   WHERE staff_invoice_id = ?
               `;

    const updateMetaParams = [
      activity_ids.length ? JSON.stringify(activity_ids) : null,
      quickpay_ids.length ? JSON.stringify(quickpay_ids) : null,
      hour_price ?? 0,
      total_price ?? 0,
      quickpay_total_amount ?? 0,
      updated_by,
      staff_invoice_id,
    ];

    await conn.execute(updateMetaSql, updateMetaParams);

    let updateStaffInvoiceSql = `
        UPDATE staff_invoice
        SET user_id = ?, from_date = ?, to_date = ?,
         total_hours = ?, hour_price = ?, deduct_price = ?,
         invoice_status = ?,
          total_price = ?, updated_by = ?, updated_at = ?
            WHERE id = ?
          `;

    await conn.execute(updateStaffInvoiceSql, [
      user_id,
      from_date,
      to_date,
      total_hours,
      hour_price,
      quickpay_total_amount,
      invoice_status,
      total_price,
      updated_by,
      new Date(),
      staff_invoice_id,
    ]);

    if (invoice_status === "finalised") {
      const payment_status = '1';
      if (Array.isArray(activity_ids) && activity_ids.length) {
        const activityPlaceholders = activity_ids.map(() => "?").join(",");
        await conn.execute(
          `UPDATE staff_activity SET staff_invoice_id = ?, payment_status = ?
               WHERE id IN (${activityPlaceholders})
                 AND user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
          [
            staff_invoice_id,
            payment_status,
            ...activity_ids,
            user_id,
            account_id,
            branch_id,
          ]
        );

        // const [activityRows] = await conn.execute(
        //   `
        //       SELECT id AS staff_activity_id, service_id, service_price AS price, total_hour AS quantity
        //       FROM staff_activity
        //       WHERE id IN (${activityPlaceholders})
        //   `,
        //   [...activity_ids]
        // );

        // currently not using this. see staff_invoice_draft_meta table for invoice items
        // if (activityRows.length) {
        //   const invoiceItemValues = activityRows.map((row) => [
        //     account_id,
        //     branch_id,
        //     staff_invoice_id,
        //     row.service_id,
        //     hour_price,
        //     row.quantity,
        //     row.staff_activity_id,
        //     0,
        //     created_by,
        //     now,
        //   ]);

        //   const itemPlaceholders = invoiceItemValues
        //     .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        //     .join(", ");
        //   const flatParams = invoiceItemValues.flat();

        //   await conn.execute(
        //     `
        //           INSERT INTO staff_invoice_items (
        //               account_id, branch_id, staff_invoice_id,
        //               service_id, hour_price, quantity,
        //               staff_activity_id, is_deleted,
        //               created_by, created_at
        //           ) VALUES ${itemPlaceholders}
        //       `,
        //     flatParams
        //   );
        // }
      }

      if (Array.isArray(quickpay_ids) && quickpay_ids.length) {
        const quickpayPlaceholders = quickpay_ids.map(() => "?").join(",");
        await conn.execute(
          `UPDATE staff_quick_pay SET status = 1
               WHERE id IN (${quickpayPlaceholders})
                 AND user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
          [...quickpay_ids, user_id, account_id, branch_id]
        );
      }
    }
    await conn.commit();

    return true;
  } catch (error) {
    conn.rollback();
    console.log("Update staff invocie error: ", error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.deleteStaffInvoice = async (id, updated_by) => {
  const now = new Date();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [invoiceRows] = await conn.execute(
      `SELECT id, user_id, account_id, branch_id, invoice_status
       FROM staff_invoice
       WHERE id = ? AND is_deleted = 0`,
      [id]
    );
    if (!invoiceRows.length) {
      await conn.rollback();
      conn.release();
      return false;
    }
    const invoice = invoiceRows[0];
    const { user_id, account_id, branch_id, invoice_status } = invoice;

    const [metaRows] = await conn.execute(
      `SELECT activity_ids, quickpay_ids
       FROM staff_invoice_draft_meta
       WHERE staff_invoice_id = ? AND is_deleted = 0
       LIMIT 1`,
      [id]
    );

    if (invoice_status === "finalised" && metaRows.length) {
      const meta = metaRows[0];
      let activity_ids = [];
      let quickpay_ids = [];

      activity_ids = meta.activity_ids ? JSON.parse(meta.activity_ids) : [];
      quickpay_ids = meta.quickpay_ids ? JSON.parse(meta.quickpay_ids) : [];

      if (Array.isArray(activity_ids) && activity_ids.length) {
        const activityPlaceholders = activity_ids.map(() => "?").join(",");
        await conn.execute(
          `UPDATE staff_activity
           SET staff_invoice_id = NULL, payment_status = '0'
           WHERE id IN (${activityPlaceholders})
             AND staff_invoice_id = ? AND user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
          [...activity_ids, id, user_id, account_id, branch_id]
        );
      }

      if (Array.isArray(quickpay_ids) && quickpay_ids.length) {
        const quickpayPlaceholders = quickpay_ids.map(() => "?").join(",");
        await conn.execute(
          `UPDATE staff_quick_pay SET status = 0
           WHERE id IN (${quickpayPlaceholders})
             AND user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0`,
          [...quickpay_ids, user_id, account_id, branch_id]
        );
      }
    }

    const [deleteMetaResult] = await conn.execute(
      `UPDATE staff_invoice_draft_meta
       SET is_deleted = 1, updated_by = ?, updated_at = ?
       WHERE staff_invoice_id = ?`,
      [updated_by, now, id]
    );

    const [deleteResult] = await conn.execute(
      `UPDATE staff_invoice
       SET is_deleted = 1, updated_by = ?, updated_at = ?
       WHERE id = ?`,
      [updated_by, now, id]
    );

    await conn.commit();
    return deleteResult.affectedRows > 0;
  } catch (error) {
    await conn.rollback();
    console.log("delete staff invoice error", error);
    throw error;
  } finally {
    conn.release();
  }
};
exports.getDraftMeta = async (staff_invoice_id) => {
  const [rows] = await db.execute(
    `SELECT * 
        FROM staff_invoice_draft_meta
         WHERE staff_invoice_id = ?
         LIMIT 1`,
    [staff_invoice_id]
  );

  if (!rows.length) return null;

  const row = rows[0];

  try {
    row.activity_ids = row.activity_ids ? JSON.parse(row.activity_ids) : [];
  } catch {
    row.activity_ids = null;
  }

  try {
    row.quickpay_ids = row.quickpay_ids ? JSON.parse(row.quickpay_ids) : [];
  } catch {
    row.quickpay_ids = null;
  }
  return row;
};

exports.getStaffInvoiceCreateData = async (data) => {
  try {
    const { user_id, account_id, branch_id, from_date, to_date } = data;

    // 1. Get total_hours
    const [activities] = await db.execute(
      `
          SELECT
           sa.*,
           s.name AS service_name,
           u.name AS customer_name,
           sn.name AS staff_name
         FROM staff_activity sa
         LEFT JOIN services s ON sa.service_id = s.id
         LEFT JOIN users u ON sa.customer_id = u.id
         LEFT JOIN users sn ON sa.user_id = sn.id
         WHERE sa.user_id = ? AND sa.account_id = ? AND sa.branch_id = ?
       AND sa.status = 'done' AND sa.is_deleted = 0
       AND sa.from_date_time >= ? AND sa.from_date_time <= ?
        AND sa.staff_invoice_id IS NULL
   `,
      [user_id, account_id, branch_id, from_date, to_date]
    );

    // 2. Get hour_price
    const [staffHourRate] = await db.execute(
      `
     SELECT hour_price
     FROM user_details
     WHERE user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
     LIMIT 1
   `,
      [user_id, account_id, branch_id]
    );

    const hour_price = parseFloat(staffHourRate[0]?.hour_price || 0);

    // 3. Get deduct_price
    const [staffQuickPays] = await db.execute(
      `
     SELECT *
     FROM staff_quick_pay
     WHERE user_id = ? AND account_id = ? AND branch_id = ? 
       AND status = 0 AND is_deleted = 0 AND date BETWEEN ? AND ?
   `,
      [user_id, account_id, branch_id, from_date, to_date]
    );

    return {
      activities: activities.length ? activities : null,
      staffHourRate: hour_price,
      staffQuickPays: staffQuickPays.length ? staffQuickPays : null,
      hasDraft: false,
    };
  } catch (error) {
    console.error("Get Staff invoice error Error:", error);
    throw new Error("Failed to get staff invoice data");
  }
};

exports.getStaffInvoices = async ({ user_id, account_id, branch_id }) => {
  try {
    const [invoices] = await db.execute(
      `
            SELECT * FROM staff_invoice
            WHERE user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
            ORDER BY created_at DESC
        `,
      [user_id, account_id, branch_id]
    );

    if (!invoices.length) return [];

    return invoices;
  } catch (error) {
    console.error("Get Staff Invoices Service Error:", error);
    throw new Error("Failed to fetch staff invoices");
  }
};

exports.getStaffInvoiceById = async (staff_invoice_id) => {
  try {
    const [invoice] = await db.execute(
      `
            SELECT si.*,
            st.name AS staff_name
             FROM staff_invoice si
            LEFT JOIN users st ON si.user_id = st.id
               WHERE si.id = ? AND si.is_deleted = 0 LIMIT 1`,
      [staff_invoice_id]
    );
    if (!invoice.length) return null;

    const inv = invoice[0];

    // Load draft meta
    const meta = (await exports.getDraftMeta(staff_invoice_id)) || {};

    // Fetch activities using snapshot if present; otherwise by date-range
    let activities;
    if (Array.isArray(meta.activity_ids) && meta.activity_ids.length) {
      const placeholders = meta.activity_ids.map(() => "?").join(",");
      const [rows] = await db.execute(
        `
                SELECT sa.*, s.name AS service_name, u.name AS customer_name, sn.name AS staff_name
                FROM staff_activity sa
                LEFT JOIN services s ON sa.service_id = s.id
                LEFT JOIN users u ON sa.customer_id = u.id
                LEFT JOIN users sn ON sa.user_id = sn.id
                WHERE sa.id IN (${placeholders}) AND sa.is_deleted = 0
            `,
        meta.activity_ids
      );
      activities = rows;
    }

    // Fetch quick pays using snapshot if present; otherwise by date-range
    let quickPays;
    if (Array.isArray(meta.quickpay_ids) && meta.quickpay_ids.length) {
      const placeholders = meta.quickpay_ids.map(() => "?").join(",");
      const [rows] = await db.execute(
        `
                SELECT * FROM staff_quick_pay
                WHERE id IN (${placeholders}) AND is_deleted = 0
            `,
        meta.quickpay_ids
      );
      quickPays = rows;
    }

    // Hourly rate: prefer snapshot
    const hour_price =
      meta?.hour_rate != null
        ? parseFloat(meta.hour_rate)
        : await (async () => {
          const [staffHourRate] = await db.execute(
            `
                SELECT hour_price FROM user_details 
                WHERE user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0 LIMIT 1
            `,
            [inv.user_id, inv.account_id, inv.branch_id]
          );
          return parseFloat(staffHourRate[0]?.hour_price || 0);
        })();

    // Calculate totals
    const total_hours = activities?.reduce(
      (acc, a) => acc + (parseFloat(a.total_hour || 0) || 0),
      0
    );
    const deduct_price = quickPays?.reduce(
      (acc, q) => acc + (parseFloat(q.amount || 0) || 0),
      0
    );
    const computed_base = parseFloat(
      (total_hours * hour_price - deduct_price).toFixed(2)
    );
    const total_price =
      meta?.total_amount != null
        ? parseFloat(meta.total_amount)
        : computed_base;

    return {
      activities: activities,
      staffQuickPays: quickPays,
      hour_rate: hour_price,
      total_hours,
      total_price,
      invoice: inv,
    };
  } catch (error) {
    console.log("Get staff invoice error error:", error);
    throw error;
  }
};

exports.getAllStaffInvoices = async (data) => {
  try {
    const page = Number(data.page) || 1;
    const limit = Number(data.limit) || 10;
    const offset = (page - 1) * limit;
    let where = `WHERE si.account_id = ? AND si.branch_id = ? AND si.is_deleted = 0`;
    const params = [data.account_id, data.branch_id];

    if (data.q) {
      where += ` AND (u.name LIKE ? OR CAST(si.id AS CHAR) LIKE ?)`;
      const like = `%${data.q}%`;
      params.push(like, like);
    }

    if (data.staff_id) {
      where += ` AND si.user_id = ?`;
      params.push(data.staff_id);
    }

    if (data.invoice_status) {
      where += ` AND si.invoice_status = ?`;
      params.push(data.invoice_status);
    }

    if (data.from_date) {
      console.log("from_date", data.from_date);
      where += ` AND DATE(si.from_date) >= ?`;
      params.push(data.from_date);
    }

    if (data.to_date) {
      console.log("to_date", data.to_date);
      where += ` AND DATE(si.to_date) <= ?`;
      params.push(data.to_date);
    }

    const [rows] = await db.execute(
      `
         SELECT si.*, u.name AS staff_name
         FROM staff_invoice si
         LEFT JOIN users u ON u.id = si.user_id
         ${where}
         ORDER BY si.id DESC
         LIMIT ${limit} OFFSET ${offset}
     `,
      params
    );
    const [countRows] = await db.execute(
      `
         SELECT COUNT(*) AS total
         FROM staff_invoice si
         LEFT JOIN users u ON u.id = si.user_id
         ${where}
     `,
      params
    );
    return {
      data: rows,
      total: countRows[0]?.total || 0,
      page,
      limit,
    };
  } catch (error) {
    console.log("Get all staff invoice error", error);
    throw error;
  }
};

exports.getStaffDashboardSummary = async ({
  staff_id,
  account_id,
  branch_id,
  from_date,
  to_date,
}) => {
  try {
    const { startDate, endDate } = normaliseDateRange(from_date, to_date);
    const todayStart = dayjs().startOf("day");
    const todayEnd = dayjs().endOf("day");

    const todayPromise = db.execute(
      `
        SELECT COUNT(*) AS total
        FROM staff_activity
        WHERE user_id = ?
          AND account_id = ?
          AND branch_id = ?
          AND is_deleted = 0
          AND from_date_time BETWEEN ? AND ?
      `,
      [staff_id, account_id, branch_id, todayStart.toDate(), todayEnd.toDate()]
    );

    const rangeStartDay = startDate.startOf("day");
    const rangeEndDay = endDate.startOf("day");

    const paymentPromise = db.execute(
      `
        SELECT
          sa.payment_status,
          sa.from_date_time,
          sa.to_date_time,
          sa.end_date_time,
          sa.staff_working_hours,
          sa.total_hour,
          COALESCE(si.hour_price, ud.hour_price, 0) AS hour_price
        FROM staff_activity sa
        LEFT JOIN staff_invoice si
          ON sa.staff_invoice_id = si.id
          AND si.is_deleted = 0
        LEFT JOIN user_details ud
          ON ud.user_id = sa.user_id
          AND ud.account_id = sa.account_id
          AND ud.branch_id = sa.branch_id
          AND ud.is_deleted = 0
        WHERE sa.user_id = ?
          AND sa.account_id = ?
          AND sa.branch_id = ?
          AND sa.is_deleted = 0
          AND sa.status = 'done'
          AND DATE(sa.from_date_time) >= ?
          AND DATE(sa.from_date_time) <= ?
      `,
      [
        staff_id,
        account_id,
        branch_id,
        rangeStartDay.format("YYYY-MM-DD"),
        rangeEndDay.format("YYYY-MM-DD"),
      ]
    );

    const monthlyPromise = db.execute(
      `
        SELECT DATE_FORMAT(from_date_time, '%Y-%m') AS month,
               COUNT(*) AS total
        FROM staff_activity
        WHERE user_id = ?
          AND account_id = ?
          AND branch_id = ?
          AND is_deleted = 0
          AND status = 'done'
          AND DATE(from_date_time) >= ?
          AND DATE(from_date_time) <= ?
        GROUP BY DATE_FORMAT(from_date_time, '%Y-%m')
        ORDER BY month ASC
      `,
      [
        staff_id,
        account_id,
        branch_id,
        rangeStartDay.format("YYYY-MM-DD"),
        rangeEndDay.format("YYYY-MM-DD"),
      ]
    );

    const [todayResult, paymentResult, monthlyResult] = await Promise.all([
      todayPromise,
      paymentPromise,
      monthlyPromise,
    ]);

    const todayRows = todayResult?.[0] || [];
    const paymentRows = paymentResult?.[0] || [];
    const monthlyRows = monthlyResult?.[0] || [];

    const todaysTaskCount = todayRows?.[0]?.total || 0;

    let moneyReceived = 0;
    let moneyRemaining = 0;

    paymentRows.forEach((row) => {
      const amount = calcActivityAmountInRange(row, rangeStartDay, rangeEndDay);
      if (row.payment_status === "1" || row.payment_status === 1) {
        moneyReceived += amount;
      } else if (row.payment_status === "0" || row.payment_status === 0) {
        moneyRemaining += amount;
      }
    });

    const monthlySummary = {};

    let cursor = startDate.startOf("month");
    const limit = endDate.startOf("month");
    while (cursor.isBefore(limit) || cursor.isSame(limit, "month")) {
      monthlySummary[cursor.format("YYYY-MM")] = 0;
      cursor = cursor.add(1, "month");
    }

    monthlyRows.forEach((row) => {
      monthlySummary[row.month] = Number(row.total || 0);
    });

    return {
      filters: {
        from_date: startDate.format(DATE_INPUT_FORMAT),
        to_date: endDate.format(DATE_INPUT_FORMAT),
      },
      todaysTaskCount: Number(todaysTaskCount || 0),
      paymentSummary: {
        received: moneyReceived,
        remaining: moneyRemaining,
      },
      monthlyCompletedTasks: monthlySummary,
    };
  } catch (error) {
    console.error("Get Staff Dashboard Summary Error:", error);
    throw new Error("Failed to fetch staff dashboard summary");
  }
};

exports.checkStaffInvoiceExists = async ({
  user_id,
  account_id,
  branch_id,
  from_date,
  to_date,
}) => {
  try {
    const [rows] = await db.execute(
      `
            SELECT id FROM staff_invoice
            WHERE user_id = ? AND account_id = ? AND branch_id = ?
              AND is_deleted = 0
              AND (
                (from_date BETWEEN ? AND ?) OR
                (to_date BETWEEN ? AND ?) OR
                (? BETWEEN from_date AND to_date) OR
                (? BETWEEN from_date AND to_date)
              )
            LIMIT 1
        `,
      [
        user_id,
        account_id,
        branch_id,
        from_date,
        to_date,
        from_date,
        to_date,
        from_date,
        to_date,
      ]
    );

    return rows.length > 0;
  } catch (error) {
    console.error("Check Staff Invoice Exists Error:", error);
    throw new Error("Failed to check staff invoice existence");
  }
};

exports.getLastInvoiceDateOfStaff = async ({
  user_id,
  account_id,
  branch_id,
}) => {
  try {
    const [rows] = await db.execute(
      `
            SELECT from_date, to_date
            FROM staff_invoice
            WHERE user_id = ? AND account_id = ? AND branch_id = ? AND is_deleted = 0
            ORDER BY to_date DESC
            LIMIT 1
        `,
      [user_id, account_id, branch_id]
    );

    return rows[0] ?? null;
  } catch (error) {
    console.error("Get Last Invoice Date Error:", error);
    throw new Error("Failed to fetch last invoice date");
  }
};

exports.getBlockedStaffListByAccountBranch = async ({ account_id, branch_id }) => {
  try {
    const [rows] = await db.execute(
      `
        SELECT ud.status,
        ud.block_reason,
        ud.updated_at,
        u.name,
        u.id
        FROM user_details ud
        JOIN users u ON u.id = ud.user_id
        JOIN user_account_mappings uam ON u.id = uam.user_id
        WHERE u.isDeleted = 0 AND ud.status = 'block' AND uam.account_id = ? AND uam.branch_id = ?
        ORDER BY u.name ASC;
      `,
      [account_id, branch_id]
    );
    return rows;
  } catch (error) {
    console.error("Get Blocked Staff List Error:", error);
    throw new Error("Failed to fetch blocked staff list");
  }
};

exports.getAllInProgressStaffActivities = async (data) => {
  try {
    const fetchAll = data.fetchAll === 1 || data.fetchAll === '1';
    const account_id = data.account_id;
    const branch_id = data.branch_id;

    let where = " WHERE sa.account_id = ? AND sa.branch_id = ? AND sa.is_deleted = 0 AND sa.status = 'inProgress'";

    let sql = `
      SELECT
        sa.*,
        s.name AS service_name,
        u.name AS customer_name,
        sn.name AS staff_name
      FROM staff_activity sa
      LEFT JOIN services s ON sa.service_id = s.id
      LEFT JOIN users u ON sa.customer_id = u.id
      LEFT JOIN users sn ON sa.user_id = sn.id
      ${where}
      ORDER BY sa.created_at DESC
    `;

    if (!fetchAll) {
      const page = data.page || 1;
      const limit = data.limit || 10;
      const offset = (page - 1) * limit;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    const [rows] = await db.execute(sql, [account_id, branch_id]);

    if (fetchAll) {
      return rows;
    } else {
      const countSql = `
        SELECT COUNT(*) AS total
        FROM staff_activity sa
        LEFT JOIN services s ON sa.service_id = s.id
        LEFT JOIN users u ON sa.customer_id = u.id
        LEFT JOIN users sn ON sa.user_id = sn.id
        ${where}
      `;
      const [countRows] = await db.execute(countSql, [account_id, branch_id]);
      const total = countRows[0].total;
      const page = data.page || 1;
      const limit = data.limit || 10;

      return {
        currentPage: page,
        pageSize: limit,
        totalRecords: total,
        data: rows,
      };
    }
  } catch (error) {
    console.error("Get all in progress staff activities error:", error);
    throw new Error("Failed to get all in progress staff activities");
  }
};

exports.changeStaffPasswordByAdmin = async (data) => {
  try {
    const { user_id, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = await db.execute(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, user_id]
    );
    return rows.affectedRows > 0;
  } catch (error) {
    console.error("Change Staff Password By Admin Error:", error);
    throw new Error("Failed to change staff password");
  }
};

exports.adjustStaffActivityTime = async (data) => {
  try {
    const now = new Date();
    const {
      id,
      start_date_time,
      end_date_time,
      total_hour,
      updated_by,
      task_holds,
    } = data;

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // load task/account/branch for holds operations
      const [activityRows] = await conn.execute(
        `SELECT account_id, branch_id FROM staff_activity WHERE id = ? AND is_deleted = 0 LIMIT 1`,
        [id],
      );
      const activity = activityRows?.[0] || null;
      if (!activity) {
        await conn.rollback();
        conn.release();
        return false;
      }

      const [result] = await conn.execute(
        `UPDATE staff_activity
         SET status = 'done', start_date_time = ?, end_date_time = ?, total_hour = ?, updated_by = ?, updated_at = ?
         WHERE id = ? AND is_deleted = 0`,
        [
          new Date(start_date_time),
          new Date(end_date_time),
          total_hour,
          updated_by,
          now,
          id,
        ],
      );

      // When admin submits a new hold list: soft-delete existing active rows, then insert new rows.
      if (Array.isArray(task_holds)) {
        await conn.execute(
          `UPDATE task_holds
           SET is_deleted = 1, updated_by = ?, updated_at = CURRENT_TIMESTAMP
           WHERE task_id = ? AND account_id = ? AND branch_id = ?
             AND COALESCE(is_deleted, 0) = 0`,
          [updated_by || null, id, activity.account_id, activity.branch_id],
        );

        for (const h of task_holds) {
          if (!h?.hold_start_at) continue;
          const startAt = new Date(h.hold_start_at);
          if (Number.isNaN(startAt.getTime())) continue;
          const endAt =
            h.hold_end_at === null || h.hold_end_at === undefined || h.hold_end_at === ''
              ? null
              : new Date(h.hold_end_at);
          if (endAt && Number.isNaN(endAt.getTime())) continue;
          if (endAt && endAt.getTime() < startAt.getTime()) continue;

          const durationMinutes = endAt
            ? Math.max(
              0,
              Math.floor((endAt.getTime() - startAt.getTime()) / (1000 * 60)),
            )
            : 0;

          await conn.execute(
            `
              INSERT INTO task_holds (
                task_id,
                account_id,
                branch_id,
                hold_start_at,
                hold_end_at,
                duration_minutes,
                is_carry_forward,
                notes,
                created_by,
                updated_by,
                is_deleted
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            `,
            [
              id,
              activity.account_id,
              activity.branch_id,
              startAt,
              endAt,
              durationMinutes,
              Number(h.is_carry_forward) === 1 ? 1 : 0,
              h.notes || null,
              updated_by || null,
              updated_by || null,
            ],
          );
        }
      }

      await conn.commit();
      return result.affectedRows > 0;
    } catch (e) {
      try {
        await conn.rollback();
      } catch { }
      throw e;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Adjust Staff Activity Time Error:", error);
    throw new Error("failed to adjust staff activity time");
  }
};