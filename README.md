# Trường Cao đẳng Bách khoa Nam Sài Gòn - Zalo Mini App

## 📱 Mô tả
Ứng dụng Zalo Mini App chính thức của **Trường Cao đẳng Bách khoa Nam Sài Gòn**. 

Nền tảng kết nối toàn diện giữa sinh viên, phụ huynh và nhà trường, cung cấp:
- 📢 Tin tức và thông báo quan trọng
- 🎓 Thông tin tuyển sinh và các ngành đào tạo  
- 📚 Dịch vụ hỗ trợ học tập
- 💬 Kênh liên lạc trực tiếp với tư vấn viên

**Website:** https://nsg.edu.vn  
**App ID:** 683482533449307102

## 🚀 Tính năng chính

### 🏠 Trang chủ
- Giao diện chào mừng với thông tin trường  
- **📊 Thống kê thời gian thực**: Số bài viết, ngành học, đơn đăng ký
- Menu truy cập nhanh các chức năng
- Preview tin tức và thông báo mới nhất
- **🎓 Ngành tuyển sinh** với hiển thị hệ đào tạo (Cao đẳng, Trung cấp, Cao đẳng liên thông)
- **Hiển thị thông tin user** khi đã đăng nhập

### 📰 Trang tin tức
- **Tìm kiếm** theo từ khóa
- **Phân loại danh mục**: Thông báo, Tin tức, Ngành tuyển sinh
- **Tin nổi bật** (flag featured)
- **Dữ liệu động** từ DataManager thay vì localStorage trực tiếp
- **Liên kết** từ thông báo mở trực tiếp bài viết

### 📄 Chi tiết tin tức
- Nội dung lấy động từ kho dữ liệu quản trị
- Meta: tác giả, ngày, lượt xem (placeholder tăng dần có thể mở rộng)
- Lưu / bỏ lưu tin (localStorage)
- Tin liên quan cùng danh mục

### 📅 Lịch học
- **Xem lịch theo từng ngày** trong tuần
- **Phân loại hoạt động**: Học bài, Kiểm tra, Sự kiện
- **Thông tin chi tiết**: Giáo viên, phòng học, thời gian
- **Thao tác nhanh**: Tải lịch, ghi chú, phản hồi

### 👤 Trang cá nhân
- **Thông tin cá nhân** + thống kê động (số ngành quan tâm, tin đã lưu, thông báo chưa đọc)
- **Quản lý thông báo** (mark all, điều hướng chi tiết)
- **Thiết lập**: đồng bộ dữ liệu trường, cài đặt hiển thị

### 🧭 Bottom Navigation
- **4 tab chính**: Trang chủ, Tin tức, Lịch học, Cá nhân
- **Active state** với visual feedback
- **Fixed position** luôn hiển thị

### 🔔 Thông báo
- Tạo tự động khi thêm mới tin / ngành (giả lập)
- Click điều hướng tới bài viết / ngành tương ứng (nếu có relatedId)
- Nếu không có liên kết: mở modal xem nội dung chi tiết
- Đánh dấu đã đọc tự động khi mở

### � Đăng ký tuyển sinh
- Chọn ngành trước từ trang ngành (query param majorId)
- Chuẩn hóa dữ liệu ngành (`tuition` → `tuitionFee`)
- Lưu form vào localStorage (có thể đồng bộ admin viewer sau này)

### 🧩 Chuẩn hóa dữ liệu
- Module `data-normalization.ts` hợp nhất schema cho Majors & News
- Migration tự động chạy lúc khởi động (`migrateStoredData()`)
- Giảm lỗi do thiếu trường / khác tên thuộc tính

## �🛠️ Công nghệ sử dụng

- **Framework**: React + TypeScript
- **UI Library**: ZMP UI (Zalo Mini Program)
- **CSS**: Tailwind CSS + SCSS  
- **State Management**: Jotai
- **Build Tool**: Vite

## 🚀 Hướng dẫn phát triển

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server  
```bash
zmp start
```

### Build production (tạo gói Mini App)
```bash
zmp build
```

### Deploy lên Zalo (yêu cầu đã `zmp login`)
```bash
zmp deploy
```

### Using Zalo Mini App CLI

1. [Install Node JS](https://nodejs.org/en/download/).
1. [Install Zalo Mini App CLI](https://mini.zalo.me/docs/dev-tools/cli/intro/).
1. **Install dependencies**:
   ```bash
   npm install
   ```
1. **Start** the dev server:
   ```bash
   zmp start
   ```
1. **Open** `localhost:3000` in your browser.

## Deployment

1. **Create** a mini program. For instructions on how to create a mini program, please refer to the [Coffee Shop Tutorial](https://mini.zalo.me/tutorial/coffee-shop/step-1/)

1. **Deploy** mini program bằng mini app ID đã tạo.

   - **Using Zalo Mini App Extension**: navigate to the **Deploy** panel > **Login** > **Deploy**.
   - **Using Zalo Mini App CLI**:
     ```bash
     zmp login
     zmp deploy
     ```

1. Open the mini app in Zalo by scanning the QR code.

## Resources

- [Zalo Mini App Official Website](https://mini.zalo.me/)
- [ZaUI Documentation](https://mini.zalo.me/documents/zaui/)
- [ZMP SDK Documentation](https://mini.zalo.me/documents/api/)
- [DevTools Documentation](https://mini.zalo.me/docs/dev-tools/)
- [Ready-made Mini App Templates](https://mini.zalo.me/zaui-templates)
- [Community Support](https://mini.zalo.me/community)

## 🗂️ Dữ liệu mẫu

Để test hệ thống với dữ liệu mẫu:

### 1. Tạo dữ liệu ngành học
```javascript
// Chạy nội dung từ file sample-data.js trong console
// Tạo 5 ngành học mẫu với các hệ đào tạo khác nhau
```

### 2. Tạo dữ liệu tin tức
```javascript
// Chạy nội dung từ file sample-news.js trong console  
// Tạo 5 bài viết mẫu (tin tức + thông báo)
```

### 3. Kiểm tra thống kê
- Trang chủ sẽ hiển thị số liệu thực từ DataManager
- Không còn sử dụng số liệu ảo/mock
- Thống kê cập nhật theo thời gian thực

---
### Ghi chú cải tiến gần đây
- **🔄 DataManager Integration**: Trang chủ sử dụng DataManager thay vì localStorage trực tiếp
- **📊 Thống kê thực tế**: Hiển thị số liệu chính xác từ cơ sở dữ liệu
- **🎓 Hệ đào tạo**: Thêm hiển thị hệ đào tạo cho ngành tuyển sinh  
- **🗂️ Đồng bộ dữ liệu**: Admin và user interface chia sẻ cùng nguồn dữ liệu
- **✅ Validation**: Form đăng ký tuyển sinh tích hợp DataManager

### Hướng phát triển tiếp theo (gợi ý)
- Thêm API backend thay localStorage
- Real-time notifications
- Phân quyền nâng cao (admin / teacher UI riêng)
- Analytics và báo cáo chi tiết
