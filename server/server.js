// server/server.js
require('dotenv').config(); // Đảm bảo biến môi trường được tải
const app = require('./app');
const PORT = process.env.PORT || 5000; // Đảm bảo cổng được lấy đúng

// Thêm log trước khi cố gắng lắng nghe cổng
console.log(`[SERVER_INIT] Attempting to start server on port ${PORT}...`);

app.listen(PORT, () => {
    // Log khi server khởi động thành công
    console.log(`[SERVER_READY] Server is running successfully on port ${PORT}`);
    console.log(`[SERVER_READY] Access backend at: http://localhost:${PORT}`);
}).on('error', (err) => {
    // Bắt lỗi nếu cổng đã bị chiếm hoặc các lỗi khác khi lắng nghe
    console.error(`[SERVER_ERROR] Failed to start server on port ${PORT}:`, err.message);
    if (err.code === 'EADDRINUSE') {
        console.error(`[SERVER_ERROR] Port ${PORT} is already in use. Please check if another process is running or try a different port.`);
    }
    process.exit(1); // Thoát ứng dụng nếu không thể khởi động server
});