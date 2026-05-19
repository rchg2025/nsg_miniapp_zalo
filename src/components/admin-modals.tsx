import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Input, Modal, Text, Sheet } from "zmp-ui";

interface NewsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (newsData: any) => void;
  editingItem?: any;
}

interface MajorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (majorData: any) => void;
  editingItem?: any;
}

export const NewsModal: React.FC<NewsModalProps> = ({ 
  isVisible, 
  onClose, 
  onSave, 
  editingItem 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'news',
    isHot: false,
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      setImagePreview(editingItem.image || '');
    } else {
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: 'news',
        isHot: false,
        image: ''
      });
      setImagePreview('');
    }
  }, [editingItem, isVisible]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.summary.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và tóm tắt!');
      return;
    }

    const newsData = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      date: editingItem ? editingItem.date : new Date().toISOString().split('T')[0],
      views: editingItem ? editingItem.views : Math.floor(Math.random() * 100) + 50
    };

    onSave(newsData);
    onClose();
  };

  const categoryOptions = [
    { value: 'news', title: 'Tin tức' },
    { value: 'announcement', title: 'Thông báo' },
    { value: 'admission', title: 'Tuyển sinh' }
  ];

  return (
    <Sheet visible={isVisible} onClose={onClose} autoHeight>
      <Box className="p-4">
        <Text.Title className="mb-4 text-center">
          {editingItem ? 'Sửa tin tức' : 'Thêm tin tức mới'}
        </Text.Title>

        <Box className="space-y-4">
          <Box>
            <Text className="font-medium mb-2">Tiêu đề *</Text>
            <Input
              placeholder="Nhập tiêu đề tin tức"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Tóm tắt *</Text>
            <Input.TextArea
              placeholder="Nhập tóm tắt nội dung"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              rows={3}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Nội dung chi tiết</Text>
            <Input.TextArea
              placeholder="Nhập nội dung chi tiết"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={5}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Danh mục</Text>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn danh mục</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </Box>

          <Box>
            <Text className="font-medium mb-2">Ảnh đại diện</Text>
            <Box className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {imagePreview && (
                <Box className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white"
                  >
                    <Icon icon="zi-close" />
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Box className="flex items-center justify-between">
            <Text className="font-medium">Tin nổi bật</Text>
            <input
              type="checkbox"
              checked={formData.isHot}
              onChange={(e) => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
              className="toggle"
            />
          </Box>

          <Box className="flex space-x-3 pt-4">
            <Button
              fullWidth
              variant="secondary"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={handleSave}
              className="bg-blue-600"
            >
              {editingItem ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
};

export const MajorModal: React.FC<MajorModalProps> = ({ 
  isVisible, 
  onClose, 
  onSave, 
  editingItem 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    tuition: '',
    duration: '',
    requirements: '',
    careerProspects: '',
    website: '',
    contactInfo: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        tuition: editingItem.tuitionFee?.toString() || '',
        requirements: Array.isArray(editingItem.requirements) 
          ? editingItem.requirements.join('\n') 
          : editingItem.requirements || '',
        careerProspects: Array.isArray(editingItem.careerProspects)
          ? editingItem.careerProspects.join('\n')
          : editingItem.careerProspects || '',
        website: editingItem.website || '',
        contactInfo: editingItem.contactInfo || ''
      });
      setImagePreview(editingItem.image || '');
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        tuition: '',
        duration: '',
        requirements: '',
        careerProspects: '',
        website: '',
        contactInfo: '',
        image: ''
      });
      setImagePreview('');
    }
  }, [editingItem, isVisible]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Vui lòng nhập đầy đủ tên ngành và mã ngành!');
      return;
    }

    const majorData = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
      requirements: formData.requirements.split('\n').filter(req => req.trim()),
      careerProspects: formData.careerProspects.split('\n').filter(career => career.trim()),
      tuitionFee: parseInt(formData.tuition) || 0,
      educationLevels: ['college'], // Default
      isActive: editingItem ? editingItem.isActive : true,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(majorData);
    onClose();
  };

  return (
    <Sheet visible={isVisible} onClose={onClose} autoHeight>
      <Box className="p-4">
        <Text.Title className="mb-4 text-center">
          {editingItem ? 'Sửa ngành đào tạo' : 'Thêm ngành đào tạo mới'}
        </Text.Title>

        <Box className="space-y-4">
          <Box>
            <Text className="font-medium mb-2">Tên ngành *</Text>
            <Input
              placeholder="Ví dụ: Công nghệ Thông tin"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Mã ngành *</Text>
            <Input
              placeholder="Ví dụ: CNTT"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Mô tả ngành</Text>
            <Input.TextArea
              placeholder="Mô tả về ngành đào tạo"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Học phí (VNĐ/năm)</Text>
            <Input
              type="number"
              placeholder="Ví dụ: 18000000"
              value={formData.tuition}
              onChange={(e) => setFormData(prev => ({ ...prev, tuition: e.target.value }))}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Thời gian đào tạo</Text>
            <Input
              placeholder="Ví dụ: 3 năm"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Yêu cầu đầu vào</Text>
            <Input.TextArea
              placeholder="Điều kiện, yêu cầu để học ngành này (mỗi điều kiện một dòng)"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              rows={3}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Mẹo: Viết mỗi yêu cầu trên một dòng riêng
            </Text>
          </Box>

          <Box>
            <Text className="font-medium mb-2">Cơ hội nghề nghiệp</Text>
            <Input.TextArea
              placeholder="Các cơ hội nghề nghiệp sau khi tốt nghiệp (mỗi cơ hội một dòng)"
              value={formData.careerProspects}
              onChange={(e) => setFormData(prev => ({ ...prev, careerProspects: e.target.value }))}
              rows={4}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Mẹo: Viết mỗi cơ hội nghề nghiệp trên một dòng riêng
            </Text>
          </Box>

          <Box>
            <Text className="font-medium mb-2">Website liên quan</Text>
            <Input
              placeholder="https://example.com (tùy chọn)"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Thông tin liên hệ</Text>
            <Input.TextArea
              placeholder="Thông tin liên hệ tư vấn ngành (tùy chọn)"
              value={formData.contactInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
              rows={2}
            />
          </Box>

          <Box>
            <Text className="font-medium mb-2">Ảnh đại diện ngành</Text>
            <Box className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {imagePreview && (
                <Box className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white"
                  >
                    <Icon icon="zi-close" />
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Box className="flex space-x-3 pt-4">
            <Button
              fullWidth
              variant="secondary"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={handleSave}
              className="bg-blue-600"
            >
              {editingItem ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
};