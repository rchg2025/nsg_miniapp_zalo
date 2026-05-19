import React, { useState, useEffect } from 'react';
import { Box, Text, Avatar, Button } from 'zmp-ui';
import { ZaloUserService, ZaloUserInfo } from '@/utils/zalo-user-service';

interface UserProfileProps {
  onUserInfoUpdate?: (userInfo: ZaloUserInfo | null) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onUserInfoUpdate }) => {
  const [userInfo, setUserInfo] = useState<ZaloUserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    setLoading(true);
    try {
      const info = await ZaloUserService.getUserInfo();
      setUserInfo(info);
      onUserInfoUpdate?.(info);
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPhoneAccess = async () => {
    setPhoneLoading(true);
    try {
      const phone = await ZaloUserService.requestPhonePermission();
      if (phone && userInfo) {
        const updatedInfo = { ...userInfo, phone };
        setUserInfo(updatedInfo);
        onUserInfoUpdate?.(updatedInfo);
      }
    } catch (error) {
      console.error('Error requesting phone:', error);
    } finally {
      setPhoneLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center p-4">
        <Text>Đang tải th�ng tin người d�ng...</Text>
      </Box>
    );
  }

  if (!userInfo) {
    return (
      <Box className="text-center p-4">
        <Text className="text-gray-500 mb-4">Kh�ng thể lấy th�ng tin người d�ng</Text>
        <Button 
          variant="primary" 
          size="small"
          onClick={loadUserInfo}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box className="bg-white rounded-lg p-4 shadow-sm">
      <Box className="flex items-center space-x-4">
        <Avatar
          story="default"
          size={60}
          src={userInfo.avatar}
        />
        <Box className="flex-1">
          <Text.Title className="text-lg font-semibold">
            {userInfo.name || 'Người d�ng Zalo'}
          </Text.Title>
          <Text className="text-gray-500 text-sm">ID: {userInfo.id}</Text>
          
          {userInfo.phone ? (
            <Text className="text-green-600 text-sm">
              📞 {userInfo.phone}
            </Text>
          ) : (
            <Box className="mt-2">
              <Button
                variant="secondary"
                size="small"
                loading={phoneLoading}
                onClick={requestPhoneAccess}
              >
                {phoneLoading ? 'Đang y�u cầu...' : '📞 Lấy số điện thoại'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;