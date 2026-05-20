import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { getImageUrl, handleImageError } from "@/utils/image-utils";

// Interfaces
interface NewsItemType {
  id: string | number;
  title: string;
  summary?: string;
  content?: string;
  category: string;
  date: string;
  isHot?: boolean;
  image?: string;
  imageUrl?: string;
  status?: string;
}

interface MajorType {
  id: string;
  name: string;
  code: string;
  description: string;
  image?: string;
  imageUrl?: string;
  duration?: string;
  status?: string;
  isActive?: boolean;
}

interface StatsType {
  majors: number;
  news: number;
  announcements: number;
  students: number;
}

// Component Slide Sự kiện
const EventSlider: React.FC<{ events: NewsItemType[]; onEventClick: (event: NewsItemType) => void }> = ({ events, onEventClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (events.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % events.length);
      }, 4000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [events.length]);

  if (events.length === 0) return null;

  return (
    <Box className="mb-4">
      <Box className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg mx-4">
        {events.map((event, index) => (
          <Box
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => onEventClick(event)}
          >
            <img
              src={getImageUrl(event, event.title)}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e, event.title)}
            />
            <Box className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <Box className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <Text.Title className="text-white text-lg font-bold mb-1 line-clamp-2">
                {event.title}
              </Text.Title>
              <Text className="text-white/90 text-sm line-clamp-1">
                {event.summary}
              </Text>
            </Box>
          </Box>
        ))}
        
        {/* Dots indicator */}
        {events.length > 1 && (
          <Box className="absolute bottom-2 right-4 flex gap-1">
            {events.map((_, index) => (
              <Box
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Component Chuyên mục nhanh
const QuickMenuSection: React.FC = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: "📝", label: "Tin tức", color: "text-blue-600", bg: "bg-blue-50", route: "/news?category=news", action: null },
    { icon: "📢", label: "Thông báo", color: "text-red-600", bg: "bg-red-50", route: "/news?category=announcement", action: null },
    { icon: "🎉", label: "Sự kiện", color: "text-purple-600", bg: "bg-purple-50", route: "/news?category=event", action: null },
    { icon: "🎓", label: "Ngành học", color: "text-green-600", bg: "bg-green-50", route: "/majors", action: null },
    { icon: "📋", label: "Đăng ký", color: "text-orange-600", bg: "bg-orange-50", route: "/admission-registration", action: null },
    { icon: "💬", label: "Quan tâm OA", color: "text-blue-500", bg: "bg-sky-50", route: null, action: "follow-oa" },
  ];

  const handleItemClick = async (item: typeof menuItems[0]) => {
    if (item.action === "follow-oa") {
      try {
        const { openWebview } = await import("zmp-sdk/apis");
        await openWebview({ url: "https://zalo.me/namsaigon" });
      } catch (e) {
        console.error("Error opening OA:", e);
      }
      return;
    }
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <Box className="mb-6 px-4">
      <Text.Title className="text-lg font-bold mb-3">Chuyên mục</Text.Title>
      <Box className="grid grid-cols-3 gap-3">
        {menuItems.map((item, index) => (
          <Box
            key={index}
            className={`${item.bg} rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => handleItemClick(item)}
          >
            <Text className={`text-3xl mb-2`}>{item.icon}</Text>
            <Text className={`${item.color} text-sm font-medium text-center`}>
              {item.label}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Component Ngành đào tạo
const MajorsSection: React.FC<{ majors: MajorType[] }> = ({ majors }) => {
  const navigate = useNavigate();

  if (majors.length === 0) {
    return null;
  }

  return (
    <Box className="mb-6 px-4">
      <Box className="flex items-center justify-between mb-3">
        <Text.Title className="text-lg font-bold">Ngành đào tạo</Text.Title>
        <Button size="small" variant="tertiary" onClick={() => {
          console.log('📍 Navigating to: /majors');
          navigate('/majors');
        }}>
          Xem tất cả →
        </Button>
      </Box>
      
      <Box className="grid grid-cols-2 gap-3">
        {majors.slice(0, 4).map((major) => (
          <Box
            key={major.id}
            className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => {
              console.log('📍 Navigating to: /majors/' + major.id);
              navigate(`/majors/${major.id}`);
            }}
          >
            {/* Ảnh đại diện ngành */}
            <Box className="h-24 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
              {(major.imageUrl || major.image) ? (
                <img
                  src={getImageUrl(major, major.name)}
                  alt={major.name}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, major.name)}
                />
              ) : (
                <Box className="w-full h-full flex items-center justify-center">
                  <Text className="text-4xl text-white font-bold">{major.code.charAt(0)}</Text>
                </Box>
              )}
            </Box>
            <Box className="p-3">
              <Text className="font-bold text-sm line-clamp-2 mb-1">{major.name}</Text>
              <Text className="text-xs text-gray-500">{major.code}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Component Tin tức compact
const NewsCompactSection: React.FC<{ 
  title: string; 
  icon: string; 
  color: string; 
  news: NewsItemType[];
  onSeeAll: () => void;
  onNewsClick: (news: NewsItemType) => void;
}> = ({ title, icon, color, news, onSeeAll, onNewsClick }) => {
  
  console.log(`📰 ${title} - Số lượng:`, news.length);
  
  return (
    <Box className="mb-6 px-4">
      <Box className="flex items-center justify-between mb-3">
        <Text.Title className={`${color} flex items-center gap-2 text-lg font-bold`}>
          <span className="text-xl">{icon}</span> {title}
        </Text.Title>
        <Button size="small" variant="tertiary" onClick={() => {
          console.log('📍 Xem tất cả:', title);
          onSeeAll();
        }}>
          Xem tất cả →
        </Button>
      </Box>

      {news.length > 0 ? (
        <Box className="space-y-3">
          {news.slice(0, 3).map((item) => (
            <Box
              key={item.id}
              className="bg-white rounded-xl shadow p-3 cursor-pointer hover:shadow-lg transition-all flex gap-3"
              onClick={() => {
                console.log('📍 Xem chi tiết tin:', item.id);
                onNewsClick(item);
              }}
            >
              <Box className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(item, item.title)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, item.title)}
                />
              </Box>
              <Box className="flex-1 min-w-0">
                <Text className="font-medium text-sm line-clamp-2 mb-1">
                  {item.title}
                </Text>
                <Text className="text-xs text-gray-500">
                  {item.date}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="text-center py-6 bg-gray-50 rounded-xl">
          <Text className="text-gray-500 text-sm">Chưa có tin tức nào</Text>
        </Box>
      )}
    </Box>
  );
};

// Main HomePage Component
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsType>({
    majors: 0,
    news: 0,
    announcements: 0,
    students: 0
  });
  const [majors, setMajors] = useState<MajorType[]>([]);
  const [newsData, setNewsData] = useState<{
    events: NewsItemType[];
    news: NewsItemType[];
    announcements: NewsItemType[];
  }>({
    events: [],
    news: [],
    announcements: []
  });

  useEffect(() => {
    // Load dữ liệu
        const loadData = async () => {
      try {
        const { getNews, getMajors } = await import('@/utils/api');
        const allNews = await getNews();
        
        const events = allNews.filter((n: any) => n.category === 'event').slice(0, 5);
        const news = allNews.filter((n: any) => n.category === 'news');
        const announcements = allNews.filter((n: any) => n.category === 'announcement');

        setNewsData({ events, news, announcements });
        
        const allMajors = await getMajors();
        setMajors(allMajors);
        
        setStats(prev => ({
          ...prev,
          news: news.length,
          announcements: announcements.length,
          majors: allMajors.length
        }));
      } catch (error) {
        console.error('L?i load d? li?u t? API:', error);
      }
    };

    loadData();
    
    // Listen for storage changes để tự động cập nhật khi admin thay đổi
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminNewsList' || e.key === 'adminMajorsList') {
        console.log('🔄 Phát hiện thay đổi từ admin, đang reload...');
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNewsClick = (newsItem: NewsItemType) => {
    navigate(`/news/${newsItem.id}`);
  };

  return (
    <Page className="page-home bg-gray-50">
      <Header />
      
      <Box className="pb-20 pt-2">
        {/* 1. Slide Sự kiện */}
        <EventSlider events={newsData.events} onEventClick={handleNewsClick} />

        {/* 2. Chuyên mục nhanh */}
        <QuickMenuSection />

        {/* 3. Ngành đào tạo */}
        {majors.length > 0 && <MajorsSection majors={majors} />}

        {/* 4. Thông báo */}
        <NewsCompactSection
          title="Thông báo"
          icon="�"
          color="text-red-600"
          news={newsData.announcements}
          onSeeAll={() => navigate('/news?category=announcement')}
          onNewsClick={handleNewsClick}
        />

        {/* 5. Tin tức */}
        <NewsCompactSection
          title="Tin tức"
          icon="�"
          color="text-blue-600"
          news={newsData.news}
          onSeeAll={() => navigate('/news?category=news')}
          onNewsClick={handleNewsClick}
        />

        {/* 6. Sự kiện */}
        <NewsCompactSection
          title="Sự kiện"
          icon="🎉"
          color="text-purple-600"
          news={newsData.events}
          onSeeAll={() => navigate('/news?category=event')}
          onNewsClick={handleNewsClick}
        />
      </Box>
    </Page>
  );
};

export default HomePage;

