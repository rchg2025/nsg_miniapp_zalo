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
      displayName: "Quản trị vi�n ch�nh",
      email: "info@nsg.edu.vn",
      role: "admin",
      status: "active",
      created: "2024-01-01",
      lastLogin: new Date().toISOString()
    },
    "admin123": {
      username: "admin123",
      displayName: "Quản trị vi�n phụ",
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
      displayName: "T�i khoản trường",
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
      setError("Vui l�ng nhập đầy đủ th�ng tin bắt buộc");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Định dạng email kh�ng hợp lệ");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      updateAccount(username, formData);
      alert("Cập nhật th�ng tin t�i khoản th�nh c�ng!");
      onClose();
    } catch (error) {
      setError("C� lỗi xảy ra, vui l�ng thử lại");
    }
    
    setIsLoading(false);
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Chưa c�";
    
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
      title={`Chỉnh sửa t�i khoản: ${username}`}
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
            T�n đăng nhập:
          </Text>
          <Box className="bg-gray-100 rounded-lg p-3">
            <Text className="text-gray-800 font-medium">{formData.username}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              (Kh�ng thể thay đổi t�n đăng nhập)
            </Text>
          </Box>
        </Box>

        {/* Display Name */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            T�n hiển thị: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            placeholder="Nhập t�n hiển thị"
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
            <option value="admin">Quản trị vi�n</option>
            <option value="moderator">Kiểm duyệt vi�n</option>
            <option value="editor">Bi�n tập vi�n</option>
            <option value="viewer">Chỉ xem</option>
          </Select>
        </Box>

        {/* Status */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trạng th�i:
          </Text>
          <Select
            value={formData.status}
            onChange={(value) => setFormData({...formData, status: value as string})}
            placeholder="Chọn trạng th�i"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm kh�a</option>
            <option value="suspended">Bị cấm</option>
          </Select>
        </Box>

        {/* Account Info */}
        <Box className="bg-gray-50 rounded-lg p-3 space-y-2">
          <Text className="text-sm font-medium text-gray-700">Th�ng tin t�i khoản:</Text>
          
          <Box className="flex justify-between">
            <Text className="text-sm text-gray-600">Ng�y tạo:</Text>
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
              Đang cập nhật th�ng tin t�i khoản...
            </Text>
          </Box>
        )}

        {/* Role descriptions */}
        <Box className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Text className="text-blue-800 text-xs mb-2">
            📋 Ph�n quyền:
          </Text>
          <Text className="text-blue-700 text-xs space-y-1">
            � <strong>Quản trị vi�n:</strong> To�n quyền quản l� hệ thống<br/>
            � <strong>Kiểm duyệt vi�n:</strong> Quản l� nội dung v� người d�ng<br/>
            � <strong>Bi�n tập vi�n:</strong> Tạo v� chỉnh sửa nội dung<br/>
            � <strong>Chỉ xem:</strong> Chỉ c� quyền xem th�ng tin
          </Text>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditAccountModal;