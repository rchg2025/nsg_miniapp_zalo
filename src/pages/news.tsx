import React, { useState, useEffect } from "react";
import { Box, Button, Icon, List, Page, Text, Header, Tabs, Input, useSnackbar } from "zmp-ui";
import { useNavigate, useSearchParams } from "react-router-dom";

import NewsCard from "@/components/news-card";
import { DataManager, NewsItem as DataNewsItem } from "@/utils/data-manager";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { time } from "@/utils/perf";
import { LoadingSkeleton, EmptyState } from "@/components/ui-helpers";
import { getImageUrl } from "@/utils/image-utils";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image?: string;
  category: string;
  date: string;
  isHot?: boolean;
  views: number;
  content?: string;
  author?: string;
  status?: string;
}

// Load news data from localStorage (same source as admin)
const getNewsData = () => {
  try {
    console.log('🔄 Loading news data from localStorage...');
    
    // Ưu tiên adminNewsList (dữ liệu mới nhất từ admin)
    const adminNews = localStorage.getItem('adminNewsList');
    const appNews = localStorage.getItem('app_news_data');
    
    let savedNews = adminNews || appNews;
    
    if (!savedNews) {
      console.log('⚠️ No news data found in localStorage');
      return [];
    }
    
    // Đồng bộ dữ liệu
    if (adminNews) {
      localStorage.setItem('app_news_data', adminNews);
    }
    
    const allNews = JSON.parse(savedNews);
    console.log('📰 Raw news data loaded:', allNews.length, 'articles');
    
    const processedNews = allNews
      .filter(item => item.status === 'published')
      .map(item => ({
        id: parseInt(item.id) || Date.now(),
        title: item.title,
        summary: item.summary || item.content?.substring(0, 150) + '...',
        image: item.image || item.imageUrl || getImageUrl({image: item.image, imageUrl: item.imageUrl}, item.title),
        category: item.category,
          date: item.createdAt || item.updatedAt || new Date().toISOString(),
        isHot: Boolean(item.featured || item.isHot),
        views: item.viewCount || item.views || 0,
        content: item.content,
        author: item.author || 'Admin',
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
      .sort((a, b) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
    
    console.log('📊 Processed news data:', processedNews.length, 'published articles');
    return processedNews;
  } catch (error) {
    console.error("❌ Error loading news from localStorage:", error);
    return [];
  }
};

const getCategories = (newsList: NewsItem[]) => {
  const dynamicCategories = Array.from(new Set(newsList.map(news => news.category)))
    .filter(cat => cat) // Lọc bỏ null/undefined
    .map(key => {
      // Map một số key tiếng Anh thường gặp với label tiếng Việt (nếu cần)
      const labelMap: Record<string, string> = {
        'news': 'Tin tức',
        'announcement': 'Thông báo',
        'admission': 'Tuyển sinh',
        'event': 'Sự kiện'
      };
      return { 
        key, 
        label: labelMap[key] || (key.charAt(0).toUpperCase() + key.slice(1)) 
      };
    });
    
  return [
    { key: "all", label: "Tất cả" },
    ...dynamicCategories
  ];
};

function NewsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openSnackbar } = useSnackbar();
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [activeTab, setActiveTab] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  
  // Lấy categories từ dữ liệu thay vì fix cứng
  const categories = getCategories(newsData);
  
  // Mock user ID - trong thực tế sẽ lấy từ Zalo authentication
  const currentUserId = "user_1";

  // Load news data from localStorage (same source as admin)
  const loadNewsData = async () => {
    try {
      const { getNews } = await import('@/utils/api');
      const allNews = await getNews();
      const processedNews = allNews
        .filter((item: any) => item.status === 'published')
        .map((item: any) => ({
          ...item,
          id: parseInt(item.id) || item.id,
          image: item.image || item.imageUrl || null,
          summary: item.summary,
        }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
      setNewsData(processedNews);
    } catch (e) { console.error('API Error:', e); }
  };

  // Load saved news for current user
  const loadSavedNews = () => {
    const saved = DataManager.getSavedNewsForUser(currentUserId);
    setSavedNewsIds(saved.map(news => news.id));
  };

  // Toggle bookmark for a news item
  const toggleBookmark = (newsId: string) => {
    const isSaved = savedNewsIds.includes(newsId);
    const newsTitle = newsData.find(news => news.id.toString() === newsId)?.title || "tin tức";
    
    if (isSaved) {
      DataManager.unsaveNewsForUser(currentUserId, newsId);
      setSavedNewsIds(prev => prev.filter(id => id !== newsId));
      openSnackbar({
        text: `Đã bỏ lưu "${newsTitle}"`,
        type: "default",
        duration: 2000
      });
    } else {
      DataManager.saveNewsForUser(currentUserId, newsId);
      setSavedNewsIds(prev => [...prev, newsId]);
      openSnackbar({
        text: `Đã lưu "${newsTitle}"`,
        type: "success", 
        duration: 2000
      });
    }
  };

  // Load data on component mount and when localStorage changes
  useEffect(() => {
    loadNewsData();
    loadSavedNews();
    
    // Set up interval to refresh data every 30 seconds (sync with admin changes)
    const interval = setInterval(() => {
      loadNewsData();
      loadSavedNews();
    }, 30000);
    
    const handleStorageChange = () => {
      loadNewsData();
      loadSavedNews();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Auto refresh respecting appSettings.autoRefresh
  useAutoRefresh(loadNewsData, 8000, 'news');

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(categoryFromUrl);
  }, [categoryFromUrl]);

  const openNewsDetail = (newsId: number) => {
    // Update view count
    const newsItem = newsData.find(item => item.id === newsId);
    if (newsItem) {
      newsItem.views += 1;
    }
    navigate(`/news/${newsId}`);
  };

  const filteredNews = newsData.filter(news => {
    // Handle "Đã lưu" tab specifically
    if (activeTab === "saved") {
      const isSaved = savedNewsIds.includes(news.id.toString());
      const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           news.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return isSaved && matchesSearch;
    }
    
    // Handle other tabs
    const matchesCategory = activeTab === "all" || news.category === activeTab;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Tin tức từ NSG"
        showBackIcon={false}
        className="custom-news-header"
        backgroundColor="#2563eb"
        textColor="white"
      />

      {/* Search Bar */}
      <Box className="p-4 bg-white shadow-sm">
        <Input.Search
          placeholder="Tìm kiếm tin tức..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </Box>

      {/* Category Tabs with Horizontal Scroll */}
      <Box className="bg-white border-b border-gray-200">
        <Box className="overflow-x-auto scrollbar-hide">
          <Box className="flex space-x-1 px-4 py-3 min-w-max">
            {categories.map((category) => (
              <Button
                key={category.key}
                size="small"
                variant={activeTab === category.key ? "primary" : "secondary"}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${activeTab === category.key 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
                onClick={() => setActiveTab(category.key)}
              >
                {category.label}
                {category.key !== "all" && category.key !== "saved" && (
                  <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                    {newsData.filter(news => news.category === category.key).length}
                  </span>
                )}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Hot News Section */}
      {activeTab === "all" && (
        <Box className="p-4">
          <Text.Title className="text-red-600 mb-3 flex items-center">
            <Icon icon="zi-star-solid" className="mr-2" />
            Tin nổi bật
          </Text.Title>
          
          <Box className="space-y-3">
            {newsData.filter(news => news.isHot).map((news) => (
              <NewsCard
                key={news.id}
                title={news.title}
                summary={news.summary}
                image={news.image || "/api/placeholder/300/200"}
                category={news.category}
                date={news.date}
                isHot={news.isHot}
                isSaved={savedNewsIds.includes(news.id.toString())}
                onClick={() => openNewsDetail(news.id)}
                onBookmark={() => toggleBookmark(news.id.toString())}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* News List */}
      <Box className="p-4">
        <Text.Title className="mb-3">
          {activeTab === "all" ? "Tất cả tin tức" : 
           activeTab === "saved" ? "Tin tức đã lưu" :
           categories.find(cat => cat.key === activeTab)?.label || "Tin tức"}
        </Text.Title>
        
        <Box className="space-y-3">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              summary={news.summary}
              image={news.image || "/api/placeholder/300/200"}
              category={news.category}
              date={news.date}
              isHot={news.isHot}
              isSaved={savedNewsIds.includes(news.id.toString())}
              onClick={() => openNewsDetail(news.id)}
              onBookmark={() => toggleBookmark(news.id.toString())}
            />
          ))}
        </Box>

        {filteredNews.length === 0 && (
          <EmptyState
            title="Không tìm thấy tin tức nào"
            description="Thử thay đổi từ khóa tìm kiếm hoặc danh mục khác"
          />
        )}
      </Box>

      {/* Load More Button */}
      {filteredNews.length > 0 && (
        <Box className="p-4 pb-20">
          <Button 
            fullWidth 
            variant="secondary"
            className="border-dashed border-gray-300"
          >
            Xem thêm tin tức
          </Button>
        </Box>
      )}

      {/* Bottom padding for navigation */}
      <Box className="h-20"></Box>
    </Page>
  );
}

export default NewsPage;
