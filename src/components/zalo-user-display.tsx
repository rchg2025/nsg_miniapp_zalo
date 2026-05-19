import React from 'react';
import { Box, Text, Avatar } from 'zmp-ui';
import { useZaloUser } from '@/hooks/useZaloUser';

interface ZaloUserDisplayProps {
  compact?: boolean;
  showPhone?: boolean;
}

export const ZaloUserDisplay: React.FC<ZaloUserDisplayProps> = ({ 
  compact = false, 
  showPhone = false 
}) => {
  const { userInfo, loading } = useZaloUser();

  if (loading) {
    return (
      <Box className={`flex items-center ${compact ? 'space-x-2' : 'space-x-3'}`}>
        <Box className={`bg-gray-200 rounded-full animate-pulse ${compact ? 'w-8 h-8' : 'w-10 h-10'}`} />
        <Box className="bg-gray-200 rounded animate-pulse h-4 w-24" />
      </Box>
    );
  }

  if (!userInfo) {
    return (
      <Box className="flex items-center space-x-2">
        <Avatar size={compact ? 32 : 40} />
        <Text className="text-gray-500">Kh�ch</Text>
      </Box>
    );
  }

  return (
    <Box className={`flex items-center ${compact ? 'space-x-2' : 'space-x-3'}`}>
      <Avatar
        src={userInfo.avatar}
        size={compact ? 32 : 40}
        className="border-2 border-white/20"
      />
      <Box>
        <Text className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>
          {userInfo.name}
        </Text>
        {showPhone && userInfo.phone && (
          <Text className={`text-green-600 ${compact ? 'text-xs' : 'text-sm'}`}>
            {userInfo.phone}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ZaloUserDisplay;