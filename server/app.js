// server/app.js
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes'); // Khai báo route cho Course API
const departmentRoutes = require('./routes/departmentRoutes'); // Khai báo route cho Department API
const curriculumRoutes = require('./routes/curriculumRoutes'); // Khai báo route cho Curriculum API

// Load environment variables (đảm bảo nó được gọi ở đây hoặc server.js)
require('dotenv').config();

// Middlewares toàn cục
app.use(express.json()); // Để phân tích cú pháp JSON trong request body

app.use(express.urlencoded({ extended: true })); // Để phân tích cú pháp URL-encoded data (nếu có form data)

// Cấu hình CORS để cho phép frontend truy cập
app.use(cors({
    origin: process.env.FRONTEND_URL, // Chỉ cho phép frontend của chúng ta truy cập
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Cho phép gửi cookies/headers xác thực
}));

// API Routes
app.use('/api/auth', authRoutes); // Các routes liên quan đến xác thực

app.use('/api/courses', courseRoutes); // Các routes liên quan đến quản lý học phần

app.use('/api/departments', departmentRoutes); // Các routes liên quan đến quản lý khoa

app.use('/api/curriculums', curriculumRoutes); // Các routes liên quan đến quản lý chương trình đào tạo

// Basic route for testing server status
app.get('/', (req, res) => {
    console.log("[ROUTE_ACCESS] Root path '/' accessed.");
    res.send('LMS Edu System Backend is Running and Ready for Authentication!');
});

// Global Error Handling Middleware (Quan trọng cho việc bắt lỗi tập trung)
// Luôn đặt ở cuối cùng, sau tất cả các routes và middleware khác
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message: message,
        // Chỉ gửi stack trace trong môi trường phát triển
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

module.exports = app;