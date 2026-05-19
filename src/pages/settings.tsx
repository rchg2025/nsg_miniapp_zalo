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
    address: "47 Cao L�, Ph��ng Ch�nh H�ng, TP. H� Ch� Minh",
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
      // S� d�ng ZaloUserService � l�y th�ng tin c� b�n (t�n v� �nh �i di�n)
      const userInfo = await ZaloUserService.getUserInfo();
      console.log('[ZALO SYNC] userInfo:', userInfo);

      if (userInfo) {
        const updatedProfile = {
          ...profileData,
          name: userInfo.name || profileData.name,
          // Gi� nguy�n email v� s� i�n tho�i hi�n t�i
          email: profileData.email,
          phone: profileData.phone
        };

        setProfileData(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        localStorage.setItem('displayName', userInfo.name);

        // Also update the global user context
        if (setUserInfo) {
          // Import UserRole enum � d�ng �ng ki�u
          const { UserRole } = await import("@/types/index");
          setUserInfo({
            id: userInfo.id,
            name: userInfo.name,
            avatar: userInfo.avatar,
            role: UserRole.STUDENT, // Default role
            permissions: [] // Default permissions
          });
        }

        // L�u user v�o danh s�ch qu�n l� ng��i d�ng (adminUsersList)
        try {
          const { saveZaloUserLogin } = await import("@/utils/user-management");
          saveZaloUserLogin(userInfo);
          console.log('[ZALO SYNC] � l�u user v�o adminUsersList:', userInfo);
        } catch (err) {
          console.error('[ZALO SYNC] L�i khi l�u user v�o adminUsersList:', err);
        }

        // Th�ng b�o th�nh c�ng
        alert(` �ng b� th�ng tin v�i Zalo th�nh c�ng!\n\n" T�n: ${userInfo.name}\n" �nh �i di�n: � c�p nh�t\n" Email v� ST: C�n nh�p th� c�ng`);
      } else {
        alert('L Kh�ng th� l�y th�ng tin t� Zalo. Vui l�ng th� l�i.');
      }
    } catch (error) {
      console.error("L�i khi �ng b� v�i Zalo:", error);
      alert('L � x�y ra l�i khi c� g�ng �ng b� th�ng tin. Vui l�ng th� l�i.');
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
        address: "47 Cao L�, Ph��ng Ch�nh H�ng, TP. H� Ch� Minh",
        phone: "0981146179",
        website: "https://namsaigon.edu.vn"
      });
      // Also update localStorage with new info
      const updatedSettings = {
        ...parsed,
        address: "47 Cao L�, Ph��ng Ch�nh H�ng, TP. H� Ch� Minh",
        phone: "0981146179",
        website: "https://namsaigon.edu.vn"
      };
      localStorage.setItem('schoolSettings', JSON.stringify(updatedSettings));
    } else {
      // Set new default values
      const newSettings = {
        address: "47 Cao L�, Ph��ng Ch�nh H�ng, TP. H� Ch� Minh",
        phone: "0981146179",
        website: "https://namsaigon.edu.vn",
        schoolName: "Tr��ng Cao �ng Nam S�i G�n"
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
    alert('� x�a cache th�nh c�ng!');
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
    alert('� kh�i ph�c c�i �t m�c �nh!');
  };

  const refreshSchoolInfo = () => {
    // Force refresh school information
    const updatedSchoolSettings = {
      address: "47 Cao L�, Ph��ng Ch�nh H�ng, TP. H� Ch� Minh",
      phone: "0981146179",
      website: "https://namsaigon.edu.vn",
      schoolName: "Tr��ng Cao �ng Nam S�i G�n"
    };
    
    setSchoolSettings(updatedSchoolSettings);
    localStorage.setItem('schoolSettings', JSON.stringify(updatedSchoolSettings));
    
    alert(' � c�p nh�t th�ng tin tr��ng th�nh c�ng!');
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="C�i �t"
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
            Th�ng tin c� nh�n
          </Text.Title>
          
          <Box className="space-y-4">
            <Button 
              fullWidth 
              variant="secondary" 
              onClick={handleSyncWithZalo}
              className="mb-4"
            >
              <Icon icon="zi-user" className="mr-2" />
              �ng b� th�ng tin v�i Zalo
            </Button>

            <Box>
              <Text className="text-gray-700 mb-2">T�n hi�n th�</Text>
              <Input
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Nh�p t�n c�a b�n"
                className="w-full"
              />
            </Box>
            
            <Box>
              <Text className="text-gray-700 mb-2">Email</Text>
              <Input
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="Nh�p email c�a b�n"
                className="w-full"
              />
              <Text className="text-gray-500 text-xs mt-1">
                9 C�n nh�p th� c�ng
              </Text>
            </Box>
            
            <Box>
              <Text className="text-gray-700 mb-2">S� i�n tho�i</Text>
              <Input
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="Nh�p s� i�n tho�i"
                className="w-full"
              />
              <Text className="text-gray-500 text-xs mt-1">
                9 C�n nh�p th� c�ng
              </Text>
            </Box>
          </Box>
        </Box>

        {/* App Settings */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4">C�i �t �ng d�ng</Text.Title>
          
          <Box className="space-y-4">
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">Th�ng b�o</Text>
                <Text className="text-gray-500 text-sm">Nh�n th�ng b�o tin t�c m�i</Text>
              </Box>
              <Switch
                checked={settings.notifications}
                onChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </Box>
            
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">T� �ng l�m m�i</Text>
                <Text className="text-gray-500 text-sm">C�p nh�t tin t�c t� �ng</Text>
              </Box>
              <Switch
                checked={settings.autoRefresh}
                onChange={(checked) => handleSettingChange('autoRefresh', checked)}
              />
            </Box>
            
            <Box>
              <Text className="text-gray-800 font-medium mb-2">Giao di�n</Text>
              <Box className="flex space-x-2">
                {[
                  { key: 'light', label: 'S�ng' },
                  { key: 'dark', label: 'T�i' },
                  { key: 'auto', label: 'T� �ng' }
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
              <Text className="text-gray-800 font-medium mb-2">Ng�n ng�</Text>
              <Box className="flex space-x-2">
                {[
                  { key: 'vi', label: 'Ti�ng Vi�t' },
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
          <Text.Title className="text-blue-600 mb-4">Th�ng tin tr��ng h�c</Text.Title>
          
          <Box className="space-y-3">
            <Box className="flex items-center">
              <Icon icon="zi-location" className="text-gray-500 mr-3" />
              <Box>
                <Text className="text-gray-800 font-medium">�a ch�</Text>
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
                <Text className="text-sm">G�i i�n</Text>
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
                <Text className="text-sm">C�p nh�t</Text>
              </Button>
            </div>
          </Box>
        </Box>

        {/* Notification Settings */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4 flex items-center">
            <Icon icon="zi-notif" className="mr-2" />
            C�i �t th�ng b�o
          </Text.Title>
          
          <Box className="space-y-4">
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">Th�ng b�o tin t�c m�i</Text>
                <Text className="text-gray-600 text-sm">Nh�n th�ng b�o khi c� tin t�c m�i</Text>
              </Box>
              <Button
                size="small"
                variant={settings.notifications ? "primary" : "secondary"}
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
              >
                {settings.notifications ? "B�t" : "T�t"}
              </Button>
            </Box>
            
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-gray-800 font-medium">�m thanh th�ng b�o</Text>
                <Text className="text-gray-600 text-sm">Ph�t �m thanh khi c� th�ng b�o</Text>
              </Box>
              <Button
                size="small"
                variant={settings.soundEnabled ? "primary" : "secondary"}
                onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
              >
                {settings.soundEnabled ? "B�t" : "T�t"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4 flex items-center">
            <Icon icon="zi-more-grid" className="mr-2" />
            Thao t�c nhanh
          </Text.Title>
          
          <Box className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => navigate('/notifications')}
            >
              <Icon icon="zi-chat" className="mb-2 text-red-600" />
              <Text className="text-sm">Xem th�ng b�o</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => {
                const news = localStorage.getItem('adminNewsList');
                const majors = localStorage.getItem('adminMajorsList');
                const notifications = localStorage.getItem('userNotifications');
                
                alert(`=� Th�ng k� d� li�u:\n\n" Tin t�c: ${news ? JSON.parse(news).length : 0} b�i\n" Ng�nh h�c: ${majors ? JSON.parse(majors).length : 0} ng�nh\n" Th�ng b�o: ${notifications ? JSON.parse(notifications).length : 0} th�ng b�o`);
              }}
            >
              <Icon icon="zi-bookmark" className="mb-2 text-blue-600" />
              <Text className="text-sm">Th�ng k� d� li�u</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => {
                if (navigator.onLine) {
                  alert('< K�t n�i internet: T�t\n=� Tr�ng th�i: Online');
                } else {
                  alert('L Kh�ng c� k�t n�i internet\n=� Tr�ng th�i: Offline');
                }
              }}
            >
              <Icon icon="zi-wifi" className="mb-2 text-blue-600" />
              <Text className="text-sm">Ki�m tra m�ng</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="flex flex-col items-center p-4 border-gray-200"
              onClick={() => {
                const version = "1.0.0";
                const buildDate = "2025-09-23";
                alert(`=� Th�ng tin �ng d�ng:\n\n" Phi�n b�n: ${version}\n" Ng�y build: ${buildDate}\n" Platform: Zalo Mini App\n" Tr��ng: Cao �ng B�ch khoa Nam S�i G�n`);
              }}
            >
              <Icon icon="zi-info-circle" className="mb-2 text-green-600" />
              <Text className="text-sm">Th�ng tin app</Text>
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
          <Text.Title className="text-blue-600 mb-4">H� th�ng</Text.Title>
          
          <Box className="space-y-3">
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200"
              onClick={clearCache}
            >
              <Icon icon="zi-delete" className="mr-3 text-gray-500" />
              X�a cache �ng d�ng
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200"
              onClick={resetSettings}
            >
              <Icon icon="zi-setting" className="mr-3 text-gray-500" />
              Kh�i ph�c c�i �t g�c
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200"
              onClick={() => navigate('/about')}
            >
              <Icon icon="zi-info-circle" className="mr-3 text-gray-500" />
              V� �ng d�ng
            </Button>
            
            {/* Debug Menu */}
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-orange-200 bg-orange-50"
              onClick={() => navigate('/profile-debug')}
            >
              <Icon icon="zi-setting" className="mr-3 text-orange-500" />
              <Text className="text-orange-600">= Debug Profile (Dev)</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-green-200 bg-green-50"
              onClick={() => navigate('/profile-simple')}
            >
              <Icon icon="zi-user" className="mr-3 text-green-500" />
              <Text className="text-green-600">=d Profile Simple</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-blue-200 bg-blue-50"
              onClick={() => navigate('/profile-v2')}
            >
              <Icon icon="zi-user" className="mr-3 text-blue-500" />
              <Text className="text-blue-600">=� Profile V2 (Alternative)</Text>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full text-left border-gray-200 border-purple-200 bg-purple-50"
              onClick={() => navigate('/profile')}
            >
              <Icon icon="zi-user" className="mr-3 text-purple-500" />
              <Text className="text-purple-600">� Profile G�c (Ch�nh th�c)</Text>
            </Button>
          </Box>
        </Box>

        {/* App Version */}
        <Box className="text-center py-4">
          <Text className="text-gray-500 text-sm">
            Phi�n b�n 1.0.0 - Tr��ng Cao �ng B�ch khoa Nam S�i G�n
          </Text>
        </Box>

        {/* Bottom padding for navigation */}
        <Box className="h-20"></Box>
      </Box>
    </Page>
  );
}

export default SettingsPage;