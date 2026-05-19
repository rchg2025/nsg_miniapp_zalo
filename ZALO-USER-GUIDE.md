# Zalo User Integration Guide

## 📱 Tích hợp thông tin người dùng Zalo

Hệ thống này cho phép lấy thông tin người dùng Zalo trong Mini App bao gồm tên, ảnh đại diện và số điện thoại.

## 🔧 Các thành phần đã tạo

### 1. ZaloUserService (`src/utils/zalo-user-service.ts`)
Service chính để tương tác với Zalo APIs:

```typescript
// Lấy thông tin cơ bản (tên, ảnh)
const userInfo = await ZaloUserService.getUserInfo();

// Yêu cầu quyền truy cập số điện thoại
const phone = await ZaloUserService.requestPhonePermission();

// Lấy thông tin đầy đủ
const fullInfo = await ZaloUserService.getFullUserInfo();
```

### 2. useZaloUser Hook (`src/hooks/useZaloUser.ts`)
React hook để sử dụng trong components:

```typescript
const { userInfo, loading, requestPhoneAccess, hasPhone } = useZaloUser();
```

### 3. UserProfile Component (`src/components/user-profile.tsx`)
Component hiển thị thông tin người dùng với button lấy số điện thoại.

### 4. ZaloUserDisplay Component (`src/components/zalo-user-display.tsx`)
Component compact để hiển thị thông tin user trong header/navbar.

## 🚀 Cách sử dụng

### Trong component React:

```typescript
import { useZaloUser } from '@/hooks/useZaloUser';

function MyComponent() {
  const { userInfo, loading, requestPhoneAccess } = useZaloUser();

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Xin chào {userInfo?.name}</h1>
      <img src={userInfo?.avatar} alt="Avatar" />
      {!userInfo?.phone && (
        <button onClick={requestPhoneAccess}>
          Lấy số điện thoại
        </button>
      )}
    </div>
  );
}
```

### Sử dụng service trực tiếp:

```typescript
import { ZaloUserService } from '@/utils/zalo-user-service';

// Trong async function
const userInfo = await ZaloUserService.getUserInfo();
console.log('User:', userInfo);
```

## 🔐 Quyền truy cập

Zalo Mini App cần các quyền sau:
- `scope.userInfo`: Lấy tên và ảnh đại diện
- `scope.userPhonenumber`: Lấy số điện thoại (cần user cho phép)

## 🧪 Testing

Truy cập `/zalo-test` để test các APIs:
- Test getUserInfo()
- Test requestPhonePermission() 
- Test getFullUserInfo()
- Check permissions status

## 📝 Lưu ý

1. **Development vs Production**: Trên localhost có thể không lấy được thông tin thực, cần test trên Zalo thật.

2. **User Permission**: Số điện thoại cần user cho phép, không tự động có.

3. **Error Handling**: Luôn handle errors khi gọi APIs.

4. **Caching**: Service tự động cache thông tin user để tránh gọi API nhiều lần.

## 🔍 Debug

- Mở DevTools Console để xem logs chi tiết
- Kiểm tra Network tab để xem API calls
- Sử dụng trang `/zalo-test` để debug

## ✅ Integration Status

- ✅ ZaloUserService created
- ✅ useZaloUser hook created  
- ✅ UserProfile component
- ✅ ZaloUserDisplay component
- ✅ Profile page updated
- ✅ Test page created (`/zalo-test`)
- ✅ Error handling
- ✅ Loading states
- ✅ Permission management