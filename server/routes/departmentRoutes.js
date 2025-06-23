// server/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, departmentController.getAllDepartments);

module.exports = router;
