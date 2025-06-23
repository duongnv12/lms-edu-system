// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Seed Roles
  const roles = [
    { role_name: 'Admin', description: 'System Administrator' },
    { role_name: 'Instructor', description: 'Course Instructor' },
    { role_name: 'Student', description: 'Registered Student' },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { role_name: roleData.role_name },
      update: {},
      create: roleData,
    });
    console.log(`Upserted role: ${roleData.role_name}`);
  }

  // Seed Departments
  const deptIT = await prisma.department.upsert({
    where: { dept_name: 'Khoa Công nghệ Thông tin' },
    update: {},
    create: {
      dept_name: 'Khoa Công nghệ Thông tin',
      description: 'Khoa chuyên về các lĩnh vực công nghệ thông tin.',
    },
  });
  console.log(`Upserted Department: ${deptIT.dept_name}`);

  // Seed Majors
  const majorIT = await prisma.major.upsert({
    where: { major_name: 'Công nghệ Thông tin' },
    update: {},
    create: {
      major_name: 'Công nghệ Thông tin',
      description: 'Ngành học về phát triển phần mềm, mạng máy tính, hệ thống thông tin.',
    },
  });
  console.log(`Upserted Major: ${majorIT.major_name}`);

  // Optional: Seed an initial Admin user for traditional login (if you plan to implement it)
  const adminEmail = 'admin@phenikaa-uni.edu.vn';
  const adminPassword = 'adminpassword'; // Thay đổi mật khẩu mạnh hơn trong thực tế
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminRole = await prisma.role.findUnique({ where: { role_name: 'Admin' } });

  if (adminRole) {
    // 1. Upsert user
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password_hash: hashedPassword },
      create: {
        username: 'admin',
        email: adminEmail,
        password_hash: hashedPassword,
        full_name: 'Admin User',
      },
    });

    // 2. Đảm bảo user có role Admin (UserRole)
    await prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: adminUser.user_id,
          role_id: adminRole.role_id,
        },
      },
      update: {},
      create: {
        user_id: adminUser.user_id,
        role_id: adminRole.role_id,
      },
    });

    // 3. Upsert bảng Admin
    await prisma.admin.upsert({
      where: { admin_id: adminUser.user_id },
      update: {},
      create: {
        admin_id: adminUser.user_id,
      },
    });

    console.log(`Upserted Admin user: ${adminUser.email}`);
  } else {
    console.error('Admin role not found. Cannot seed admin user.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });