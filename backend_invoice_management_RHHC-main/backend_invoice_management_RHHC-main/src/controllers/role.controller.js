const roleService = require("../services/role.service");
const serverResponse = require("../utils/serverResponse");

exports.createRole = async (req, res) => {
  try {
    const body = req.body;
    const { userId } = req.user;

    const existingRole = await roleService.checkRoleByName(body.name);

    if (existingRole) {
      return serverResponse.badRequest(req, res, {
        message: "Role already exists with this name",
      });
    }

    let saveData = body;
    saveData["created_by"] = userId;
    saveData["updated_by"] = userId;

    const newRole = await roleService.createRole(saveData);

    return serverResponse.success(req, res, {
      message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const body = req.query;
    const data = await roleService.getAllRolesByAccount(body);
    const result = {
      message: "Roles fetched successfully",
      data: data.data,
    };

    const meta = {
      total: data.totalRecords,
      limit: data.pageSize,
      currentPage: data.currentPage,
    };
    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};
exports.getRoleById = async (req, res) => {
  try {
    const data = await roleService.getRoleById(req.params.id);
    if (data) {
      const result = { data };
      return serverResponse.success(req, res, result);
    } else {
      const result = { message: "Role Not Found" };
      return serverResponse.notFound(req, res, result);
    }
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};
exports.updateRole = async (req, res) => {
  try {
    const updateId = req.params.id;
    const body = req.body;

    body["updated_by"] = updateId;

    if (!updateId) {
      return serverResponse.badRequest(req, res, {
        message: "Please send id in paramas",
      });
    }

    const data = await roleService.updateRole(updateId, body);

    return serverResponse.success(req, res, data);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};
exports.deleteRole = async (req, res) => {
  try {
    const data = await roleService.deleteRole(req.params.id);
    const result = {
      message: "Role deleted successfully",
    };
    return serverResponse.success(req, res, result);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};
