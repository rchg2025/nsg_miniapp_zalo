import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header, Avatar, List } from "zmp-ui";
import { authorize, getUserInfo } from "zmp-sdk/apis";
import { useUser } from "@/contexts/user-context";
import { UserRole } from "@/types";
import OAFollowCheck from "@/components/oa-follow-check";
import AdminLogin from "@/components/admin-login-new";
import { useNavigate } from "react-router-dom";
// Simplified imports - commented out problematic ones
// import { getNotificationStats, markAllNotificationsAsRead } from "@/utils/notifications";
// import { DataManager } from "@/utils/data-manager";
// import { ZaloUserService, ZaloUserInfo } from "@/utils/zalo-user-service";
import UserProfile from "@/components/user-profile";
import { useZaloUser } from "@/hooks/useZaloUser";
import { ZaloOAService } from "@/utils/zalo-oa-service";
import { OA_CONFIG } from "@/config/oa-config";

function ProfilePage() {
  const { userInfo, setUserInfo, isLoggedIn, isAdmin, isTeacher } = useUser();
  const { userInfo: zaloUserInfo, loading: zaloLoading, error: zaloError } = useZaloUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showOACheck, setShowOACheck] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isOAFollowed, setIsOAFollowed] = useState(false);
  const [savedNewsCount, setSavedNewsCount] = useState(0);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [interestedMajorsCount, setInterestedMajorsCount] = useState(0);
  const navigate = useNavigate();

  // Error boundary để bắt lỗi
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cleanupFunctions: (() => void)[] = [];

    try {
      const followStatus = ZaloOAService.isOAFollowed();
      setIsOAFollowed(followStatus);

      // Load saved news count từ localStorage thực tế
      const savedNews = JSON.parse(localStorage.getItem('user_saved_news') || '[]');
      setSavedNewsCount(savedNews.length);

      // Load notification count using utility function
      const loadStats = () => {
        try {
          // Simplified stats loading
          const savedNews = JSON.parse(localStorage.getItem('user_saved_news') || '[]');
          setSavedNewsCount(savedNews.length);
          
          // Simplified notification count
          setNewNotificationsCount(0); // Temporary simplified
          console.log('📊 Profile stats loaded (simplified)');

          // Load majors count từ dữ liệu thực tế trong app
          const majorsData = JSON.parse(localStorage.getItem('app_majors_data') || '[]');
          const adminMajors = JSON.parse(localStorage.getItem('adminMajorsList') || '[]');
          const totalMajors = Math.max(majorsData.length, adminMajors.length, 6); // Tối thiểu 6 ngành
          setInterestedMajorsCount(totalMajors);
        } catch (error) {
          console.error('Error loading stats:', error);
          setHasError(true);
        }
      };

      loadStats();

      // Listen for notification updates
      const handleNotificationUpdate = () => {
        loadStats();
      };

      window.addEventListener('notifications-updated', handleNotificationUpdate);
      window.addEventListener('storage', handleNotificationUpdate);

      // Đồng bộ tên hiển thị nếu có thay đổi ở localStorage
      const syncDisplayName = () => {
        try {
          const displayName = localStorage.getItem('displayName');
          if (displayName && userInfo && displayName !== userInfo.name) {
            setUserInfo({ ...userInfo, name: displayName });
          }
        } catch (error) {
          console.error('Error syncing display name:', error);
        }
      };
      
      window.addEventListener('storage', syncDisplayName);
      const displayNameInterval = setInterval(syncDisplayName, 2000);

      // Check for updates periodically
      const interval = setInterval(loadStats, 2000);

      cleanupFunctions.push(() => {
        window.removeEventListener('notifications-updated', handleNotificationUpdate);
        window.removeEventListener('storage', handleNotificationUpdate);
        window.removeEventListener('storage', syncDisplayName);
        clearInterval(interval);
        clearInterval(displayNameInterval);
      });
    } catch (error) {
      console.error('Error in profile useEffect:', error);
      setHasError(true);
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [userInfo, setUserInfo]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Request authorization
      await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"]
      });

      // Get user info after authorization
      const user = await getUserInfo({});
      if (user.userInfo) {
        // Role sẽ được xác định từ user context dựa trên Zalo ID
        // Không cần mock role ở đây nữa
        setUserInfo({
          id: user.userInfo.id,
          name: user.userInfo.name,
          avatar: user.userInfo.avatar,
          role: UserRole.STUDENT, // Default, sẽ được cập nhật bởi context
          permissions: [] // Sẽ được cập nhật bởi context
        });

        // Kiểm tra xem đã follow OA chưa
        const followStatus = ZaloOAService.isOAFollowed();
        if (!followStatus) {
          setShowOACheck(true);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    // You might want to clear any stored user data here
  };

  const handleOAFollowComplete = () => {
    setIsOAFollowed(true);
    setShowOACheck(false);
  };

  const handleAdminLoginSuccess = () => {
    console.log('✅ Admin login successful!');
    console.log('Closing modal and navigating to admin...');
    setShowAdminLogin(false);
    navigate("/admin");
  };

  const handleAdminAccess = () => {
    console.log('🔧 Admin Access Debug:');
    console.log('User info:', userInfo);
    console.log('Is Admin:', isAdmin);
    console.log('Is Teacher:', isTeacher);
    
    // Kiểm tra session admin trước
    const adminStatus = localStorage.getItem("admin_logged_in");
    const loginTime = localStorage.getItem("admin_login_time");
    
    if (adminStatus === "true" && loginTime) {
      const now = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const hoursDiff = (now - loginTimestamp) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        // Session còn hạn, vào admin ngay
        console.log('✅ Valid session, navigating to admin...');
        navigate("/admin");
        return;
      } else {
        // Session hết hạn, xóa và yêu cầu đăng nhập lại
        console.log('⏰ Session expired, clearing...');
        localStorage.removeItem("admin_logged_in");
        localStorage.removeItem("admin_login_time");
      }
    }
    
    // Hiển thị modal đăng nhập admin
    console.log('🔑 Showing admin login modal...');
    setShowAdminLogin(true);
  };

  const checkOABeforeAction = (action: () => void) => {
    if (!isOAFollowed) {
      setShowOACheck(true);
    } else {
      action();
    }
  };

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Quản trị viên";
      case UserRole.TEACHER:
        return "Giáo viên";
      case UserRole.STUDENT:
        return "";
      default:
        return "";
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "text-red-600";
      case UserRole.TEACHER:
        return "text-blue-600";
      case UserRole.STUDENT:
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Hàm xử lý quan tâm Zalo OA
  const handleFollowOA = async () => {
    try {
      console.log('🔗 [PROFILE] Attempting to follow OA...');
      const result = await ZaloOAService.followOA();
      
      if (result.success) {
        setIsOAFollowed(true);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Follow OA unexpected error:", error);
      alert("❌ Đã xảy ra lỗi không mong muốn. Vui lòng thử lại!");
    }
  };

  // Hàm xử lý hỗ trợ qua chat
  const handleSupport = async () => {
    try {
      console.log('💬 [PROFILE] Attempting to open support chat...');
      const result = await ZaloOAService.openSupportChat();
      
      if (!result.success) {
        alert(result.message);
      }
      // Không hiển thị thông báo thành công vì chat sẽ tự mở
    } catch (error) {
      console.error("Open chat unexpected error:", error);
      alert("❌ Đã xảy ra lỗi không mong muốn. Vui lòng thử lại!");
    }
  };

  // Tạo menu items dựa trên trạng thái đăng nhập và vai trò
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: "zi-bookmark",
        title: "Tin tức đã lưu",
        subtitle: `${savedNewsCount} tin tức đã lưu`,
        action: () => navigate('/news?category=saved'),
        color: "text-blue-600",
        show: true
      },
      {
        icon: "zi-chat",
        title: "Thông báo",
        subtitle: `${newNotificationsCount} thông báo chưa đọc`,
        action: () => {
          // markAllNotificationsAsRead(); // Simplified - commented out
          setNewNotificationsCount(0);
          navigate('/notifications');
        },
        color: "text-green-600",
        show: true
      },
      {
        icon: "zi-heart",
        title: isOAFollowed ? "Đã quan tâm OA" : "Quan tâm Zalo OA",
        subtitle: isOAFollowed ? "Đã theo dõi thông tin từ trường" : "Nhận thông tin mới nhất từ trường",
        action: isOAFollowed ? () => alert("✅ Bạn đã quan tâm Zalo OA!") : handleFollowOA,
        color: isOAFollowed ? "text-green-600" : "text-red-600",
        show: true
      },
      {
        icon: "zi-call",
        title: "Hỗ trợ trực tuyến",
        subtitle: "Chat trực tiếp với nhà trường",
        action: handleSupport,
        color: "text-purple-600",
        show: true
      },
      {
        icon: "zi-admin",
        title: "Đăng nhập Admin",
        subtitle: "Truy cập trang quản trị hệ thống",
        action: handleAdminAccess,
        color: "text-red-600",
        show: true // Luôn hiển thị để có thể đăng nhập admin
      },
      {
        icon: "zi-setting",
        title: "Cài đặt",
        subtitle: "Thông tin cá nhân và ứng dụng",
        action: () => navigate('/settings'),
        color: "text-gray-600",
        show: userInfo !== null // Chỉ hiển thị khi đã đăng nhập
      }
    ];

    return baseItems.filter(item => item.show);
  };

  const menuItems = getMenuItems();

  // Error state
  if (hasError) {
    return (
      <Page className="page-with-header bg-gray-50">
        <Header 
          title="Cá nhân"
          showBackIcon={false}
          className="bg-blue-600 text-white"
        />
        <Box className="p-4 text-center">
          <Text className="text-red-600 mb-4">❌ Đã xảy ra lỗi khi tải trang</Text>
          <Button 
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
          >
            Thử lại
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Cá nhân"
        showBackIcon={false}
        className="bg-blue-600 text-white"
      />
      
      {/* Notification button - positioned absolutely */}
      {userInfo && (
        <Box className="absolute top-4 right-4 z-20">
          <Button
            size="small"
            variant="tertiary"
            className="relative bg-white/20 rounded-full"
            onClick={() => {
              // Mark all notifications as read when clicking
              // markAllNotificationsAsRead(); // Simplified - commented out
              setNewNotificationsCount(0);
              navigate('/notifications');
            }}
          >
            <Icon icon="zi-notif" className="text-white text-lg" />
            {newNotificationsCount > 0 && (
              <Box className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {newNotificationsCount}
              </Box>
            )}
          </Button>
        </Box>
      )}

      {/* User Profile Section */}
      <Box className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <Box className="p-6">
          {zaloLoading ? (
            // Loading state
            <Box className="flex items-center space-x-4">
              <Box className="w-20 h-20 bg-white/20 rounded-full animate-pulse"></Box>
              <Box className="flex-1">
                <Box className="h-6 bg-white/20 rounded mb-2 animate-pulse"></Box>
                <Box className="h-4 bg-white/20 rounded mb-1 animate-pulse"></Box>
                <Box className="h-4 bg-white/20 rounded animate-pulse"></Box>
              </Box>
            </Box>
          ) : zaloError ? (
            // Error state
            <Box className="text-center">
              <Text className="text-red-200 mb-2">❌ Không thể lấy thông tin Zalo</Text>
              <Text className="text-blue-200 text-sm">{zaloError}</Text>
            </Box>
          ) : zaloUserInfo ? (
            // Zalo user logged in state
            <Box className="flex items-center space-x-4">
              <Avatar
                src={zaloUserInfo.avatar}
                size={80}
                className="border-4 border-white/20"
              />
              <Box className="flex-1">
                <Text.Title className="text-white text-xl font-bold mb-1">
                  {zaloUserInfo.name}
                </Text.Title>
                <Text className="text-blue-200 text-sm mb-1">
                  👤 Người dùng Zalo
                </Text>
                <Text className="text-blue-100 text-sm mb-3">
                  Trường Cao đẳng Bách khoa Nam Sài Gòn • ID: {zaloUserInfo.id.substring(0, 8)}...
                </Text>
              </Box>
            </Box>
          ) : userInfo ? (
            // Fallback to old user info system
            <Box className="flex items-center space-x-4">
              <Avatar
                src={userInfo.avatar}
                size={80}
                className="border-4 border-white/20"
              />
              <Box className="flex-1">
                <Text.Title className="text-white text-xl font-bold mb-1">
                  {localStorage.getItem('displayName') || userInfo.name}
                </Text.Title>
                <Text className={`text-sm font-medium mb-1 ${
                  userInfo.role === UserRole.ADMIN ? 'text-yellow-300' :
                  userInfo.role === UserRole.TEACHER ? 'text-green-300' :
                  'text-blue-200'
                }`}>
                  {getRoleDisplay(userInfo.role)}
                </Text>
                <Text className="text-blue-100 text-sm mb-3">
                  Trường Cao đẳng Bách khoa Nam Sài Gòn • ID: {userInfo.id}
                </Text>
                <Box className="flex space-x-2">
                  {(isAdmin || isTeacher) && (
                    <Button
                      size="small"
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 text-xs"
                      onClick={() => window.location.href = "/news-editor"}
                    >
                      <Icon icon="zi-edit" className="mr-1" />
                      Viết bài
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            // Not logged in state
            <Box className="text-center py-4">
              <Box className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="zi-user" className="text-white text-4xl" />
              </Box>
              <Text.Title className="text-white text-xl font-bold mb-2">
                Chào mừng đến với Trường Cao đẳng Bách khoa Nam Sài Gòn
              </Text.Title>
              <Text className="text-blue-100 mb-2 text-sm">
                Đăng nhập để trải nghiệm đầy đủ tính năng
              </Text>
              <Text className="text-blue-200 text-xs px-4">
                🎓 Đào tạo chất lượng cao • 📚 6 ngành đào tạo hot • 🌟 Môi trường học tập hiện đại
              </Text>
              <Button
                variant="secondary"
                className="bg-white text-blue-600 font-medium"
                loading={isLoading}
                onClick={handleLogin}
                icon={<Icon icon="zi-user" />}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập bằng Zalo"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Quick Stats */}
      {userInfo && (
        <Box className="bg-white mx-4 rounded-lg shadow-md -mt-6 relative z-10">
          <Box className="grid grid-cols-3 divide-x divide-gray-200">
            <Box className="text-center py-4">
              <Text.Title className="text-2xl font-bold text-blue-600">{savedNewsCount}</Text.Title>
              <Text className="text-gray-500 text-sm">Tin đã lưu</Text>
            </Box>
            <Box className="text-center py-4">
              <Text.Title className="text-2xl font-bold text-green-600">{newNotificationsCount}</Text.Title>
              <Text className="text-gray-500 text-sm">Thông báo mới</Text>
            </Box>
            <Box className="text-center py-4">
              <Text.Title className="text-2xl font-bold text-orange-600">{interestedMajorsCount}</Text.Title>
              <Text className="text-gray-500 text-sm">Ngành đào tạo</Text>
            </Box>
          </Box>
        </Box>
      )}

      {/* User Permissions */}
      {userInfo && userInfo.permissions && userInfo.permissions.length > 0 && (
        <Box className="mx-4 mt-4 bg-white rounded-lg shadow-md p-4">
          <Text.Title className="text-gray-800 mb-3">Quyền hạn của bạn</Text.Title>
          <Box className="flex flex-wrap gap-2">
            {userInfo.permissions.map((permission, index) => (
              <Box 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {permission}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Admin Quick Actions */}
      {userInfo && isAdmin && (
        <Box className="mx-4 mt-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md p-4">
          <Text.Title className="text-white mb-3">Quản trị viên</Text.Title>
          <Box className="space-y-2">
            <Button
              fullWidth
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
              onClick={() => window.location.href = "/admin"}
            >
              <Icon icon="zi-setting" className="mr-2" />
              Bảng điều khiển quản trị
            </Button>
          </Box>
        </Box>
      )}

      {/* Menu Items */}
      <Box className="p-4 mt-4">
        <Text.Title className="mb-3 text-gray-800">Chức năng</Text.Title>
        <List className="bg-white rounded-lg shadow-sm">
          {menuItems.map((item, index) => (
            <List.Item
              key={index}
              className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                index === menuItems.length - 1 ? '' : 'border-b border-gray-100'
              }`}
              onClick={item.action}
            >
              <Box className="flex items-center py-4">
                <Box className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                  item.color === 'text-blue-600' ? 'bg-blue-50' :
                  item.color === 'text-green-600' ? 'bg-green-50' :
                  item.color === 'text-red-600' ? 'bg-red-50' :
                  item.color === 'text-purple-600' ? 'bg-purple-50' :
                  'bg-gray-50'
                }`}>
                  <Icon icon={item.icon as any} className={`text-xl ${item.color}`} />
                </Box>
                <Box className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">{item.title}</Text>
                  <Text className="text-sm text-gray-500 mt-1 leading-relaxed">{item.subtitle}</Text>
                </Box>
                <Icon icon="zi-arrow-right" className="text-gray-400 text-lg" />
              </Box>
            </List.Item>
          ))}
        </List>
      </Box>

      {/* School Information */}
      <Box className="p-4">
        <Box className="bg-white rounded-lg shadow-sm p-4">
          <Box className="flex items-center mb-3">
            <Box className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Icon icon="zi-home" className="text-white text-xl" />
            </Box>
            <Box>
              <Text.Title className="text-gray-800">Trường Cao đẳng Bách khoa Nam Sài Gòn</Text.Title>
              <Text className="text-gray-500 text-sm">Trường Cao đẳng Công lập</Text>
            </Box>
          </Box>
          
          <Box className="space-y-2">
            <Box className="flex items-center">
              <Icon icon="zi-location" className="text-gray-400 mr-2" />
              <Text className="text-gray-600 text-sm">47 Cao Lỗ, Phường Chánh Hưng, TP. Hồ Chí Minh</Text>
            </Box>
            <Box className="flex items-center">
              <Icon icon="zi-call" className="text-gray-400 mr-2" />
              <Text className="text-gray-600 text-sm">0981146179</Text>
            </Box>
            <Box className="flex items-center">
              <Icon icon="zi-more-grid" className="text-gray-400 mr-2" />
              <Text 
                className="text-blue-600 text-sm cursor-pointer"
                onClick={() => window.open("https://namsaigon.edu.vn", "_blank")}
              >
                https://namsaigon.edu.vn
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Version Info */}
      <Box className="p-4 pb-20">
        <Text className="text-center text-gray-400 text-xs">
          Phiên bản 1.0.0 • © 2025 Trường Cao đẳng Bách khoa Nam Sài Gòn
        </Text>
        
        {/* Debug Admin Access - Click version 5 times to show */}
        <Box 
          className="text-center mt-2"
          onClick={() => {
            const clicks = parseInt(localStorage.getItem('debug_clicks') || '0') + 1;
            localStorage.setItem('debug_clicks', clicks.toString());
            
            if (clicks >= 5) {
              localStorage.setItem("admin_logged_in", "true");
              localStorage.setItem("admin_login_time", Date.now().toString());
              localStorage.removeItem('debug_clicks');
              alert('🔧 Debug: Admin access enabled!');
              navigate("/admin");
            } else if (clicks >= 3) {
              alert(`🔧 Debug mode: ${5 - clicks} more clicks to force admin access`);
            }
          }}
        >
          <Text className="text-gray-300 text-xs">v1.1.0-debug</Text>
        </Box>
      </Box>

      {/* OA Follow Check Modal */}
      {showOACheck && (
        <OAFollowCheck
          isRequired={false}
          onFollowComplete={handleOAFollowComplete}
          onCancel={() => setShowOACheck(false)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLogin
        isVisible={showAdminLogin}
        onLoginSuccess={handleAdminLoginSuccess}
        onCancel={() => setShowAdminLogin(false)}
      />
    </Page>
  );
}

export default ProfilePage;