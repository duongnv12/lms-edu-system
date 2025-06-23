// server/config/jwt.js
require('dotenv').config({ path: './.env' }); // Tải biến môi trường nếu chạy độc lập

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};