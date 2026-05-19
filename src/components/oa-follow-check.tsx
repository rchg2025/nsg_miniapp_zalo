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
    // Kiểm tra trạng th�i follow OA từ localStorage
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
      
      // Lưu trạng th�i đ� follow
      localStorage.setItem("oa_followed", "true");
      setIsFollowed(true);
      setShowModal(false);
      onFollowComplete();
      
    } catch (error) {
      console.error("Cannot follow OA:", error);
      
      // Fallback: Mở link OA v� giả định user đ� follow
      try {
        const { openChat } = await import("zmp-sdk/apis");
        await openChat({
          type: "oa",
          id: "785749141891313000",
          message: "Xin ch�o! T�i muốn quan t�m OA của trường để nhận th�ng tin tuyển sinh."
        });
        
        // Sau khi mở chat, giả định user đ� follow
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
      title="Quan t�m OA Trường"
      actions={[
        {
          text: isRequired ? "Quan t�m ngay" : "Quan t�m OA", 
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
            ? "Bắt buộc quan t�m OA để tiếp tục" 
            : "Quan t�m OA để nhận th�ng tin mới nhất"
          }
        </Text.Title>
        
        <Text className="text-gray-600 text-sm leading-relaxed mb-4">
          Quan t�m OA <strong>Trường Cao đẳng B�ch khoa Nam S�i G�n</strong> để:
        </Text>
        
        <Box className="text-left space-y-2 mb-4">
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Nhận th�ng b�o tuyển sinh mới nhất</Text>
          </Box>
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Tư vấn trực tiếp với nh� trường</Text>
          </Box>
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Cập nhật tin tức v� sự kiện</Text>
          </Box>
          <Box className="flex items-center space-x-2">
            <Icon icon="zi-check-circle" className="text-green-500 text-sm" />
            <Text className="text-sm text-gray-700">Hỗ trợ thủ tục đăng k� học</Text>
          </Box>
        </Box>
        
        {isRequired && (
          <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <Text className="text-yellow-800 text-xs">
              ⚠️ Bạn cần quan t�m OA để sử dụng đầy đủ c�c chức năng của ứng dụng
            </Text>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default OAFollowCheck;