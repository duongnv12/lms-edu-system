// server/controllers/departmentController.js
const prisma = require('../config/database');

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách khoa.' });
    }
};
