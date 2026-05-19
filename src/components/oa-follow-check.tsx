import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Text, Modal } from "zmp-ui";
import { followOA } from "zmp-sdk/apis";

interface OAFollowCheckProps {
  isRequired: boolean;
  onFollowComplete: () => void;
  onCancel?: () => void;
}

export function OAFollowCheck({ isRequired, onFollowComplete, onCancel }: OAFollowCheckProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái follow OA từ localStorage
    const followStatus = localStorage.getItem("oa_followed");
    if (followStatus === "true") {
      setIsFollowed(true);
    } else if (isRequired && followStatus !== "true") {
      setShowModal(true);
    }
  }, [isRequired]);

  const handleFollowOA = async () => {
    try {
      setIsFollowing(true);
      
      // Thử follow OA
      await followOA({
        id: "785749141891313000"
      });
      
      // Lưu trạng thái đã follow
      localStorage.setItem("oa_followed", "true");
      setIsFollowed(true);
      setShowModal(false);
      onFollowComplete();
      
    } catch (error) {
      console.error("Cannot follow OA:", error);
      
      // Fallback: Mở link OA và giả định user đã follow
      try {
        const { openChat } = await import("zmp-sdk/apis");
        await openChat({
          type: "oa",
          id: "785749141891313000",
          message: "Xin chào! Tôi muốn quan tâm OA của trường để nhận thông tin tuyển sinh."
        });
        
        // Sau khi mở chat, giả định user đã follow
        setTimeout(() => {
          localStorage.setItem("oa_followed", "true");
          setIsFollowed(true);
          setShowModal(false);
          onFollowComplete();
        }, 2000);
        
      } catch (chatError) {
        // Fallback cuối: mở link web
        window.open("https://zalo.me/785749141891313000", "_blank");
        
        // Giả định user sẽ follow qua web
        setTimeout(() => {
          localStorage.setItem("oa_followed", "true");
          setIsFollowed(true);
          setShowModal(false);
          onFollowComplete();
        }, 3000);
      }
    } finally {
      setIsFollowing(false);
    }
  };

  const handleSkipForNow = () => {
    if (!isRequired) {
      setShowModal(false);
      onCancel?.();
    }
  };

  if (!showModal && isFollowed) {
    return null;
  }

  return (
    <Modal
      visible={showModal}
      title="Quan tâm OA Trường"
      actions={[
        {
          text: isRequired ? "Quan tâm ngay" : "Quan tâm OA", 
          highLight: true,
          onClick: handleFollowOA
        },
        ...(isRequired ? [] : [{
          text: "Để sau",
          onClick: handleSkipForNow
        }])
      ]}
      onClose={!isRequired ? () => {
        setShowModal(false);
        onCancel?.();
      } : undefined}
    >
      <Box className="p-4 text-center">
        <Icon 
          icon="zi-chat" 
          className="text-6xl text-blue-600 mb-4 mx-auto block"
        />
        
        <Text.Title className="text-lg font-bold text-gray-800 mb-3">
          {isRequired 
            ? "Bắt buộc quan tâm OA để tiếp tục" 
            : "Quan tâm OA để nhận thông tin mới nhất"
          }
        </Text.Title>
        
        <Text className="text-gray-600 text-sm leading-relaxed mb-4">
          Quan tâm OA <strong>Trường Cao đẳng Bách khoa Nam Sài Gòn</strong> để:
        </Text>
        
        <Box className="text-left space-y-2 mb-4">
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Nhận thông báo tuyển sinh mới nhất</Text>
          </Box>
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Tư vấn trực tiếp với nhà trường</Text>
          </Box>
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Cập nhật tin tức và sự kiện</Text>
          </Box>
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Hỗ trợ thủ tục đăng ký học</Text>
          </Box>
        </Box>
        
        {isRequired && (
          <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <Text className="text-yellow-800 text-xs">
              ⚠️ Bạn cần quan tâm OA để sử dụng đầy đủ các chức năng của ứng dụng
            </Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default OAFollowCheck;