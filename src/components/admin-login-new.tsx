import React, { useState } from "react";
import { Box, Button, Input, Text, Modal, Icon } from "zmp-ui";
import { systemUserLogin } from "@/utils/api";

interface AdminLoginProps {
  isVisible: boolean;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

// Hàm xác thực admin - sẽ kết nối với API backend
const validateAdminCredentials = (username: string, password: string) => {
  // Trong thực tế, gọi API để xác thực
  // Tạm thời để một tài khoản admin duy nhất để không lộ thông tin
  if (username === "admin" && password === "admin@nsg2025") {
    return { username: "admin", role: "Quản trị viên NSG" };
  }
  if (username === "thanhtung" && password === "123456") {
    return { username: "thanhtung", role: "Thành viên Ban Giám Hiệu" };
  }
  return null;
};

function AdminLogin({ isVisible, onLoginSuccess, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleManualLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await systemUserLogin({ username, password });
      
      if (response && response.success && response.user) {
        // Lưu trạng thái admin login
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_login_time", Date.now().toString());
        localStorage.setItem("admin_role", response.user.role || "Quản trị viên NSG");
        localStorage.setItem("admin_username", response.user.username);
        localStorage.setItem("admin_login_method", "manual");
        
        onLoginSuccess();
        
        // Reset form
        setUsername("");
        setPassword("");
        setError("");
      } else {
        setError(response.message || "Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (e: any) {
      console.error("Login err:", e);
      setError("Có lỗi xảy ra, không thể kết nối tới máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleManualLogin();
    }
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
    setError("");
    onCancel();
  };

  return (
    <Modal
      visible={isVisible}
      title="Đăng nhập Admin"
      onClose={handleCancel}
    >
      <Box className="p-6">
        {/* Header */}
        <Box className="text-center mb-6">
          <Icon 
            icon="zi-user-check" 
            className="text-4xl text-red-600 mx-auto block mb-3"
          />
          <Text className="text-gray-800 font-medium mb-2">Truy cập trang quản trị</Text>
          <Text className="text-gray-600 text-sm">
            Nhập tên đăng nhập và mật khẩu để tiếp tục
          </Text>
        </Box>

        {/* Manual Login Form */}
        <Box className="space-y-4">
            <Box>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập:
              </Text>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </Box>

            <Box>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Mật khẩu:
              </Text>
              <Box className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10"
                />
                <Button
                  size="small"
                  variant="tertiary"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    icon={showPassword ? "zi-close" : "zi-setting"} 
                    className="text-gray-500"
                  />
                </Button>
              </Box>
            </Box>



            <Button
              fullWidth
              onClick={handleManualLogin}
              disabled={isLoading}
              className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Box>

        {/* Error Message */}
        {error && (
          <Box className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <Text className="text-red-700 text-sm whitespace-pre-line">
              {error}
            </Text>
          </Box>
        )}

        {/* Cancel Button */}
        <Box className="mt-6">
          <Button
            fullWidth
            variant="secondary"
            onClick={handleCancel}
            className="text-gray-600 border-gray-300"
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AdminLogin;