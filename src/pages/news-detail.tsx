import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header } from "zmp-ui";
import { useNavigate, useParams } from "react-router-dom";
import { normalizeNewsList, labelForCategory } from "@/utils/data-normalization";

function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [newsDetail, setNewsDetail] = useState<any | null>(null);
  const [allNews, setAllNews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { getNews } = await import('@/utils/api');
        const list = await getNews();
        setAllNews(list);
        const found = list.find((item: any) => String(item.id) === String(id));
        if (found) {
          setNewsDetail(found);
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
          <Box className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
            <Box className="flex items-center">
              <Icon icon="zi-calendar" className="mr-1" />
              {newsDetail.date}
            </Box>
            <Box className="flex items-center">
              <Icon icon="zi-user" className="mr-1" />
              {newsDetail.author}
            </Box>
            <Box className="flex items-center">
              <Text className="mr-1">👁️</Text>
              {newsDetail.views} lượt xem
            </Box>
          </Box>
        </Box>

        {/* Article Content */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-gray-700 leading-relaxed">
            {newsDetail.content}
          </Text>
          
          {/* Additional content based on category */}
          {newsDetail.category === "announcement" && (
            <Box className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <Text.Title className="text-red-700 mb-2">📢 Thông tin quan trọng</Text.Title>
              <Text className="text-red-600 text-sm">
                • Thời gian nộp hồ sơ: 15/03 - 30/08/2025<br/>
                • Địa điểm: Phòng Đào tạo - Tầng 2<br/>
                • Hotline: 028.3xxx.xxxx
              </Text>
            </Box>
          )}
          
          {newsDetail.category === "admission" && (
            <Box className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <Text.Title className="text-green-700 mb-2">🎓 Thông tin ngành học</Text.Title>
              <Text className="text-green-600 text-sm">
                • Thời gian đào tạo: 3 năm<br/>
                • Tỷ lệ có việc làm: 95%<br/>
                • Học phí: 18.000.000 VND/năm
              </Text>
            </Box>
          )}
        </Box>

        {/* Action Buttons */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Box className="flex gap-3">
            <Button
              variant="secondary"
              size="small"
              className={`flex-1 flex items-center justify-center ${
                isSaved 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'border-blue-200 text-blue-600 hover:bg-blue-50'
              }`}
              onClick={handleSaveNews}
            >
              <Icon icon={isSaved ? "zi-star-solid" : "zi-bookmark"} className="mr-2" />
              {isSaved ? "Đã lưu" : "Lưu tin"}
            </Button>
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
        <Box className="bg-white rounded-lg shadow-sm p-4">
          <Text.Title className="text-blue-600 mb-3">Tin tức liên quan</Text.Title>
          <Box className="space-y-3">
            {allNews
              .filter(item => item.id !== newsDetail.id && item.category === newsDetail.category)
              .slice(0,3)
              .map(related => (
                <Box
                  key={related.id}
                  className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-blue-500"
                  onClick={() => navigate(`/news/${related.id}`)}
                >
                  <Text className="text-blue-500 mt-1">📄</Text>
                  <Box className="flex-1">
                    <Text className="text-sm font-medium text-gray-800 line-clamp-2">{related.title}</Text>
                    <Text className="text-xs text-gray-500 mt-1">{related.date}</Text>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>

      {/* Bottom padding for navigation */}
      <Box className="h-20"></Box>
    </Page>
  );
}

export default NewsDetail;

