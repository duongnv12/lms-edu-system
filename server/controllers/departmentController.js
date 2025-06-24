// server/controllers/departmentController.js
const prisma = require('../config/database');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách khoa.' });
    }
};

exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await prisma.department.findUnique({
            where: { department_id: parseInt(id) }
        });
        if (!department) {
            return res.status(404).json({ message: 'Không tìm thấy khoa.' });
        }
        res.json(department);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết khoa.' });
    }
};

exports.createDepartment = async (req, res) => {
    try {
        const { code, dept_name, description } = req.body;
        // Kiểm tra trùng mã khoa
        const existedCode = await prisma.department.findUnique({ where: { code } });
        if (existedCode) {
            return res.status(400).json({ message: 'Mã khoa đã tồn tại.' });
        }
        // Kiểm tra trùng tên khoa
        const existedName = await prisma.department.findUnique({ where: { dept_name } });
        if (existedName) {
            return res.status(400).json({ message: 'Tên khoa đã tồn tại.' });
        }
        const department = await prisma.department.create({
            data: { code, dept_name, description }
        });
        res.status(201).json(department);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi tạo khoa.' });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, dept_name, description } = req.body;
        // Kiểm tra trùng mã khoa (trừ chính nó)
        const existedCode = await prisma.department.findFirst({
            where: {
                code,
                department_id: { not: parseInt(id) }
            }
        });
        if (existedCode) {
            return res.status(400).json({ message: 'Mã khoa đã tồn tại.' });
        }
        // Kiểm tra trùng tên khoa (trừ chính nó)
        const existedName = await prisma.department.findFirst({
            where: {
                dept_name,
                department_id: { not: parseInt(id) }
            }
        });
        if (existedName) {
            return res.status(400).json({ message: 'Tên khoa đã tồn tại.' });
        }
        const department = await prisma.department.update({
            where: { department_id: parseInt(id) },
            data: { code, dept_name, description }
        });
        res.json(department);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật khoa.' });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra ràng buộc: còn giảng viên hoặc môn học không?
        const instructors = await prisma.instructor.findFirst({ where: { department_id: parseInt(id) } });
        const courses = await prisma.course.findFirst({ where: { department_id: parseInt(id) } });
        if (instructors || courses) {
            return res.status(400).json({ message: 'Không thể xóa khoa còn giảng viên hoặc môn học.' });
        }
        await prisma.department.delete({
            where: { department_id: parseInt(id) }
        });
        res.json({ message: 'Xóa khoa thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa khoa.' });
    }
};

exports.importDepartmentsExcel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn file Excel.' });
        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        let count = 0, errors = [];
        for (let i = 1; i < rows.length; i++) {
            const [code, dept_name, description] = rows[i];
            if (!code || !dept_name) {
                errors.push(`Dòng ${i + 1}: Thiếu mã hoặc tên khoa.`);
                continue;
            }
            try {
                await prisma.department.create({
                    data: { code: code.toString().trim().toUpperCase(), dept_name: dept_name.toString().trim(), description: description || '' }
                });
                count++;
            } catch (e) {
                errors.push(`Dòng ${i + 1}: ${e.meta?.cause || e.message}`);
            }
        }
        fs.unlinkSync(req.file.path);
        res.json({ message: `Đã nhập ${count} khoa.`, errors });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi nhập dữ liệu Excel.' });
    }
};
