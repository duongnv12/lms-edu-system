// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

// Route để khởi tạo quá trình đăng nhập Google
router.get('/google', authController.googleAuth);

// Route callback từ Google sau khi người dùng xác thực
router.get('/google/callback', authController.googleAuthCallback);

// Route để lấy thông tin của người dùng hiện tại (yêu cầu JWT hợp lệ)
router.get('/me', authenticate, authController.getMe);

// Đăng nhập truyền thống
router.post('/login', authController.login);

// --- CẬP NHẬT MỚI ---
// Route để cập nhật thông tin cá nhân của người dùng
router.patch('/profile', authenticate, authController.updateProfile); // Sử dụng PATCH cho cập nhật từng phần
// Route để đổi mật khẩu của người dùng (chỉ cho user đăng nhập truyền thống)
router.patch('/change-password', authenticate, authController.changePassword);

module.exports = router;