// server/config/googleAuth.js
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config({ path: './.env' }); // Tải biến môi trường nếu chạy độc lập

console.log("[GOOGLE_AUTH_CONFIG] Initializing Google OAuth Client...");
console.log(`[GOOGLE_AUTH_CONFIG] GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'Loaded' : 'NOT LOADED'}`);
console.log(`[GOOGLE_AUTH_CONFIG] GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? 'Loaded' : 'NOT LOADED'}`);
console.log(`[GOOGLE_AUTH_CONFIG] GOOGLE_REDIRECT_URI: ${process.env.GOOGLE_REDIRECT_URI || 'NOT SET'}`);


const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

module.exports = googleClient;