// server/services/authService.js
const prisma = require('../config/database');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt');
const googleClient = require('../config/googleAuth');

/**
 * Generates a JSON Web Token for the authenticated user.
 * Includes userId and user roles in the token payload.
 * @param {object} user - The user object from Prisma, including UserRole and role.
 * @returns {string} The generated JWT.
 */
const generateAuthToken = (user) => {
    // Ensure user.UserRole is an array and each item has a role.role_name
    const roles = Array.isArray(user.UserRole) ? user.UserRole.map(r => r.role.role_name) : [];
    const token = jwt.sign(
        { userId: user.user_id, roles: roles },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
    );
    return token;
};

/**
 * Verifies a Google ID Token using the configured Google OAuth2 client.
 * @param {string} idToken - The ID token received from Google.
 * @returns {object} The decoded payload of the ID token.
 * @throws {Error} If the token is invalid or its issuer is not Google.
 */
const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const issuer = payload['iss'];
        if (issuer !== 'accounts.google.com' && issuer !== 'https://accounts.google.com') {
            throw new Error('Invalid token issuer.');
        }
        return payload;
    } catch (error) {
        throw new Error("Invalid Google ID token.");
    }
};

/**
 * Finds an existing user by email or creates a new one based on Google payload.
 * Assigns appropriate roles (Student/Instructor) based on email domain.
 * Creates related Student/Instructor records if a new user is created.
 * @param {object} googlePayload - The decoded payload from Google ID Token.
 * @returns {Promise<{user: object, created: boolean}>} An object containing the user record and a boolean indicating if a new user was created.
 * @throws {Error} If email domain is not allowed or required roles are not found.
 */
const findOrCreateUserFromGoogle = async (googlePayload) => {
    const { email, name, sub } = googlePayload; // 'sub' is Google User ID, unique to each Google user
    let user = null;
    let created = false;

    let expectedRoleName;
    if (email.endsWith('@st.phenikaa-uni.edu.vn')) {
        expectedRoleName = 'Student';
    } else if (email.endsWith('@phenikaa-uni.edu.vn')) {
        expectedRoleName = 'Instructor'; // Instructors and Admins share this domain, role will be Instructor by default
    } else {
        throw new Error('Email domain not allowed. Please use a Phenikaa University email.');
    }

    // 1. Find existing user by email
    user = await prisma.user.findUnique({
        where: { email },
        include: {
            UserRole: { include: { role: true } },
            Student: { include: { major: true } }, // Include Major for Student
            Instructor: { include: { department: true } }, // Include Department for Instructor
            Admin: true // Include Admin if any
        }
    });

    if (!user) {
        // 2. If user not found, create a new user and assign the corresponding role
        const role = await prisma.role.findUnique({
            where: { role_name: expectedRoleName },
        });

        if (!role) {
            throw new Error(`Role "${expectedRoleName}" not found. Please ensure roles are seeded correctly.`);
        }

        // Create new user (DO NOT include roles directly in create data for many-to-many)
        const newUser = await prisma.user.create({
            data: {
                username: email.split('@')[0], // Use part of email as username
                email: email,
                full_name: name || email.split('@')[0], // Use Google name or part of email
                password_hash: `GOOGLE_AUTH_${sub}`, // Mark as Google authenticated user
            },
        });

        // THEN, create the link in the UserRole join table
        await prisma.userRole.create({
            data: {
                user_id: newUser.user_id,
                role_id: role.role_id,
            },
        });

        // Create records in Students or Instructors table
        if (expectedRoleName === 'Student') {
            await prisma.student.create({
                data: {
                    student_id: newUser.user_id, // student_id is also the user_id in your schema
                    student_code: `STU${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Generate a sample student_code
                    major_id: 1, // Assume major_id=1 exists as a default
                    admission_year: new Date().getFullYear(),
                },
            });
        } else if (expectedRoleName === 'Instructor') {
            await prisma.instructor.create({
                data: {
                    instructor_id: newUser.user_id, // instructor_id is also the user_id in your schema
                    department_id: 1, // Assume department_id=1 exists as a default
                },
            });
        }
        // No explicit Admin record creation here, as it's assumed to be manual or specific flow

        // Re-fetch the user to get the full updated role information for JWT and response
        user = await prisma.user.findUnique({
            where: { user_id: newUser.user_id },
            include: {
                UserRole: { include: { role: true } },
                Student: { include: { major: true } },
                Instructor: { include: { department: true } },
                Admin: true
            }
        });

        created = true;

    } else {
        // 3. If user already exists, check and update role if necessary
        const userRoles = user.UserRole.map(r => r.role.role_name);

        if (!userRoles.includes(expectedRoleName)) {
            const roleToAdd = await prisma.role.findUnique({
                where: { role_name: expectedRoleName },
            });
            if (roleToAdd) {
                await prisma.userRole.create({
                    data: {
                        user_id: user.user_id,
                        role_id: roleToAdd.role_id,
                    },
                });
                // Re-fetch the user to get updated role information
                user = await prisma.user.findUnique({
                    where: { email },
                    include: {
                        UserRole: { include: { role: true } },
                        Student: { include: { major: true } },
                        Instructor: { include: { department: true } },
                        Admin: true
                    },
                });
            }
        }
        // Update full_name if it changed from Google (e.g., user changed their Google profile name)
        if (user.full_name !== name) {
            user = await prisma.user.update({
                where: { user_id: user.user_id },
                data: { full_name: name },
                include: {
                    UserRole: { include: { role: true } },
                    Student: { include: { major: true } },
                    Instructor: { include: { department: true } },
                    Admin: true
                },
            });
        }
    }

    return { user, created };
};

module.exports = {
    generateAuthToken,
    verifyGoogleToken,
    findOrCreateUserFromGoogle,
    googleClient,
};