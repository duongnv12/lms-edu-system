// server/controllers/authController.js
const authService = require('../services/authService');
const prisma = require('../config/database'); // Import prisma để lấy thông tin user chi tiết
const bcrypt = require('bcryptjs');

// Endpoint để khởi tạo quá trình đăng nhập Google.
const googleAuth = (req, res) => {
    console.log("[AUTH_CONTROLLER] /api/auth/google endpoint hit. Initiating Google OAuth flow.");
    try {
        const authUrl = authService.googleClient.generateAuthUrl({
            access_type: 'offline', // Có thể yêu cầu refresh token cho quyền truy cập liên tục
            scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
            prompt: 'consent', // Luôn yêu cầu người dùng đồng ý (hữu ích trong phát triển)
        });
        console.log(`[AUTH_CONTROLLER] Redirecting to Google Auth URL: ${authUrl}`);
        res.redirect(authUrl); // Chuyển hướng trình duyệt của người dùng đến Google
    } catch (error) {
        console.error('[AUTH_CONTROLLER_ERROR] Error generating Google Auth URL:', error.message);
        res.status(500).json({ message: 'Could not initiate Google authentication.' });
    }
};

// Callback endpoint từ Google sau khi người dùng xác thực thành công
const googleAuthCallback = async (req, res) => {
    const { code } = req.query;
    console.log(`[AUTH_CONTROLLER] /api/auth/google/callback endpoint hit. Received code: ${code ? 'Yes' : 'No'}`);

    if (!code) {
        // Nếu không có mã, có thể người dùng từ chối hoặc có lỗi
        console.error('Google Auth Callback: Authorization code not provided.');
        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('Authorization code not provided or user denied.')}`
        );
    }

    try {
        // 1. Trao đổi mã ủy quyền với Google để lấy token
        console.log("[AUTH_CONTROLLER] Exchanging authorization code for tokens...");
        const { tokens } = await authService.googleClient.getToken(code);
        const idToken = tokens.id_token;
        console.log(`[AUTH_CONTROLLER] Received ID Token: ${idToken ? 'Yes' : 'No'}`);


        if (!idToken) {
            console.error('[AUTH_CONTROLLER_ERROR] Google did not return an ID token.');
            throw new Error('Google did not return an ID token.');
        }

        // 2. Xác minh ID Token và lấy thông tin người dùng từ payload
        console.log("[AUTH_CONTROLLER] Verifying Google ID token and getting payload...");
        const googlePayload = await authService.verifyGoogleToken(idToken);
        console.log(`[AUTH_CONTROLLER] Google Payload received for email: ${googlePayload.email}`);

        // 3. Tìm hoặc tạo người dùng trong cơ sở dữ liệu của chúng ta
        console.log("[AUTH_CONTROLLER] Finding or creating user in database...");
        const { user } = await authService.findOrCreateUserFromGoogle(googlePayload);
        console.log(`[AUTH_CONTROLLER] User processed: ${user.user_id}, Roles: ${user.UserRole.map(r => r.role.role_name).join(',')}`);


        // 4. Tạo JWT của riêng chúng ta
        console.log("[AUTH_CONTROLLER] Generating local JWT...");
        const token = authService.generateAuthToken(user);
        console.log(`[AUTH_CONTROLLER] JWT generated: ${token ? 'Yes' : 'No'}`);


        // 5. Chuyển hướng người dùng về frontend với token và thông tin user trong URL query parameters
        // Frontend sẽ đọc các tham số này để hoàn tất đăng nhập
        const rolesString = user.UserRole.map(r => r.role.role_name).join(','); // Chuyển mảng roles thành chuỗi
        const frontendRedirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${user.user_id}&email=${user.email}&fullName=${encodeURIComponent(user.full_name)}&roles=${rolesString}`;

        console.log(`[AUTH_CONTROLLER] Redirecting to frontend URL: ${frontendRedirectUrl}`);
        res.redirect(frontendRedirectUrl);

    } catch (error) {
        console.error('[AUTH_CONTROLLER_ERROR] Google Auth Callback Error:', error.message);
        // Chuyển hướng về trang đăng nhập của frontend với thông báo lỗi
        res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
    }
};

// Endpoint để lấy thông tin của người dùng hiện đang đăng nhập
// Yêu cầu token JWT hợp lệ trong header Authorization
const getMe = async (req, res) => {
    console.log(`[AUTH_CONTROLLER] /api/auth/me endpoint hit. User ID from token: ${req.user.userId}`);
    try {
        const userId = req.user.userId;
        const roles = req.user.roles;

        const userDetails = await prisma.user.findUnique({
            where: { user_id: userId },
            select: {
                email: true,
                full_name: true,
                date_of_birth: true,
                phone_number: true,
                address: true,
                is_active: true,
                password_hash: true,
                Student: { // Đây là mối quan hệ 1-1, sẽ trả về đối tượng hoặc null
                    select: {
                        student_code: true,
                        current_gpa: true,
                        total_credits_earned: true,
                        major: { select: { major_name: true } }
                    }
                },
                Instructor: { // Đây là mối quan hệ 1-1, sẽ trả về đối tượng hoặc null
                    select: {
                        academic_rank: true,
                        department: { select: { dept_name: true } } // ĐÃ SỬA: department_name thành dept_name
                    }
                },
                Admin: { // Đây là mối quan hệ 1-1, sẽ trả về đối tượng hoặc null
                    select: {
                        admin_id: true
                    }
                }
            }
        });

        if (!userDetails) {
            console.warn(`[AUTH_CONTROLLER_WARN] User details not found for ID: ${userId}`);
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log(`[AUTH_CONTROLLER] User details fetched for ${userDetails.email}`);

        const isGoogleUser = userDetails.password_hash && userDetails.password_hash.startsWith('GOOGLE_AUTH_');

        const responseUser = {
            user_id: userId,
            email: userDetails.email,
            fullName: userDetails.full_name,
            roles: roles,
            phone: userDetails.phone_number,
            address: userDetails.address,
            isGoogleUser: isGoogleUser,
            dateOfBirth: userDetails.date_of_birth,
        };

        // --- ĐIỀU CHỈNH TẠI ĐÂY ---
        // Access trực tiếp userDetails.Student (không dùng [0])
        if (userDetails.Student) { // Kiểm tra nếu có thông tin Student
            responseUser.studentCode = userDetails.Student.student_code; // Đổi studentId thành studentCode
            responseUser.currentGpa = userDetails.Student.current_gpa;
            responseUser.totalCreditsEarned = userDetails.Student.total_credits_earned;
            responseUser.major = userDetails.Student.major ? userDetails.Student.major.major_name : null;
        }

        // Access trực tiếp userDetails.Instructor (không dùng [0])
        if (userDetails.Instructor) { // Kiểm tra nếu có thông tin Instructor
            // student_id và instructor_id trong schema của bạn là PK đồng thời là FK đến user_id
            // Do đó, instructor_id của bản ghi Instructor chính là user_id
            responseUser.instructorId = userId; // Gán trực tiếp userId
            responseUser.academicRank = userDetails.Instructor.academic_rank;
            responseUser.department = userDetails.Instructor.department ? userDetails.Instructor.department.dept_name : null; // ĐÃ SỬA: Dùng dept_name
        }
        // Admin chỉ cần vai trò là đủ

        res.status(200).json({ user: responseUser });

    } catch (error) {
        console.error('[AUTH_CONTROLLER_ERROR] Error fetching user info (getMe):', error.message);
        res.status(500).json({ message: 'Failed to retrieve user information.' });
    }
};


// Đăng nhập truyền thống (email + password)
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH_CONTROLLER] Traditional login attempt for email: ${email}`);

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    try {
        // Tìm user theo email
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                UserRole: { include: { role: true } },
                Student: true,
                Instructor: true,
                Admin: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // So sánh password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Tạo JWT
        const token = require('../services/authService').generateAuthToken(user);

        res.json({
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                roles: user.UserRole.map(r => r.role.role_name),
            }
        });
    } catch (error) {
        console.error('[AUTH_CONTROLLER_ERROR] Traditional login error:', error.message);
        res.status(500).json({ message: 'Đăng nhập thất bại.' });
    }
};

// Endpoint để cập nhật thông tin cá nhân (PATCH)
const updateProfile = async (req, res) => {
    console.log(`[AUTH_CONTROLLER] Update profile hit for user ID: ${req.user.userId}`);
    const { fullName, phone, address, dateOfBirth } = req.body; // Các trường có thể cập nhật
    const userId = req.user.userId;

    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!fullName && !phone && !address && !dateOfBirth) {
        return res.status(400).json({ message: 'Không có thông tin nào để cập nhật.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { user_id: userId } });

        if (!user) {
            console.warn(`[AUTH_CONTROLLER_WARN] User not found for profile update: ${userId}`);
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        const updatedData = {};
        if (fullName) updatedData.full_name = fullName;
        if (phone !== undefined) updatedData.phone_number = phone; // Cho phép cập nhật thành null/empty
        if (address !== undefined) updatedData.address = address; // Cho phép cập nhật thành null/empty
        if (dateOfBirth) {
            // Validate and parse dateOfBirth if necessary
            // For simplicity, assuming it's a valid date string or Date object
            updatedData.date_of_birth = new Date(dateOfBirth);
        }

        const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: updatedData,
            select: { // Chỉ trả về các trường cần thiết sau khi cập nhật
                user_id: true,
                email: true,
                full_name: true,
                phone_number: true,
                address: true,
                date_of_birth: true,
            }
        });

        // Nếu bạn muốn JWT cập nhật với các thông tin mới, bạn có thể tạo lại token ở đây
        // Nhưng thường thì chỉ cần trả về thông tin user mới cập nhật là đủ.
        // Frontend sẽ gọi lại /me để có thông tin đầy đủ nếu cần.

        res.status(200).json({
            message: 'Hồ sơ đã được cập nhật thành công!',
            user: {
                userId: updatedUser.user_id,
                fullName: updatedUser.full_name,
                email: updatedUser.email,
                phone: updatedUser.phone_number,
                address: updatedUser.address,
                dateOfBirth: updatedUser.date_of_birth,
            }
        });

    } catch (error) {
        console.error('[AUTH_CONTROLLER_ERROR] Error updating profile:', error.message);
        res.status(500).json({ message: 'Cập nhật hồ sơ thất bại.' });
    }
};

// Endpoint để đổi mật khẩu
const changePassword = async (req, res) => {
    console.log(`[AUTH_CONTROLLER] Change password hit for user ID: ${req.user.userId}`);
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
    }
    if (newPassword.length < 6) { // Kiểm tra độ dài mật khẩu mới
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { user_id: userId }
        });

        if (!user) {
            console.warn(`[AUTH_CONTROLLER_WARN] User not found for password change: ${userId}`);
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Ngăn chặn đổi mật khẩu cho tài khoản Google đã tạo tự động
        if (user.password_hash && user.password_hash.startsWith('GOOGLE_AUTH_')) {
            return res.status(403).json({ message: 'Không thể đổi mật khẩu cho tài khoản Google đã đăng nhập.' });
        }

        // So sánh mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });
        }

        // Hash mật khẩu mới và cập nhật
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where: { user_id: userId },
            data: { password_hash: user.password_hash }
        });

        res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công!' });

    } catch (error) {
        console.error('[AUTH_CONTROLLER_ERROR] Error changing password:', error.message);
        res.status(500).json({ message: 'Đổi mật khẩu thất bại.' });
    }
};

module.exports = {
    googleAuth,
    googleAuthCallback,
    getMe,
    login,
    updateProfile,
    changePassword,
};