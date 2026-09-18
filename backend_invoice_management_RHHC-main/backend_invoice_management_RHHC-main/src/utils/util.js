const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const generateTokenJWT = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "365d" });
};

// verify refresh token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_SECRET);
};

const generatePasswordResetToken = (payload) => {
  // Token expires in 1 hour
  return jwt.sign(payload, process.env.PASSWORD_RESET_SECRET || process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
};

const verifyPasswordResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.PASSWORD_RESET_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const currentTimestamp = () => {
  return new Date().toISOString();
};

const generate4DigitCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const generatePassword = () => {
  // Generate a random 8-character password with letters and numbers
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const moveIfPresent = (fileArr, destDir, publicPrefix, oldFileDir = null) => {
  if (!fileArr || !fileArr[0]) return null;
  const file = fileArr[0];
  ensureDir(destDir);
  const src = file.path;
  const dest = path.join(destDir, file.filename);
  fs.renameSync(src, dest);
  if (oldFileDir) {
    const deletePath = path.join(__dirname, "..", oldFileDir);
    if (fs.existsSync(deletePath)) {
      fs.unlinkSync(deletePath);
    }
  }
  return `${publicPrefix}/${file.filename}`;
};

const toYYYYMMDD = (isoString, inputFormat) => {
  return dayjs(isoString, inputFormat).format("YYYY-MM-DD");
};
const toDDMMYYYY = (isoString) => {
  return dayjs(isoString).format("DD-MM-YYYY");
};

const toDDMMYYYYhhmmss = (isoString) => {
  return dayjs(isoString).format("DD-MM-YYYY hh:mm:ss");
};

const parseJsontoString = (jsonObject) => {
  try {
    if (!jsonObject) {
      return null;
    }
    if (typeof jsonObject === "object") {
      return JSON.stringify(jsonObject);
    }

    return jsonObject;
  } catch (error) {
    return jsonObject;
  }
};
module.exports = {
  generateTokenJWT,
  verifyRefreshToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  currentTimestamp,
  generate4DigitCode,
  generatePassword,
  capitalize,
  ensureDir,
  moveIfPresent,
  toYYYYMMDD,
  toDDMMYYYY,
  parseJsontoString,
  toDDMMYYYYhhmmss,
};
