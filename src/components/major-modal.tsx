import React, { useState } from "react";
import { Box, Button, Input, Text, Modal } from "zmp-ui";
import { EducationLevel } from "@/types";

interface MajorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (majorData: any) => void;
  editData?: any;
}

export function MajorModal({ isVisible, onClose, onSave, editData }: MajorModalProps) {
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    code: editData?.code || "",
    description: editData?.description || "",
    tuitionFee: editData?.tuitionFee || 0,
    educationLevels: editData?.educationLevels || [EducationLevel.COLLEGE],
    duration: editData?.duration || "",
    isActive: editData?.isActive !== undefined ? editData.isActive : true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.tuitionFee) {
      alert("Vui l�ng nhập đầy đủ th�ng tin bắt buộc");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const majorData = {
      id: editData?.id || `major_${Date.now()}`,
      ...formData,
      createdAt: editData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(majorData);
    setIsLoading(false);
    
    // Reset form
    setFormData({
      name: "",
      code: "",
      description: "",
      tuitionFee: 0,
      educationLevels: [EducationLevel.COLLEGE],
      duration: "",
      isActive: true
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: editData?.name || "",
      code: editData?.code || "",
      description: editData?.description || "",
      tuitionFee: editData?.tuitionFee || 0,
      educationLevels: editData?.educationLevels || [EducationLevel.COLLEGE],
      duration: editData?.duration || "",
      isActive: editData?.isActive !== undefined ? editData.isActive : true
    });
    onClose();
  };

  const handleEducationLevelChange = (level: EducationLevel, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        educationLevels: [...formData.educationLevels, level]
      });
    } else {
      setFormData({
        ...formData,
        educationLevels: formData.educationLevels.filter(l => l !== level)
      });
    }
  };

  return (
    <Modal
      visible={isVisible}
      title={editData ? "Chỉnh sửa ng�nh đ�o tạo" : "Th�m ng�nh đ�o tạo mới"}
      actions={[
        {
          text: isLoading ? "Đang lưu..." : "Lưu",
          highLight: true,
          onClick: handleSave,
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
        {/* Name */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            T�n ng�nh: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="VD: C�ng nghệ Th�ng tin"
            className="w-full"
          />
        </Box>

        {/* Code */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            M� ng�nh: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
            placeholder="VD: CNTT"
            className="w-full"
          />
        </Box>

        {/* Description */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            M� tả:
          </Text>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="M� tả ng�nh đ�o tạo..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />
        </Box>

        {/* Tuition Fee */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Học ph� (VNĐ/năm): <span className="text-red-500">*</span>
          </Text>
          <Input
            type="number"
            value={formData.tuitionFee}
            onChange={(e) => setFormData({...formData, tuitionFee: parseInt(e.target.value) || 0})}
            placeholder="18000000"
            className="w-full"
          />
        </Box>

        {/* Duration */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Thời gian đ�o tạo:
          </Text>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Chọn thời gian</option>
            <option value="2.5 năm">2.5 năm</option>
            <option value="3 năm">3 năm</option>
            <option value="3.5 năm">3.5 năm</option>
            <option value="4 năm">4 năm</option>
          </select>
        </Box>

        {/* Education Levels */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Hệ đ�o tạo:
          </Text>
          <Box className="space-y-2">
            {Object.values(EducationLevel).map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.educationLevels.includes(level)}
                  onChange={(e) => handleEducationLevelChange(level, e.target.checked)}
                  className="rounded"
                />
                <Text className="text-sm text-gray-700">
                  {level === EducationLevel.COLLEGE ? "Cao đẳng" :
                   level === EducationLevel.VOCATIONAL ? "Trung cấp" :
                   level === EducationLevel.BRIDGE_COLLEGE ? "Cao đẳng li�n th�ng" : level}
                </Text>
              </label>
            ))}
          </Box>
        </Box>

        {/* Status */}
        <Box>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="rounded"
            />
            <Text className="text-sm font-medium text-gray-700">
              K�ch hoạt ng�nh đ�o tạo
            </Text>
          </label>
        </Box>

        {isLoading && (
          <Box className="text-center py-2">
            <Text className="text-blue-600 text-sm">Đang xử l�...</Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default MajorModal;