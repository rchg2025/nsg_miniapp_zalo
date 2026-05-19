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
    console.log('ðŸ”„ Loading news data from localStorage...');
    
    // Æ¯u tiÃªn adminNewsList (dá»¯ liá»‡u má»›i nháº¥t tá»« admin)
    const adminNews = localStorage.getItem('adminNewsList');
    const appNews = localStorage.getItem('app_news_data');
    
    let savedNews = adminNews || appNews;
    
    if (!savedNews) {
      console.log('âš ï¸ No news data found in localStorage');
      return [];
    }
    
    // Äá»“ng bá»™ dá»¯ liá»‡u
    if (adminNews) {
      localStorage.setItem('app_news_data', adminNews);
    }
    
    const allNews = JSON.parse(savedNews);
    console.log('ðŸ“° Raw news data loaded:', allNews.length, 'articles');
    
    const processedNews = allNews
      .filter(item => item.status === 'published')
      .map(item => ({
        id: parseInt(item.id) || Date.now(),
        title: item.title,
        summary: item.summary || item.content?.substring(0, 150) + '...',
        image: item.image || item.imageUrl || getImageUrl({image: item.image, imageUrl: item.imageUrl}, item.title),
        category: item.category,
        date: new Date(item.createdAt || item.updatedAt || Date.now()).toLocaleDateString('vi-VN'),
        isHot: Boolean(item.featured || item.isHot),
        views: item.viewCount || item.views || 0,
        content: item.content,
        author: item.author || 'Admin',
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
      .sort((a, b) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
    
    console.log('ðŸ“Š Processed news data:', processedNews.length, 'published articles');
    return processedNews;
  } catch (error) {
    console.error("âŒ Error loading news from localStorage:", error);
    return [];
  }
};

const categories = [
  { key: "all", label: "Táº¥t cáº£" },
  { key: "news", label: "Tá»•ng há»£p" },
  { key: "announcement", label: "ThÃ´ng bÃ¡o" },
  { key: "admission", label: "Tuyá»ƒn sinh" },
  { key: "event", label: "Sá»± kiá»‡n" },
  { key: "saved", label: "ÄÃ£ lÆ°u" }
];

function NewsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openSnackbar } = useSnackbar();
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [activeTab, setActiveTab] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  
  // Mock user ID - trong thá»±c táº¿ sáº½ láº¥y tá»« Zalo authentication
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
          image: item.image || item.imageUrl || 'https://via.placeholder.com/300x150',
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
    const newsTitle = newsData.find(news => news.id.toString() === newsId)?.title || "tin tá»©c";
    
    if (isSaved) {
      DataManager.unsaveNewsForUser(currentUserId, newsId);
      setSavedNewsIds(prev => prev.filter(id => id !== newsId));
      openSnackbar({
        text: `ÄÃ£ bá» lÆ°u "${newsTitle}"`,
        type: "default",
        duration: 2000
      });
    } else {
      DataManager.saveNewsForUser(currentUserId, newsId);
      setSavedNewsIds(prev => [...prev, newsId]);
      openSnackbar({
        text: `ÄÃ£ lÆ°u "${newsTitle}"`,
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
    // Handle "ÄÃ£ lÆ°u" tab specifically
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
        title="Tin tá»©c TrÆ°á»ng Cao Ä‘áº³ng BÃ¡ch khoa Nam SÃ i GÃ²n"
        showBackIcon={false}
        className="bg-blue-600 text-white"
      />

      {/* Search Bar */}
      <Box className="p-4 bg-white shadow-sm">
        <Input.Search
          placeholder="TÃ¬m kiáº¿m tin tá»©c..."
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
            Tin ná»•i báº­t
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
          {activeTab === "all" ? "Táº¥t cáº£ tin tá»©c" : 
           activeTab === "saved" ? "Tin tá»©c Ä‘Ã£ lÆ°u" :
           categories.find(cat => cat.key === activeTab)?.label || "Tin tá»©c"}
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
            title="KhÃ´ng tÃ¬m tháº¥y tin tá»©c nÃ o"
            description="Thá»­ thay Ä‘á»•i tá»« khÃ³a tÃ¬m kiáº¿m hoáº·c danh má»¥c khÃ¡c"
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
            Xem thÃªm tin tá»©c
          </Button>
        </Box>
      )}

      {/* Bottom padding for navigation */}
      <Box className="h-20"></Box>
    </Page>
  );
}

export default NewsPage;
