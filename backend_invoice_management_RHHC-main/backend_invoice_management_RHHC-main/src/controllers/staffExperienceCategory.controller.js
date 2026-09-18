const categoryService = require("../services/staffExperienceCategory.service");
const serverResponse = require("../utils/serverResponse");

exports.createCategory = async (req, res) => {
  try {
    const body = req.body;
    const { userId } = req.user;

    const existingCategory = await categoryService.checkCategoryByName(
      body.name,
      body.account_id
    );

    if (existingCategory) {
      return serverResponse.badRequest(req, res, {
        message: "Category already exists with this name",
      });
    }

    let saveData = {
      ...body,
      created_by: userId,
      updated_by: userId,
    };

    const newCategory = await categoryService.createCategory(saveData);

    return serverResponse.success(req, res, {
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log(error);

    return serverResponse.internalServerError(req, res, {
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const query = req.query;
    const data = await categoryService.getAllCategoriesByAccount(query);

    const result = {
      message: "Categories fetched successfully",
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

exports.getCategoryById = async (req, res) => {
  try {
    const data = await categoryService.getCategoryById(req.params.id);
    if (data) {
      return serverResponse.success(req, res, { data });
    } else {
      return serverResponse.notFound(req, res, {
        message: "Category not found",
      });
    }
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updateId = req.params.id;
    const body = req.body;
    const { userId } = req.user;

    if (!updateId) {
      return serverResponse.badRequest(req, res, {
        message: "Please send ID in params",
      });
    }

    const existingCategory = await categoryService.checkCategoryByName(
      body.name,
      body.account_id,
      updateId
    );

    if (existingCategory) {
      return serverResponse.badRequest(req, res, {
        message: "Category already exists with this name",
      });
    }

    body.updated_by = userId;

    const data = await categoryService.updateCategory(updateId, body);

    return serverResponse.success(req, res, data);
  } catch (error) {
    console.log(error);
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await categoryService.deleteCategory(id);
    return serverResponse.success(req, res, {
      message: "Category deleted successfully",
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.getCategoriesForDropdown = async (req, res) => {
  try {
    const { account_id, branch_id } = req.query;
    const data = await categoryService.getCategoriesForDropdown(
      account_id,
      branch_id
    );
    return serverResponse.success(req, res, {
      message: "Categories fetched successfully",
      data: data,
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};
