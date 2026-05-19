import React from "react";
import { Box, Text, Icon } from "zmp-ui";

interface LoadingSkeletonProps {
  count?: number;
}

function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <Box className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Box className="flex">
            <Box className="w-24 h-20 bg-gray-200 flex-shrink-0 loading-skeleton" />
            <Box className="flex-1 p-3">
              <Box className="h-4 bg-gray-200 rounded loading-skeleton mb-2" />
              <Box className="h-3 bg-gray-200 rounded loading-skeleton mb-2 w-3/4" />
              <Box className="flex justify-between items-center">
                <Box className="h-3 bg-gray-200 rounded loading-skeleton w-16" />
                <Box className="h-3 bg-gray-200 rounded loading-skeleton w-20" />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

function EmptyState({ icon = "zi-search", title, description }: EmptyStateProps) {
  return (
    <Box className="text-center py-12">
      <Icon icon={icon as any} className="text-gray-400 text-5xl mb-4" />
      <Text className="text-gray-600 font-medium mb-2">{title}</Text>
      {description && (
        <Text className="text-gray-500 text-sm">{description}</Text>
      )}
    </Box>
  );
}

export { LoadingSkeleton, EmptyState };