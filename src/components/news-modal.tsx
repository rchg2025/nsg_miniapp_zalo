import React, { useState } from "react";
import { Box, Button, Input, Text, Modal, Select } from "zmp-ui";

interface NewsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (newsData: any) => void;
  editData?: any;
}

export function NewsModal({ isVisible, onClose, onSave, editData }: NewsModalProps) {
  const [formData, setFormData] = useState({
    title: editData?.title || "",
    content: editData?.content || "",
    category: editData?.category || "announcement",
    status: editData?.status || "draft",
    author: editData?.author || "Admin"
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newsData = {
      id: editData?.id || Date.now(),
      ...formData,
      date: editData?.date || new Date().toISOString().split('T')[0],
      createdAt: editData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newsData);
    setIsLoading(false);
    
    // Reset form
    setFormData({
      title: "",
      content: "",
      category: "announcement",
      status: "draft",
      author: "Admin"
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      title: editData?.title || "",
      content: editData?.content || "",
      category: editData?.category || "announcement", 
      status: editData?.status || "draft",
      author: editData?.author || "Admin"
    });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      title={editData ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
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
        {/* Title */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Tiêu đề: <span className="text-red-500">*</span>
          </Text>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Nhập tiêu đề tin tức"
            className="w-full"
          />
        </Box>

        {/* Category */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Danh mục:
          </Text>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="announcement">Thông báo</option>
            <option value="news">Tin tức</option>
            <option value="training">Chương trình đào tạo</option>
            <option value="event">Sự kiện</option>
            <option value="admission">Tuyển sinh</option>
          </select>
        </Box>

        {/* Content */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Nội dung: <span className="text-red-500">*</span>
          </Text>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Nhập nội dung tin tức..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />
        </Box>

        {/* Status */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trạng thái:
          </Text>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="draft">Bản thảo</option>
            <option value="published">Đã đăng</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </Box>

        {/* Author */}
        <Box>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Tác giả:
          </Text>
          <Input
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            placeholder="Tên tác giả"
            className="w-full"
          />
        </Box>

        {isLoading && (
          <Box className="text-center py-2">
            <Text className="text-blue-600 text-sm">Đang xử lý...</Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default NewsModal;