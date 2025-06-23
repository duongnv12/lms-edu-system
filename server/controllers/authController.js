// server/controllers/authController.js
const authService = require('../services/authService');
const prisma = require('../config/database'); // Import prisma để lấy thông tin user chi tiết
const bcrypt = require('bcryptjs');

// Endpoint để khởi tạo quá trình đăng nhập Google.
const googleAuth = (req, res) => {
    try {
        const authUrl = authService.googleClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
            prompt: 'consent',
        });
        res.redirect(authUrl);
    } catch (error) {
        res.status(500).json({ message: 'Could not initiate Google authentication.' });
    }
};

// Callback endpoint từ Google sau khi người dùng xác thực thành công
const googleAuthCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('Authorization code not provided or user denied.')}`
        );
    }

    try {
        const { tokens } = await authService.googleClient.getToken(code);
        const idToken = tokens.id_token;

        if (!idToken) {
            throw new Error('Google did not return an ID token.');
        }

        const googlePayload = await authService.verifyGoogleToken(idToken);
        const { user } = await authService.findOrCreateUserFromGoogle(googlePayload);
        const token = authService.generateAuthToken(user);

        const rolesString = user.UserRole.map(r => r.role.role_name).join(',');
        const frontendRedirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${user.user_id}&email=${user.email}&fullName=${encodeURIComponent(user.full_name)}&roles=${rolesString}`;

        res.redirect(frontendRedirectUrl);

    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
    }
};

// Endpoint để lấy thông tin của người dùng hiện đang đăng nhập
const getMe = async (req, res) => {
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
                Student: {
                    select: {
                        student_code: true,
                        current_gpa: true,
                        total_credits_earned: true,
                        major: { select: { major_name: true } }
                    }
                },
                Instructor: {
                    select: {
                        academic_rank: true,
                        department: { select: { dept_name: true } }
                    }
                },
                Admin: {
                    select: {
                        admin_id: true
                    }
                }
            }
        });

        if (!userDetails) {
            return res.status(404).json({ message: 'User not found.' });
        }

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

        if (userDetails.Student) {
            responseUser.studentCode = userDetails.Student.student_code;
            responseUser.currentGpa = userDetails.Student.current_gpa;
            responseUser.totalCreditsEarned = userDetails.Student.total_credits_earned;
            responseUser.major = userDetails.Student.major ? userDetails.Student.major.major_name : null;
        }

        if (userDetails.Instructor) {
            responseUser.instructorId = userId;
            responseUser.academicRank = userDetails.Instructor.academic_rank;
            responseUser.department = userDetails.Instructor.department ? userDetails.Instructor.department.dept_name : null;
        }

        res.status(200).json({ user: responseUser });

    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user information.' });
    }
};

// Đăng nhập truyền thống (email + password)
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    try {
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

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

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
        res.status(500).json({ message: 'Đăng nhập thất bại.' });
    }
};

// Endpoint để cập nhật thông tin cá nhân (PATCH)
const updateProfile = async (req, res) => {
    const { fullName, phone, address, dateOfBirth } = req.body;
    const userId = req.user.userId;

    if (!fullName && !phone && !address && !dateOfBirth) {
        return res.status(400).json({ message: 'Không có thông tin nào để cập nhật.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        const updatedData = {};
        if (fullName) updatedData.full_name = fullName;
        if (phone !== undefined) updatedData.phone_number = phone;
        if (address !== undefined) updatedData.address = address;
        if (dateOfBirth) {
            updatedData.date_of_birth = new Date(dateOfBirth);
        }

        const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: updatedData,
            select: {
                user_id: true,
                email: true,
                full_name: true,
                phone_number: true,
                address: true,
                date_of_birth: true,
            }
        });

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
        res.status(500).json({ message: 'Cập nhật hồ sơ thất bại.' });
    }
};

// Endpoint để đổi mật khẩu
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { user_id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        if (user.password_hash && user.password_hash.startsWith('GOOGLE_AUTH_')) {
            return res.status(403).json({ message: 'Không thể đổi mật khẩu cho tài khoản Google đã đăng nhập.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where: { user_id: userId },
            data: { password_hash: user.password_hash }
        });

        res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công!' });

    } catch (error) {
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
