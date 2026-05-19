import React, { useState, useEffect } from "react";
import { Box, Button, Input, Text, Modal, Icon, Select } from "zmp-ui";

interface EditAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  username: string;
}

interface AccountInfo {
  username: string;
  displayName: string;
  email: string;
  role: string;
  status: string;
  created: string;
  lastLogin?: string;
}

// Mock account database
const getAccountDatabase = (): Record<string, AccountInfo> => {
  const stored = localStorage.getItem('admin_accounts_db');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const defaultAccounts: Record<string, AccountInfo> = {
    "admin": {
      username: "admin",
      displayName: "Quản trị viên chính",
      email: "info@nsg.edu.vn",
      role: "admin",
      status: "active",
      created: "2024-01-01",
      lastLogin: new Date().toISOString()
    },
    "admin123": {
      username: "admin123",
      displayName: "Quản trị viên phụ",
      email: "info@nsg.edu.vn",
      role: "moderator",
      status: "active",
      created: "2024-01-15",
      lastLogin: new Date().toISOString()
    },
    "nsg": {
      username: "nsg",
      displayName: "BKNSG System",
      email: "info@nsg.edu.vn",
      role: "admin",
      status: "active",
      created: "2024-01-01"
    },
    "school": {
      username: "school",
      displayName: "Tài khoản trường",
      email: "info@nsg.edu.vn",
      role: "editor",
      status: "active",
      created: "2024-02-01"
    }
  };
  
  localStorage.setItem('admin_accounts_db', JSON.stringify(defaultAccounts));
  return defaultAccounts;
};

const updateAccount = (username: string, accountInfo: AccountInfo) => {
  const accounts = getAccountDatabase();
  accounts[username] = accountInfo;
  localStorage.setItem('admin_accounts_db', JSON.stringify(accounts));
  return true;
};

export function EditAccountModal({ isVisible, onClose, username }: EditAccountModalProps) {
  const [formData, setFormData] = useState<AccountInfo>({
    username: "",
    displayName: "",
    email: "",
    role: "editor",
    status: "active",
    created: "",
    lastLogin: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load account data when modal opens
  useEffect(() => {
    if (isVisible && username) {
      const accounts = getAccountDatabase();
      const accountInfo = accounts[username];
      
      if (accountInfo) {
        setFormData(accountInfo);
      } else {
        // New account
        setFormData({
          username: username,
          displayName: "",
          email: "",
          role: "editor",
          status: "active",
          created: new Date().toISOString().split('T')[0],
          lastLogin: ""
        });
      }
    }
  }, [isVisible, username]);

  const handleSaveAccount = async () => {
    setError("");
    
    if (!formData.displayName.trim() || !formData.email.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Định dạng email không hợp lệ");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      updateAccount(username, formData);
      alert("Cập nhật thông tin tài khoản thành công!");
      onClose();
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    }
    
    setIsLoading(false);
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Chưa có";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      visible={isVisible}
      title={`Chỉnh sửa tài khoản: ${username}`}
      actions={[
        {
          text: isLoading ? "Đang lưu..." : "Lưu thay đổi",
          highLight: true,
          onClick: handleSaveAccount,
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
        {/* Username (readonly) */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Tên đăng nhập:
          </Text>
          <Box className="bg-gray-100 rounded-lg p-3">
            <Text className="text-gray-800 font-medium">{formData.username}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              (Không thể thay đổi tên đăng nhập)
            </Text>
          </Box>
        </Box>

        {/* Display Name */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Tên hiển thị: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            placeholder="Nhập tên hiển thị"
            className="w-full"
          />
        </Box>

        {/* Email */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Email: <span className="text-red-500">*</span>
          </Text>
          <Input
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Nhập địa chỉ email"
            className="w-full"
          />
        </Box>

        {/* Role */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Quyền hạn:
          </Text>
          <Select
            value={formData.role}
            onChange={(value) => setFormData({...formData, role: value as string})}
            placeholder="Chọn quyền hạn"
          >
            <option value="admin">Quản trị viên</option>
            <option value="moderator">Kiểm duyệt viên</option>
            <option value="editor">Biên tập viên</option>
            <option value="viewer">Chỉ xem</option>
          </Select>
        </Box>

        {/* Status */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trạng thái:
          </Text>
          <Select
            value={formData.status}
            onChange={(value) => setFormData({...formData, status: value as string})}
            placeholder="Chọn trạng thái"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm khóa</option>
            <option value="suspended">Bị cấm</option>
          </Select>
        </Box>

        {/* Account Info */}
        <Box className="bg-gray-50 rounded-lg p-3 space-y-2">
          <Text className="text-sm font-medium text-gray-700">Thông tin tài khoản:</Text>
          
          <Box className="flex justify-between">
            <Text className="text-sm text-gray-600">Ngày tạo:</Text>
            <Text className="text-sm text-gray-800">
              {formatDateTime(formData.created)}
            </Text>
          </Box>
          
          <Box className="flex justify-between">
            <Text className="text-sm text-gray-600">Đăng nhập cuối:</Text>
            <Text className="text-sm text-gray-800">
              {formatDateTime(formData.lastLogin || "")}
            </Text>
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
              Đang cập nhật thông tin tài khoản...
            </Text>
          </Box>
        )}

        {/* Role descriptions */}
        <Box className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Text className="text-blue-800 text-xs mb-2">
            📋 Phân quyền:
          </Text>
          <Text className="text-blue-700 text-xs space-y-1">
            • <strong>Quản trị viên:</strong> Toàn quyền quản lý hệ thống<br/>
            • <strong>Kiểm duyệt viên:</strong> Quản lý nội dung và người dùng<br/>
            • <strong>Biên tập viên:</strong> Tạo và chỉnh sửa nội dung<br/>
            • <strong>Chỉ xem:</strong> Chỉ có quyền xem thông tin
          </Text>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditAccountModal;