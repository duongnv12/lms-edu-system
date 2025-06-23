// server/controllers/courseController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy tất cả các học phần
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                department: true,
                prerequisites: {
                    include: {
                        prerequisite: { select: { course_id: true, course_name: true, course_code: true } }
                    }
                },
                priors: {
                    include: {
                        prior: { select: { course_id: true, course_name: true, course_code: true } }
                    }
                },
            },
            orderBy: { course_code: 'asc' },
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy chi tiết 1 học phần
exports.getCourseById = async (req, res) => {
    try {
        const course = await prisma.course.findUnique({
            where: { course_id: req.params.id },
            include: {
                department: true,
                prerequisites: {
                    include: {
                        prerequisite: { select: { course_id: true, course_name: true, course_code: true } }
                    }
                },
                priors: {
                    include: {
                        prior: { select: { course_id: true, course_name: true, course_code: true } }
                    }
                },
            },
        });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo mới học phần
exports.createCourse = async (req, res) => {
    try {
        const data = req.body;
        // Tách các trường liên kết many-to-many
        const { prerequisite_ids = [], prior_ids = [], ...courseData } = data;
        // Tạo course trước
        const course = await prisma.course.create({ data: courseData });
        // Tạo liên kết tiên quyết
        for (const pid of prerequisite_ids) {
            await prisma.coursePrerequisite.create({
                data: { course_id: course.course_id, prerequisite_id: pid }
            });
        }
        // Tạo liên kết học trước
        for (const pid of prior_ids) {
            await prisma.coursePrior.create({
                data: { course_id: course.course_id, prior_id: pid }
            });
        }
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cập nhật học phần
exports.updateCourse = async (req, res) => {
    try {
        const data = req.body;
        const { prerequisite_ids = [], prior_ids = [] } = data;
        // Chỉ lấy các trường hợp lệ cho Prisma
        const updateData = {
            course_code: data.course_code,
            course_name: data.course_name,
            credits: data.credits,
            department_id: data.department_id,
            course_type: data.course_type,
            semester_applicable: data.semester_applicable,
            description: data.description
        };
        // Cập nhật course
        const course = await prisma.course.update({
            where: { course_id: req.params.id },
            data: updateData,
        });
        // Xóa hết liên kết cũ
        await prisma.coursePrerequisite.deleteMany({ where: { course_id: course.course_id } });
        await prisma.coursePrior.deleteMany({ where: { course_id: course.course_id } });
        // Tạo lại liên kết mới
        for (const pid of prerequisite_ids) {
            await prisma.coursePrerequisite.create({
                data: { course_id: course.course_id, prerequisite_id: pid }
            });
        }
        for (const pid of prior_ids) {
            await prisma.coursePrior.create({
                data: { course_id: course.course_id, prior_id: pid }
            });
        }
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Xóa học phần
exports.deleteCourse = async (req, res) => {
    try {
        await prisma.course.delete({ where: { course_id: req.params.id } });
        res.json({ message: 'Course deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
