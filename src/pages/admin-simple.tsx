import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header, List } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager } from "@/utils/data-manager";

function AdminPageSimple() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    newsCount: 0,
    usersCount: 0,
    majorsCount: 0,
    applicationsCount: 0
  });

  // Load statistics
  useEffect(() => {
    const loadStats = () => {
      const news = DataManager.getNews();
      const users = DataManager.getUsers();
      const majors = DataManager.getMajors();
      const applications = DataManager.getApplications();
      
      setStats({
        newsCount: news.length,
        usersCount: users.length,
        majorsCount: majors.length,
        applicationsCount: applications.length
      });
    };

    loadStats();
  }, []);

  // Kiểm tra quyền truy cập admin
  useEffect(() => {
    console.log('🔧 AdminPageSimple: Checking admin authentication...');
    
    const adminStatus = localStorage.getItem("admin_logged_in");
    const loginTime = localStorage.getItem("admin_login_time");
    
    console.log('Admin status:', adminStatus);
    console.log('Login time:', loginTime);
    
    if (adminStatus === "true" && loginTime) {
      const now = Date.now();
      const loginTimestamp = parseInt(loginTime || '0');
      const hoursDiff = (now - loginTimestamp) / (1000 * 60 * 60);
      
      console.log('Hours since login:', hoursDiff);
      
      if (hoursDiff < 24) {
        console.log('✅ Admin authentication valid');
        setIsAuthenticated(true);
        return;
      } else {
        console.log('❌ Admin session expired');
        localStorage.removeItem("admin_logged_in");
        localStorage.removeItem("admin_login_time");
      }
    }
    
    console.log('❌ No valid admin session, redirecting to profile');
    navigate("/profile");
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) {
      console.log('🚪 Admin logging out...');
      localStorage.removeItem("admin_logged_in");
      localStorage.removeItem("admin_login_time");
      navigate("/profile");
    }
  };

  if (!isAuthenticated) {
    return (
      <Page className="bg-gray-50">
        <Box className="flex items-center justify-center h-screen">
          <Text>Đang kiểm tra quyền truy cập...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Quản trị hệ thống" 
        showBackIcon={false}
        className="bg-blue-600 text-white"
      />
      
      {/* Main logout button in header */}
      <Box className="absolute top-2 right-2 z-50">
        <Button
          size="small"
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600 rounded-lg px-4 py-2 shadow-lg font-medium"
        >
          <Box className="flex items-center gap-2">
            <span>🚪</span>
            <span>Đăng xuất</span>
          </Box>
        </Button>
      </Box>

      <Box className="p-4">
        {/* Admin Dashboard */}
        <Box className="grid grid-cols-2 gap-4 mb-6">
          <Box className="bg-white rounded-lg p-4 shadow-sm text-center">
            <Box className="text-2xl mb-2">📰</Box>
            <Text className="font-medium">Tin tức</Text>
            <Text className="text-sm text-gray-500">{stats.newsCount} bài viết</Text>
          </Box>
          
          <Box className="bg-white rounded-lg p-4 shadow-sm text-center">
            <Box className="text-2xl mb-2">👥</Box>
            <Text className="font-medium">Người dùng</Text>
            <Text className="text-sm text-gray-500">{stats.usersCount} users</Text>
          </Box>
          
          <Box className="bg-white rounded-lg p-4 shadow-sm text-center">
            <Box className="text-2xl mb-2">📚</Box>
            <Text className="font-medium">Ngành học</Text>
            <Text className="text-sm text-gray-500">{stats.majorsCount} ngành</Text>
          </Box>
          
          <Box className="bg-white rounded-lg p-4 shadow-sm text-center">
            <Box className="text-2xl mb-2">📄</Box>
            <Text className="font-medium">Đơn tuyển sinh</Text>
            <Text className="text-sm text-gray-500">{stats.applicationsCount} đơn</Text>
          </Box>
        </Box>

        {/* Admin Menu */}
        <Box className="space-y-3">
          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/news")}
            className="bg-white shadow-sm border-gray-200 justify-start h-14"
          >
            <Box className="flex items-center">
              <Box className="text-xl mr-3">📰</Box>
              <Box className="text-left">
                <Text className="font-medium">Quản lý tin tức</Text>
                <Text className="text-sm text-gray-500">Tạo, chỉnh sửa và xóa bài viết</Text>
              </Box>
            </Box>
          </Button>

          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/users")}
            className="bg-white shadow-sm border-gray-200 justify-start h-14"
          >
            <Box className="flex items-center">
              <Box className="text-xl mr-3">👥</Box>
              <Box className="text-left">
                <Text className="font-medium">Quản lý người dùng</Text>
                <Text className="text-sm text-gray-500">Xem danh sách và thông tin user</Text>
              </Box>
            </Box>
          </Button>

          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/majors")}
            className="bg-white shadow-sm border-gray-200 justify-start h-14"
          >
            <Box className="flex items-center">
              <Box className="text-xl mr-3">📚</Box>
              <Box className="text-left">
                <Text className="font-medium">Quản lý ngành học</Text>
                <Text className="text-sm text-gray-500">Cập nhật thông tin các ngành đào tạo</Text>
              </Box>
            </Box>
          </Button>

          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/banners")}
            className="bg-white shadow-sm border-gray-200 justify-start h-14"
          >
            <Box className="flex items-center">
              <Box className="text-xl mr-3">🖼️</Box>
              <Box className="text-left">
                <Text className="font-medium">Quản lý Banner Tuyển sinh</Text>
                <Text className="text-sm text-gray-500">Cập nhật slide banner trang chủ</Text>
              </Box>
            </Box>
          </Button>

          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/applications")}
            className="bg-white shadow-sm border-gray-200 justify-start h-14"
          >
            <Box className="flex items-center">
              <Box className="text-xl mr-3">📄</Box>
              <Box className="text-left">
                <Text className="font-medium">Đơn tuyển sinh</Text>
                <Text className="text-sm text-gray-500">Xem và xử lý đơn đăng ký</Text>
              </Box>
            </Box>
          </Button>

          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/stats")}
            className="bg-white shadow-sm border-gray-200 justify-start h-14"
          >
            <Box className="flex items-center">
              <Box className="text-xl mr-3">📊</Box>
              <Box className="text-left">
                <Text className="font-medium">Thống kê & Báo cáo</Text>
                <Text className="text-sm text-gray-500">Xem báo cáo và phân tích dữ liệu</Text>
              </Box>
            </Box>
          </Button>

          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate("/admin/settings")}
            className="bg-white shadow-sm border-gray-200 justify-start h-14"
          >
            <Box className="flex items-center">
              <Box className="text-xl mr-3">⚙️</Box>
              <Box className="text-left">
                <Text className="font-medium">Cài đặt hệ thống</Text>
                <Text className="text-sm text-gray-500">Cấu hình ứng dụng và thông số</Text>
              </Box>
            </Box>
          </Button>
        </Box>

        {/* Additional logout button at bottom */}
        <Box className="mt-6 mb-20">
          <Button 
            fullWidth
            onClick={handleLogout}
            className="bg-red-500 text-white hover:bg-red-600 h-12 shadow-md font-medium"
          >
            <Box className="flex items-center justify-center gap-2">
              <span className="text-xl">🚪</span>
              <span>Đăng xuất khỏi Admin</span>
            </Box>
          </Button>
        </Box>
      </Box>

      {/* Floating logout button */}
      <Box 
        className="fixed bottom-20 right-4 z-50"
        style={{ 
          animation: 'pulse 2s infinite',
        }}
      >
        <Button
          size="large"
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600 rounded-full w-14 h-14 shadow-2xl flex items-center justify-center p-0"
          style={{
            minWidth: '56px',
            minHeight: '56px',
          }}
        >
          <span className="text-2xl">🚪</span>
        </Button>
      </Box>
    </Page>
  );
}

export default AdminPageSimple;