const staffService = require("../services/staff.service");
const serverResponse = require("../utils/serverResponse");
const { moveIfPresent, toDDMMYYYYhhmmss } = require("../utils/util");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

// Start 08:00 AM (India time) auto-complete scheduler (idempotent).
try {
  staffService.startDailyAutoCompleteCron();
} catch (e) {
  console.error("Failed to start daily auto-complete cron:", e);
}

function deletePublicFileSafe(publicPath) {
  try {
    if (!publicPath) return;
    const rel = String(publicPath).replace(/^\//, "");
    const abs = path.join(__dirname, "..", rel);
    const uploadsRoot = path.join(__dirname, "../uploads");
    if (abs.startsWith(uploadsRoot) && fs.existsSync(abs)) {
      fs.unlinkSync(abs);
    }
  } catch (err) {
    console.error("Delete file error:", err);
  }
}

// Staff Experience

const addExperience = async (req, res) => {
  try {
    const userId = req.user.userId;
    const staff_id = req.body.staff_id;
    req.body.created_by = userId;

    // insert base experience
    const experienceId = await staffService.addExperience(req.body);

    // destination
    const destDir = path.join(
      __dirname,
      "../uploads/staff/experience",
      String(staff_id),
      String(experienceId)
    );
    const publicPrefix = `/uploads/staff/experience/${staff_id}/${experienceId}`;

    // parse documents meta (names) from frontend
    let docsPayload = [];
    try {
      docsPayload = req.body.documents ? JSON.parse(req.body.documents) : [];
    } catch {
      docsPayload = [];
    }

    const documents = [];
    (req.files || []).forEach((file, idx) => {
      const docName =
        docsPayload[idx] && docsPayload[idx].name
          ? docsPayload[idx].name
          : file.originalname;
      const newPath = moveIfPresent([file], destDir, publicPrefix, null);
      if (newPath) {
        documents.push({
          id: uuid(),
          name: docName,
          path: newPath,
        });
      }
    });

    // update DB with docs
    if (documents.length) {
      await staffService.updateExperienceDocuments(experienceId, documents);
    }

    return serverResponse.success(req, res, {
      message: "Experience added",
      data: { id: experienceId },
    });
  } catch (err) {
    console.error(err);
    return serverResponse.internalServerError(req, res);
  }
};

const updateExperience = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const staff_id = req.body.staff_id;
    req.body.updated_by = userId;

    // fetch previous documents for deletes
    const previousDocs = await staffService.getExperienceDocuments(id);

    // update main fields
    const updated = await staffService.updateExperience(id, req.body);
    if (!updated) {
      return serverResponse.notFound(req, res, {
        message: "Experience not found",
      });
    }

    const destDir = path.join(
      __dirname,
      "../uploads/staff/experience",
      String(staff_id),
      String(id)
    );
    const publicPrefix = `/uploads/staff/experience/${staff_id}/${id}`;

    let docsMeta = [];
    try {
      docsMeta = req.body.documents ? JSON.parse(req.body.documents) : [];
    } catch {
      docsMeta = [];
    }
    const files = Array.isArray(req.files) ? req.files : [];
    let fileIdx = 0;

    const finalDocs = [];
    for (const meta of docsMeta) {
      const isReplacing = Boolean(meta.replacing);
      if (isReplacing && files[fileIdx]) {
        const file = files[fileIdx++];
        const newPath = moveIfPresent([file], destDir, publicPrefix, null);
        if (newPath) {
          if (meta.id) {
            // delete old file if different
            const old = (previousDocs || []).find((d) => d.id === meta.id);
            if (old?.path && old.path !== newPath) {
              deletePublicFileSafe(old.path);
            }
            finalDocs.push({
              id: meta.id,
              name: meta.name || file.originalname,
              path: newPath,
            });
          } else {
            finalDocs.push({
              id: uuid(),
              name: meta.name || file.originalname,
              path: newPath,
            });
          }
        }
      } else {
        if (meta.id && meta.path) {
          finalDocs.push({ id: meta.id, name: meta.name, path: meta.path });
        } else if (!meta.id && meta.path) {
          finalDocs.push({ id: uuid(), name: meta.name, path: meta.path });
        }
      }
    }

    // append any extra files as new docs
    while (files[fileIdx]) {
      const file = files[fileIdx++];
      const newPath = moveIfPresent([file], destDir, publicPrefix, null);
      if (newPath) {
        finalDocs.push({ id: uuid(), name: file.originalname, path: newPath });
      }
    }

    // delete disk files for removed docs
    const removed = (previousDocs || []).filter(
      (prev) => !finalDocs.find((d) => d.id === prev.id)
    );
    for (const r of removed) {
      if (r?.path) deletePublicFileSafe(r.path);
    }

    await staffService.updateExperienceDocuments(id, finalDocs);

    return serverResponse.success(req, res, {
      message: "Experience updated",
      data: { id, documents: finalDocs },
    });
  } catch (err) {
    console.error(err);
    return serverResponse.internalServerError(req, res);
  }
};

const deleteExperience = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBy = req.user.userId;
    const existingExp = await staffService.getSingleExperience(id);
    if (!existingExp) {
      return serverResponse.notFound(req, res, {
        message: "Experience not found",
      });
    }

    let documents = [];
    try {
      const raw = existingExp.documents;
      documents = Array.isArray(raw) ? raw : raw ? JSON.parse(raw) : [];
    } catch {
      documents = [];
    }

    for (const doc of documents) {
      if (doc?.path) {
        deletePublicFileSafe(doc.path);
      }
    }

    const ok = await staffService.deleteExperience(id, updatedBy);
    if (!ok) {
      return serverResponse.notFound(req, res, {
        message: "Experience not found or already deleted",
      });
    }

    return serverResponse.success(req, res, {
      message: "Experience deleted",
    });
  } catch (err) {
    console.error(err);
    return serverResponse.internalServerError(req, res);
  }
};

const getExperiences = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const body = req.query;
    body.user_id = user_id;
    const rows = await staffService.getExperiences(body);
    return serverResponse.success(req, res, {
      message: "Experience fetched",
      data: rows,
    });
  } catch (err) {
    console.error(err);
    return serverResponse.internalServerError(req, res);
  }
};

// Staff Qualifications
const addQualification = async (req, res) => {
  try {
    const userId = req.user.userId;
    req.body.created_by = userId;
    req.body.updated_by = userId;
    const qualificationId = await staffService.addQualification(req.body);
    return serverResponse.success(req, res, {
      message: "Qualification added successfully",
      data: { id: qualificationId },
    });
  } catch (err) {
    console.error(err);
    return serverResponse.internalServerError(req, res);
  }
};

const updateQualification = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBy = req.user.userId;
    req.body.updated_by = updatedBy;

    const existingQual = await staffService.getQualificationById(id);
    if (!existingQual) {
      return serverResponse.notFound(req, res, {
        message: "Qualification not found",
      });
    }

    await staffService.updateQualification(id, req.body);
    return serverResponse.success(req, res, {
      message: "Qualification updated successfully",
    });
  } catch (err) {
    console.error(err);
    return serverResponse.internalServerError(req, res);
  }
};

const deleteQualification = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBy = req.user.userId;

    const existingQual = await staffService.getQualificationById(id);
    if (!existingQual) {
      return serverResponse.notFound(req, res, {
        message: "Qualification not found",
      });
    }

    await staffService.deleteQualification(id, updatedBy);
    return serverResponse.success(req, res, {
      message: "Qualification deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return serverResponse.internalServerError(req, res);
  }
};

// Staff Activity

const addStaffActivity = async (req, res) => {
  try {
    const activities = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(activities) || activities.length === 0) {
      return serverResponse.badRequest(req, res, {
        message: "Activities must be a non-empty array",
      });
    }

    const createdActivities = [];

    for (const body of activities) {
      const staff_id = body.user_id;

      const isActive = await staffService.checkStaffisAssignedOnDateTime({
        staff_id,
        account_id: body.account_id,
        branch_id: body.branch_id,
        from_date_time: body.from_date_time,
        to_date_time: body.to_date_time,
      }, null);

      if (isActive) {
        return serverResponse.badRequest(req, res, {
          message: `Staff is already assigned to an active task on this time.(${toDDMMYYYYhhmmss(
            isActive.from_date_time
          )} - ${toDDMMYYYYhhmmss(isActive.to_date_time)})`,
          body: isActive,
        });
      }

      const activityData = {
        ...body,
        status: body.status,
        created_by: userId,
        staff_id: staff_id,
      };
      console.log(activityData);
      const activityId = await staffService.createStaffActivity(activityData);
      createdActivities.push(activityId);
    }

    return serverResponse.success(req, res, {
      message: "All staff activities created successfully",
      data: createdActivities,
    });
  } catch (error) {
    console.error("Add staff activity error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getStaffActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get staff activity by id
    const result = await staffService.getStaffActivityById(id);
    if (!result) {
      return serverResponse.badRequest(req, res, {
        message: "Activity not found",
      });
    }

    return serverResponse.success(req, res, {
      message: "Activity fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in getStaffActivityById:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const softDeleteTaskHold = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const roleId = Number(req.user?.role_id ?? req.user?.roleId ?? 0);
    const { supAdmin_role_id } = require("../utils/constantVariables");

    const meta = await staffService.getTaskHoldActivityMeta(Number(id));
    if (!meta || Number(meta.is_deleted) === 1) {
      return serverResponse.notFound(req, res, {
        message: "Task hold not found",
      });
    }

    if (meta.staff_invoice_id && roleId !== Number(supAdmin_role_id)) {
      return serverResponse.badRequest(req, res, {
        message: "Activity is already associated with a staff invoice",
      });
    }

    const ok = await staffService.softDeleteTaskHold({
      id: Number(id),
      updated_by: userId,
    });

    if (!ok) {
      return serverResponse.notFound(req, res, {
        message: "Task hold not found",
      });
    }

    return serverResponse.success(req, res, {
      message: "Task hold removed successfully",
    });
  } catch (error) {
    console.error("Soft delete task hold error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const updateStaffActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const existingActivity = await staffService.getStaffActivityById(id);
    if (!existingActivity) {
      return serverResponse.notFound(req, res, {
        message: "Activity not found",
      });
    }

    if (existingActivity.status !== 'onHold') {
      return serverResponse.badRequest(req, res, {
        message: "Only onHold activities can be updated",
      });
    }

    const isActive = await staffService.checkStaffisAssignedOnDateTime({
      staff_id: existingActivity.user_id,
      account_id: existingActivity.account_id,
      branch_id: existingActivity.branch_id,
      from_date_time: body.from_date_time,
      to_date_time: body.to_date_time,
    }, Number(existingActivity.id));

    if (isActive) {
      return serverResponse.badRequest(req, res, {
        message: `Staff is already assigned to an active task on this time.(${toDDMMYYYYhhmmss(
          isActive.from_date_time
        )} - ${toDDMMYYYYhhmmss(isActive.to_date_time)})`,
        body: isActive,
      });
    }

    body.updated_by = req.user.userId;
    console.log(body);

    const updateActivity = await staffService.updateStaffActivity(id, body);
    // return serverResponse.internalServerError(req, res, { body: body });

    return serverResponse.success(req, res, {
      message: "Activity updated successfully",
    });
  } catch (error) {
    console.error("Update Staff Activity Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const adjustStaffActivityTime = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const existingActivity = await staffService.getStaffActivityById(id);
    if (!existingActivity) {
      return serverResponse.notFound(req, res, {
        message: "Activity not found",
      });
    }
    const { supAdmin_role_id } = require("../utils/constantVariables");
    const roleId = Number(req.user?.role_id ?? req.user?.roleId ?? 0);
    if (existingActivity.staff_invoice_id && roleId !== Number(supAdmin_role_id)) {
      return serverResponse.badRequest(req, res, {
        message: "Activity is already associated with a staff invoice",
      });
    }

    body.updated_by = req.user.userId;
    console.log(body);
    const updateActivity = await staffService.adjustStaffActivityTime({ id, ...body });
    return serverResponse.success(req, res, {
      message: "Activity time adjusted successfully",
    });
  } catch (error) {
    console.error("Adjust Staff Activity Time Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const updateStaffActivityStatus = async (req, res) => {
  try {
    const body = req.body;
    const { id, status, note_by_staff = null, is_carry_forward } = body;
    const user_id = req.user.userId;
    const now = new Date();

    const activity = await staffService.getCurrentStaffActivity(id);
    console.log("Current Activity:", activity);

    if (!activity) {
      return serverResponse.notFound(req, res, {
        message: "Activity not found or not assigned to this user",
      });
    }

    if (activity.status === "done") {
      return serverResponse.badRequest(req, res, {
        message: "Activity is already marked as done",
      });
    }

    const allowedByCurrentStatus = {
      todo: ["inProgress", "onHold"],
      inProgress: ["done", "onHold"],
      onHold: ["inProgress", "done"],
    };

    const allowedNext = allowedByCurrentStatus[activity.status] || [];
    if (!allowedNext.includes(status)) {
      return serverResponse.badRequest(req, res, {
        message: `Invalid status transition from ${activity.status} to ${status}`,
      });
    }

    if (status === "inProgress") {
      const ongoing = await staffService.checkStaffAlreadyInProgress({
        staff_id: user_id,
        account_id: activity.account_id,
        branch_id: activity.branch_id,
        exclude_activity_id: id,
      });

      if (ongoing) {
        return serverResponse.badRequest(req, res, {
          message:
            "You already have an activity in progress. Please complete that first.",
        });
      }
    }

    let updateData = {
      status,
      note_by_staff,
      updated_by: user_id,
      updated_at: now,
    };

    if (status === "inProgress") {
      // Only set start_date_time on first start (todo -> inProgress)
      if (activity.status === "todo") {
        updateData.start_date_time = now;
      }

      // If task was on hold, close the latest open hold row
      if (activity.status === "onHold") {
        const closedHold = await staffService.closeLatestOpenTaskHold({
          task_id: Number(id),
          account_id: activity.account_id,
          branch_id: activity.branch_id,
          hold_end_at: now,
          updated_by: user_id,
        });

        // Carry forward = extend the scheduled task end time by hold duration
        if (closedHold?.is_carry_forward === 1 && closedHold.duration_minutes > 0) {
          await staffService.extendTaskToDateTimeByMinutes({
            task_id: Number(id),
            account_id: activity.account_id,
            branch_id: activity.branch_id,
            minutes: closedHold.duration_minutes,
            updated_by: user_id,
          });
        }
      }
    } else if (status === "done") {
      updateData.end_date_time = now;

      // total_hour is based on actual start_date_time (if any)
      let roundedHours = 0;
      if (activity.start_date_time) {
        const start = new Date(activity.start_date_time);
        const diffMs = now - start;
        const diffHours = diffMs / (1000 * 60 * 60);
        roundedHours = parseFloat(diffHours.toFixed(2));
      }

      // Safety: if there is any open hold, close it when task is completed
      await staffService.closeLatestOpenTaskHold({
        task_id: Number(id),
        account_id: activity.account_id,
        branch_id: activity.branch_id,
        hold_end_at: now,
        updated_by: user_id,
      });

      const totalHoldMinutes = await staffService.getTaskHoldMinutesSum({
        task_id: Number(id),
        account_id: activity.account_id,
        branch_id: activity.branch_id,
      });

      // Net working time = gross time - total hold time
      const netHours = Math.max(0, roundedHours - totalHoldMinutes / 60);
      updateData.total_hour = parseFloat(netHours.toFixed(2));
    } else if (status === "onHold") {
      // Create a hold entry when task is put on hold
      await staffService.createTaskHold({
        task_id: Number(id),
        account_id: activity.account_id,
        branch_id: activity.branch_id,
        hold_start_at: now,
        is_carry_forward: Number(is_carry_forward) === 1 ? 1 : 0,
        notes: note_by_staff,
        created_by: user_id,
        updated_by: user_id,
      });
    }
    console.log("updateData", updateData);

    await staffService.updateStaffActivityStatus(id, updateData);

    return serverResponse.success(req, res, {
      message: `Staff activity marked as ${status} successfully`,
    });
  } catch (error) {
    console.error("Update Staff Activity Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const deleteStaffActivity = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const isDeleted = await staffService.deleteStaffActivity(id, userId);
    if (!isDeleted) {
      return serverResponse.notFound(req, res, {
        message: "Activity not found or already deleted",
      });
    }
    return serverResponse.success(req, res, {
      message: "Staff activity deleted successfully",
    });
  } catch (error) {
    console.error("Update Staff Activity Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getAllStaffActivitiesofAccount = async (req, res) => {
  try {
    const body = req.query;
    const data = await staffService.getAllStaffActivitiesofAccount(body);
    const result = {
      message: "Staff activities retrieved successfully",
      data: data.data,
    };
    const meta = {
      total: data.totalRecords,
      limit: data.pageSize,
      currentPage: data.currentPage,
    };
    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    console.error("Get Staff Activities Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getAllStaffPastActivitiesofAccount = async (req, res) => {
  try {
    const body = req.query;
    body.dayFilter = "past";
    const data = await staffService.getAllStaffActivitiesofAccount(body);
    const result = {
      message: "Staff activities retrieved successfully",
      data: data.data,
    };
    const meta = {
      total: data.totalRecords,
      limit: data.pageSize,
      currentPage: data.currentPage,
    };
    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    console.error("Get Staff Activities Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};
const getAllStaffTodayActivitiesofAccount = async (req, res) => {
  try {
    const body = req.query;
    body.dayFilter = "today";
    const data = await staffService.getAllStaffActivitiesofAccount(body);
    const result = {
      message: "Staff activities retrieved successfully",
      data: data.data,
    };
    const meta = {
      total: data.totalRecords,
      limit: data.pageSize,
      currentPage: data.currentPage,
    };
    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    console.error("Get Staff Activities Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};
const getAllStaffFutureActivitiesofAccount = async (req, res) => {
  try {
    const body = req.query;
    body.dayFilter = "future";
    const data = await staffService.getAllStaffActivitiesofAccount(body);
    const result = {
      message: "Staff activities retrieved successfully",
      data: data.data,
    };
    const meta = {
      total: data.totalRecords,
      limit: data.pageSize,
      currentPage: data.currentPage,
    };
    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    console.error("Get Staff Activities Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getStaffDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { account_id, branch_id, from_date, to_date } = req.body || {};

    if (!account_id || !branch_id) {
      return serverResponse.badRequest(req, res, {
        message: "Account and branch are required",
      });
    }

    const summary = await staffService.getStaffDashboardSummary({
      staff_id: userId,
      account_id,
      branch_id,
      from_date,
      to_date,
    });

    return serverResponse.success(req, res, {
      message: "Staff dashboard summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Get Staff Dashboard Summary Error:", error);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to fetch staff dashboard summary",
    });
  }
};

// Staff Quick Pay

const addStaffQuickPay = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.userId;
    const staff_id = req.body.user_id;
    body.created_by = userId;
    body.staff_id = staff_id;

    const newQuickPayId = await staffService.addStaffQuickPay(body);
    return serverResponse.success(req, res, {
      message: "Staff Quick pay added",
      data: newQuickPayId,
    });
  } catch (error) {
    console.error("Staff Quick pay add Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getAllQuickPaysByStaffId = async (req, res) => {
  try {
    const { account_id, branch_id } = req.query;
    const { userId: user_id } = req.params;

    const pays = await staffService.getStaffQuickPays({
      user_id,
      account_id,
      branch_id,
    });

    return serverResponse.success(req, res, {
      message: "Staff quick pays fetched successfully",
      data: pays,
    });
  } catch (error) {
    console.error("Get Staff Quick Pays Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const updateStaffQuickPayStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { status } = req.body;

    const updateQuickPay = await staffService.updateQuickPayStatus(
      id,
      userId,
      status
    );
    if (!updateQuickPay) {
      return serverResponse.notFound(req, res, {
        message: "Quick pay not found or already deleted",
      });
    }

    return serverResponse.success(req, res, {
      message: "Staff Quick Pay status updated",
    });
  } catch (error) {
    console.error("Staff Quick pay add Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const deleteStaffQuickPay = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const isDeleted = await staffService.deleteQuickPay(id, userId);
    if (!isDeleted) {
      return serverResponse.notFound(req, res, {
        message: "Staff Quick Pay not found or already deleted",
      });
    }
    return serverResponse.success(req, res, {
      message: "Staff Quick Pay deleted successfully",
    });
  } catch (error) {
    console.error("Delete Staff Quick Pay Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

// Staff Invoice(payslip)
const createStaffInvoice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const body = req.body;
    body.from_date = `${body.from_date} 00:00:00`;
    body.to_date = `${body.to_date} 23:59:59`;

    // Prevent creating a new invoice if a draft exists for this staff
    const existingDraft = await staffService.checkStaffHasDraftInvoice({
      user_id: body.user_id,
      account_id: body.account_id,
      branch_id: body.branch_id,
    });
    if (existingDraft) {
      return serverResponse.badRequest(req, res, {
        message:
          "A draft payslip already exists for this staff. Finalise it before creating a new one.",
      });
    }
    const invoiceId = await staffService.createStaffInvoice({
      ...body,
      created_by: userId,
      invoice_status: body.invoice_status || "draft",
    });

    return serverResponse.success(req, res, {
      message: "Staff invoice generated successfully",
      data: { invoiceId },
    });
  } catch (err) {
    console.error("Create Staff Invoice Error:", err);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to generate staff invoice",
    });
  }
};

const updateStaffInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const body = req.body || {};
    if (body.from_date && !body.from_date.includes("00:00:00"))
      body.from_date = `${body.from_date} 00:00:00`;
    if (body.to_date && !body.to_date.includes("23:59:59"))
      body.to_date = `${body.to_date} 23:59:59`;

    const ok = await staffService.updateStaffInvoice(id, {
      ...body,
      updated_by: userId,
      created_by: userId,
    });
    if (!ok) {
      return serverResponse.badRequest(req, res, {
        message:
          "Unable to update draft (maybe already finalised or not found)",
      });
    }
    return serverResponse.success(req, res, {
      message: "Draft updated successfully",
      data: { id },
    });
  } catch (err) {
    console.error("Update Staff Invoice Error:", err);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to update staff invoice",
    });
  }
};

const getStaffInvoiceCreateData = async (req, res) => {
  try {
    const invoiceCreateData = await staffService.getStaffInvoiceCreateData(
      req.body
    );
    return serverResponse.success(req, res, {
      data: invoiceCreateData,
    });
  } catch (error) {
    console.error("Get Staff Invoice Data Error:", error);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to get staff invoice data",
    });
  }
};

const getAllInvoiceStaffById = async (req, res) => {
  try {
    const { account_id, branch_id } = req.query;
    const { userId: user_id } = req.params;
    const invoices = await staffService.getStaffInvoices({
      user_id,
      account_id,
      branch_id,
    });

    return serverResponse.success(req, res, {
      message: "Staff invoices fetched successfully",
      data: invoices,
    });
  } catch (error) {
    console.error("Get Staff Invoices Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getStaffInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await staffService.getStaffInvoiceById(id);
    if (!invoice) {
      return serverResponse.notFound(req, res, {
        message: "Staff pay slip not found",
      });
    }
    return serverResponse.success(req, res, {
      message: "Staff invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("Get Staff Invoice By Id Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const deleteStaffInvoice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invoiceId = req.params.id;

    const result = await staffService.deleteStaffInvoice(invoiceId, userId);

    if (!result) {
      return serverResponse.badRequest(req, res, {
        message: "Pay slip  not found",
      });
    }
    return serverResponse.success(req, res, {
      message: "Payslip deleted successfully",
    });
  } catch (error) {
    console.error("Delete Staff Invoice Data Error:", error);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to delete staff pay slip data",
    });
  }
};

const getLastInvoiceDateOfStaff = async (req, res) => {
  try {
    const { userId } = req.params;
    const { account_id, branch_id } = req.body;
    const lastInvoiceDate = await staffService.getLastInvoiceDateOfStaff({
      user_id: userId,
      account_id,
      branch_id,
    });
    return serverResponse.success(req, res, {
      message: "Last invoice date fetched successfully",
      data: lastInvoiceDate,
    });
  } catch (error) {
    console.error("Get Last Invoice Date Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getAllStaffInvoices = async (req, res) => {
  try {
    const body = req.query;
    const result = await staffService.getAllStaffInvoices(body);
    return serverResponse.paginationRes(
      req,
      res,
      {
        message: "Staff payslips retrieved successfully",
        data: result.data,
      },
      {
        total: result.total,
        limit: result.limit,
        currentPage: result.page,
      }
    );
  } catch (error) {
    console.error("Get All Staff Invoices Error:", error);
    return serverResponse.internalServerError(req, res);
  }
};

const getBlockedStaffListByAccountBranch = async (req, res) => {
  try {
    const { account_id, branch_id } = req.query;
    const blockedStaffList = await staffService.getBlockedStaffListByAccountBranch({
      account_id,
      branch_id,
    });
    return serverResponse.success(req, res, {
      message: "Blocked staff list fetched successfully",
      data: blockedStaffList,
    });
  } catch (error) {
    console.error("Get Blocked Staff List Error:", error);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to fetch blocked staff list",
    });
  }
};

// Get all in-progress staff activities by account branch
const getAllInProgressStaffActivities = async (req, res) => {
  try {

    const inProgressStaffActivities = await staffService.getAllInProgressStaffActivities(req.query);
    return serverResponse.success(req, res, {
      message: "In progress staff activities fetched successfully",
      data: inProgressStaffActivities,
    });
  }
  catch (error) {
    console.error("Get All In Progress Staff Activities Error:", error);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to fetch in progress staff activities",
    });
  }
};

// Change staff password admin. 
const changeStaffPasswordByAdmin = async (req, res) => {
  try {
    const body = req.body;
    const result = await staffService.changeStaffPasswordByAdmin(body);
    if (!result) {
      return serverResponse.badRequest(req, res, {
        message: "Failed to change staff password",
      });
    }
    return serverResponse.success(req, res, {
      message: "Staff password changed successfully",
    });
  } catch (error) {
    console.error("Change Staff Password By Admin Error:", error);
    return serverResponse.internalServerError(req, res, {
      message: "Failed to change staff password",
    });
  }
};

module.exports = {
  // Staff Experience
  addExperience,
  updateExperience,
  deleteExperience,
  getExperiences,
  // Staff Qualifications
  addQualification,
  updateQualification,
  deleteQualification,
  // Staff Activity
  addStaffActivity,
  updateStaffActivity,
  updateStaffActivityStatus,
  getAllStaffActivitiesofAccount,
  getAllStaffPastActivitiesofAccount,
  getAllStaffTodayActivitiesofAccount,
  getAllStaffFutureActivitiesofAccount,
  getAllInProgressStaffActivities,
  adjustStaffActivityTime,
  // Staff Quick Pay
  addStaffQuickPay,
  updateStaffQuickPayStatus,
  deleteStaffQuickPay,
  // Staff Invoice(payslip)
  getAllQuickPaysByStaffId,
  createStaffInvoice,
  updateStaffInvoice,
  getStaffInvoiceCreateData,
  getAllInvoiceStaffById,
  getStaffInvoiceById,
  deleteStaffInvoice,
  getLastInvoiceDateOfStaff,
  getAllStaffInvoices,
  getStaffActivityById,
  softDeleteTaskHold,
  deleteStaffActivity,
  // Staff Dashboard
  getStaffDashboardSummary,
  // Staff Blocked List
  getBlockedStaffListByAccountBranch,
  // Change Staff Password By Admin
  changeStaffPasswordByAdmin,
};
