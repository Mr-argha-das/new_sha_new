const productService = require("../services/product.service");
const productTrackingService = require("../services/productTracking.service");
const serverResponse = require("../utils/serverResponse");

exports.createProduct = async (req, res) => {
  try {
    const { userId } = req.user;
    const body = req.body;

    const existingProduct = await productService.checkProductByName(
      body.name,
      body.account_id,
    );

    if (existingProduct) {
      return serverResponse.badRequest(req, res, {
        message: "Product already exists with this name",
      });
    };

    const imagePath = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;


    const productData = {
      ...body,
      images: imagePath,
      created_by: userId,
      updated_by: userId,
    };

    const newProductId = await productService.createProduct(productData);

    return serverResponse.success(req, res, {
      message: "Product created successfully",
      data: { product_id: newProductId },
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to create product",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const data = req.query;
    const products = await productService.getAllProducts(data);

    const result = {
      message: "Products fetched successfully",
      data: products.data,
    };

    const meta = {
      total: products.totalRecords,
      limit: products.pageSize,
      currentPage: products.currentPage
    };

    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to fetch products",
    });
  }
};

exports.getAllAvailableProducts = async (req, res) => {
  try {
    const data = req.query;
    const products = await productService.getAllAvailableProducts(data);

    const result = {
      message: "Products fetched successfully",
      data: products.data,
    };

    const meta = {
      total: products.totalRecords,
      limit: products.pageSize,
      currentPage: products.currentPage
    };

    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to fetch products",
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return serverResponse.notFound(req, res, {
        message: "Product not found",
      });
    }
    return serverResponse.success(req, res, {
      data: product,
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to get product",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.user;
    const body = req.body;

    const existingProduct = await productService.checkProductByName(
      body.name,
      body.account_id,
      id
    );

    if (existingProduct) {
      return serverResponse.badRequest(req, res, {
        message: "Product already exists with this name",
      });
    };

    const imagePath = req.file
      ? `/uploads/products/${req.file.filename}`
      : body.images || null;

    const updateData = {
      ...body,
      images: imagePath,
      updated_by: userId,
    };

    const result = await productService.updateProduct(id, updateData);
    return serverResponse.success(req, res, result);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to update product",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    return serverResponse.success(req, res, {
      message: "Product deleted successfully",
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to delete product",
    });
  }
};

exports.getProductTrackingHistory = async (req, res) => {
  try {
    const data = req.query;
    const filters = {
      deal_type: data.deal_type || '',
      from_date: data.from_date || '',
      to_date: data.to_date || '',
    };

    const productTrackingHistory = await productTrackingService.getProductTrackingHistory(
      data.id,
      data.account_id,
      data.branch_id,
      data.page,
      data.limit,
      filters
    );

    const result = {
      message: "Product tracking history fetched successfully",
      data: productTrackingHistory.data,
    };

    const meta = {
      total: productTrackingHistory.totalRecords,
      limit: productTrackingHistory.pageSize,
      currentPage: productTrackingHistory.currentPage,
    };

    return serverResponse.paginationRes(req, res, result, meta);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to get product tracking history",
    });
  }
};

exports.incDecProductStock = async (req, res) => {
  try {
    const data = req.body;

    const existingProduct = await productService.getProductById(data.product_id);
    if (!existingProduct) {
      return serverResponse.notFound(req, res, {
        message: "Product not found",
      });
    }

    const quantity = Number(data.quantity);
    const availableStock = Number(existingProduct.available_stock ?? 0);
    const totalStock = Number(existingProduct.total_stock ?? 0);

    if (data.type === "decrement") {
      if (quantity > availableStock) {
        return serverResponse.badRequest(req, res, {
          message: `Insufficient available stock. Available: ${availableStock}, requested: ${quantity}`,
        });
      }
      if (quantity > totalStock) {
        return serverResponse.badRequest(req, res, {
          message: `Insufficient total stock. Total: ${totalStock}, requested: ${quantity}`,
        });
      }
    }

    const saveProductStockData = {
      product_id: data.product_id,
      available_stock: data.type === "increment" ? availableStock + quantity : availableStock - quantity,
      total_stock: data.type === "increment" ? totalStock + quantity : totalStock - quantity,
      updated_by: req.user.userId,
      updated_at: new Date(),
    };

    const productStock = await productService.incDecProductStock(saveProductStockData);

    return serverResponse.success(req, res, {
      message: "Product stock updated successfully",
      data: productStock,
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Failed to increment/decrement product stock",
    });
  }
};