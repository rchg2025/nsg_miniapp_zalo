import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header, Input, Switch, Select } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, SystemSettings } from "@/utils/data-manager";

function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Kiểm tra quyền admin
  useEffect(() => {
    const adminStatus = localStorage.getItem("admin_logged_in");
    if (adminStatus !== "true") {
      navigate("/profile");
      return;
    }

    loadSettings();
  }, [navigate]);

  const loadSettings = () => {
    const settingsData = DataManager.getSettings();
    setSettings(settingsData);
  };

  const handleSettingChange = (section: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    };

    setSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleNestedSettingChange = (section: keyof SystemSettings, nestedField: string, field: string, value: any) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [nestedField]: {
          ...settings[section][nestedField],
          [field]: value
        }
      }
    };

    setSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    if (settings) {
      DataManager.saveSettings(settings);
      setHasChanges(false);
      alert('Cài đặt đã được lưu thành công!');
    }
  };

  const handleResetSettings = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
      loadSettings();
      setHasChanges(false);
    }
  };

  if (!settings) {
    return (
      <Page className="page-with-header bg-gray-50">
        <Header 
          title="Cài đặt hệ thống" 
          showBackIcon={true}
          className="bg-blue-600 text-white"
        />
        <Box className="p-4">
          <Text>Đang tải cài đặt...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Cài đặt hệ thống" 
        showBackIcon={true}
        className="bg-blue-600 text-white"
      />
      
      {/* Back Button */}
      <Box className="absolute top-4 left-4 z-20">
        <Button
          size="small"
          variant="tertiary"
          onClick={() => navigate("/admin")}
          className="bg-white/20 text-white rounded-full"
        >
          ← Quay lại
        </Button>
      </Box>

      <Box className="p-4 space-y-6">
        {/* Save/Reset Actions */}
        {hasChanges && (
          <Box className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <Box className="flex justify-between items-center">
              <Text className="text-yellow-800">Có thay đổi chưa được lưu</Text>
              <Box className="flex gap-2">
                <Button 
                  size="small"
                  variant="tertiary"
                  onClick={handleResetSettings}
                >
                  Hủy
                </Button>
                <Button 
                  size="small"
                  variant="primary"
                  onClick={handleSaveSettings}
                >
                  Lưu thay đổi
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* General Settings */}
        <Box className="bg-white p-4 rounded-lg">
          <Text.Title className="mb-4">🏫 Thông tin trường</Text.Title>
          <Box className="space-y-4">
            <Box>
              <Text className="mb-2 font-medium">Tên trường</Text>
              <Input
                value={settings.general.schoolName}
                onChange={(e) => handleSettingChange('general', 'schoolName', e.target.value)}
                placeholder="Tên đầy đủ của trường"
              />
            </Box>
            
            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Mã trường</Text>
                <Input
                  value={settings.general.schoolCode}
                  onChange={(e) => handleSettingChange('general', 'schoolCode', e.target.value)}
                  placeholder="NSG"
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Số điện thoại</Text>
                <Input
                  value={settings.general.phone}
                  onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
                  placeholder="028-12345678"
                />
              </Box>
            </Box>

            <Box>
              <Text className="mb-2 font-medium">Địa chỉ</Text>
              <Input
                value={settings.general.address}
                onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                placeholder="Địa chỉ trường"
              />
            </Box>

            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Email</Text>
                <Input
                  value={settings.general.email}
                  onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                  placeholder="info@school.edu.vn"
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Website</Text>
                <Input
                  value={settings.general.website}
                  onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
                  placeholder="https://school.edu.vn"
                />
              </Box>
            </Box>

            <Box>
              <Text className="mb-2 font-medium">URL Logo</Text>
              <Input
                value={settings.general.logoUrl}
                onChange={(e) => handleSettingChange('general', 'logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              {settings.general.logoUrl && (
                <Box className="mt-2">
                  <img 
                    src={settings.general.logoUrl} 
                    alt="Logo"
                    className="w-16 h-16 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Admission Settings */}
        <Box className="bg-white p-4 rounded-lg">
          <Text.Title className="mb-4">🎓 Cài đặt tuyển sinh</Text.Title>
          <Box className="space-y-4">
            <Box className="flex items-center justify-between">
              <Text className="font-medium">Mở đăng ký tuyển sinh</Text>
              <Switch
                checked={settings.admission.isOpen}
                onChange={(e) => handleSettingChange('admission', 'isOpen', e.target.checked)}
              />
            </Box>

            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Ngày bắt đầu</Text>
                <Input
                  value={settings.admission.startDate}
                  onChange={(e) => handleSettingChange('admission', 'startDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Ngày kết thúc</Text>
                <Input
                  value={settings.admission.endDate}
                  onChange={(e) => handleSettingChange('admission', 'endDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </Box>
            </Box>

            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Điểm tối thiểu</Text>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.admission.minScore}
                  onChange={(e) => handleSettingChange('admission', 'minScore', parseFloat(e.target.value) || 0)}
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Số đơn tối đa</Text>
                <Input
                  type="number"
                  value={settings.admission.maxApplications}
                  onChange={(e) => handleSettingChange('admission', 'maxApplications', parseInt(e.target.value) || 0)}
                />
              </Box>
            </Box>

            <Box>
              <Text className="mb-2 font-medium">Hồ sơ yêu cầu (cách nhau bằng dấu phẩy)</Text>
              <Input.TextArea
                value={settings.admission.requiredDocuments.join(', ')}
                onChange={(e) => handleSettingChange('admission', 'requiredDocuments', e.target.value.split(',').map(doc => doc.trim()).filter(doc => doc))}
                placeholder="Bản sao bằng tốt nghiệp, Bản sao học bạ, CMND, Ảnh 3x4"
                rows={3}
              />
            </Box>
          </Box>
        </Box>

        {/* App Settings */}
        <Box className="bg-white p-4 rounded-lg">
          <Text.Title className="mb-4">📱 Cài đặt ứng dụng</Text.Title>
          <Box className="space-y-4">
            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Giao diện</Text>
                <Select
                  value={settings.app.theme}
                  onChange={(value) => handleSettingChange('app', 'theme', value)}
                >
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                  <option value="auto">Tự động</option>
                </Select>
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Ngôn ngữ</Text>
                <Select
                  value={settings.app.language}
                  onChange={(value) => handleSettingChange('app', 'language', value)}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </Select>
              </Box>
            </Box>

            <Box>
              <Text className="mb-3 font-medium">Thông báo</Text>
              <Box className="space-y-3">
                <Box className="flex items-center justify-between">
                  <Text>Thông báo đẩy</Text>
                  <Switch
                    checked={settings.app.notifications.push}
                    onChange={(e) => handleNestedSettingChange('app', 'notifications', 'push', e.target.checked)}
                  />
                </Box>
                <Box className="flex items-center justify-between">
                  <Text>Thông báo email</Text>
                  <Switch
                    checked={settings.app.notifications.email}
                    onChange={(e) => handleNestedSettingChange('app', 'notifications', 'email', e.target.checked)}
                  />
                </Box>
                <Box className="flex items-center justify-between">
                  <Text>Thông báo SMS</Text>
                  <Switch
                    checked={settings.app.notifications.sms}
                    onChange={(e) => handleNestedSettingChange('app', 'notifications', 'sms', e.target.checked)}
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <Text className="mb-3 font-medium">Tính năng</Text>
              <Box className="space-y-3">
                <Box className="flex items-center justify-between">
                  <Text>Tuyển sinh trực tuyến</Text>
                  <Switch
                    checked={settings.app.features.admissionEnabled}
                    onChange={(e) => handleNestedSettingChange('app', 'features', 'admissionEnabled', e.target.checked)}
                  />
                </Box>
                <Box className="flex items-center justify-between">
                  <Text>Tin tức</Text>
                  <Switch
                    checked={settings.app.features.newsEnabled}
                    onChange={(e) => handleNestedSettingChange('app', 'features', 'newsEnabled', e.target.checked)}
                  />
                </Box>
                <Box className="flex items-center justify-between">
                  <Text>Thông tin ngành học</Text>
                  <Switch
                    checked={settings.app.features.majorInfoEnabled}
                    onChange={(e) => handleNestedSettingChange('app', 'features', 'majorInfoEnabled', e.target.checked)}
                  />
                </Box>
                <Box className="flex items-center justify-between">
                  <Text>Chat hỗ trợ</Text>
                  <Switch
                    checked={settings.app.features.chatEnabled}
                    onChange={(e) => handleNestedSettingChange('app', 'features', 'chatEnabled', e.target.checked)}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Security Settings */}
        <Box className="bg-white p-4 rounded-lg">
          <Text.Title className="mb-4">🔒 Cài đặt bảo mật</Text.Title>
          <Box className="space-y-4">
            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Thời gian phiên (phút)</Text>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value) || 1440)}
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Số lần đăng nhập tối đa</Text>
                <Input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value) || 5)}
                />
              </Box>
            </Box>

            <Box className="flex items-center justify-between">
              <Text className="font-medium">Bắt buộc quan tâm OA</Text>
              <Switch
                checked={settings.security.requireOAFollow}
                onChange={(e) => handleSettingChange('security', 'requireOAFollow', e.target.checked)}
              />
            </Box>

            <Box>
              <Text className="mb-3 font-medium">Chính sách mật khẩu Admin</Text>
              <Box className="space-y-3">
                <Box>
                  <Text className="mb-2">Độ dài tối thiểu</Text>
                  <Input
                    type="number"
                    value={settings.security.adminPasswordPolicy.minLength}
                    onChange={(e) => handleNestedSettingChange('security', 'adminPasswordPolicy', 'minLength', parseInt(e.target.value) || 8)}
                  />
                </Box>
                <Box className="flex items-center justify-between">
                  <Text>Yêu cầu ký tự đặc biệt</Text>
                  <Switch
                    checked={settings.security.adminPasswordPolicy.requireSpecialChar}
                    onChange={(e) => handleNestedSettingChange('security', 'adminPasswordPolicy', 'requireSpecialChar', e.target.checked)}
                  />
                </Box>
                <Box className="flex items-center justify-between">
                  <Text>Yêu cầu số</Text>
                  <Switch
                    checked={settings.security.adminPasswordPolicy.requireNumber}
                    onChange={(e) => handleNestedSettingChange('security', 'adminPasswordPolicy', 'requireNumber', e.target.checked)}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleResetSettings}
          >
            Khôi phục mặc định
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSaveSettings}
            disabled={!hasChanges}
          >
            Lưu cài đặt
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default AdminSettingsPage;