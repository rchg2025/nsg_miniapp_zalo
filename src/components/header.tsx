import React from 'react';
import { Box, Text, Avatar } from 'zmp-ui';
import { useUser } from '../contexts/user-context';

export interface HeaderProps {
  showBackIcon?: boolean;
  onBackClick?: () => void;
  title?: string;
  className?: string;
}

export function Header({ 
  showBackIcon = false, 
  onBackClick, 
  title,
  className = "bg-blue-600 text-white"
}: HeaderProps) {
  const { userInfo, isLoggedIn } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Ch�o buổi s�ng";
    if (hour < 18) return "Ch�o buổi chiều";
    return "Ch�o buổi tối";
  };

  return (
    <>
      <Box className={`fixed top-0 left-0 right-0 z-50 p-4 ${className}`}>
        <Box className="container mx-auto">
          <Box className="flex items-center">
            {showBackIcon && (
              <Box onClick={onBackClick} className="mr-4 cursor-pointer">
                <i className="zi-arrow-left text-xl"></i>
              </Box>
            )}
            
            {title ? (
              <Text.Title className="text-white font-bold">{title}</Text.Title>
            ) : (
              <Box className="flex items-center">
                {isLoggedIn && userInfo ? (
                  <Box className="flex items-center">
                    <Avatar 
                      src={userInfo.avatar}
                      size={40}
                      className="border-2 border-white/20 mr-3"
                    />
                    <Box className="flex-1">
                      <Text className="text-white/90 text-sm">{getGreeting()},</Text>
                      <Text className="text-white font-bold">
                        {localStorage.getItem('displayName') || userInfo.name}
                      </Text>
                      <Text className="text-white/80 text-xs">
                        Ch�o mừng bạn đến với Trường Cao đẳng B�ch khoa Nam S�i G�n
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Text className="text-white/90">Ch�o mừng đến với</Text>
                    <Text className="text-white font-bold">Trường Cao đẳng B�ch khoa Nam S�i G�n</Text>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {/* Spacing element to prevent content from being hidden under fixed header */}
      <Box className="h-16"></Box>
    </>
  );
}