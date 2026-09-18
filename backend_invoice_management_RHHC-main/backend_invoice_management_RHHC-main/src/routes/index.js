const express = require("express");
const userRoutes = require("./user.routes");
const roleRoutes = require("./role.routes");
const servicesRoutes = require("./services.routes");
const productRoutes = require("./product.routes");
const invoiceRoutes = require("./invoice.routes");
const staffRoutes = require("./staff.routes");
const accountSettingsRoutes = require("./accountSettings.routes");
const dashboardRoutes = require("./dashboard.route");
const leadRoute = require("./lead.routes");
const staffExperienceCategoryRoutes = require("./staffExperienceCategory.routes");
const router = express.Router();

router.use("/user", userRoutes);
router.use("/role", roleRoutes);
router.use("/services", servicesRoutes);
router.use("/product", productRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/staff", staffRoutes);
router.use("/account-settings", accountSettingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/lead", leadRoute);
router.use("/staff-experience-category", staffExperienceCategoryRoutes);

module.exports = router;
