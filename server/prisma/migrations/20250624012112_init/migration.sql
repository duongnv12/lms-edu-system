-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255),
    "date_of_birth" DATE,
    "phone_number" VARCHAR(20),
    "address" VARCHAR(255),
    "profile_picture" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "user_id" UUID NOT NULL,
    "role_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "Major" (
    "major_id" SERIAL NOT NULL,
    "major_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("major_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "student_id" UUID NOT NULL,
    "student_code" VARCHAR(20) NOT NULL,
    "major_id" INTEGER NOT NULL,
    "admission_year" INTEGER NOT NULL,
    "current_gpa" DECIMAL(3,2),
    "total_credits_earned" INTEGER DEFAULT 0,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "department_id" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "dept_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "instructor_id" UUID NOT NULL,
    "department_id" INTEGER NOT NULL,
    "academic_rank" VARCHAR(100),
    "office_location" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("instructor_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" UUID NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Course" (
    "course_id" UUID NOT NULL,
    "course_code" VARCHAR(20) NOT NULL,
    "course_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "credits" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "course_type" VARCHAR(50),
    "semester_applicable" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "CoursePrerequisite" (
    "course_id" UUID NOT NULL,
    "prerequisite_id" UUID NOT NULL,

    CONSTRAINT "CoursePrerequisite_pkey" PRIMARY KEY ("course_id","prerequisite_id")
);

-- CreateTable
CREATE TABLE "CoursePrior" (
    "course_id" UUID NOT NULL,
    "prior_id" UUID NOT NULL,

    CONSTRAINT "CoursePrior_pkey" PRIMARY KEY ("course_id","prior_id")
);

-- CreateTable
CREATE TABLE "Section" (
    "section_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "instructor_id" UUID NOT NULL,
    "section_code" VARCHAR(20) NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "semester" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "enrollment_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Enrolled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignment_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "max_score" INTEGER NOT NULL,
    "assignment_type" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submission_id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "submission_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_url" VARCHAR(255),
    "text_content" TEXT,
    "score" DECIMAL(5,2),
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "grade_id" UUID NOT NULL,
    "enrollment_id" UUID NOT NULL,
    "assignment_id" UUID,
    "score" DECIMAL(5,2) NOT NULL,
    "graded_by" UUID NOT NULL,
    "grade_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "section_id" UUID NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("grade_id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "lecture_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "lecture_date" TIMESTAMP(3) NOT NULL,
    "file_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("lecture_id")
);

-- CreateTable
CREATE TABLE "_RolePermissions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RolePermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_permission_name_key" ON "Permission"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Major_major_name_key" ON "Major"("major_name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_code_key" ON "Student"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Department_dept_name_key" ON "Department"("dept_name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_course_code_key" ON "Course"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "Section_section_code_key" ON "Section"("section_code");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_student_id_section_id_key" ON "Enrollment"("student_id", "section_id");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assignment_id_student_id_key" ON "Submission"("assignment_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_enrollment_id_assignment_id_key" ON "Grade"("enrollment_id", "assignment_id");

-- CreateIndex
CREATE INDEX "_RolePermissions_B_index" ON "_RolePermissions"("B");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "Major"("major_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrerequisite" ADD CONSTRAINT "CoursePrerequisite_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrerequisite" ADD CONSTRAINT "CoursePrerequisite_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrior" ADD CONSTRAINT "CoursePrior_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrior" ADD CONSTRAINT "CoursePrior_prior_id_fkey" FOREIGN KEY ("prior_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "Instructor"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("assignment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "Enrollment"("enrollment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("assignment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "Instructor"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;
