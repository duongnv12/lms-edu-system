// server/config/googleAuth.js
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config({ path: './.env' }); // Tải biến môi trường nếu chạy độc lập

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

module.exports = googleClient;