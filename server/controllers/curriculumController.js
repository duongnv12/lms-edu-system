const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all curriculums with pagination and filters
const getCurriculums = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            major_id,
            version,
            is_active
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build where condition
        const where = {
            ...(search && {
                OR: [
                    { curriculum_name: { contains: search, mode: 'insensitive' } },
                    { curriculum_code: { contains: search, mode: 'insensitive' } },
                    { version: { contains: search, mode: 'insensitive' } }
                ]
            }),
            ...(major_id && { major_id: parseInt(major_id) }),
            ...(version && { version: { contains: version, mode: 'insensitive' } }),
            ...(is_active !== undefined && { is_active: is_active === 'true' })
        };

        const [curriculums, total] = await Promise.all([
            prisma.curriculum.findMany({
                where,
                skip,
                take,
                include: {
                    major: true,
                    _count: {
                        select: {
                            students: true,
                            curriculumCourses: true,
                            requirements: true
                        }
                    }
                },
                orderBy: [
                    { is_active: 'desc' },
                    { created_at: 'desc' }
                ]
            }),
            prisma.curriculum.count({ where })
        ]);

        res.json({
            success: true,
            data: curriculums,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching curriculums:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching curriculums',
            error: error.message
        });
    }
};

// Get curriculum by ID
const getCurriculumById = async (req, res) => {
    try {
        const { id } = req.params;

        const curriculum = await prisma.curriculum.findUnique({
            where: { curriculum_id: id },
            include: {
                major: true,
                curriculumCourses: {
                    include: {
                        course: {
                            include: {
                                department: true
                            }
                        }
                    },
                    orderBy: [
                        { year_suggested: 'asc' },
                        { semester_suggested: 'asc' }
                    ]
                },
                requirements: {
                    orderBy: { requirement_type: 'asc' }
                },
                _count: {
                    select: {
                        students: true
                    }
                }
            }
        });

        if (!curriculum) {
            return res.status(404).json({
                success: false,
                message: 'Curriculum not found'
            });
        }

        res.json({
            success: true,
            data: curriculum
        });
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching curriculum',
            error: error.message
        });
    }
};

// Create new curriculum
const createCurriculum = async (req, res) => {
    try {
        const {
            curriculum_code,
            curriculum_name,
            description,
            major_id,
            version,
            academic_year,
            total_credits,
            min_gpa,
            effective_date,
            courses = [], // Array of course assignments
            requirements = [] // Array of requirements
        } = req.body;

        // Check if curriculum code already exists
        const existingCurriculum = await prisma.curriculum.findUnique({
            where: { curriculum_code }
        });

        if (existingCurriculum) {
            return res.status(400).json({
                success: false,
                message: 'Curriculum code already exists'
            });
        }

        // Create curriculum with related data in transaction
        const curriculum = await prisma.$transaction(async (tx) => {
            // Create curriculum
            const newCurriculum = await tx.curriculum.create({
                data: {
                    curriculum_code,
                    curriculum_name,
                    description,
                    major_id: parseInt(major_id),
                    version,
                    academic_year: parseInt(academic_year),
                    total_credits: parseInt(total_credits),
                    min_gpa: min_gpa ? parseFloat(min_gpa) : null,
                    effective_date: new Date(effective_date)
                }
            });

            // Add courses to curriculum
            if (courses.length > 0) {
                await tx.curriculumCourse.createMany({
                    data: courses.map(course => ({
                        curriculum_id: newCurriculum.curriculum_id,
                        course_id: course.course_id,
                        semester_suggested: parseInt(course.semester_suggested),
                        year_suggested: parseInt(course.year_suggested),
                        is_mandatory: course.is_mandatory !== false,
                        course_group: course.course_group || null
                    }))
                });
            }

            // Add requirements to curriculum
            if (requirements.length > 0) {
                await tx.curriculumRequirement.createMany({
                    data: requirements.map(req => ({
                        curriculum_id: newCurriculum.curriculum_id,
                        requirement_type: req.requirement_type,
                        requirement_name: req.requirement_name,
                        description: req.description || null,
                        value: req.value
                    }))
                });
            }

            return newCurriculum;
        });

        // Fetch complete curriculum data
        const completeCurriculum = await prisma.curriculum.findUnique({
            where: { curriculum_id: curriculum.curriculum_id },
            include: {
                major: true,
                curriculumCourses: {
                    include: {
                        course: true
                    }
                },
                requirements: true
            }
        });

        res.status(201).json({
            success: true,
            data: completeCurriculum,
            message: 'Curriculum created successfully'
        });
    } catch (error) {
        console.error('Error creating curriculum:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating curriculum',
            error: error.message
        });
    }
};

// Update curriculum
const updateCurriculum = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            curriculum_code,
            curriculum_name,
            description,
            major_id,
            version,
            academic_year,
            total_credits,
            min_gpa,
            effective_date,
            is_active,
            courses = [],
            requirements = []
        } = req.body;

        // Check if curriculum exists
        const existingCurriculum = await prisma.curriculum.findUnique({
            where: { curriculum_id: id }
        });

        if (!existingCurriculum) {
            return res.status(404).json({
                success: false,
                message: 'Curriculum not found'
            });
        }

        // Check if curriculum code is unique (excluding current curriculum)
        if (curriculum_code !== existingCurriculum.curriculum_code) {
            const duplicateCurriculum = await prisma.curriculum.findUnique({
                where: { curriculum_code }
            });

            if (duplicateCurriculum) {
                return res.status(400).json({
                    success: false,
                    message: 'Curriculum code already exists'
                });
            }
        }

        // Update curriculum in transaction
        const updatedCurriculum = await prisma.$transaction(async (tx) => {
            // Update curriculum basic info
            const curriculum = await tx.curriculum.update({
                where: { curriculum_id: id },
                data: {
                    curriculum_code,
                    curriculum_name,
                    description,
                    major_id: parseInt(major_id),
                    version,
                    academic_year: parseInt(academic_year),
                    total_credits: parseInt(total_credits),
                    min_gpa: min_gpa ? parseFloat(min_gpa) : null,
                    effective_date: new Date(effective_date),
                    is_active: is_active !== undefined ? is_active : undefined
                }
            });

            // Update courses - delete existing and recreate
            await tx.curriculumCourse.deleteMany({
                where: { curriculum_id: id }
            });

            if (courses.length > 0) {
                await tx.curriculumCourse.createMany({
                    data: courses.map(course => ({
                        curriculum_id: id,
                        course_id: course.course_id,
                        semester_suggested: parseInt(course.semester_suggested),
                        year_suggested: parseInt(course.year_suggested),
                        is_mandatory: course.is_mandatory !== false,
                        course_group: course.course_group || null
                    }))
                });
            }

            // Update requirements - delete existing and recreate
            await tx.curriculumRequirement.deleteMany({
                where: { curriculum_id: id }
            });

            if (requirements.length > 0) {
                await tx.curriculumRequirement.createMany({
                    data: requirements.map(req => ({
                        curriculum_id: id,
                        requirement_type: req.requirement_type,
                        requirement_name: req.requirement_name,
                        description: req.description || null,
                        value: req.value
                    }))
                });
            }

            return curriculum;
        });

        // Fetch complete updated curriculum
        const completeCurriculum = await prisma.curriculum.findUnique({
            where: { curriculum_id: id },
            include: {
                major: true,
                curriculumCourses: {
                    include: {
                        course: true
                    }
                },
                requirements: true
            }
        });

        res.json({
            success: true,
            data: completeCurriculum,
            message: 'Curriculum updated successfully'
        });
    } catch (error) {
        console.error('Error updating curriculum:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating curriculum',
            error: error.message
        });
    }
};

// Delete curriculum
const deleteCurriculum = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if curriculum exists
        const curriculum = await prisma.curriculum.findUnique({
            where: { curriculum_id: id },
            include: {
                _count: {
                    select: {
                        students: true
                    }
                }
            }
        });

        if (!curriculum) {
            return res.status(404).json({
                success: false,
                message: 'Curriculum not found'
            });
        }

        // Check if curriculum has students
        if (curriculum._count.students > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete curriculum that has students assigned to it'
            });
        }

        // Delete curriculum and related data
        await prisma.$transaction(async (tx) => {
            // Delete requirements
            await tx.curriculumRequirement.deleteMany({
                where: { curriculum_id: id }
            });

            // Delete curriculum courses
            await tx.curriculumCourse.deleteMany({
                where: { curriculum_id: id }
            });

            // Delete curriculum
            await tx.curriculum.delete({
                where: { curriculum_id: id }
            });
        });

        res.json({
            success: true,
            message: 'Curriculum deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting curriculum:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting curriculum',
            error: error.message
        });
    }
};

// Get available courses for curriculum
const getAvailableCourses = async (req, res) => {
    try {
        const { major_id } = req.query;

        const where = major_id ? {
            department: {
                // Assuming courses from same department as major
                // You might need to adjust this logic based on your requirements
            }
        } : {};

        const courses = await prisma.course.findMany({
            where,
            include: {
                department: true
            },
            orderBy: [
                { course_code: 'asc' }
            ]
        });

        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching available courses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching available courses',
            error: error.message
        });
    }
};

// Clone curriculum (create new version)
const cloneCurriculum = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_version, new_academic_year, new_curriculum_code } = req.body;

        // Get original curriculum
        const originalCurriculum = await prisma.curriculum.findUnique({
            where: { curriculum_id: id },
            include: {
                curriculumCourses: true,
                requirements: true
            }
        });

        if (!originalCurriculum) {
            return res.status(404).json({
                success: false,
                message: 'Original curriculum not found'
            });
        }

        // Check if new curriculum code already exists
        const existingCurriculum = await prisma.curriculum.findUnique({
            where: { curriculum_code: new_curriculum_code }
        });

        if (existingCurriculum) {
            return res.status(400).json({
                success: false,
                message: 'New curriculum code already exists'
            });
        }

        // Clone curriculum
        const clonedCurriculum = await prisma.$transaction(async (tx) => {
            // Create new curriculum
            const newCurriculum = await tx.curriculum.create({
                data: {
                    curriculum_code: new_curriculum_code,
                    curriculum_name: originalCurriculum.curriculum_name,
                    description: originalCurriculum.description,
                    major_id: originalCurriculum.major_id,
                    version: new_version,
                    academic_year: parseInt(new_academic_year),
                    total_credits: originalCurriculum.total_credits,
                    min_gpa: originalCurriculum.min_gpa,
                    effective_date: new Date(),
                    is_active: true
                }
            });

            // Clone courses
            if (originalCurriculum.curriculumCourses.length > 0) {
                await tx.curriculumCourse.createMany({
                    data: originalCurriculum.curriculumCourses.map(course => ({
                        curriculum_id: newCurriculum.curriculum_id,
                        course_id: course.course_id,
                        semester_suggested: course.semester_suggested,
                        year_suggested: course.year_suggested,
                        is_mandatory: course.is_mandatory,
                        course_group: course.course_group
                    }))
                });
            }

            // Clone requirements
            if (originalCurriculum.requirements.length > 0) {
                await tx.curriculumRequirement.createMany({
                    data: originalCurriculum.requirements.map(req => ({
                        curriculum_id: newCurriculum.curriculum_id,
                        requirement_type: req.requirement_type,
                        requirement_name: req.requirement_name,
                        description: req.description,
                        value: req.value
                    }))
                });
            }

            return newCurriculum;
        });

        // Fetch complete cloned curriculum
        const completeCurriculum = await prisma.curriculum.findUnique({
            where: { curriculum_id: clonedCurriculum.curriculum_id },
            include: {
                major: true,
                curriculumCourses: {
                    include: {
                        course: true
                    }
                },
                requirements: true
            }
        });

        res.status(201).json({
            success: true,
            data: completeCurriculum,
            message: 'Curriculum cloned successfully'
        });
    } catch (error) {
        console.error('Error cloning curriculum:', error);
        res.status(500).json({
            success: false,
            message: 'Error cloning curriculum',
            error: error.message
        });
    }
};

// Get all majors for dropdown
const getMajors = async (req, res) => {
    try {
        const majors = await prisma.major.findMany({
            orderBy: { major_name: 'asc' }
        });

        res.json({
            success: true,
            data: majors
        });
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching majors',
            error: error.message
        });
    }
};

module.exports = {
    getCurriculums,
    getCurriculumById,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
    getAvailableCourses,
    cloneCurriculum,
    getMajors
};
