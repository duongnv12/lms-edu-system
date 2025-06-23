// server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { importCoursesExcel } = require('../controllers/importCoursesExcel');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Lấy tất cả các học phần (mọi user đã đăng nhập đều xem được)
router.get('/', authenticate, courseController.getAllCourses);
// Lấy chi tiết 1 học phần
router.get('/:id', authenticate, courseController.getCourseById);
// Tạo mới học phần (chỉ Admin hoặc Instructor)
router.post('/', authenticate, authorize(['Admin', 'Instructor']), courseController.createCourse);
// Cập nhật học phần (chỉ Admin hoặc Instructor)
router.put('/:id', authenticate, authorize(['Admin', 'Instructor']), courseController.updateCourse);
// Xóa học phần (chỉ Admin)
router.delete('/:id', authenticate, authorize('Admin'), courseController.deleteCourse);
// Nhập học phần từ file Excel (chỉ Admin hoặc Instructor)
router.post('/import-excel', authenticate, authorize(['Admin', 'Instructor']), importCoursesExcel);

module.exports = router;
