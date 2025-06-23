// server/controllers/courseController.js (phần bổ sung import Excel)
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.importCoursesExcel = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
            const workbook = XLSX.readFile(req.file.path);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            for (let i = 1; i < rows.length; i++) {
                const [course_code, course_name, credits, semester_applicable] = rows[i];
                if (!course_code || !course_name) continue;
                try {
                    await prisma.course.upsert({
                        where: { course_code },
                        update: {
                            course_name,
                            credits: Number(credits) || 0,
                            semester_applicable: semester_applicable ? String(semester_applicable) : null,
                            department_id: 1
                        },
                        create: {
                            course_code,
                            course_name,
                            credits: Number(credits) || 0,
                            semester_applicable: semester_applicable ? String(semester_applicable) : null,
                            department_id: 1
                        }
                    });
                } catch (err) {
                    console.error(`Lỗi khi import dòng ${i + 1}:`, err.message, rows[i]);
                }
            }
            fs.unlinkSync(req.file.path); // Xóa file tạm
            res.json({ message: 'Import thành công!' });
        } catch (err) {
            console.error('Lỗi import file Excel:', err);
            res.status(500).json({ message: 'Lỗi import file Excel.', error: err.message });
        }
    }
];
