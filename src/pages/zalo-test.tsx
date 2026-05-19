import React, { useState } from 'react';
import { Box, Button, Text, Page, Header } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { ZaloUserService, ZaloUserInfo } from '@/utils/zalo-user-service';
import UserProfile from '@/components/user-profile';

function ZaloTestPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<ZaloUserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [permissions, setPermissions] = useState<{userInfo: boolean, phone: boolean} | null>(null);

  const testGetUserInfo = async () => {
    setLoading(true);
    try {
      const info = await ZaloUserService.getUserInfo();
      setUserInfo(info);
      console.log('✅ User info result:', info);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testGetPhone = async () => {
    setPhoneLoading(true);
    try {
      const phone = await ZaloUserService.requestPhonePermission();
      console.log('✅ Phone result:', phone);
      if (phone && userInfo) {
        setUserInfo({ ...userInfo, phone });
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setPhoneLoading(false);
    }
  };

  const testGetFullInfo = async () => {
    setLoading(true);
    try {
      const info = await ZaloUserService.getFullUserInfo();
      setUserInfo(info);
      console.log('✅ Full user info result:', info);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const perms = await ZaloUserService.checkPermissions();
      setPermissions(perms);
      console.log('✅ Permissions:', perms);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Test Zalo APIs"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-purple-600 text-white"
      />

      <Box className="p-4 space-y-4">
        {/* API Test Buttons */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">🧪 Test Zalo APIs</Text.Title>
          <Box className="space-y-3">
            <Button 
              fullWidth
              variant="primary"
              loading={loading}
              onClick={testGetUserInfo}
            >
              📱 Test getUserInfo()
            </Button>
            
            <Button 
              fullWidth
              variant="secondary"
              loading={phoneLoading}
              onClick={testGetPhone}
            >
              📞 Test requestPhonePermission()
            </Button>
            
            <Button 
              fullWidth
              variant="tertiary"
              loading={loading}
              onClick={testGetFullInfo}
            >
              👤 Test getFullUserInfo()
            </Button>
            
            <Button 
              fullWidth
              variant="secondary"
              onClick={checkPermissions}
            >
              🔐 Check Permissions
            </Button>
          </Box>
        </Box>

        {/* Permissions Status */}
        {permissions && (
          <Box className="bg-white rounded-lg p-4">
            <Text.Title className="mb-4">🔐 Permissions Status</Text.Title>
            <Box className="space-y-2">
              <Text className={`${permissions.userInfo ? 'text-green-600' : 'text-red-600'}`}>
                📱 User Info: {permissions.userInfo ? '✅ Granted' : '❌ Denied'}
              </Text>
              <Text className={`${permissions.phone ? 'text-green-600' : 'text-red-600'}`}>
                📞 Phone: {permissions.phone ? '✅ Granted' : '❌ Denied'}
              </Text>
            </Box>
          </Box>
        )}

        {/* User Profile Component */}
        {userInfo && (
          <Box>
            <Text.Title className="mb-4">👤 User Profile Component</Text.Title>
            <UserProfile onUserInfoUpdate={setUserInfo} />
          </Box>
        )}

        {/* Raw Data Display */}
        {userInfo && (
          <Box className="bg-white rounded-lg p-4">
            <Text.Title className="mb-4">📊 Raw Data</Text.Title>
            <Box className="bg-gray-100 p-3 rounded text-xs">
              <pre>{JSON.stringify(userInfo, null, 2)}</pre>
            </Box>
          </Box>
        )}

        {/* Console Logs Info */}
        <Box className="bg-blue-50 rounded-lg p-4">
          <Text.Title className="mb-2 text-blue-800">💡 Hướng dẫn</Text.Title>
          <Text className="text-blue-700 text-sm">
            Mở DevTools Console để xem chi tiết logs v� debug information.
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

export default ZaloTestPage;