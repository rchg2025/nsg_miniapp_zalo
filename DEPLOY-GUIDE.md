# Hướng dẫn Deploy với Production Data

## 📝 Tổng quan

Để deploy ứng dụng với dữ liệu thực tế từ localStorage lên server, cần thực hiện các bước sau:

## 🔧 Bước 1: Export dữ liệu từ localStorage

### Cách 1: Sử dụng trang Debug
1. Truy cập `http://localhost:3000/debug`
2. Click nút **"📄 Tạo file production-data.ts"**
3. File sẽ được download tự động

### Cách 2: Sử dụng Console
1. Mở DevTools Console trên `http://localhost:3000`
2. Chạy lệnh:
```javascript
exportProductionData()
```
3. File `production-data.ts` sẽ được download

### Cách 3: Copy console output
1. Truy cập `http://localhost:3000/debug`
2. Click nút **"📋 Log ra console để copy"**
3. Mở DevTools Console
4. Copy dữ liệu và tạo file thủ công

## 🔧 Bước 2: Cập nhật production data

1. Thay thế nội dung file `src/data/production-data.ts` bằng file vừa export
2. Kiểm tra format và types
3. Commit changes

## 🔧 Bước 3: Build và Deploy

1. Build ứng dụng:
```bash
zmp build
```

2. Deploy build folder lên server của bạn

## 🎯 Hoạt động

- **Development** (`localhost`): Sử dụng localStorage
- **Production** (domain khác): Sử dụng PRODUCTION_DATA

## 📊 Dữ liệu được export

- **News**: Tất cả tin tức từ admin và app
- **Majors**: Tất cả ngành học với educationLevel đã migrate
- **Applications**: Tất cả đơn đăng ký tuyển sinh

## 🔍 Kiểm tra Production Data

Sau khi deploy, kiểm tra console logs để đảm bảo:
- `🚀 Production mode: using PRODUCTION_DATA`
- `✅ Found X news items from production data`
- `✅ Found X majors from production data`

## ⚠️ Lưu ý

1. Luôn backup dữ liệu trước khi deploy
2. Test trên staging environment trước
3. Kiểm tra các URLs và paths sau khi deploy
4. Dữ liệu production sẽ bị override nếu user truy cập admin trên production