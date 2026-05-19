import { getSystemInfo } from "zmp-sdk";
import React, { useState, useEffect } from "react";
import {
  AnimationRoutes,
  App,
  Route,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import NewsPage from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import ProfilePage from "@/pages/profile";
import MajorsPage from "@/pages/majors";
import MajorDetailPage from "@/pages/major-detail";
import AdmissionRegistrationPage from "@/pages/admission-registration";
import AdminPageSimple from "@/pages/admin-simple"; // Use simple version
import AdminNewsPage from "@/pages/admin-news";
import AdminUsersPage from "@/pages/admin-users";
import AdminMajorsPage from "@/pages/admin-majors";
import AdminBannersPage from "@/pages/admin-banners";
import AdminApplicationsPage from "@/pages/admin-applications";
import AdminStatsPage from "@/pages/admin-stats";
import AdminSettingsPage from "@/pages/admin-settings";
import NewsEditorPage from "@/pages/news-editor";
import SettingsPage from "@/pages/settings";
import NotificationsPage from "@/pages/notifications";
import AboutPage from "@/pages/about";
import DebugPage from "@/pages/debug";
import ZaloTestPage from "@/pages/zalo-test";
import ZaloPermissionTestPage from "@/pages/zalo-permission-test";
import ZaloOATestPage from "@/pages/zalo-oa-test";
import ProfileDebugPage from "@/pages/profile-debug";
import ProfilePageSimple from "@/pages/profile-simple";
import ProfilePageV2 from "@/pages/profile-v2";
import OAChecker from "@/pages/oa-checker";
import { Header } from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import ZaloLogin from "@/components/zalo-login";
import { UserProvider } from "@/contexts/user-context";
import { saveZaloUserLogin } from "@/utils/user-management";

const Layout = () => {
  const [appTheme, setAppTheme] = useState<AppProps["theme"]>('light');
  const [isZaloLoggedIn, setIsZaloLoggedIn] = useState(false);
  const [zaloUserInfo, setZaloUserInfo] = useState(null);

  useEffect(() => {
    // Load theme from settings
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        let theme: AppProps["theme"] = 'light';
        
        if (settings.theme === 'dark') {
          theme = 'dark';
        } else if (settings.theme === 'auto') {
          // Use system theme for auto
          theme = getSystemInfo().zaloTheme as AppProps["theme"];
        } else {
          theme = 'light';
        }
        
        setAppTheme(theme);
      } catch (e) {
        console.error('Error parsing app settings:', e);
        setAppTheme(getSystemInfo().zaloTheme as AppProps["theme"]);
      }
    } else {
      // Fallback to system theme
      setAppTheme(getSystemInfo().zaloTheme as AppProps["theme"]);
    }

    // Listen for storage changes to update theme dynamically
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appSettings' && e.newValue) {
        try {
          const settings = JSON.parse(e.newValue);
          let theme: AppProps["theme"] = 'light';
          
          if (settings.theme === 'dark') {
            theme = 'dark';
          } else if (settings.theme === 'auto') {
            theme = getSystemInfo().zaloTheme as AppProps["theme"];
          } else {
            theme = 'light';
          }
          
          setAppTheme(theme);
        } catch (e) {
          console.error('Error parsing updated settings:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check Zalo login status on mount
  useEffect(() => {
    const checkZaloLogin = () => {
      const savedUserInfo = localStorage.getItem('zaloUserInfo');
      const loginStatus = localStorage.getItem('isZaloLoggedIn') === 'true';
      
      if (savedUserInfo && loginStatus) {
        try {
          const userInfo = JSON.parse(savedUserInfo);
          setZaloUserInfo(userInfo);
          setIsZaloLoggedIn(true);
          console.log('✅ Zalo user logged in:', userInfo);
        } catch (error) {
          console.error('Error parsing saved user info:', error);
          localStorage.removeItem('zaloUserInfo');
          localStorage.removeItem('isZaloLoggedIn');
        }
      }
    };

    checkZaloLogin();
  }, []);

  const handleZaloLoginSuccess = (userInfo: any) => {
    setZaloUserInfo(userInfo);
    setIsZaloLoggedIn(true);
    
    // Save user info to user management system
    saveZaloUserLogin(userInfo);
    
    console.log('🎉 Zalo login successful:', userInfo);
    console.log('💾 User info saved to admin system');
  };

  return (
    <App theme={appTheme}>
      <UserProvider>
        <ZMPRouter>
                    <AnimationRoutes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/news" element={<NewsPage />}></Route>
            <Route path="/news/:id" element={<NewsDetail />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/profile-debug" element={<ProfileDebugPage />}></Route>
            <Route path="/profile-simple" element={<ProfilePageSimple />}></Route>
            <Route path="/profile-v2" element={<ProfilePageV2 />}></Route>
            <Route path="/oa-checker" element={<OAChecker />}></Route>
            <Route path="/majors" element={<MajorsPage />}></Route>
            <Route path="/majors/:id" element={<MajorDetailPage />}></Route>
            <Route path="/admission-registration" element={<AdmissionRegistrationPage />}></Route>
            <Route path="/admin" element={<AdminPageSimple />}></Route>
            <Route path="/admin/news" element={<AdminNewsPage />}></Route>
            <Route path="/admin/users" element={<AdminUsersPage />}></Route>
            <Route path="/admin/majors" element={<AdminMajorsPage />}></Route>
            <Route path="/admin/banners" element={<AdminBannersPage />}></Route>
            <Route path="/admin/applications" element={<AdminApplicationsPage />}></Route>
            <Route path="/admin/stats" element={<AdminStatsPage />}></Route>
            <Route path="/admin/settings" element={<AdminSettingsPage />}></Route>
            <Route path="/news-editor" element={<NewsEditorPage />}></Route>
            <Route path="/settings" element={<SettingsPage />}></Route>
            <Route path="/notifications" element={<NotificationsPage />}></Route>
            <Route path="/about" element={<AboutPage />}></Route>
            <Route path="/debug" element={<DebugPage />}></Route>
            <Route path="/zalo-test" element={<ZaloTestPage />}></Route>
            <Route path="/zalo-permission-test" element={<ZaloPermissionTestPage />}></Route>
            <Route path="/zalo-oa-test" element={<ZaloOATestPage />}></Route>
          </AnimationRoutes>
          <BottomNavigation />
        </ZMPRouter>
      </UserProvider>
    </App>
  );
};
export default Layout;
