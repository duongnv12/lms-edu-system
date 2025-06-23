# Phần mềm Quản lý Chương trình Đào tạo & Theo dõi Tiến độ Sinh viên

## Giới thiệu

Hệ thống giúp tự động hóa quản lý chương trình đào tạo và theo dõi tiến độ học tập của sinh viên tại các trường học, trung tâm đào tạo. Phần mềm giảm thiểu thao tác thủ công, hạn chế sai sót và cung cấp cái nhìn tổng quan, trực quan về quá trình học tập.

---

## Tính năng nổi bật

### 1. Quản lý Chương trình Đào tạo (Course & Curriculum Management)
- **Khóa học/Môn học:** Thêm, sửa, xóa, phân loại, tải lên đề cương chi tiết, quản lý môn học tiên quyết.
- **Chương trình đào tạo:** Định nghĩa cấu trúc chương trình, gán môn học, thiết lập điều kiện hoàn thành, quản lý phiên bản chương trình.
- **Giảng viên:** Lưu trữ thông tin, phân công giảng dạy.

### 2. Theo dõi Tiến độ Sinh viên (Student Progress Tracking)
- **Hồ sơ sinh viên:** Quản lý thông tin cá nhân, lịch sử học tập, điểm số.
- **Lộ trình học tập:** Trực quan hóa tiến độ, tính toán tín chỉ, kiểm tra điều kiện hoàn thành, dự đoán thời gian tốt nghiệp.
- **Báo cáo & Thông báo:** Tổng hợp điểm số, gửi cảnh báo, nhắc nhở tự động.

### 3. Module phụ trợ & mở rộng
- **Quản lý người dùng & phân quyền:** Phân vai trò (quản trị viên, cán bộ, giảng viên, sinh viên).
- **Báo cáo & thống kê:** Đa dạng báo cáo về đào tạo, tiến độ, tỷ lệ tốt nghiệp.
- **Tích hợp hệ thống ngoài:** Kết nối SMS, LMS, hệ thống quản lý sinh viên.
- **Giao diện hiện đại:** UI/UX thân thiện, tối ưu cho cả sinh viên và cán bộ.

---

## Công nghệ sử dụng

- **Frontend:** Vue.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL (hoặc MongoDB tùy cấu hình)

---

## Cài đặt & triển khai

### Yêu cầu
- Node.js >= 18.x
- npm hoặc yarn
- PostgreSQL (hoặc cấu hình database phù hợp)

### 1. Clone repository
```bash
git clone <URL_repository_cua_ban>
cd lms-edu-system
```

### 2. Cài đặt dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Cấu hình biến môi trường
- **Frontend:** Tạo file `.env` trong `client/` với biến `VITE_API_URL` trỏ tới backend.
- **Backend:** Tạo file `.env` trong `server/` với các biến như `PORT`, `DATABASE_URL`, `JWT_SECRET`, v.v.

### 4. Khởi tạo database (Prisma)
```bash
cd server
npx prisma migrate deploy
npx prisma db seed # (nếu có file seed)
```

### 5. Chạy dự án
```bash
# Chạy backend
cd server
npm start
# hoặc npm run dev

# Chạy frontend (mở tab mới)
cd client
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## Đóng góp & phát triển

Chào mừng mọi đóng góp để cải thiện hệ thống! Vui lòng tham khảo `CONTRIBUTING.md` (nếu có).

## Giấy phép

Dự án được cấp phép theo MIT License. Xem file `LICENSE` để biết thêm chi tiết.