import React, { useState } from "react";
import { Box, Button, Input, Text, Modal, Icon, useSnackbar } from "zmp-ui";
import { useUser } from "@/contexts/user-context";
import { systemUserLogin } from "@/utils/api";

interface AdminLoginProps {
  isVisible: boolean;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

// Danh sách Zalo ID có quyền admin (thêm Zalo ID thật vào đây)
const ADMIN_ZALO_IDS = [
  // Tự động cấp quyền cho user hiện tại để test
  // Thêm Zalo ID thật của admin/giảng viên tại đây:
  // "2847656892858292658", // Ví dụ Zalo ID của admin
  // "1234567890123456789", // Ví dụ Zalo ID của giảng viên
];

function AdminLogin({ isVisible, onLoginSuccess, onCancel }: AdminLoginProps) {
  const { userInfo } = useUser();
  const [loginMethod, setLoginMethod] = useState<"manual" | "zalo">("manual");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const snackbar = useSnackbar();

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
        
        snackbar.openSnackbar({
          text: `Đăng nhập thành công! Xin chào ${response.user.display_name || response.user.username}`,
          type: "success",
          icon: true,
          duration: 3000
        });

        onLoginSuccess();
        
        // Reset form
        setUsername("");
        setPassword("");
        setError("");
      } else {
        const errorMsg = response.message || "Tên đăng nhập hoặc mật khẩu không đúng!";
        setError(errorMsg);
        snackbar.openSnackbar({
          text: errorMsg,
          type: "error",
          icon: true,
          duration: 3000
        });
      }
    } catch (e: any) {
      console.error("Login err:", e);
      setError("Có lỗi xảy ra, không thể kết nối đến máy chủ.");
      snackbar.openSnackbar({
        text: "Lỗi kết nối máy chủ!",
        type: "error",
        icon: true,
        duration: 3000
      });
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
            Nhập thông tin đăng nhập để truy cập trang quản trị
          </Text>
        </Box>

        {/* Username Input */}
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
              Đang xác thực...
            </Text>
          </Box>
        )}

        {/* Demo Info - Removed per user request */}
      </Box>
    </Modal>
  );
}

export default AdminLogin;