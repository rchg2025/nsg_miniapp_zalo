import React, { useEffect, useState } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { PERMISSIONS } from "@/types";
import { DataManager } from "@/utils/data-manager";

interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  requirePermission?: string;
}

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useUser();
  const [savedNewsCount, setSavedNewsCount] = useState(0);
  
  // Load saved news count
  useEffect(() => {
    const loadSavedNewsCount = () => {
      const savedNews = DataManager.getSavedNewsForUser("user_1");
      setSavedNewsCount(savedNews.length);
    };
    
    loadSavedNewsCount();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadSavedNewsCount();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval to refresh count
    const interval = setInterval(loadSavedNewsCount, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

    const baseNavItems: BottomNavItem[] = [
    {
      id: "home",
      label: "Trang chủ",
      icon: "zi-home",
      path: "/"
    },
    {
      id: "news",
      label: "Tin tức",
      icon: "zi-bookmark",
      path: "/news"
    },
    {
      id: "majors",
      label: "Ngành đào tạo",
      icon: "zi-calendar",
      path: "/majors"
    },
    {
      id: "admission",
      label: "Đăng ký",
      icon: "zi-edit",
      path: "/admission-registration"
    }
  ];

  const adminNavItem: BottomNavItem = {
    id: "admin",
    label: "Quản trị",
    icon: "zi-setting",
    path: "/admin",
    requirePermission: PERMISSIONS.ADMIN_PANEL
  };

  // Add admin tab if user has permission
  const navItems = hasPermission(PERMISSIONS.ADMIN_PANEL) 
    ? [...baseNavItems.slice(0, 3), adminNavItem, baseNavItems[3]]
    : baseNavItems;

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <Box className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === "/news" && location.pathname.startsWith("/news")) ||
                          (item.path === "/admin" && location.pathname.startsWith("/admin"));
          
          return (
            <Button
              key={item.id}
              variant="tertiary"
              size="small"
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 ${
                isActive 
                  ? item.id === "admin" ? "text-red-600" : "text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => handleNavClick(item.path)}
            >
              <Icon 
                icon={item.icon as any} 
                className={`text-lg mb-1 ${
                  isActive 
                    ? item.id === "admin" ? "text-red-600" : "text-blue-600"
                    : "text-gray-500"
                }`} 
              />
              <Text 
                className={`text-xs leading-none ${
                  isActive 
                    ? item.id === "admin" ? "text-red-600 font-medium" : "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </Text>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

export default BottomNavigation;

