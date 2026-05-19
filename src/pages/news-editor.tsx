import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header, Input, Select, Switch } from "zmp-ui";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { PERMISSIONS } from "@/types";

interface NewsFormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  isHot: boolean;
  status: 'draft' | 'published';
}

function NewsEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userInfo, hasPermission } = useUser();
  const isEditing = !!id;

  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    summary: "",
    content: "",
    category: "Thông báo",
    image: "",
    isHot: false,
    status: "draft"
  });

  const [isLoading, setIsLoading] = useState(false);

  // Check permissions
  React.useEffect(() => {
    if (!hasPermission(PERMISSIONS.NEWS_CREATE) && !hasPermission(PERMISSIONS.NEWS_EDIT)) {
      navigate("/");
    }
    
    // Load existing news data if editing
    if (isEditing) {
      // Mock load existing news data
      setFormData({
        title: "Thông báo tuyển sinh năm học 2025-2026",
        summary: "Trường Cao đẳng Bách khoa Nam Sài Gòn thông báo kế hoạch tuyển sinh năm học mới với nhiều chính sách ưu đãi cho học sinh xuất sắc.",
        content: `<div class="news-content">
          <p>Trường Cao đẳng Bách khoa Nam Sài Gòn thông báo chính thức về kế hoạch tuyển sinh năm học 2025-2026.</p>
          <h3>1. Chỉ tiêu tuyển sinh</h3>
          <ul>
            <li>Lớp 10: 300 học sinh (12 lớp)</li>
            <li>Lớp 11 chuyển trường: 30 học sinh</li>
          </ul>
        </div>`,
        category: "Tuyển sinh",
        image: "/api/placeholder/400/250",
        isHot: true,
        status: "published"
      });
    }
  }, [hasPermission, navigate, isEditing]);

  const categories = [
    "Tuyển sinh",
    "Sự kiện", 
    "Thành tích",
    "Thông báo",
    "Học tập",
    "Hoạt động"
  ];

  const handleInputChange = (field: keyof NewsFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (publishNow = false) => {
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề tin tức");
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API call
      const newsData = {
        ...formData,
        status: publishNow ? 'published' : formData.status,
        author: userInfo?.name || 'Unknown',
        authorId: userInfo?.id || '',
        id: isEditing ? parseInt(id!) : Date.now(),
        date: new Date().toISOString().split('T')[0],
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Saving news:', newsData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(isEditing ? "Cập nhật tin tức thành công!" : "Tạo tin tức thành công!");
      navigate("/admin");
      
    } catch (error) {
      console.error('Error saving news:', error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasPermission(PERMISSIONS.NEWS_CREATE) && !hasPermission(PERMISSIONS.NEWS_EDIT)) {
    return null;
  }

  // Ref & auto force-scroll fallback
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const apply = () => {
      if (!el) return;
      // Test scroll capability
      const prev = el.scrollTop;
      el.scrollTop = 1;
      const scrolled = el.scrollTop === 1;
      el.scrollTop = prev; // restore

      const contentLonger = el.scrollHeight > el.clientHeight + 16; // allow minor diff
      // Condition where scroll should exist but doesn't behave
      const needForce = (!scrolled && contentLonger) || (el.scrollHeight <= el.clientHeight && contentLonger);

      if (needForce) {
        el.classList.add('force-scroll');
      } else {
        el.classList.remove('force-scroll');
      }
    };

    // Delay to let layout settle
    requestAnimationFrame(apply);
    const id = setTimeout(apply, 250);
    window.addEventListener('resize', apply);
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', apply);
    };
  }, [formData, isEditing]);

  return (
  <Page className="news-editor-page bg-gray-50">
      <Header
        title={isEditing ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white flex-none"
      />
      {/* Scroll container */}
      <div ref={scrollRef} className="news-editor-scroll">
        <Box className="p-4 space-y-6 pb-32">
          {/* Title */}
          <Box>
            <Text className="text-sm font-medium text-gray-700 mb-2">Tiêu đề *</Text>
            <Input
              placeholder="Nhập tiêu đề tin tức"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full"
            />
          </Box>
          {/* Summary */}
          <Box>
            <Text className="text-sm font-medium text-gray-700 mb-2">Tóm tắt *</Text>
            <Input.TextArea
              placeholder="Nhập tóm tắt nội dung (1-2 câu)"
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={3}
              className="w-full"
            />
          </Box>
          {/* Category */}
          <Box>
            <Text className="text-sm font-medium text-gray-700 mb-2">Danh mục</Text>
            <Select
              placeholder="Chọn danh mục"
              value={formData.category}
              onChange={(value) => handleInputChange('category', value as string)}
            >
              {categories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Box>
          {/* Image URL */}
          <Box>
            <Text className="text-sm font-medium text-gray-700 mb-2">Hình ảnh</Text>
            <Input
              placeholder="URL hình ảnh hoặc để trống"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="w-full"
            />
            {formData.image && (
              <Box className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0OEwzOSA0NEw0NSA1MEw1NSA0MEw2NSA1MEw2NSA2MEgzNVY0OFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iNDIiIGN5PSIzMiIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
                  }}
                />
              </Box>
            )}
          </Box>
          {/* Content */}
          <Box>
            <Text className="text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết *</Text>
            <Input.TextArea
              placeholder="Nhập nội dung chi tiết tin tức (có thể sử dụng HTML cơ bản)"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              className="w-full"
            />
            <Text className="text-xs text-gray-500 mt-1">
              Có thể sử dụng HTML: &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;
            </Text>
          </Box>
          {/* Options */}
          <Box className="bg-white rounded-lg p-4">
            <Text className="font-medium text-gray-800 mb-3">Tùy chọn</Text>
            <Box className="flex items-center justify-between mb-3">
              <Box>
                <Text className="text-sm font-medium text-gray-700">Tin nổi bật</Text>
                <Text className="text-xs text-gray-500">Hiển thị ở đầu danh sách</Text>
              </Box>
              <Switch
                checked={formData.isHot}
                onChange={(e) => handleInputChange('isHot', e.target.checked)}
              />
            </Box>
            <Box className="flex items-center justify-between">
              <Box>
                <Text className="text-sm font-medium text-gray-700">Trạng thái</Text>
                <Text className="text-xs text-gray-500">
                  {formData.status === 'published' ? 'Đã xuất bản' : 'Bản thảo'}
                </Text>
              </Box>
              <Switch
                checked={formData.status === 'published'}
                onChange={(e) => handleInputChange('status', e.target.checked ? 'published' : 'draft')}
              />
            </Box>
          </Box>
          {/* Preview */}
          <Box className="bg-white rounded-lg p-4">
            <Text className="font-medium text-gray-800 mb-3">Xem trước</Text>
            <Box className="border rounded-lg p-3 bg-gray-50">
              <Text.Title className="text-sm font-semibold mb-1">
                {formData.title || "Tiêu đề tin tức"}
              </Text.Title>
              <Text className="text-xs text-gray-600 mb-2">
                {formData.summary || "Tóm tắt nội dung"}
              </Text>
              <Box className="flex items-center justify-between">
                <Text className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {formData.category}
                </Text>
                {formData.isHot && (
                  <Icon icon="zi-star-solid" className="text-red-500 text-xs" />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Sticky action bar */}
  <div className="news-editor-actions">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/admin')}
              className="flex-1"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              variant="tertiary"
              onClick={() => handleSave(false)}
              className="flex-1"
              loading={isLoading}
              disabled={!formData.title.trim()}
            >
              Lưu nháp
            </Button>
            {hasPermission(PERMISSIONS.NEWS_PUBLISH) && (
              <Button
                variant="primary"
                onClick={() => handleSave(true)}
                className="flex-1"
                loading={isLoading}
                disabled={!formData.title.trim() || !formData.summary.trim()}
              >
                {isEditing ? 'Cập nhật' : 'Xuất bản'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default NewsEditorPage;