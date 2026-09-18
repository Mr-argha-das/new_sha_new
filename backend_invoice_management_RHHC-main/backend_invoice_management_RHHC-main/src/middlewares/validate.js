const serverResponse = require("../utils/serverResponse");

exports.validateBody = (validateFn, location = "body") => {
  return (req, res, next) => {
    const data = req[location];
    const validationError = validateFn(data);
    if (validationError) {
      return serverResponse.badRequest(req, res, validationError);
    }
    next();
  };
};
