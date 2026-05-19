import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { labelForCategory } from "@/utils/data-normalization";

interface NewsCardProps {
  title: string;
  summary: string;
  image: string;
  category: string;
  date: string;
  isHot?: boolean;
  isSaved?: boolean;
  onClick?: () => void;
  onBookmark?: () => void;
}

function NewsCard({ title, summary, image, category, date, isHot, isSaved, onClick, onBookmark }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // H�m tạo ảnh No Image mặc định
  const getDefaultImage = () => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc"/>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" opacity="0.1"/>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" stroke-width="0.5"/>
          </pattern>
        </defs>
        <g transform="translate(150,100)">
          <circle cx="0" cy="-20" r="25" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="-15" y="-10" width="30" height="20" fill="#cbd5e1" rx="3"/>
          <circle cx="-8" cy="-2" r="3" fill="#94a3b8"/>
          <polygon points="-15,5 -5,-5 5,0 15,-10 15,5" fill="#94a3b8"/>
        </g>
        <text x="150" y="140" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="14" font-weight="500">No Image</text>
      </svg>
    `)}`;
  };

  return (
    <Box 
      className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        isHot ? 'ring-2 ring-red-200 ring-opacity-50' : ''
      }`}
      onClick={onClick}
    >
      {/* Ảnh đại diện ở tr�n */}
      <Box className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img 
          src={image || getDefaultImage()} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultImage();
          }}
        />
        
        {/* Overlay với c�c badge */}
        <Box className="absolute top-3 left-3 flex gap-2">
          {isHot && (
            <Box className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
              🔥 Hot
            </Box>
          )}
          <Box className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            {labelForCategory(category)}
          </Box>
        </Box>

        {/* Bookmark button */}
        {onBookmark && (
          <Box 
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-white transition-colors shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
          >
            <Icon 
              icon={isSaved ? "zi-heart-solid" : "zi-heart"} 
              className={`text-lg ${isSaved ? 'text-red-500' : 'text-gray-600 hover:text-red-400'}`}
            />
          </Box>
        )}

        {/* Gradient overlay at bottom */}
        <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent h-16"></Box>
      </Box>
      
      {/* Nội dung ở dưới */}
      <Box className="p-4">
        <Text className="text-base font-semibold text-gray-800 line-clamp-2 mb-3 leading-tight min-h-[3rem]">
          {title}
        </Text>
        
        <Text className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
          {summary}
        </Text>
        
        <Box className="flex items-center justify-between">
          <Text className="text-xs text-gray-500 flex items-center gap-1">
            <span>📅</span> {formatDate(date)}
          </Text>
          <Box className="flex items-center gap-2">
            <Box 
              className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
            >
              Xem chi tiết →
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default NewsCard;