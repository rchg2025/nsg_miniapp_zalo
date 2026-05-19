import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header, Input, Switch } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { authorize, getUserInfo } from "zmp-sdk/apis";
import { ZaloUserService } from "@/utils/zalo-user-service";

interface AppSettings {
  notifications: boolean;
  autoRefresh: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  soundEnabled: boolean;
}

function SettingsPage() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUser();
  const [schoolSettings, setSchoolSettings] = useState({
    address: "47 Cao Lỗ, Phường Chánh Hưng, TP. Hồ Chí Minh",
    phone: "0981146179",
    website: "https://namsaigon.edu.vn"
  });
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoRefresh: true,
    theme: 'light',
    language: 'vi',
    soundEnabled: true
  });

  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('displayName') || userInfo?.name || '',
    email: '',
    phone: ''
  });

  const handleSyncWithZalo = async () => {
    try {
      // Sử dụng ZaloUserService để lấy thông tin cơ bản (tên và ảnh đại diện)
      const userInfo = await ZaloUserService.getUserInfo();
      console.log('[ZALO SYNC] userInfo:', userInfo);

      if (userInfo) {
        const updatedProfile = {
          ...profileData,
          name: userInfo.name || profileData.name,
          // Giữ nguyên email và số điện thoại hiện tại
          email: profileData.email,
          phone: profileData.phone
        };

        setProfileData(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        localStorage.setItem('displayName', userInfo.name);

        // Also update the global user context
        if (setUserInfo) {
          // Import UserRole enum để dùng đúng kiểu
          const { UserRole } = await import("@/types/index");
          setUserInfo({
            id: userInfo.id,
            name: userInfo.name,
            avatar: userInfo.avatar,
            role: UserRole.STUDENT, // Default role
            permissions: [] // Default permissions
          });
        }

        // Lưu user vào danh sách quản lý người dùng (adminUsersList)
        try {
          const { saveZaloUserLogin } = await import("@/utils/user-management");
          saveZaloUserLogin(userInfo);
          console.log('[ZALO SYNC] Đã lưu user vào adminUsersList:', userInfo);
        } catch (err) {
          console.error('[ZALO SYNC] Lỗi khi lưu user vào adminUsersList:', err);
        }

        // Thông báo thành công
        alert(`✅ Đồng bộ thông tin với Zalo thành công!\n\n• Tên: ${userInfo.name}\n• Ảnh đại diện: Đã cập nhật\n• Email và SĐT: Cần nhập thủ công`);
      } else {
        alert('❌ Không thể lấy thông tin từ Zalo. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error("Lỗi khi đồng bộ với Zalo:", error);
      alert('❌ Đã xảy ra lỗi khi cố gắng đồng bộ thông tin. Vui lòng thử lại.');
    }
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }

    // Load school settings - always use the latest info
    const savedSchoolSettings = localStorage.getItem('schoolSettings');
    if (savedSchoolSettings) {
      const parsed = JSON.parse(savedSchoolSettings);
      // Update with new values, prioritize new info
      setSchoolSettings({
        address: "47 Cao Lỗ, Phường Chánh Hưng, TP. Hồ Chí Minh",
        phone: "0981146179",
        website: "https://namsaigon.edu.vn"
      });
      // Also update localStorage with new info
      const updatedSettings = {
        ...parsed,
        address: "47 Cao Lỗ, Phường Chánh Hưng, TP. Hồ Chí Minh",
        phone: "0981146179",
        website: "https://namsaigon.edu.vn"
      };
      localStorage.setItem('schoolSettings', JSON.stringify(updatedSettings));
    } else {
      // Set new default values
      const newSettings = {
        address: "47 Cao Lỗ, Phường Chánh Hưng, TP. Hồ Chí Minh",
        phone: "0981146179",
        website: "https://namsaigon.edu.vn",
        schoolName: "Trường Cao đẳng Nam Sài Gòn"
      };
      setSchoolSettings(newSettings);
      localStorage.setItem('schoolSettings', JSON.stringify(newSettings));
    }
  }, [userInfo]);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handleProfileChange = (key: string, value: string) => {
    const newProfile = { ...profileData, [key]: value };
    setProfileData(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    
    // Update display name if name is changed
    if (key === 'name') {
      localStorage.setItem('displayName', value);
      if (setUserInfo) {
        setUserInfo({
          ...userInfo!,
          name: value
        });
      }
    }
  };

  const clearCache = () => {
    localStorage.removeItem('savedNews');
    localStorage.removeItem('lastNewsVisit');
    alert('Đã xóa cache thành công!');
  };

  const resetSettings = () => {
    const defaultSettings = {
      notifications: true,
      autoRefresh: true,
      theme: 'light' as const,
      language: 'vi' as const,
      soundEnabled: true
    };
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    alert('Đã khôi phục cài đặt mặc định!');
  };

  const refreshSchoolInfo = () => {
    // Force refresh school information
    const updatedSchoolSettings = {
      address: "47 Cao Lỗ, Phường Chánh Hưng, TP. Hồ Chí Minh",
      phone: "0981146179",
      website: "https://namsaigon.edu.vn",
      schoolName: "Trường Cao đẳng Nam Sài Gòn"
    };
    
    setSchoolSettings(updatedSchoolSettings);
    localStorage.setItem('schoolSettings', JSON.stringify(updatedSchoolSettings));
    
    alert('✅ Đã cập nhật thông tin trường thành công!');
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Cài đặt"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />

      {/* Spacing to prevent header overlap */}
      <Box className="h-4"></Box>

      {/* Profile Settings */}
      <Box className="p-4">
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4 flex items-center">
            <Icon icon="zi-user" className="mr-2" />
            Thông tin cá nhân
          </Text.Title>
          
          <Box className="space-y-4">
            <Button 
              fullWidth 
              variant="secondary" 
              onClick={handleSyncWithZalo}
              className="mb-4"
            >
              <Icon icon="zi-user" className="mr-2" />
              Đồng bộ thông tin với Zalo
            </Button>

            <Box>
              <Text className="text-gray-700 mb-2">Tên hiển thị</Text>
              <Input
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full"
              />
            </Box>
            
            <Box>
              <Text className="text-gray-700 mb-2">Email</Text>
              <Input
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full"
              />
              <Text className="text-gray-500 text-xs mt-1">
                ℹ️ Cần nhập thủ công
              </Text>
            </Box>
            
            <Box>
              <Text className="text-gray-700 mb-2">Số điện thoại</Text>
              <Input
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full"
              />
              <Text className="text-gray-500 text-xs mt-1">
                ℹ️ Cần nhập thủ công
              </Text>
            </Box>
          </Box>
        </Box>

        {/* App Settings */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4">Cài đặt ứng dụng</Text.Title>
          
          <Box className="space-y-4">
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">Thông báo</Text>
                <Text className="text-gray-500 text-sm">Nhận thông báo tin tức mới</Text>
              </Box>
              <Switch
                checked={settings.notifications}
                onChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </Box>
            
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">Tự động làm mới</Text>
                <Text className="text-gray-500 text-sm">Cập nhật tin tức tự động</Text>
              </Box>
              <Switch
                checked={settings.autoRefresh}
                onChange={(checked) => handleSettingChange('autoRefresh', checked)}
              />
            </Box>
            
            <Box>
              <Text className="text-gray-800 font-medium mb-2">Giao diện</Text>
              <Box className="flex space-x-2">
                {[
                  { key: 'light', label: 'Sáng' },
                  { key: 'dark', label: 'Tối' },
                  { key: 'auto', label: 'Tự động' }
                ].map((theme) => (
                  <Button
                    key={theme.key}
                    size="small"
                    variant={settings.theme === theme.key ? "primary" : "secondary"}
                    onClick={() => handleSettingChange('theme', theme.key)}
                    className={settings.theme === theme.key ? "bg-blue-600 text-white" : ""}
                  >
                    {theme.label}
                  </Button>
                ))}
              </Box>
            </Box>
            
            <Box>
              <Text className="text-gray-800 font-medium mb-2">Ngôn ngữ</Text>
              <Box className="flex space-x-2">
                {[
                  { key: 'vi', label: 'Tiếng Việt' },
                  { key: 'en', label: 'English' }
                ].map((lang) => (
                  <Button
                    key={lang.key}
                    size="small"
                    variant={settings.language === lang.key ? "primary" : "secondary"}
                    onClick={() => handleSettingChange('language', lang.key)}
                    className={settings.language === lang.key ? "bg-blue-600 text-white" : ""}
                  >
                    {lang.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* About School */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4">Thông tin trường học</Text.Title>
          
          <Box className="space-y-3">
            <Box className="flex items-center">
              <Icon icon="zi-location" className="text-gray-500 mr-3" />
              <Box>
                <Text className="text-gray-800 font-medium">Địa chỉ</Text>
                <Text className="text-gray-600 text-sm">{schoolSettings.address}</Text>
              </Box>
            </Box>
            
            <Box className="flex items-center">
              <Icon icon="zi-call" className="text-gray-500 mr-3" />
              <Box>
                <Text className="text-gray-800 font-medium">Hotline</Text>
                <Text className="text-gray-600 text-sm">{schoolSettings.phone}</Text>
              </Box>
            </Box>
            
            <Box className="flex items-center">
              <Icon icon="zi-share-solid" className="text-gray-500 mr-3" />
              <Box>
                <Text className="text-gray-800 font-medium">Website</Text>
                <Text className="text-gray-600 text-sm">{schoolSettings.website}</Text>
              </Box>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="secondary"
                className="flex flex-col items-center p-4 border-gray-200"
                onClick={() => window.location.href = "tel:" + schoolSettings.phone}
              >
                <Icon icon="zi-call" className="mb-2 text-green-600" />
                <Text className="text-sm">Gọi điện</Text>
              </Button>

              <Button
                variant="secondary"
                className="flex flex-col items-center p-4 border-gray-200"
                onClick={() => window.open(schoolSettings.website, "_blank")}
              >
                <Icon icon="zi-location" className="mb-2 text-purple-600" />
                <Text className="text-sm">Website</Text>
              </Button>

              <Button
                variant="secondary"
                className="flex flex-col items-center p-4 border-gray-200"
                onClick={refreshSchoolInfo}
              >
                <Icon icon="zi-clock-1" className="mb-2 text-blue-600" />
                <Text className="text-sm">Cập nhật</Text>
              </Button>
            </div>
          </Box>
        </Box>

        {/* Notification Settings */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4 flex items-center">
            <Icon icon="zi-notif" className="mr-2" />
            Cài đặt thông báo
          </Text.Title>
          
          <Box className="space-y-4">
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">Thông báo tin tức mới</Text>
                <Text className="text-gray-600 text-sm">Nhận thông báo khi có tin tức mới</Text>
              </Box>
              <Button
                size="small"
                variant={settings.notifications ? "primary" : "secondary"}
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
              >
                {settings.notifications ? "Bật" : "Tắt"}
              </Button>
            </Box>
            
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">Âm thanh thông báo</Text>
                <Text className="text-gray-600 text-sm">Phát âm thanh khi có thông báo</Text>
              </Box>
              <Button
                size="small"
                variant={settings.soundEnabled ? "primary" : "secondary"}
                onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
              >
                {settings.soundEnabled ? "Bật" : "Tắt"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4 flex items-center">
            <Icon icon="zi-more-grid" className="mr-2" />
            Thao tác nhanh
          </Text.Title>
          
          <Box className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => navigate('/notifications')}
            >
              <Icon icon="zi-chat" className="mb-2 text-red-600" />
              <Text className="text-sm">Xem thông báo</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => {
                const news = localStorage.getItem('adminNewsList');
                const majors = localStorage.getItem('adminMajorsList');
                const notifications = localStorage.getItem('userNotifications');
                
                alert(`📊 Thống kê dữ liệu:\n\n• Tin tức: ${news ? JSON.parse(news).length : 0} bài\n• Ngành học: ${majors ? JSON.parse(majors).length : 0} ngành\n• Thông báo: ${notifications ? JSON.parse(notifications).length : 0} thông báo`);
              }}
            >
              <Icon icon="zi-bookmark" className="mb-2 text-blue-600" />
              <Text className="text-sm">Thống kê dữ liệu</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => {
                if (navigator.onLine) {
                  alert('🌐 Kết nối internet: Tốt\n📶 Trạng thái: Online');
                } else {
                  alert('❌ Không có kết nối internet\n📶 Trạng thái: Offline');
                }
              }}
            >
              <Icon icon="zi-wifi" className="mb-2 text-blue-600" />
              <Text className="text-sm">Kiểm tra mạng</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => {
                const version = "1.0.0";
                const buildDate = "2025-09-23";
                alert(`📱 Thông tin ứng dụng:\n\n• Phiên bản: ${version}\n• Ngày build: ${buildDate}\n• Platform: Zalo Mini App\n• Trường: Cao đẳng Bách khoa Nam Sài Gòn`);
              }}
            >
              <Icon icon="zi-info-circle" className="mb-2 text-green-600" />
              <Text className="text-sm">Thông tin app</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => window.open(schoolSettings.website, "_blank")}
            >
              <Icon icon="zi-location" className="mb-2 text-purple-600" />
              <Text className="text-sm">Website NSG</Text>
            </Button>
          </Box>
        </Box>

        {/* System Actions */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4">Hệ thống</Text.Title>
          
          <Box className="space-y-3">
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200"
              onClick={clearCache}
            >
              <Icon icon="zi-delete" className="mr-3 text-gray-500" />
              Xóa cache ứng dụng
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200"
              onClick={resetSettings}
            >
              <Icon icon="zi-setting" className="mr-3 text-gray-500" />
              Khôi phục cài đặt gốc
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200"
              onClick={() => navigate('/about')}
            >
              <Icon icon="zi-info-circle" className="mr-3 text-gray-500" />
              Về ứng dụng
            </Button>
            
            {/* Debug Menu */}
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-orange-200 bg-orange-50"
              onClick={() => navigate('/profile-debug')}
            >
              <Icon icon="zi-setting" className="mr-3 text-orange-500" />
              <Text className="text-orange-600">🐛 Debug Profile (Dev)</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-green-200 bg-green-50"
              onClick={() => navigate('/profile-simple')}
            >
              <Icon icon="zi-user" className="mr-3 text-green-500" />
              <Text className="text-green-600">👤 Profile Simple</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-blue-200 bg-blue-50"
              onClick={() => navigate('/profile-v2')}
            >
              <Icon icon="zi-user" className="mr-3 text-blue-500" />
              <Text className="text-blue-600">🚀 Profile V2 (Alternative)</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-purple-200 bg-purple-50"
              onClick={() => navigate('/profile')}
            >
              <Icon icon="zi-user" className="mr-3 text-purple-500" />
              <Text className="text-purple-600">🏠 Profile Gốc (Chính thức)</Text>
            </Button>
          </Box>
        </Box>

        {/* App Version */}
        <Box className="text-center py-4">
          <Text className="text-gray-500 text-sm">
            Phiên bản 1.0.0 - Trường Cao đẳng Bách khoa Nam Sài Gòn
          </Text>
        </Box>

        {/* Bottom padding for navigation */}
        <Box className="h-20"></Box>
      </Box>
    </Page>
  );
}

export default SettingsPage;