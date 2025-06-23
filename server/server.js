// server/server.js
require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 5000;

// Helper for colored log
const color = (msg, code) => `\x1b[${code}m${msg}\x1b[0m`;

app.listen(PORT, () => {
    // Thông báo thành công với màu xanh lá
    console.log(color(`Server is running successfully on port ${PORT}`, '32'));
    console.log(color(`Access backend at: http://localhost:${PORT}`, '36'));
}).on('error', (err) => {
    // Thông báo lỗi với màu đỏ
    console.error(color(`Failed to start server on port ${PORT}: ${err.message}`, '31'));
    if (err.code === 'EADDRINUSE') {
        console.error(color(`Port ${PORT} is already in use. Please check if another process is running or try a different port.`, '31'));
    }
    process.exit(1);
});