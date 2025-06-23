// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const prisma = require('../config/database'); // Import prisma (chỉ cần nếu bạn muốn truy vấn DB trong middleware)

// Middleware xác thực JWT
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Xác minh token với secret key
        const decoded = jwt.verify(token, jwtSecret);
        // decoded sẽ chứa { userId, roles } từ payload của JWT
        req.user = decoded; // Đính kèm thông tin user đã giải mã vào đối tượng request
        next(); // Tiếp tục đến route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access denied. Token has expired.' });
        }
        return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
};

// Middleware phân quyền dựa trên vai trò
const authorize = (allowedRoles = []) => {
    // Nếu allowedRoles không phải là mảng, chuyển đổi thành mảng (để linh hoạt)
    if (typeof allowedRoles === 'string') {
        allowedRoles = [allowedRoles];
    }


    return (req, res, next) => {
        // Kiểm tra xem đã có thông tin người dùng được đính kèm từ middleware authenticate chưa
        if (!req.user || !req.user.roles) {
            // Đây là lỗi cấu hình, authenticate phải chạy trước
            return res.status(403).json({ message: 'Forbidden. User roles not found.' });
        }

        const userRoles = req.user.roles; // Danh sách vai trò của người dùng từ JWT

        // Nếu allowedRoles rỗng, có nghĩa là bất kỳ người dùng đã xác thực nào cũng có quyền
        if (allowedRoles.length === 0) {
            return next();
        }

        // Kiểm tra xem người dùng có ít nhất một trong các vai trò được phép hay không
        const hasPermission = allowedRoles.some(role => userRoles.includes(role));

        if (hasPermission) {
            next(); // Cho phép tiếp tục
        } else {
            console.warn(`[AUTH_MIDDLEWARE_WARN] Authorization denied. User roles ${userRoles.join(', ')} do not match required roles ${allowedRoles.join(', ')}.`);
            res.status(403).json({ message: 'Forbidden. You do not have the required permissions.' });
        }
    };
};

module.exports = {
    authenticate,
    authorize,
};