const userService = require("../services/user.service");
const serverResponse = require("../utils/serverResponse");
const {
  generateTokenJWT,
  generatePassword,
  generateRefreshToken,
  verifyRefreshToken,
  moveIfPresent,
} = require("../utils/util");
const emailService = require("../utils/emailService");
const constVar = require("../utils/constantVariables");
const path = require("path");

exports.createUser = async (req, res) => {
  try {
    const body = req.body;
    const { userId } = req.user;

    // Check phone uniqueness
    const existingUserByPhone = await userService.checkUserByPhone(body.mobile);
    if (existingUserByPhone) {
      return serverResponse.badRequest(req, res, {
        message: "User already exists with this mobile number",
      });
    }

    // Check email uniqueness
    if (body.email) {
      const existingUserByEmail = await userService.checkUserByEmail(body.email);
      if (existingUserByEmail) {
        return serverResponse.badRequest(req, res, {
          message: "User already exists with this email address",
        });
      }
    }

    // Generate password instead of mpin
    const generatedPassword = generatePassword();

    const parseMaybeJson = (val) => {
      try {
        if (typeof val === "string") return JSON.parse(val);
        return val;
      } catch (_) {
        return val;
      }
    };

    const permAddr = parseMaybeJson(body.permanent_address);
    const tempAddr = parseMaybeJson(body.temporary_address);

    let saveData = body;
    saveData["password"] = generatedPassword;
    saveData["mpin"] = null; // No longer using mpin
    saveData["created_by"] = userId;
    saveData["updated_by"] = userId;
    saveData["username"] = "";

    // normalize booleans/numbers
    saveData.has_driving_license =
      saveData.has_driving_license !== undefined
        ? Number(saveData.has_driving_license)
        : null;

    saveData.has_vehicle =
      saveData.has_vehicle !== undefined ? Number(saveData.has_vehicle) : null;

    // store full JSON for addresses
    saveData.permanent_address = permAddr ? JSON.stringify(permAddr) : null;
    saveData.temporary_address = tempAddr ? JSON.stringify(tempAddr) : null;

    saveData.status = saveData.status ?? null;

    const newUser = await userService.createUser(saveData);

    if (req.files) {
      const dirForDocs = Number(body.role_id) === constVar.staff_role_id ? "staff" : "customer";

      const finalDir = path.join(
        __dirname,
        `../uploads/${dirForDocs}/documents`,
        String(newUser)
      );
      const publicBase = `/uploads/${dirForDocs}/documents/${newUser}`;

      const photoUrl = moveIfPresent(
        req.files["photo"],
        finalDir,
        publicBase,
        null
      );
      const aadharUrl = moveIfPresent(
        req.files["aadhar_card"],
        finalDir,
        publicBase,
        null
      );
      const panUrl = moveIfPresent(
        req.files["pan_card"],
        finalDir,
        publicBase,
        null
      );
      const dlUrl = moveIfPresent(
        req.files["driving_license"],
        finalDir,
        publicBase,
        null
      );
      const referenceAadharUrl = moveIfPresent(
        req.files["reference_aadhar"],
        finalDir,
        publicBase,
        null
      );

      await userService.updateUserDetailsDocs(newUser, {
        aadhar_card_url: aadharUrl,
        photo_url: photoUrl,
        pan_card_url: panUrl,
        driving_license_url: dlUrl,
        reference_aadhar_url: referenceAadharUrl,
        updated_by: userId,
      });
    }

    // Send email with credentials only to staff (role_id = 3)
    if (Number(body.role_id) === Number(constVar.staff_role_id) && body.email) {
      try {
        await emailService.sendStaffCredentialsEmail(
          body.email,
          body.name,
          body.mobile,
          generatedPassword
        );
      } catch (emailError) {
        console.error(
          "Failed to send email, but user was created:",
          emailError
        );
      }
    }

    return serverResponse.success(req, res, {
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Something went wrong",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await userService.checkUserByPhone(mobile);

    if (!user) {
      return serverResponse.notFound(req, res, {
        message: "User not found with given number.",
      });
    }

    // Check password if it exists (new users), otherwise fallback to mpin for backward compatibility
    let isValid = false;
    if (user.password) {
      const bcrypt = require("bcrypt");
      isValid = await bcrypt.compare(password, user.password);
    } else if (user.mpin) {
      // Backward compatibility: allow mpin login for old users
      isValid = user.mpin === password;
    }

    if (!isValid) {
      return serverResponse.unauthorised(req, res, {
        message: "Invalid password.",
      });
    }

    const tokenData = {
      userId: user.id,
      userRole: user.role_id,
      userName: user.name,
      userMobile: user.mobile,
      userEmail: user.email,
      userAccountId: user.account_id,
      userBranchId: user.branch_id,
    };

    const jwtToken = generateTokenJWT(tokenData, "1d");
    const refreshToken = generateRefreshToken(tokenData);

    return serverResponse.success(req, res, {
      message: "Login successful.",
      data: { jwtToken, refreshToken },
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Something went wrong",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await userService.getUserById(userId, true);
    if (!user) {
      return serverResponse.notFound(req, res, { message: "User not found" });
    }

    return serverResponse.success(req, res, { data: user });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Something went wrong",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId, userRole } = req.user;
    const body = req.body;

    // Get user to check role
    const currentUser = await userService.getUserById(userId, true);
    if (!currentUser) {
      return serverResponse.notFound(req, res, {
        message: "User not found",
      });
    }

    // Ensure user can only update their own profile
    const updateId = userId;

    const existUser = await userService.getUserById(updateId, false);

    if (!existUser) {
      return serverResponse.badRequest(req, res, {
        message: "User not found",
      });
    }

    const updateData = {};

    if (body.password) {
      const bcrypt = require("bcrypt");
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    if (body.mobile && body.mobile !== existUser.mobile) {
      const existingUserByPhone = await userService.checkUserByPhone(
        body.mobile,
        updateId
      );
      if (existingUserByPhone) {
        return serverResponse.badRequest(req, res, {
          message: "User already exists with this mobile number",
        });
      }
      updateData.mobile = body.mobile;
    } else if (body.mobile) {
      updateData.mobile = body.mobile;
    }

    if (body.email && body.email !== existUser.email) {
      const existingUserByEmail = await userService.checkUserByEmail(
        body.email,
        updateId
      );
      if (existingUserByEmail) {
        return serverResponse.badRequest(req, res, {
          message: "User already exists with this email address",
        });
      }
      updateData.email = body.email;
    } else if (body.email) {
      updateData.email = body.email;
    }

    if (body.name) {
      updateData.name = body.name;
    }

    updateData.updated_by = userId;

    const data = await userService.updateProfile(updateId, updateData);

    return serverResponse.success(req, res, data);
  } catch (error) {
    console.log("error ==", error);
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return serverResponse.badRequest(req, res, {
        message: "Refresh token is required",
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return serverResponse.unauthorised(req, res, {
        message: "Invalid or expired refresh token",
      });
    }

    const tokenData = {
      userId: decoded.userId,
      userRole: decoded.userRole,
      userName: decoded.userName,
      userMobile: decoded.userMobile,
      userEmail: decoded.userEmail,
      userAccountId: decoded.userAccountId,
      userBranchId: decoded.userBranchId,
    };

    const newAccessToken = generateTokenJWT(tokenData, "1d");
    const newRefreshToken = generateRefreshToken(tokenData); // expiresIn: 7d by default

    return serverResponse.success(req, res, {
      message: "Token refreshed successfully",
      data: {
        jwtToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const body = req.query;
    const data = await userService.getAllUsersByAccount(body);
    const result = {
      message: "Users fetched successfully",
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

exports.getUserById = async (req, res) => {
  try {
    const data = await userService.getUserById(req.params.id);
    if (data) {
      const result = { data };
      return serverResponse.success(req, res, result);
    } else {
      const result = { message: "User Not Found" };
      return serverResponse.notFound(req, res, result);
    }
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updateId = req.params.id;
    const body = req.body;
    const { userId } = req.user;
    body["updated_by"] = userId;

    const existUser = await userService.getUserById(updateId, false);

    if (!existUser) {
      return serverResponse.badRequest(req, res, {
        message: "User not found",
      });
    }

    // Check phone uniqueness if mobile is being updated
    if (body.mobile && body.mobile !== existUser.mobile) {
      const existingUserByPhone = await userService.checkUserByPhone(
        body.mobile,
        updateId
      );
      if (existingUserByPhone) {
        return serverResponse.badRequest(req, res, {
          message: "User already exists with this mobile number",
        });
      }
    }

    // Check email uniqueness if email is being updated
    if (body.email && body.email !== existUser.email) {
      const existingUserByEmail = await userService.checkUserByEmail(
        body.email,
        updateId
      );
      if (existingUserByEmail) {
        return serverResponse.badRequest(req, res, {
          message: "User already exists with this email address",
        });
      }
    }

    const parseMaybeJson = (val) => {
      try {
        if (typeof val === "string") return JSON.parse(val);
        return val;
      } catch (_) {
        return val;
      }
    };

    const permAddr = parseMaybeJson(body.permanent_address);
    const tempAddr = parseMaybeJson(body.temporary_address);

    // normalize booleans/numbers
    body.has_driving_license =
      body.has_driving_license !== undefined
        ? Number(body.has_driving_license)
        : null;

    body.has_vehicle =
      body.has_vehicle !== undefined ? Number(body.has_vehicle) : null;

    // store full JSON strings for addresses
    body.permanent_address = permAddr ? JSON.stringify(permAddr) : null;
    body.temporary_address = tempAddr ? JSON.stringify(tempAddr) : null;

    body.status = body.status ?? null;
    body.hour_price = Number(body.hour_price) || null;
    body.working_hours = Number(body.working_hours) || null;


    let aadharUrl = body.aadhar_card_url || null;
    let panUrl = body.pan_card_url || null;
    let dlUrl = body.driving_license_url || null;
    let photoUrl = body.photo_url || null;

    if (req.files) {
      const dirForDocs = Number(body.role_id) === constVar.staff_role_id ? "staff" : "customer";
      const finalDir = path.join(
        __dirname,
        `../uploads/${dirForDocs}/documents`,
        String(updateId)
      );
      const publicBase = `/uploads/${dirForDocs}/documents/${updateId}`;
      const newPhoto = moveIfPresent(
        req.files["photo"],
        finalDir,
        publicBase,
        existUser.photo_url
      );
      const newA = moveIfPresent(
        req.files["aadhar_card"],
        finalDir,
        publicBase,
        existUser.aadhar_card_url
      );
      const newP = moveIfPresent(
        req.files["pan_card"],
        finalDir,
        publicBase,
        existUser.pan_card_url
      );
      const newD = moveIfPresent(
        req.files["driving_license"],
        finalDir,
        publicBase,
        existUser.driving_license_url
      );
      const newRefAadhar = moveIfPresent(
        req.files["reference_aadhar"],
        finalDir,
        publicBase,
        existUser.reference_aadhar_url
      );
      aadharUrl = newA || aadharUrl;
      panUrl = newP || panUrl;
      dlUrl = newD || dlUrl;
      photoUrl = newPhoto || photoUrl;
      body.reference_aadhar_url = newRefAadhar || existUser.reference_aadhar_url || null;
    }

    body.aadhar_card_url = aadharUrl;
    body.pan_card_url = panUrl;
    body.driving_license_url = dlUrl;
    body.photo_url = photoUrl;

    const data = await userService.updateUser(updateId, body);

    return serverResponse.success(req, res, data);
  } catch (error) {
    console.log("error ==", error);
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const data = await userService.deleteUser(req.params.id);
    const result = {
      message: "User deleted successfully",
    };
    return serverResponse.success(req, res, result);
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};

exports.getDesignations = async (req, res) => {
  try {
    const designations = await userService.getDesignations(req.query);
    return serverResponse.success(req, res, {
      data: {
        designations,
      },
    });
  } catch (error) {
    return serverResponse.internalServerError(req, res, {
      message: error.message,
    });
  }
};
