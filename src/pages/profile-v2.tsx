import React, { useState, useEffect } from "react";
import { Page, Header, Text, Box, Avatar, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { OA_CONFIG } from "@/config/oa-config";

const ProfilePageV2: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[PROFILE V2] Component mounted');
    
    const loadUserInfo = async () => {
      try {
        // Import Zalo API dynamically
        const { getUserInfo } = await import("zmp-sdk/apis");
        console.log('[PROFILE V2] Zalo SDK imported');
        
        const response = await getUserInfo({
          autoRequestPermission: true,
        });
        
        console.log('[PROFILE V2] Zalo response:', response);
        
        setUserInfo(response.userInfo);
        console.log('[PROFILE V2] User info set successfully');
        
      } catch (err: any) {
        console.error('[PROFILE V2] Error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // Follow OA function - RESTORED: Working as confirmed by OA Checker
  const handleFollowOA = async () => {
    try {
      console.log('[PROFILE V2] Starting Follow OA...');
      const { followOA } = await import("zmp-sdk/apis");
      console.log('[PROFILE V2] followOA imported');
      
      const result = await followOA({
        id: OA_CONFIG.OA_ID
      });
      console.log('[PROFILE V2] Follow OA result:', result);
      
      alert('✅ Đã quan tâm OA thành công!\n\n🎉 Bạn sẽ nhận được thông báo mới nhất từ trường qua Zalo OA.');
    } catch (error: any) {
      console.error('[PROFILE V2] Follow OA error:', error);
      // Fallback to contact info if API fails
      alert(`📞 Liên hệ trực tiếp với trường:
      
• Hotline: 0981146179  
• Website: namsaigon.edu.vn
• Email: info@namsaigon.edu.vn

� Hoặc tìm kiếm "Trường Cao đẳng Bách khoa Nam Sài Gòn" trong Zalo để quan tâm OA.`);
    }
  };

  // Open support chat - RESTORED: Working as confirmed by OA Checker
  const handleOpenSupport = async () => {
    try {
      console.log('[PROFILE V2] Starting Open Support Chat...');
      const { openChat } = await import("zmp-sdk/apis");
      console.log('[PROFILE V2] openChat imported');
      
      const result = await openChat({
        type: "oa",
        id: OA_CONFIG.OA_ID
      });
      console.log('[PROFILE V2] Open chat result:', result);
      
      // Success message since openChat doesn't return meaningful data
      console.log('[PROFILE V2] Chat opened successfully');
      
    } catch (error: any) {
      console.error('[PROFILE V2] Open chat error:', error);
      // Fallback to contact info if API fails
      alert(`📞 Liên hệ hỗ trợ ngay:
      
• Hotline: 0981146179
• Website: namsaigon.edu.vn  
• Email: info@namsaigon.edu.vn

💬 Hoặc nhắn tin cho OA "Trường Cao đẳng Bách khoa Nam Sài Gòn" trong Zalo.`);
    }
  };

  if (loading) {
    return (
      <Page className="page">
        <Header title="Cá nhân" />
        <Box className="p-4">
          <Box className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <Box className="flex items-center mb-4">
              <Box className="w-16 h-16 bg-gray-300 rounded-full"></Box>
              <Box className="ml-4">
                <Box className="h-4 bg-gray-300 rounded w-32 mb-2"></Box>
                <Box className="h-3 bg-gray-300 rounded w-24"></Box>
              </Box>
            </Box>
          </Box>
          <Text className="text-center mt-4 text-gray-500">Đang tải thông tin...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page className="page">
        <Header title="Cá nhân" />
        <Box className="p-4">
          <Box className="bg-red-50 border border-red-200 rounded-lg p-4">
            <Text className="text-red-600 font-medium mb-2">❌ Có lỗi xảy ra</Text>
            <Text className="text-red-500 text-sm mb-4">{error}</Text>
            <Button 
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </Box>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page">
      <Header title="Cá nhân" />
      
      <Box className="p-4">
        {/* User Info Card */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          <Box className="flex items-center mb-4">
            <Avatar
              size={64}
              src={userInfo?.avatar || 'https://h5.zdn.vn/static/images/avatar.png'}
              className="border-2 border-blue-100"
            />
            <Box className="ml-4">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {userInfo?.name || 'Người dùng'}
              </Text>
              <Text className="text-sm text-gray-500">
                ID: {userInfo?.id || 'N/A'}
              </Text>
              <Text className="text-xs text-green-600 mt-1">
                ✅ Đã đăng nhập Zalo
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          <Text className="font-medium text-gray-800 mb-3">Hỗ trợ</Text>
          
          <Button
            variant="secondary"
            className="w-full text-left mb-2 border-blue-200 bg-blue-50"
            onClick={handleFollowOA}
          >
            <Icon icon="zi-heart" className="mr-3 text-blue-500" />
            <Text className="text-blue-600">❤️ Quan tâm OA</Text>
          </Button>
          
          <Button
            variant="secondary"
            className="w-full text-left border-green-200 bg-green-50"
            onClick={handleOpenSupport}
          >
            <Icon icon="zi-chat" className="mr-3 text-green-500" />
            <Text className="text-green-600">💬 Hỗ trợ trực tuyến</Text>
          </Button>
        </Box>

        {/* Menu Items */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          <Text className="font-medium text-gray-800 mb-3">Cài đặt</Text>
          
          <Button
            variant="secondary"
            className="w-full text-left mb-2"
            onClick={() => navigate('/settings')}
          >
            <Icon icon="zi-setting" className="mr-3 text-gray-500" />
            Cài đặt ứng dụng
          </Button>
          
          <Button
            variant="secondary"
            className="w-full text-left mb-2"
            onClick={() => navigate('/about')}
          >
            <Icon icon="zi-info-circle" className="mr-3 text-gray-500" />
            Về ứng dụng
          </Button>
        </Box>

        {/* Test Navigation */}
        <Box className="bg-gray-50 rounded-lg p-4">
          <Text className="font-medium text-gray-700 mb-3">🧪 Test & Debug</Text>
          
          <Button
            variant="secondary"
            className="w-full text-left mb-2 border-purple-200 bg-purple-50"
            onClick={() => navigate('/oa-checker')}
          >
            <Icon icon="zi-setting" className="mr-3 text-purple-500" />
            <Text className="text-purple-600">🔍 OA Checker (Fix OA)</Text>
          </Button>
          
          <Button
            variant="secondary"
            className="w-full text-left mb-2 border-orange-200 bg-orange-50"
            onClick={() => navigate('/profile-debug')}
          >
            <Icon icon="zi-setting" className="mr-3 text-orange-500" />
            <Text className="text-orange-600">Debug Page</Text>
          </Button>
          
          <Button
            variant="secondary"
            className="w-full text-left mb-2 border-green-200 bg-green-50"
            onClick={() => navigate('/profile-simple')}
          >
            <Icon icon="zi-user" className="mr-3 text-green-500" />
            <Text className="text-green-600">Profile Simple</Text>
          </Button>
          
          <Button
            variant="secondary"
            className="w-full text-left border-red-200 bg-red-50"
            onClick={() => navigate('/profile')}
          >
            <Icon icon="zi-user" className="mr-3 text-red-500" />
            <Text className="text-red-600">Profile Gốc (Lỗi)</Text>
          </Button>
        </Box>

        {/* Footer Info */}
        <Box className="text-center py-4">
          <Text className="text-gray-400 text-xs">
            Profile V2 - Phiên bản tối ưu
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default ProfilePageV2;