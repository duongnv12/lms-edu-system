-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "curriculum_id" UUID;

-- CreateTable
CREATE TABLE "Curriculum" (
    "curriculum_id" UUID NOT NULL,
    "curriculum_code" VARCHAR(20) NOT NULL,
    "curriculum_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "major_id" INTEGER NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "total_credits" INTEGER NOT NULL,
    "min_gpa" DECIMAL(3,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "effective_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("curriculum_id")
);

-- CreateTable
CREATE TABLE "CurriculumCourse" (
    "curriculum_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "semester_suggested" INTEGER NOT NULL,
    "year_suggested" INTEGER NOT NULL,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT true,
    "course_group" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurriculumCourse_pkey" PRIMARY KEY ("curriculum_id","course_id")
);

-- CreateTable
CREATE TABLE "CurriculumRequirement" (
    "requirement_id" UUID NOT NULL,
    "curriculum_id" UUID NOT NULL,
    "requirement_type" VARCHAR(50) NOT NULL,
    "requirement_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "value" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumRequirement_pkey" PRIMARY KEY ("requirement_id")
);

-- CreateTable
CREATE TABLE "StudentProgress" (
    "progress_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "curriculum_id" UUID NOT NULL,
    "completed_credits" INTEGER NOT NULL DEFAULT 0,
    "current_gpa" DECIMAL(3,2),
    "completion_percentage" DECIMAL(5,2),
    "expected_graduation_date" DATE,
    "status" VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProgress_pkey" PRIMARY KEY ("progress_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_curriculum_code_key" ON "Curriculum"("curriculum_code");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProgress_student_id_curriculum_id_key" ON "StudentProgress"("student_id", "curriculum_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "Curriculum"("curriculum_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "Major"("major_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumCourse" ADD CONSTRAINT "CurriculumCourse_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "Curriculum"("curriculum_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumCourse" ADD CONSTRAINT "CurriculumCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumRequirement" ADD CONSTRAINT "CurriculumRequirement_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "Curriculum"("curriculum_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProgress" ADD CONSTRAINT "StudentProgress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProgress" ADD CONSTRAINT "StudentProgress_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "Curriculum"("curriculum_id") ON DELETE RESTRICT ON UPDATE CASCADE;
