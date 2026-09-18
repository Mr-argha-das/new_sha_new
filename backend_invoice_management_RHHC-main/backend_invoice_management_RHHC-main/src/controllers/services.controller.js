const serviceService = require("../services/services.service");
const serverResponse = require("../utils/serverResponse");

exports.createService = async (req, res) => {
  try {
    const body = req.body;
    const { userId } = req.user;

    const existingService = await serviceService.checkServiceByName(
      body.name,
      body.account_id,
    );

    if (existingService) {
      return serverResponse.badRequest(req, res, {
        message: "Service already exists with this name",
      });
    }

    let saveData = {
      ...body,
      created_by: userId,
      updated_by: userId,
    };

    const newService = await serviceService.createService(saveData);

    return serverResponse.success(req, res, {
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.log(error);

    return serverResponse.internalServerError(req, res, {
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const query = req.query;
    const data = await serviceService.getAllServicesByAccount(query);

    const result = {
      message: "Services fetched successfully",
      data: data.data,
    };

    const meta = {
      total: data.totalRecords,
      limit: data.pageSize,
      currentPage: data.currentPage
    };

    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const data = await serviceService.getServiceById(req.params.id);
    if (data) {
      return serverResponse.success(req, res, { data });
    } else {
      return serverResponse.notFound(req, res, {
        message: "Service not found",
      });
    }
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const updateId = req.params.id;
    const body = req.body;
    const { userId } = req.user;

    if (!updateId) {
      return serverResponse.badRequest(req, res, {
        message: "Please send ID in params",
      });
    }

    const existingService = await serviceService.checkServiceByName(
      body.name,
      body.account_id,
      updateId
    );

    if (existingService) {
      return serverResponse.badRequest(req, res, {
        message: "Service already exists with this name",
      });
    }

    body.updated_by = userId;

    const data = await serviceService.updateService(updateId, body);

    return serverResponse.success(req, res, data);
  } catch (error) {
    console.log(error);
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await serviceService.deleteService(id);
    return serverResponse.success(req, res, {
      message: "Service deleted successfully",
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};
