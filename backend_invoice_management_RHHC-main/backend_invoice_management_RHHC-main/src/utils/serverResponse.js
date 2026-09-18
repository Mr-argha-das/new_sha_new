// const logger = require("./console_logging");
// const util = require("./util");

// *** for now not setup the logger

const serverResponse = {
  paginationRes: (
    req,
    res,
    body = {},
    meta = {},
    extraInfo = {},
    statusCode = 200
  ) => {
    const finalResponse = {
      success: true,
      message: body.message || "Success",
      data: body.data || {},
      meta,
      ...extraInfo,
    };

    // if (logger && typeof logger === "function") {
    //   logger(
    //     "info",
    //     JSON.stringify(serverResponse.getLogObject(req, statusCode.toString())),
    //     req?.uuid
    //   );
    // }

    return res.status(statusCode).json(finalResponse);
  },
  success: (req, res, body = {}, extraInfo = {}, statusCode = 200) => {
    const finalResponse = {
      success: true,
      message: body.message || "Success",
      data: body.data || {},
      ...extraInfo,
    };

    // if (logger && typeof logger === "function") {
    //   logger(
    //     "info",
    //     JSON.stringify(serverResponse.getLogObject(req, statusCode.toString())),
    //     req?.uuid
    //   );
    // }

    return res.status(statusCode).json(finalResponse);
  },

  badRequest: (req, res, body = {}) => {
    // if (logger) {
    //   logger(
    //     "warn",
    //     JSON.stringify(serverResponse.getLogObject(req, "400")),
    //     req?.uuid
    //   );
    // }
    return res.status(400).json({
      success: false,
      message: body.message || "Bad Request",
      data: body.data || {},
    });
  },

  unauthorised: (req, res, body = {}) => {
    // if (logger) {
    //   logger(
    //     "warn",
    //     JSON.stringify(serverResponse.getLogObject(req, "401")),
    //     req?.uuid
    //   );
    // }
    return res.status(401).json({
      success: false,
      message: body.message || "Unauthorized",
      data: body.data || {},
    });
  },

  forbidden: (req, res, body = {}) => {
    return res.status(403).json({
      success: false,
      message: body.message || "Forbidden",
      data: body.data || {},
    });
  },

  notFound: (req, res, body = {}) => {
    // if (logger) {
    //   logger(
    //     "warn",
    //     JSON.stringify(serverResponse.getLogObject(req, "404")),
    //     req?.uuid
    //   );
    // }
    return res.status(404).json({
      success: false,
      message: body.message || "Not Found",
      data: body.data || {},
    });
  },

  internalServerError: (req, res, body = {}) => {
    // if (logger) {
    //   logger(
    //     "error",
    //     JSON.stringify(serverResponse.getLogObject(req, "500")),
    //     req?.uuid
    //   );
    // }
    return res.status(500).json({
      success: false,
      message: body.message || "Internal Server Error",
      data: body.data || {},
    });
  },

  //   getLogObject: (req, responseCode) => {
  //     return {
  //       path: req.path,
  //       originalUrl: req.originalUrl,
  //       timestamp: util?.currentTimestamp?.() || new Date().toISOString(),
  //       uuid: req?.uuid || "",
  //       responseCode,
  //       responseTime: req?.startTime ? Date.now() - req.startTime : null,
  //       externalCalls: req?.externalCalls || [],
  //     };
  //   },
};

module.exports = serverResponse;
