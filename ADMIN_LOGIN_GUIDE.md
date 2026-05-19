# 🚀 Hướng dẫn đăng nhập Admin - NSG News

## 📍 **Cách truy cập trang Admin:**

### **Bước 1: Vào trang Cá nhân**
- Truy cập: `http://localhost:3000/profile`
- Hoặc click tab "Cá nhân" ở navigation bar

### **Bước 2: Tìm menu "Đăng nhập Admin"**
- Scroll xuống phần "Chức năng"  
- Tìm mục có icon 🔴 "Đăng nhập Admin"
- Subtitle: "Dành cho quản trị viên"

### **Bước 3: Đăng nhập Admin**
- Click vào "Đăng nhập Admin"
- Nhập thông tin đăng nhập:
  - **Username:** `admin`
  - **Password:** `admin123`
- Click "Đăng nhập"

### **Bước 4: Truy cập Admin Panel**
- Sau khi đăng nhập thành công
- Tự động chuyển đến: `http://localhost:3000/admin`
- Hoặc click "Bảng điều khiển quản trị" nếu đã là admin

## 🔧 **Thông tin đăng nhập mặc định:**

```
Username: admin
Password: admin123
```

## 📋 **Các chức năng Admin có thể truy cập:**

### **📰 Quản lý Tin tức:**
- Thêm/sửa/xóa tin tức
- Thay đổi trạng thái: draft/published
- Quản lý danh mục tin tức

### **🎓 Quản lý Ngành đào tạo:**
- Thêm/sửa/xóa ngành đào tạo
- Cập nhật thông tin: học phí, chỉ tiêu, môn học
- Quản lý trạng thái ngành

### **📝 Quản lý Đăng ký tuyển sinh:**
- Xem danh sách đăng ký
- Xử lý hồ sơ: duyệt/từ chối
- Xuất báo cáo Excel

### **👥 Quản lý Người dùng:**
- Phân quyền user: Student/Teacher/Admin
- Xem thống kê người dùng
- Quản lý danh sách user

### **🔒 Phân quyền:**
- Cấp quyền admin cho user khác
- Quản lý permissions
- Xóa quyền user

### **⚙️ Cài đặt:**
- Thông tin trường
- Cấu hình hệ thống
- Backup/restore data

## 🔄 **Session Admin:**
- **Thời gian:** 24 giờ
- **Auto logout:** Sau 24h không hoạt động
- **Persistent:** Lưu trạng thái đăng nhập

## ⚠️ **Lưu ý:**
- Chỉ admin mới có đầy đủ quyền
- Session sẽ hết hạn sau 24h
- Đăng xuất để bảo mật

## 🆘 **Nếu không thấy menu Admin:**
1. **Refresh trang:** Ctrl + F5
2. **Clear cache:** Developer Tools > Application > Clear Storage
3. **Restart server:** `npm start`

## 🎯 **Đường dẫn trực tiếp:**
- **Profile:** http://localhost:3000/profile
- **Admin:** http://localhost:3000/admin (cần đăng nhập)
- **Debug:** http://localhost:3000/debug (tạo dữ liệu mẫu)

**✅ Menu "Đăng nhập Admin" giờ đã hiển thị cho tất cả user!**