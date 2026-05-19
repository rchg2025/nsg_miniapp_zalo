import React, { useState } from "react";
import { Box, Button, Input, Text, Modal, Icon, Select } from "zmp-ui";

interface AdmissionStatusModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  admissionData: any;
  currentAdmin: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử l�", color: "text-yellow-600 bg-yellow-50" },
  { value: "contacted", label: "Đ� li�n hệ", color: "text-blue-600 bg-blue-50" },
  { value: "interviewed", label: "Đ� phỏng vấn", color: "text-purple-600 bg-purple-50" },
  { value: "approved", label: "Đ� duyệt", color: "text-green-600 bg-green-50" },
  { value: "rejected", label: "Từ chối", color: "text-red-600 bg-red-50" },
  { value: "enrolled", label: "Đ� nhập học", color: "text-indigo-600 bg-indigo-50" }
];

export function AdmissionStatusModal({ 
  isVisible, 
  onClose, 
  onSave, 
  admissionData, 
  currentAdmin 
}: AdmissionStatusModalProps) {
  const [formData, setFormData] = useState({
    status: admissionData?.status || "pending",
    note: "",
    followUpDate: "",
    priority: "normal"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (admissionData) {
      setFormData({
        status: admissionData.status || "pending",
        note: admissionData.lastNote || "",
        followUpDate: admissionData.followUpDate || "",
        priority: admissionData.priority || "normal"
      });
    }
  }, [admissionData]);

  const handleSave = async () => {
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const updatedData = {
        ...admissionData,
        status: formData.status,
        lastNote: formData.note,
        followUpDate: formData.followUpDate,
        priority: formData.priority,
        processedBy: currentAdmin,
        processedAt: new Date().toISOString(),
        statusHistory: [
          ...(admissionData.statusHistory || []),
          {
            status: formData.status,
            note: formData.note,
            processedBy: currentAdmin,
            processedAt: new Date().toISOString()
          }
        ]
      };

      onSave(updatedData);
      alert("Cập nhật trạng th�i hồ sơ th�nh c�ng!");
      onClose();
    } catch (error) {
      setError("C� lỗi xảy ra, vui l�ng thử lại");
    }
    
    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      status: admissionData?.status || "pending",
      note: "",
      followUpDate: "",
      priority: "normal"
    });
    setError("");
    onClose();
  };

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];
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

  if (!admissionData) return null;

  return (
    <Modal
      visible={isVisible}
      title={`Xử l� hồ sơ: ${admissionData.studentName}`}
      actions={[
        {
          text: isLoading ? "Đang lưu..." : "Cập nhật trạng th�i",
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
        {/* Student Information */}
        <Box className="bg-gray-50 rounded-lg p-3">
          <Text className="text-sm font-medium text-gray-700 mb-2">Th�ng tin th� sinh:</Text>
          <Text className="font-medium text-gray-800 mb-1">{admissionData.studentName}</Text>
          <Box className="flex flex-wrap gap-3 text-xs text-gray-600">
            <Text>📞 {admissionData.phoneNumber}</Text>
            <Text>📧 {admissionData.email}</Text>
            <Text>🎓 {admissionData.majorName}</Text>
            <Text>📅 {admissionData.submittedAt}</Text>
          </Box>
        </Box>

        {/* Current Status */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">Trạng th�i hiện tại:</Text>
          <Box className="flex items-center gap-2">
            <Text className={`text-xs px-3 py-2 rounded-lg font-medium ${getStatusInfo(admissionData.status).color}`}>
              {getStatusInfo(admissionData.status).label}
            </Text>
            {admissionData.processedBy && (
              <Text className="text-xs text-gray-500">
                Xử l� bởi: {admissionData.processedBy}
              </Text>
            )}
          </Box>
        </Box>

        {/* New Status */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trạng th�i mới: <span className="text-red-500">*</span>
          </Text>
          <Select
            value={formData.status}
            onChange={(value) => setFormData({...formData, status: value as string})}
            placeholder="Chọn trạng th�i mới"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>

        {/* Priority */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">Mức độ ưu ti�n:</Text>
          <Select
            value={formData.priority}
            onChange={(value) => setFormData({...formData, priority: value as string})}
            placeholder="Chọn mức độ ưu ti�n"
          >
            <option value="low">Thấp</option>
            <option value="normal">B�nh thường</option>
            <option value="high">Cao</option>
            <option value="urgent">Khẩn cấp</option>
          </Select>
        </Box>

        {/* Follow-up Date */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">Ng�y theo d�i tiếp theo:</Text>
          <Input
            type="text"
            value={formData.followUpDate}
            onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
            placeholder="YYYY-MM-DD"
            className="w-full"
          />
        </Box>

        {/* Processing Note */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Ghi ch� xử l�: <span className="text-red-500">*</span>
          </Text>
          <Input.TextArea
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
            placeholder="Nhập ghi ch� về qu� tr�nh xử l� hồ sơ..."
            rows={3}
            className="w-full"
          />
        </Box>

        {/* Processing History */}
        {admissionData.statusHistory && admissionData.statusHistory.length > 0 && (
          <Box>
            <Text className="text-sm font-medium text-gray-700 mb-2">Lịch sử xử l�:</Text>
            <Box className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {admissionData.statusHistory.slice().reverse().map((history: any, index: number) => (
                <Box key={index} className="mb-2 last:mb-0">
                  <Box className="flex items-center gap-2 mb-1">
                    <Text className={`text-xs px-2 py-1 rounded ${getStatusInfo(history.status).color}`}>
                      {getStatusInfo(history.status).label}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatDateTime(history.processedAt)}
                    </Text>
                  </Box>
                  <Text className="text-xs text-gray-600 ml-2">
                    👤 {history.processedBy}: {history.note || "Kh�ng c� ghi ch�"}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}

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
              Đang cập nhật trạng th�i hồ sơ...
            </Text>
          </Box>
        )}

        {/* Admin Info */}
        <Box className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Text className="text-blue-800 text-xs">
            👤 Xử l� bởi: <strong>{currentAdmin}</strong><br/>
            🕒 Thời gian: {new Date().toLocaleString('vi-VN')}
          </Text>
        </Box>
      </Box>
    </Modal>
  );
}

export default AdmissionStatusModal;