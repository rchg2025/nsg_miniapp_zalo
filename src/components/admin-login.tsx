import React, { useState } from "react";
import { Box, Button, Input, Text, Modal, Icon } from "zmp-ui";
import { useUser } from "@/contexts/user-context";

interface AdminLoginProps {
  isVisible: boolean;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

// H�m x�c thực admin - sẽ kết nối với API backend
const validateAdminCredentials = (username: string, password: string) => {
  // Trong thực tế, gọi API để x�c thực
  // Tạm thời để một t�i khoản admin duy nhất để kh�ng lộ th�ng tin
  if (username === "admin" && password === "admin@nsg2025") {
    return { username: "admin", role: "Quản trị vi�n NSG" };
  }
  return null;
};

// Danh s�ch Zalo ID c� quyền admin (th�m Zalo ID thật v�o đ�y)
const ADMIN_ZALO_IDS = [
  // Tự động cấp quyền cho user hiện tại để test
  // Th�m Zalo ID thật của admin/giảng vi�n tại đ�y:
  // "2847656892858292658", // V� dụ Zalo ID của admin
  // "1234567890123456789", // V� dụ Zalo ID của giảng vi�n
];

function AdminLogin({ isVisible, onLoginSuccess, onCancel }: AdminLoginProps) {
  const { userInfo } = useUser();
  const [loginMethod, setLoginMethod] = useState<"manual" | "zalo">("manual");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleManualLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Vui l�ng nhập đầy đủ th�ng tin");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // X�c thực t�i khoản admin
    const validAccount = validateAdminCredentials(username, password);
    
    if (validAccount) {
      // Lưu trạng th�i admin login
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_login_time", Date.now().toString());
      localStorage.setItem("admin_role", validAccount.role);
      localStorage.setItem("admin_username", validAccount.username);
      onLoginSuccess();
      
      // Reset form
      setUsername("");
      setPassword("");
      setError("");
    } else {
      setError("T�n đăng nhập hoặc mật khẩu kh�ng đ�ng!");
    }

    setIsLoading(false);
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
      title="Đăng nhập quản trị"
      actions={[
        {
          text: "Đăng nhập",
          highLight: true,
          onClick: handleManualLogin
        },
        {
          text: "Hủy",
          onClick: handleCancel
        }
      ]}
      onClose={handleCancel}
    >
      <Box className="p-6 space-y-4">
        {/* Icon */}
        <Box className="text-center mb-6">
          <Icon 
            icon="zi-user-check" 
            className="text-5xl text-blue-600 mx-auto block mb-3"
          />
          <Text className="text-gray-600 text-sm">
            Nhập th�ng tin đăng nhập để truy cập trang quản trị
          </Text>
        </Box>

        {/* Username Input */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            T�n đăng nhập:
          </Text>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập t�n đăng nhập"
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </Box>

        {/* Password Input */}
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
                icon={showPassword ? "zi-setting" : "zi-setting"} 
                className="text-gray-500"
              />
            </Button>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Box className="bg-red-50 border border-red-200 rounded-lg p-3">
            <Text className="text-red-700 text-sm text-center">
              {error}
            </Text>
          </Box>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box className="text-center">
            <Text className="text-blue-600 text-sm">
              Đang x�c thực...
            </Text>
          </Box>
        )}

        {/* Demo Info - Removed per user request */}
      </Box>
    </Modal>
  );
}

export default AdminLogin;