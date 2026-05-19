import React, { useState, useEffect } from "react";
import { Page, Header, Text, Box, Avatar, Button } from "zmp-ui";
import { useNavigate } from "zmp-ui";

const ProfilePageSimple: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[PROFILE SIMPLE] Component mounted');
    
    const loadUserInfo = async () => {
      try {
        console.log('[PROFILE SIMPLE] Starting to load user info...');
        
        // Import Zalo API dynamically để tr�nh conflict
        const { getUserInfo } = await import("zmp-sdk/apis");
        console.log('[PROFILE SIMPLE] Zalo SDK imported');
        
        const response = await getUserInfo({
          autoRequestPermission: true,
        });
        
        console.log('[PROFILE SIMPLE] Zalo response:', response);
        
        if (response.errorKeys && response.errorKeys.length > 0) {
          throw new Error(`Zalo API Error: ${response.errorKeys.join(', ')}`);
        }
        
        setUserInfo(response.userInfo);
        console.log('[PROFILE SIMPLE] User info set successfully');
        
      } catch (err: any) {
        console.error('[PROFILE SIMPLE] Error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  if (loading) {
    return (
      <Page className="page">
        <Header title="C� nh�n (Simple)" />
        <Box className="p-4">
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page className="page">
        <Header title="C� nh�n (Simple)" />
        <Box className="p-4">
          <Text className="text-red-500">Lỗi: {error}</Text>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page">
      <Header title="C� nh�n (Simple)" />
      
      <Box className="p-4">
        {/* User Info */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Box className="flex items-center mb-4">
            <Avatar
              size={64}
              src={userInfo?.avatar || 'https://h5.zdn.vn/static/images/avatar.png'}
            />
            <Box className="ml-4">
              <Text className="text-lg font-semibold text-gray-800">
                {userInfo?.name || 'Người d�ng'}
              </Text>
              <Text className="text-sm text-gray-500">
                ID: {userInfo?.id || 'N/A'}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Button
            variant="secondary"
            className="w-full text-left mb-2"
            onClick={() => navigate('/settings')}
          >
            C�i đặt
          </Button>
          
          <Button
            variant="secondary"
            className="w-full text-left mb-2"
            onClick={() => navigate('/profile')}
          >
            Profile Gốc (Test)
          </Button>
          
          <Button
            variant="secondary"
            className="w-full text-left"
            onClick={() => navigate('/profile-debug')}
          >
            Profile Debug
          </Button>
        </Box>

        {/* Debug Info */}
        <Box className="bg-gray-50 rounded-lg p-4 mt-4">
          <Text className="text-sm text-gray-600 mb-2">Debug Info:</Text>
          <Text className="text-xs text-gray-500">
            User: {JSON.stringify(userInfo, null, 2)}
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default ProfilePageSimple;