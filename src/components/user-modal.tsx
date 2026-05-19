import React, { useState, useEffect } from 'react';
import { Modal, Box, Text, Input, Select, Button, Avatar, Switch } from 'zmp-ui';
import { User, createUser, updateUser } from '@/utils/user-management';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  user?: User | null;
  onSave: (user: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({ visible, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student' as User['role'],
    status: 'active' as User['status'],
    notes: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (visible) {
      if (user) {
        // Editing existing user
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role,
          status: user.status,
          notes: user.notes || ''
        });
      } else {
        // Creating new user
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'student',
          status: 'active',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [visible, user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let savedUser: User;
      
      if (user) {
        // Update existing user
        savedUser = updateUser(user.id, {
          name: formData.name.trim(),
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          role: formData.role,
          status: formData.status,
          notes: formData.notes.trim() || undefined
        })!;
      } else {
        // Create new user
        savedUser = createUser({
          name: formData.name.trim(),
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          role: formData.role,
          status: formData.status,
          notes: formData.notes.trim() || undefined
        });
      }

      onSave(savedUser);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'Có lỗi xảy ra khi lưu thông tin người dùng' });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Sinh viên' },
    { value: 'teacher', label: 'Giáo viên' },
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'guest', label: 'Khách' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
    { value: 'suspended', label: 'Tạm khóa' }
  ];

  return (
    <Modal
      visible={visible}
      title={user ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
      onClose={onClose}
      actions={[
        {
          text: 'Hủy',
          close: true,
          highLight: false
        },
        {
          text: isLoading ? 'Đang lưu...' : 'Lưu',
          highLight: true,
          disabled: isLoading,
          onClick: handleSave
        }
      ]}
    >
      <Box className="space-y-4 p-4">
        {/* User Avatar Preview */}
        {user && (
          <Box className="flex items-center justify-center mb-4">
            <Box className="text-center">
              <Avatar
                src={user.avatar}
                size={80}
                className="mx-auto mb-2"
              />
              <Text className="text-sm text-gray-500">
                {user.source === 'zalo' ? '📱 Từ Zalo' : '👤 Tạo thủ công'}
              </Text>
              {user.zaloId && (
                <Text className="text-xs text-gray-400">
                  Zalo ID: {user.zaloId}
                </Text>
              )}
            </Box>
          </Box>
        )}

        {/* Name */}
        <Box>
          <Text className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên *
          </Text>
          <Input
            placeholder="Nhập họ và tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            status={errors.name ? 'error' : undefined}
          />
          {errors.name && (
            <Text className="text-xs text-red-500 mt-1">{errors.name}</Text>
          )}
        </Box>

        {/* Email */}
        <Box>
          <Text className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </Text>
          <Input
            placeholder="Nhập địa chỉ email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            status={errors.email ? 'error' : undefined}
          />
          {errors.email && (
            <Text className="text-xs text-red-500 mt-1">{errors.email}</Text>
          )}
        </Box>

        {/* Phone */}
        <Box>
          <Text className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </Text>
          <Input
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            status={errors.phone ? 'error' : undefined}
            disabled={user?.source === 'zalo'} // Không cho sửa phone từ Zalo
          />
          {errors.phone && (
            <Text className="text-xs text-red-500 mt-1">{errors.phone}</Text>
          )}
          {user?.source === 'zalo' && (
            <Text className="text-xs text-gray-500 mt-1">
              Số điện thoại từ Zalo không thể chỉnh sửa
            </Text>
          )}
        </Box>

        {/* Role */}
        <Box>
          <Text className="block text-sm font-medium text-gray-700 mb-1">
            Vai trò
          </Text>
          <Select
            placeholder="Chọn vai trò"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
          >
            {roleOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Box>

        {/* Status */}
        <Box>
          <Text className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </Text>
          <Select
            placeholder="Chọn trạng thái"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as User['status'] })}
          >
            {statusOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Box>

        {/* Notes */}
        <Box>
          <Text className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú
          </Text>
          <Input.TextArea
            placeholder="Nhập ghi chú (tùy chọn)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </Box>

        {/* User Info (for existing users) */}
        {user && (
          <Box className="border-t pt-4 mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Thông tin hệ thống
            </Text>
            <Box className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <Box>
                <Text className="font-medium">Tạo lúc:</Text>
                <Text>{new Date(user.createdAt).toLocaleString('vi-VN')}</Text>
              </Box>
              <Box>
                <Text className="font-medium">Cập nhật:</Text>
                <Text>{new Date(user.updatedAt).toLocaleString('vi-VN')}</Text>
              </Box>
              {user.lastLoginAt && (
                <Box className="col-span-2">
                  <Text className="font-medium">Đăng nhập cuối:</Text>
                  <Text>{new Date(user.lastLoginAt).toLocaleString('vi-VN')}</Text>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Error message */}
        {errors.submit && (
          <Box className="bg-red-50 border border-red-200 rounded-lg p-3">
            <Text className="text-sm text-red-600">{errors.submit}</Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default UserModal;