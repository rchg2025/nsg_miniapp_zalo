import React, { useState } from "react";
import { Box, Button, Input, Text, Modal } from "zmp-ui";
import { EducationLevel } from "@/types";

interface AdmissionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (admissionData: any) => void;
  editData?: any;
}

export function AdmissionModal({ isVisible, onClose, onSave, editData }: AdmissionModalProps) {
  // Convert dd/mm/yyyy to yyyy-mm-dd for input type="date"
  const convertToInputDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return dateStr;
  };

  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  const convertToDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
      }
    }
    return dateStr;
  };

  const [formData, setFormData] = useState({
    studentName: editData?.studentName || "",
    phoneNumber: editData?.phoneNumber || "",
    email: editData?.email || "",
    dateOfBirth: convertToInputDate(editData?.dateOfBirth || ""),
    address: editData?.address || "",
    majorId: editData?.majorId || "",
    majorName: editData?.majorName || "",
    educationLevel: editData?.educationLevel || EducationLevel.COLLEGE,
    graduationYear: editData?.graduationYear || "",
    previousSchool: editData?.previousSchool || "",
    academicRecord: editData?.academicRecord || "Kh�",
    notes: editData?.notes || "",
    status: editData?.status || "pending"
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.studentName.trim() || !formData.phoneNumber.trim() || !formData.email.trim()) {
      alert("Vui l�ng nhập đầy đủ th�ng tin bắt buộc");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const admissionData = {
      id: editData?.id || `admission_${Date.now()}`,
      ...formData,
      dateOfBirth: convertToDisplayDate(formData.dateOfBirth), // Convert back to dd/mm/yyyy
      zaloId: editData?.zaloId || "",
      submittedAt: editData?.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(admissionData);
    setIsLoading(false);
    
    // Reset form if creating new
    if (!editData) {
      setFormData({
        studentName: "",
        phoneNumber: "",
        email: "",
        dateOfBirth: "",
        address: "",
        majorId: "",
        majorName: "",
        educationLevel: EducationLevel.COLLEGE,
        graduationYear: "",
        previousSchool: "",
        academicRecord: "Kh�",
        notes: "",
        status: "pending"
      });
    }
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      studentName: editData?.studentName || "",
      phoneNumber: editData?.phoneNumber || "",
      email: editData?.email || "",
      dateOfBirth: convertToInputDate(editData?.dateOfBirth || ""),
      address: editData?.address || "",
      majorId: editData?.majorId || "",
      majorName: editData?.majorName || "",
      educationLevel: editData?.educationLevel || EducationLevel.COLLEGE,
      graduationYear: editData?.graduationYear || "",
      previousSchool: editData?.previousSchool || "",
      academicRecord: editData?.academicRecord || "Kh�",
      notes: editData?.notes || "",
      status: editData?.status || "pending"
    });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      title={editData ? "Chỉnh sửa hồ sơ tuyển sinh" : "Th�m hồ sơ tuyển sinh"}
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
      <Box className="space-y-4 p-4 max-h-96 overflow-y-auto">
        {/* Student Name */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Họ v� t�n: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.studentName}
            onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            placeholder="Nguyễn Văn A"
            className="w-full"
          />
        </Box>

        {/* Phone Number */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Số điện thoại: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            placeholder="0123456789"
            className="w-full"
          />
        </Box>

        {/* Email */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Email: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="example@email.com"
            className="w-full"
          />
        </Box>

        {/* Date of Birth */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Ng�y sinh:
          </Text>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </Box>

        {/* Address */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Địa chỉ:
          </Text>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Địa chỉ thường tr�"
            className="w-full"
          />
        </Box>

        {/* Major */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Ng�nh đăng k�:
          </Text>
          <Input
            value={formData.majorName}
            onChange={(e) => setFormData({...formData, majorName: e.target.value})}
            placeholder="VD: C�ng nghệ Th�ng tin"
            className="w-full"
          />
        </Box>

        {/* Education Level */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Hệ đ�o tạo:
          </Text>
          <select
            value={formData.educationLevel}
            onChange={(e) => setFormData({...formData, educationLevel: e.target.value as EducationLevel})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={EducationLevel.COLLEGE}>Cao đẳng</option>
            <option value={EducationLevel.VOCATIONAL}>Trung cấp</option>
            <option value={EducationLevel.BRIDGE_COLLEGE}>Cao đẳng li�n th�ng</option>
          </select>
        </Box>

        {/* Graduation Year */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Năm tốt nghiệp:
          </Text>
          <Input
            value={formData.graduationYear}
            onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
            placeholder="2024"
            className="w-full"
          />
        </Box>

        {/* Previous School */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trường trung học:
          </Text>
          <Input
            value={formData.previousSchool}
            onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
            placeholder="T�n trường đ� tốt nghiệp"
            className="w-full"
          />
        </Box>

        {/* Academic Record */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Học lực:
          </Text>
          <select
            value={formData.academicRecord}
            onChange={(e) => setFormData({...formData, academicRecord: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Xuất sắc">Xuất sắc</option>
            <option value="Giỏi">Giỏi</option>
            <option value="Kh�">Kh�</option>
            <option value="Trung b�nh">Trung b�nh</option>
          </select>
        </Box>

        {/* Status (for admin) */}
        {editData && (
          <Box>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Trạng th�i:
            </Text>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Chờ x�t duyệt</option>
              <option value="approved">Đ� duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="contacted">Đ� li�n hệ</option>
            </select>
          </Box>
        )}

        {/* Notes */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Ghi ch�:
          </Text>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Ghi ch� th�m..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />
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

export default AdmissionModal;