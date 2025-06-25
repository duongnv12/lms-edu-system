const express = require('express');
const router = express.Router();
const {
    getCurriculums,
    getCurriculumById,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
    getAvailableCourses,
    cloneCurriculum,
    getMajors
} = require('../controllers/curriculumController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Get all curriculums with pagination and filters (mọi user đã đăng nhập đều xem được)
router.get('/', authenticate, getCurriculums);

// Get available courses for curriculum (mọi user đã đăng nhập đều xem được)
router.get('/available-courses', authenticate, getAvailableCourses);

// Get majors for dropdown (mọi user đã đăng nhập đều xem được)
router.get('/majors', authenticate, getMajors);

// Get curriculum by ID (mọi user đã đăng nhập đều xem được)
router.get('/:id', authenticate, getCurriculumById);

// Create new curriculum (chỉ Admin hoặc Instructor)
router.post('/', authenticate, authorize(['Admin', 'Instructor']), createCurriculum);

// Update curriculum (chỉ Admin hoặc Instructor)
router.put('/:id', authenticate, authorize(['Admin', 'Instructor']), updateCurriculum);

// Clone curriculum - create new version (chỉ Admin hoặc Instructor)
router.post('/:id/clone', authenticate, authorize(['Admin', 'Instructor']), cloneCurriculum);

// Delete curriculum (chỉ Admin)
router.delete('/:id', authenticate, authorize('Admin'), deleteCurriculum);

module.exports = router;
