import React, { useState } from "react";
import { Box, Button, Input, Text, Modal, Icon } from "zmp-ui";

interface ChangePasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  username: string;
}

// Mock password database
const getPasswordDatabase = () => {
  const stored = localStorage.getItem('admin_passwords_db');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const defaultPasswords = {
    "admin": "admin123",
    "admin123": "123456", 
    "nsg": "bknsg2024",
    "school": "school123"
  };
  
  localStorage.setItem('admin_passwords_db', JSON.stringify(defaultPasswords));
  return defaultPasswords;
};

const updatePassword = (username: string, newPassword: string) => {
  const passwords = getPasswordDatabase();
  passwords[username] = newPassword;
  localStorage.setItem('admin_passwords_db', JSON.stringify(passwords));
  return true;
};

export function ChangePasswordModal({ isVisible, onClose, username }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChangePassword = async () => {
    setError("");
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);

    // Verify current password
    const passwords = getPasswordDatabase();
    if (passwords[username] !== formData.currentPassword) {
      setError("Mật khẩu hiện tại không đúng");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update password
    try {
      updatePassword(username, formData.newPassword);
      alert("Đổi mật khẩu thành công!");
      
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      onClose();
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    }
    
    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setError("");
    onClose();
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Modal
      visible={isVisible}
      title="Đổi mật khẩu"
      actions={[
        {
          text: isLoading ? "Đang xử lý..." : "Đổi mật khẩu",
          highLight: true,
          onClick: handleChangePassword,
          disabled: isLoading
        },
        {
          text: "Hủy",
          onClick: handleCancel,
          disabled: isLoading
        }
      ]}
      onClose={handleCancel}
    >
      <Box className="space-y-4 p-4">
        {/* Username display */}
        <Box className="bg-gray-50 rounded-lg p-3">
          <Text className="text-sm text-gray-600 mb-1">Tài khoản:</Text>
          <Text className="font-medium text-gray-800">{username}</Text>
        </Box>

        {/* Current Password */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại: <span className="text-red-500">*</span>
          </Text>
          <Box className="relative">
            <Input
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full pr-10"
            />
            <Button
              size="small"
              variant="tertiary"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              onClick={() => toggleShowPassword('current')}
            >
              <Icon 
                icon={showPasswords.current ? "zi-setting" : "zi-setting"} 
                className="text-gray-500"
              />
            </Button>
          </Box>
        </Box>

        {/* New Password */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới: <span className="text-red-500">*</span>
          </Text>
          <Box className="relative">
            <Input
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              className="w-full pr-10"
            />
            <Button
              size="small"
              variant="tertiary"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              onClick={() => toggleShowPassword('new')}
            >
              <Icon 
                icon={showPasswords.new ? "zi-setting" : "zi-setting"} 
                className="text-gray-500"
              />
            </Button>
          </Box>
        </Box>

        {/* Confirm Password */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới: <span className="text-red-500">*</span>
          </Text>
          <Box className="relative">
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full pr-10"
            />
            <Button
              size="small"
              variant="tertiary"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              onClick={() => toggleShowPassword('confirm')}
            >
              <Icon 
                icon={showPasswords.confirm ? "zi-setting" : "zi-setting"} 
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
              Đang cập nhật mật khẩu...
            </Text>
          </Box>
        )}

        {/* Instructions */}
        <Box className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Text className="text-blue-800 text-xs">
            💡 Mật khẩu mới phải có ít nhất 6 ký tự và khác với mật khẩu hiện tại
          </Text>
        </Box>
      </Box>
    </Modal>
  );
}

export default ChangePasswordModal;