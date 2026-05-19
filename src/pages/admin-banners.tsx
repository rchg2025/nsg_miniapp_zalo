import React, { useState, useEffect } from "react";
import { Box, Button, Header, Input, Page, Text, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, Banner } from "@/utils/data-manager";

function AdminBannersPage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    order: 1,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const allBanners = DataManager.getBanners();
    setBanners(allBanners.sort((a, b) => a.order - b.order));
  };

  const handleSubmit = () => {
    try {
      if (editingBanner) {
        // Update existing banner
        DataManager.updateBanner(editingBanner.id, formData);
      } else {
        // Add new banner
        DataManager.addBanner(formData);
      }
      
      loadBanners();
      resetForm();
      alert(editingBanner ? 'Cập nhật banner th�nh c�ng!' : 'Th�m banner th�nh c�ng!');
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('C� lỗi xảy ra khi lưu banner!');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      order: banner.order,
      status: banner.status
    });
    setIsEditing(true);
  };

  const handleDelete = (bannerId: string) => {
    if (confirm('Bạn c� chắc chắn muốn x�a banner n�y?')) {
      DataManager.deleteBanner(bannerId);
      loadBanners();
      alert('X�a banner th�nh c�ng!');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      order: banners.length + 1,
      status: 'active'
    });
    setEditingBanner(null);
    setIsEditing(false);
  };

  const moveUp = (banner: Banner) => {
    if (banner.order > 1) {
      const otherBanner = banners.find(b => b.order === banner.order - 1);
      if (otherBanner) {
        DataManager.updateBanner(banner.id, { order: banner.order - 1 });
        DataManager.updateBanner(otherBanner.id, { order: otherBanner.order + 1 });
        loadBanners();
      }
    }
  };

  const moveDown = (banner: Banner) => {
    const maxOrder = Math.max(...banners.map(b => b.order));
    if (banner.order < maxOrder) {
      const otherBanner = banners.find(b => b.order === banner.order + 1);
      if (otherBanner) {
        DataManager.updateBanner(banner.id, { order: banner.order + 1 });
        DataManager.updateBanner(otherBanner.id, { order: otherBanner.order - 1 });
        loadBanners();
      }
    }
  };

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Quản l� Banner Tuyển sinh"
        showBackIcon={true}
        onBackClick={() => navigate('/admin')}
        className="bg-purple-600 text-white"
      />
      
      <Box className="p-4">
        {/* Add/Edit Form */}
        <Box className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
          <Text.Title className="mb-4 text-purple-700">
            {isEditing ? '✏️ Chỉnh sửa Banner' : '➕ Th�m Banner Mới'}
          </Text.Title>
          
          <Box className="space-y-4">
            <Box>
              <Text className="text-sm font-medium mb-2">Ti�u đề *</Text>
              <Input
                placeholder="Nhập ti�u đề banner..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </Box>

            <Box>
              <Text className="text-sm font-medium mb-2">M� tả</Text>
              <Input
                placeholder="Nhập m� tả ngắn..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Box>

            <Box>
              <Text className="text-sm font-medium mb-2">URL H�nh ảnh *</Text>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              {formData.imageUrl && (
                <Box className="mt-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box>
              <Text className="text-sm font-medium mb-2">Link đ�ch (t�y chọn)</Text>
              <Input
                placeholder="/majors hoặc /admission-registration"
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
              />
            </Box>

            <Box className="grid grid-cols-2 gap-4">
              <Box>
                <Text className="text-sm font-medium mb-2">Thứ tự hiển thị</Text>
                <Input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                />
              </Box>

              <Box>
                <Text className="text-sm font-medium mb-2">Trạng th�i</Text>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm ẩn</option>
                </select>
              </Box>
            </Box>

            <Box className="flex space-x-3">
              <Button 
                variant="primary"
                className="bg-purple-600"
                onClick={handleSubmit}
                disabled={!formData.title.trim() || !formData.imageUrl.trim()}
              >
                {isEditing ? 'Cập nhật' : 'Th�m mới'}
              </Button>
              
              {isEditing && (
                <Button 
                  variant="secondary"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Banner List */}
        <Box className="space-y-4">
          <Text.Title className="text-gray-800">📋 Danh s�ch Banner ({banners.length})</Text.Title>
          
          {banners.length === 0 ? (
            <Box className="text-center py-8 bg-white rounded-lg border">
              <Text className="text-gray-500">Chưa c� banner n�o</Text>
            </Box>
          ) : (
            banners.map((banner) => (
              <Box key={banner.id} className="bg-white rounded-lg p-4 border shadow-sm">
                <Box className="flex items-start space-x-4">
                  {/* Banner Image */}
                  <Box className="flex-shrink-0">
                    <img 
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-24 h-16 object-cover rounded border"
                    />
                  </Box>

                  {/* Banner Content */}
                  <Box className="flex-1 min-w-0">
                    <Box className="flex items-center justify-between mb-2">
                      <Text.Title className="text-lg">{banner.title}</Text.Title>
                      <Box className="flex items-center space-x-2">
                        <Box className={`px-2 py-1 rounded-full text-xs ${
                          banner.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {banner.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                        </Box>
                        <Text className="text-sm text-gray-500">#{banner.order}</Text>
                      </Box>
                    </Box>
                    
                    <Text className="text-gray-600 text-sm mb-2">{banner.description}</Text>
                    
                    {banner.linkUrl && (
                      <Text className="text-blue-600 text-xs">🔗 {banner.linkUrl}</Text>
                    )}

                    <Text className="text-xs text-gray-400 mt-2">
                      Cập nhật: {new Date(banner.updatedAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </Box>

                  {/* Actions */}
                  <Box className="flex flex-col space-y-2">
                    <Button 
                      size="small"
                      variant="secondary"
                      onClick={() => moveUp(banner)}
                      disabled={banner.order === 1}
                    >
                      <Icon icon="zi-arrow-up" />
                    </Button>
                    
                    <Button 
                      size="small"
                      variant="secondary"
                      onClick={() => moveDown(banner)}
                      disabled={banner.order === Math.max(...banners.map(b => b.order))}
                    >
                      <Icon icon="zi-arrow-down" />
                    </Button>
                    
                    <Button 
                      size="small"
                      variant="secondary"
                      onClick={() => handleEdit(banner)}
                    >
                      <Icon icon="zi-edit" />
                    </Button>
                    
                    <Button 
                      size="small"
                      variant="secondary"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Icon icon="zi-delete" />
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Page>
  );
}

export default AdminBannersPage;