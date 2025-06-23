// server/app.js
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

// Load environment variables (đảm bảo nó được gọi ở đây hoặc server.js)
require('dotenv').config();

console.log("[APP_CONFIG] Loading application configurations...");

// Middlewares toàn cục
app.use(express.json()); // Để phân tích cú pháp JSON trong request body
console.log("[APP_CONFIG] express.json() middleware applied.");

app.use(express.urlencoded({ extended: true })); // Để phân tích cú pháp URL-encoded data (nếu có form data)
console.log("[APP_CONFIG] express.urlencoded() middleware applied.");

// Cấu hình CORS để cho phép frontend truy cập
app.use(cors({
  origin: process.env.FRONTEND_URL, // Chỉ cho phép frontend của chúng ta truy cập
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Cho phép gửi cookies/headers xác thực
}));
console.log(`[APP_CONFIG] CORS middleware applied. Origin allowed: ${process.env.FRONTEND_URL}`);

// API Routes
app.use('/api/auth', authRoutes); // Các routes liên quan đến xác thực
console.log("[APP_CONFIG] Auth routes mounted at /api/auth.");


// Basic route for testing server status
app.get('/', (req, res) => {
    console.log("[ROUTE_ACCESS] Root path '/' accessed.");
    res.send('LMS Edu System Backend is Running and Ready for Authentication!');
});

// Global Error Handling Middleware (Quan trọng cho việc bắt lỗi tập trung)
// Luôn đặt ở cuối cùng, sau tất cả các routes và middleware khác
app.use((err, req, res, next) => {
    console.error(`[GLOBAL_ERROR] An unhandled error occurred:`, err.message);
    console.error(`[GLOBAL_ERROR] Stack trace:`, err.stack); // Ghi log stack trace của lỗi
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message: message,
        // Chỉ gửi stack trace trong môi trường phát triển
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});
console.log("[APP_CONFIG] Global error handler applied.");


module.exports = app;