const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { validateBody } = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post('/getDashboardData', authenticate, dashboardController.getDashboardData);

module.exports = router;