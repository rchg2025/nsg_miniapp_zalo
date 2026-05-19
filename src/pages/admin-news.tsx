import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header, List, Input, Modal, Switch } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, NewsItem } from "@/utils/data-manager";

function AdminNewsPage() {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'draft' | 'featured' | 'views'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'general',
    status: 'draft' as 'draft' | 'published',
    featured: false,
    imageUrl: '',
    tags: ''
  });

  // Kiểm tra quyền admin
  useEffect(() => {
    const adminStatus = localStorage.getItem("admin_logged_in");
    if (adminStatus !== "true") {
      navigate("/profile");
      return;
    }

    loadNews();
  }, [navigate]);

  const loadNews = () => {
    const newsData = DataManager.getNews();
    setNewsList(newsData);
    applyFilter(newsData, activeFilter);
  };

  const applyFilter = (newsData: NewsItem[], filter: string) => {
    let filtered = [...newsData];
    
    switch (filter) {
      case 'published':
        filtered = newsData.filter(n => n.status === 'published');
        break;
      case 'draft':
        filtered = newsData.filter(n => n.status === 'draft');
        break;
      case 'featured':
        filtered = newsData.filter(n => n.featured);
        break;
      case 'views':
        filtered = [...newsData].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      default:
        filtered = newsData;
    }
    
    setFilteredNews(filtered);
  };

  const handleFilterClick = (filter: 'all' | 'published' | 'draft' | 'featured' | 'views') => {
    setActiveFilter(filter);
    applyFilter(newsList, filter);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'general',
      status: 'draft',
      featured: false,
      imageUrl: '',
      tags: ''
    });
  };

  const handleCreateNews = () => {
    if (!formData.title || !formData.content || !formData.summary) {
      alert('Vui l�ng nhập đầy đủ ti�u đề, t�m tắt v� nội dung');
      return;
    }

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const newsData = {
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      category: formData.category,
      author: 'Admin NSG',
      status: formData.status,
      featured: formData.featured,
      imageUrl: formData.imageUrl || undefined,
      tags: tagsArray,
    };

    DataManager.addNews(newsData);
    loadNews();
    resetForm();
    setShowCreateModal(false);
    setActiveFilter('all');
  };

  const handleEditNews = (news: NewsItem) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      content: news.content,
      summary: news.summary,
      category: news.category,
      status: news.status,
      featured: news.featured,
      imageUrl: news.imageUrl || '',
      tags: news.tags && Array.isArray(news.tags) ? news.tags.join(', ') : ''
    });
    setShowCreateModal(true);
  };

  const handleUpdateNews = () => {
    if (!editingNews) return;

    if (!formData.title || !formData.content || !formData.summary) {
      alert('Vui l�ng nhập đầy đủ ti�u đề, t�m tắt v� nội dung');
      return;
    }

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const updatedNews = newsList.map(news => 
      news.id === editingNews.id 
        ? { 
            ...news, 
            title: formData.title,
            content: formData.content,
            summary: formData.summary,
            category: formData.category,
            status: formData.status,
            featured: formData.featured,
            imageUrl: formData.imageUrl || undefined,
            tags: tagsArray,
            updatedAt: new Date().toISOString()
          }
        : news
    );
    
    DataManager.saveNews(updatedNews);
    setNewsList(updatedNews);
    setEditingNews(null);
    resetForm();
    setShowCreateModal(false);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Bạn c� chắc chắn muốn x�a b�i viết n�y?')) {
      const updatedNews = newsList.filter(news => news.id !== id);
      DataManager.saveNews(updatedNews);
      setNewsList(updatedNews);
    }
  };

  const toggleFeatured = (id: string) => {
    const updatedNews = newsList.map(news => 
      news.id === id ? { ...news, featured: !news.featured, updatedAt: new Date().toISOString() } : news
    );
    DataManager.saveNews(updatedNews);
    setNewsList(updatedNews);
  };

  const getCategoryName = (category: string) => {
    const categories = {
      'news': 'Tổng hợp',
      'admission': 'Tuyển sinh',
      'event': 'Sự kiện',
      'announcement': 'Th�ng b�o',
      // Legacy categories (for backward compatibility)
      'general': 'Tổng hợp',
      'tuyen-sinh': 'Tuyển sinh',
      'su-kien': 'Sự kiện',
      'thong-bao': 'Th�ng b�o'
    };
    return categories[category] || category;
  };

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Quản l� tin tức" 
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

      <Box className="p-4">
        {/* Header actions */}
        <Box className="flex justify-between items-center mb-4">
          <Text.Title>Danh s�ch tin tức ({newsList.length})</Text.Title>
          <Button 
            variant="primary"
            size="small"
            onClick={() => {
              resetForm();
              setEditingNews(null);
              setShowCreateModal(true);
            }}
          >
            + Tạo mới
          </Button>
        </Box>

        {/* Stats - Clickable */}
        <Box className="grid grid-cols-4 gap-3 mb-4">
          <Box 
            className={`bg-white p-3 rounded text-center cursor-pointer transition-all ${
              activeFilter === 'published' ? 'ring-2 ring-green-500 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => handleFilterClick('published')}
          >
            <Text className="text-lg font-bold text-green-600">
              {newsList.filter(n => n.status === 'published').length}
            </Text>
            <Text className="text-xs text-gray-500">Đ� xuất bản</Text>
            {activeFilter === 'published' && <Text className="text-xs text-green-600 mt-1">✓ Đang lọc</Text>}
          </Box>
          <Box 
            className={`bg-white p-3 rounded text-center cursor-pointer transition-all ${
              activeFilter === 'draft' ? 'ring-2 ring-yellow-500 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => handleFilterClick('draft')}
          >
            <Text className="text-lg font-bold text-yellow-600">
              {newsList.filter(n => n.status === 'draft').length}
            </Text>
            <Text className="text-xs text-gray-500">Bản nh�p</Text>
            {activeFilter === 'draft' && <Text className="text-xs text-yellow-600 mt-1">✓ Đang lọc</Text>}
          </Box>
          <Box 
            className={`bg-white p-3 rounded text-center cursor-pointer transition-all ${
              activeFilter === 'featured' ? 'ring-2 ring-red-500 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => handleFilterClick('featured')}
          >
            <Text className="text-lg font-bold text-red-600">
              {newsList.filter(n => n.featured).length}
            </Text>
            <Text className="text-xs text-gray-500">Nổi bật</Text>
            {activeFilter === 'featured' && <Text className="text-xs text-red-600 mt-1">✓ Đang lọc</Text>}
          </Box>
          <Box 
            className={`bg-white p-3 rounded text-center cursor-pointer transition-all ${
              activeFilter === 'views' ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => handleFilterClick('views')}
          >
            <Text className="text-lg font-bold text-blue-600">
              {newsList.reduce((sum, n) => sum + (n.viewCount || 0), 0)}
            </Text>
            <Text className="text-xs text-gray-500">Lượt xem</Text>
            {activeFilter === 'views' && <Text className="text-xs text-blue-600 mt-1">✓ Sắp xếp</Text>}
          </Box>
        </Box>

        {/* Active filter indicator */}
        {activeFilter !== 'all' && (
          <Box className="mb-4 flex items-center justify-between bg-blue-50 p-3 rounded">
            <Box className="flex items-center gap-2">
              <Text className="text-sm text-blue-700 font-medium">
                🔍 Đang hiển thị: {
                  activeFilter === 'published' ? 'B�i đ� xuất bản' :
                  activeFilter === 'draft' ? 'Bản nh�p' :
                  activeFilter === 'featured' ? 'B�i nổi bật' :
                  'Sắp xếp theo lượt xem'
                } ({filteredNews.length} b�i)
              </Text>
            </Box>
            <Button 
              size="small"
              variant="tertiary"
              onClick={() => handleFilterClick('all')}
              className="text-blue-600"
            >
              X�a bộ lọc
            </Button>
          </Box>
        )}

        {/* News List */}
        <List>
          {(activeFilter === 'all' ? newsList : filteredNews).map((news) => (
            <List.Item
              key={news.id}
              title={`${news.featured ? '⭐ ' : ''}${news.title}`}
              subTitle={`${getCategoryName(news.category)} � ${new Date(news.createdAt).toLocaleDateString('vi-VN')} � ${news.status === 'published' ? 'Đ� xuất bản' : 'Bản nh�p'} � ${news.viewCount} lượt xem`}
              prefix={
                news.imageUrl ? (
                  <img 
                    src={news.imageUrl} 
                    alt={news.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <Box className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Text className="text-gray-500 text-xs">📰</Text>
                  </Box>
                )
              }
              suffix={
                <Box className="flex gap-2">
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => toggleFeatured(news.id)}
                    className={news.featured ? "text-red-600" : "text-gray-600"}
                  >
                    {news.featured ? '★' : '☆'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => handleEditNews(news)}
                  >
                    Sửa
                  </Button>
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => handleDeleteNews(news.id)}
                    className="text-red-600"
                  >
                    X�a
                  </Button>
                </Box>
              }
            />
          ))}
        </List>

        {newsList.length === 0 && (
          <Box className="text-center py-8">
            <Text className="text-gray-500">Chưa c� tin tức n�o</Text>
          </Box>
        )}
      </Box>

      {/* Create/Edit Modal */}
      <Modal
        visible={showCreateModal}
        title={editingNews ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
        onClose={() => {
          setShowCreateModal(false);
          setEditingNews(null);
          resetForm();
        }}
        actions={[
          {
            text: "Hủy",
            close: true,
            highLight: false,
          },
          {
            text: editingNews ? "Cập nhật" : "Tạo mới",
            highLight: true,
            onClick: () => {
              if (editingNews) {
                handleUpdateNews();
              } else {
                handleCreateNews();
              }
            },
          },
        ]}
      >
        <Box className="space-y-4 max-h-96 overflow-y-auto">
          <Box>
            <Text className="mb-2 font-medium">Ti�u đề</Text>
            <Input
              placeholder="Nhập ti�u đề tin tức"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </Box>

          <Box>
            <Text className="mb-2 font-medium">T�m tắt</Text>
            <Input.TextArea
              placeholder="Nhập t�m tắt ngắn gọn về tin tức"
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              rows={2}
            />
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Danh mục</Text>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="news">Tổng hợp</option>
              <option value="admission">Tuyển sinh</option>
              <option value="event">Sự kiện</option>
              <option value="announcement">Th�ng b�o</option>
            </select>
          </Box>

          <Box>
            <Text className="mb-2 font-medium">URL ảnh đại diện</Text>
            <Input
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
            {formData.imageUrl && (
              <Box className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Box>
            )}
          </Box>

          <Box className="flex items-center justify-between">
            <Text className="font-medium">B�i viết nổi bật</Text>
            <Switch
              checked={formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
            />
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Trạng th�i</Text>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Bản nh�p</option>
              <option value="published">Xuất bản</option>
            </select>
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Tags (c�ch nhau bằng dấu phẩy)</Text>
            <Input
              placeholder="tin tức, quan trọng, th�ng b�o"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
            />
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Nội dung</Text>
            <Input.TextArea
              placeholder="Nhập nội dung tin tức đầy đủ"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={8}
            />
          </Box>
        </Box>
      </Modal>
    </Page>
  );
}

export default AdminNewsPage;