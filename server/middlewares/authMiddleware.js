// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const prisma = require('../config/database'); // Import prisma (chỉ cần nếu bạn muốn truy vấn DB trong middleware)

// Middleware xác thực JWT
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`[AUTH_MIDDLEWARE] Received Authorization header: ${authHeader ? 'Yes' : 'No'}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('[AUTH_MIDDLEWARE_WARN] No Bearer token found in Authorization header.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    console.log(`[AUTH_MIDDLEWARE] Extracted token: ${token ? token.substring(0, 20) + '...' : 'None'}`); // Log phần đầu token

    try {
        // Xác minh token với secret key
        const decoded = jwt.verify(token, jwtSecret);
        // decoded sẽ chứa { userId, roles } từ payload của JWT
        req.user = decoded; // Đính kèm thông tin user đã giải mã vào đối tượng request
        console.log(`[AUTH_MIDDLEWARE] Token verified for user ID: ${req.user.userId}, Roles: ${req.user.roles.join(',')}`);
        next(); // Tiếp tục đến route handler
    } catch (err) {
        console.error(`[AUTH_MIDDLEWARE_ERROR] JWT Verification failed: ${err.name} - ${err.message}`);
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
    console.log(`[AUTH_MIDDLEWARE] Authorize middleware activated. Required roles: ${allowedRoles.length > 0 ? allowedRoles.join(', ') : 'Any authenticated user'}`);


    return (req, res, next) => {
        // Kiểm tra xem đã có thông tin người dùng được đính kèm từ middleware authenticate chưa
        if (!req.user || !req.user.roles) {
            console.error('[AUTH_MIDDLEWARE_ERROR] Authorize failed: User or roles not found in request. Ensure authenticate middleware runs first.');
            // Đây là lỗi cấu hình, authenticate phải chạy trước
            return res.status(403).json({ message: 'Forbidden. User roles not found.' });
        }

        const userRoles = req.user.roles; // Danh sách vai trò của người dùng từ JWT
        console.log(`[AUTH_MIDDLEWARE] User roles for authorization: ${userRoles.join(', ')}`);

        // Nếu allowedRoles rỗng, có nghĩa là bất kỳ người dùng đã xác thực nào cũng có quyền
        if (allowedRoles.length === 0) {
            return next();
        }

        // Kiểm tra xem người dùng có ít nhất một trong các vai trò được phép hay không
        const hasPermission = allowedRoles.some(role => userRoles.includes(role));

        if (hasPermission) {
            console.log(`[AUTH_MIDDLEWARE] Authorization granted. User has required role.`);
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