import React, { useState } from 'react';
import { Box, Text, Avatar, useSnackbar } from 'zmp-ui';
import { getUserInfo, authorize } from 'zmp-sdk/apis';
import { useUser } from '../contexts/user-context';
import { UserRole } from '@/types';

export interface HeaderProps {
  showBackIcon?: boolean;
  onBackClick?: () => void;
  title?: string;
  className?: string;
}

export function Header({ 
  showBackIcon = false, 
  onBackClick, 
  title,
  className = "bg-blue-600 text-white"
}: HeaderProps) {
  const { userInfo, setUserInfo } = useUser();
  const { openSnackbar } = useSnackbar();
  const [isRequesting, setIsRequesting] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const handleAvatarClick = async () => {
    if (title || isRequesting) return; // chỉ hoạt động ở trang chủ
    setIsRequesting(true);
    try {
      // Bước 1: yêu cầu quyền đọc tên và ảnh đại diện (bắt buộc từ SDK 2.35.0+)
      try {
        await authorize({ scopes: ['scope.userInfo'] });
      } catch (_) {
        // Người dùng từ chối hoặc lỗi quyền — vẫn tiếp tục
      }
      // Bước 2: lấy thông tin sau khi đã được cấp quyền
      const result = await getUserInfo({});
      if (result?.userInfo) {
        const u = result.userInfo;
        // Lấy số điện thoại nếu được cấp phép
        let phone: string | undefined;
        try {
          const { getPhoneNumber } = await import('zmp-sdk/apis');
          const phoneResult = await (getPhoneNumber as any)({ autoRequestPermission: true });
          phone = phoneResult?.number || phoneResult?.token || undefined;
        } catch (_) { /* phone không bắt buộc */ }

        const role = userInfo?.role ?? UserRole.STUDENT;
        const permissions = userInfo?.permissions ?? [];

        setUserInfo({
          id: u.id,
          name: u.name || 'Bạn',
          avatar: u.avatar || '',
          phone,
          role,
          permissions
        });
        // Save user to backend
        try {
          const { API_BASE_URL } = await import('@/utils/api');
          await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zalo_id: u.id, name: u.name || 'Khách', avatar: u.avatar || '' })
          });
        } catch (_) {}
        openSnackbar({ text: `Xin chào, ${u.name || 'Bạn'}! 👋`, type: 'success', duration: 3000 });
      }
    } catch (err) {
      openSnackbar({ text: 'Không thể lấy thông tin. Vui lòng thử lại.', type: 'error', duration: 3000 });
    } finally {
      setIsRequesting(false);
    }
  };

  const isGuest = !userInfo || userInfo.id === 'guest';

  return (
    <>
      <Box className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 ${className}`}>
        <Box className="flex items-center">
          {showBackIcon && (
            <Box onClick={onBackClick} className="mr-3 cursor-pointer p-1">
              <i className="zi-arrow-left text-xl text-white"></i>
            </Box>
          )}

          {title ? (
            <Text.Title className="text-white font-bold flex-1">{title}</Text.Title>
          ) : (
            <Box
              className={`flex items-center flex-1 ${!title ? 'cursor-pointer active:opacity-70' : ''}`}
              onClick={handleAvatarClick}
            >
              {/* Avatar */}
              <Box className="relative mr-3 flex-shrink-0">
                {isGuest ? (
                  <Box className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40">
                    <i className="zi-user text-white text-xl"></i>
                  </Box>
                ) : (
                  <Avatar
                    src={userInfo.avatar}
                    size={44}
                    className="border-2 border-white/30"
                  />
                )}
                {isRequesting && (
                  <Box className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                    <Text className="text-white text-xs">...</Text>
                  </Box>
                )}
              </Box>

              {/* Info */}
              <Box className="flex-1 min-w-0">
                {isGuest ? (
                  <>
                    <Text className="text-white/70 text-xs">Nhấn để đăng nhập</Text>
                    <Text className="text-white font-bold text-sm">Trường CĐ Bách khoa Nam Sài Gòn</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-white/80 text-xs">{getGreeting()},</Text>
                    <Text className="text-white font-bold text-sm leading-tight truncate">
                      {userInfo.name}
                    </Text>
                    {userInfo.phone ? (
                      <Text className="text-white/70 text-xs">{userInfo.phone}</Text>
                    ) : (
                      <Text className="text-white/60 text-xs">Nhấn để cập nhật thông tin</Text>
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box className="h-16"></Box>
    </>
  );
}