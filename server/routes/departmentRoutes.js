// server/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '../uploads') });

router.get('/', authenticate, departmentController.getAllDepartments);
router.get('/:id', authenticate, departmentController.getDepartmentById);
router.post('/', authenticate, authorize(['Admin', 'Instructor']), departmentController.createDepartment);
router.put('/:id', authenticate, authorize(['Admin', 'Instructor']), departmentController.updateDepartment);
router.delete('/:id', authenticate, authorize(['Admin', 'Instructor']), departmentController.deleteDepartment);
router.post('/import-excel', authenticate, authorize(['Admin', 'Instructor']), upload.single('file'), departmentController.importDepartmentsExcel);

module.exports = router;
