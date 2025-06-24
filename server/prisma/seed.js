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
      code: 'CNTT', // Mã khoa thực tế
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

  // Seed Instructor user
  const instructorEmail = 'instructor@phenikaa-uni.edu.vn';
  const instructorPassword = 'instructorpassword'; // Đổi mật khẩu mạnh hơn khi dùng thực tế
  const hashedInstructorPassword = await bcrypt.hash(instructorPassword, 10);

  const instructorRole = await prisma.role.findUnique({ where: { role_name: 'Instructor' } });

  if (instructorRole && deptIT) {
    // 1. Upsert user
    const instructorUser = await prisma.user.upsert({
      where: { email: instructorEmail },
      update: { password_hash: hashedInstructorPassword },
      create: {
        username: 'instructor',
        email: instructorEmail,
        password_hash: hashedInstructorPassword,
        full_name: 'Instructor User',
      },
    });

    // 2. Đảm bảo user có role Instructor (UserRole)
    await prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: instructorUser.user_id,
          role_id: instructorRole.role_id,
        },
      },
      update: {},
      create: {
        user_id: instructorUser.user_id,
        role_id: instructorRole.role_id,
      },
    });

    // 3. Upsert bảng Instructor
    await prisma.instructor.upsert({
      where: { instructor_id: instructorUser.user_id },
      update: {},
      create: {
        instructor_id: instructorUser.user_id,
        department_id: deptIT.department_id,
        academic_rank: 'Lecturer',
        office_location: 'A1-101',
        phone_number: '0123456789',
      },
    });

    console.log(`Upserted Instructor user: ${instructorUser.email}`);
  } else {
    console.error('Instructor role or department not found. Cannot seed instructor user.');
  }

  // Seed Courses
  // Lấy lại department CNTT để liên kết
  const departmentIT = await prisma.department.findUnique({ where: { dept_name: 'Khoa Công nghệ Thông tin' } });

  // Seed các học phần cơ bản
  const course1 = await prisma.course.upsert({
    where: { course_code: 'CS101' },
    update: {},
    create: {
      course_code: 'CS101',
      course_name: 'Lập trình C cơ bản',
      description: 'Nhập môn lập trình với ngôn ngữ C.',
      credits: 3,
      department_id: departmentIT.department_id,
      course_type: 'Cơ sở ngành',
      semester_applicable: '1',
    },
  });

  const course2 = await prisma.course.upsert({
    where: { course_code: 'CS102' },
    update: {},
    create: {
      course_code: 'CS102',
      course_name: 'Cấu trúc dữ liệu',
      description: 'Học về các cấu trúc dữ liệu cơ bản.',
      credits: 3,
      department_id: departmentIT.department_id,
      course_type: 'Cơ sở ngành',
      semester_applicable: '2',
    },
  });

  const course3 = await prisma.course.upsert({
    where: { course_code: 'CS201' },
    update: {},
    create: {
      course_code: 'CS201',
      course_name: 'Cơ sở dữ liệu',
      description: 'Nhập môn về hệ quản trị cơ sở dữ liệu.',
      credits: 3,
      department_id: departmentIT.department_id,
      course_type: 'Chuyên ngành',
      semester_applicable: '3',
    },
  });

  const course4 = await prisma.course.upsert({
    where: { course_code: 'CS202' },
    update: {},
    create: {
      course_code: 'CS202',
      course_name: 'Phân tích thiết kế hệ thống',
      description: 'Phân tích và thiết kế hệ thống thông tin.',
      credits: 3,
      department_id: departmentIT.department_id,
      course_type: 'Chuyên ngành',
      semester_applicable: '4',
    },
  });
  console.log('Upserted sample courses');

  // Thêm quan hệ tiên quyết: CS102 cần CS101
  await prisma.coursePrerequisite.create({
    data: {
      course_id: course2.course_id,
      prerequisite_id: course1.course_id,
    },
  });

  // Thêm quan hệ học trước: CS202 học trước CS201
  await prisma.coursePrior.create({
    data: {
      course_id: course4.course_id,
      prior_id: course3.course_id,
    },
  });

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