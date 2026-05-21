import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header } from "zmp-ui";
import { useNavigate, useParams } from "react-router-dom";
import { normalizeNewsList, labelForCategory } from "@/utils/data-normalization";
import { getImageUrl, handleImageError } from "@/utils/image-utils";

function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [newsDetail, setNewsDetail] = useState<any | null>(null);
  const [allNews, setAllNews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Dùng /api/news/:id để lấy đầy đủ content (list API không trả content)
        const { getNewsDetail, getNews } = await import('@/utils/api');
        const [detail, list] = await Promise.all([getNewsDetail(id!), getNews()]);
        setAllNews(list);
        if (detail) {
          const { convertGoogleDriveUrl } = await import('@/utils/image-utils');
          setNewsDetail({
            ...detail,
            date: detail.created_at,
            image: convertGoogleDriveUrl(detail.image_url || ''),
            imageUrl: convertGoogleDriveUrl(detail.image_url || ''),
          });
        }
      } catch (e) {
        console.error('Lỗi API:', e);
      }
    };
    if (id) load();
  }, [id]);

  // Check if news is saved when component mounts
  useEffect(() => {
    if (id) {
      // Use consistent key with DataManager
      const savedNews = JSON.parse(localStorage.getItem('user_saved_news') || '[]');
      setIsSaved(savedNews.includes(id));
    }
  }, [id]);

  const handleSaveNews = () => {
    if (!id) return;
    
    // Use consistent key with DataManager
    const savedNews = JSON.parse(localStorage.getItem('user_saved_news') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updated = savedNews.filter((savedId: string) => savedId !== id);
      localStorage.setItem('user_saved_news', JSON.stringify(updated));
      setIsSaved(false);
      console.log('✅ Đã bỏ lưu tin:', id);
    } else {
      // Add to saved
      savedNews.push(id);
      localStorage.setItem('user_saved_news', JSON.stringify(savedNews));
      setIsSaved(true);
      console.log('✅ Đã lưu tin:', id);
    }
  };

  if (!newsDetail) {
    return (
      <Page>
        <Header 
          title="Không tìm thấy bài viết"
          showBackIcon={true}
          onBackClick={() => navigate(-1)}
          className="bg-blue-600 text-white"
        />
        <Box className="p-4 text-center">
          <Text>Bài viết không tồn tại hoặc đã bị xóa.</Text>
          <Button 
            className="mt-4 bg-blue-600 text-white"
            onClick={() => navigate("/news")}
          >
            Quay lại tin tức
          </Button>
        </Box>
      </Page>
    );
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "announcement": 
        return { label: "Thông báo", color: "bg-red-100 text-red-600" };
      case "news": 
        return { label: "Tin tức", color: "bg-blue-100 text-blue-600" };
      case "admission": 
        return { label: "Ngành tuyển sinh", color: "bg-green-100 text-green-600" };
      default: 
        return { label: "Khác", color: "bg-gray-100 text-gray-600" };
    }
  };

  const categoryInfo = getCategoryInfo(newsDetail.category);

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Chi tiết tin tức"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />

      <Box className="p-4">
        {/* Article Header */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          {/* Article Image */}
          {(newsDetail.imageUrl || newsDetail.image) && (
            <Box className="mb-4 rounded-lg overflow-hidden">
              <img
                src={newsDetail.imageUrl || newsDetail.image}
                alt={newsDetail.title}
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </Box>
          )}

          {/* Category and Hot Badge */}
          <Box className="flex items-center gap-2 mb-3">
            <Box className={`px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
              {categoryInfo.label}
            </Box>
            {newsDetail.isHot && (
              <Box className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                🔥 Nổi bật
              </Box>
            )}
          </Box>

          {/* Title */}
          <Text.Title className="text-xl font-bold text-gray-800 mb-3 leading-tight">
            {newsDetail.title}
          </Text.Title>

          {/* Meta Info */}
          <Box className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-3">
            <Box className="flex items-center gap-1">
              <Icon icon="zi-calendar" className="mr-1" />
              {newsDetail.date
                ? (newsDetail.date.includes('T')
                    ? new Date(newsDetail.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : newsDetail.date)
                : (newsDetail.createdAt
                    ? new Date(newsDetail.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : '')}
            </Box>
            <Box className="flex items-center gap-1">
              <Icon icon="zi-user" className="mr-1" />
              {newsDetail.author || 'Quản trị viên'}
            </Box>
            <Box className="flex items-center gap-1">
              <Text className="mr-1">👁️</Text>
              {(newsDetail.views ?? 0).toLocaleString('vi-VN')} lượt xem
            </Box>
          </Box>
        </Box>

        {/* Article Content */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-gray-700 leading-relaxed">
            {newsDetail.content && newsDetail.content.startsWith('<')
              ? <span dangerouslySetInnerHTML={{ __html: newsDetail.content }} />
              : newsDetail.content}
          </Text>
        </Box>

        {/* Action Buttons */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Box className="flex gap-3">
            <Button
              variant="secondary"
              size="small"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/news")}
            >
              📰 Tin tức khác
            </Button>
            <Button
              variant="secondary"
              size="small"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate(-1)}
            >
              ← Quay lại
            </Button>
          </Box>
        </Box>

        {/* Related News */}
        {(() => {
          const related = allNews
            .filter(item => String(item.id) !== String(newsDetail.id) && item.category === newsDetail.category)
            .slice(0, 3);
          if (related.length === 0) return null;
          return (
            <Box className="bg-white rounded-lg shadow-sm p-4">
              <Text.Title className="text-blue-600 mb-3">Tin tức liên quan</Text.Title>
              <Box className="space-y-3">
                {related.map(item => (
                  <Box
                    key={item.id}
                    className="flex gap-3 cursor-pointer active:bg-gray-50 rounded-lg p-1"
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    <Box className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(item, item.title)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, item.title)}
                      />
                    </Box>
                    <Box className="flex-1 min-w-0">
                      <Text className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {item.date
                          ? (item.date.includes('T')
                              ? new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                              : item.date)
                          : ''}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })()}
      </Box>

      {/* Bottom padding for navigation */}
      <Box className="h-20"></Box>
    </Page>
  );
}

export default NewsDetail;

