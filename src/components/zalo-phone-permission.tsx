/**
 * Component xử lý quyền truy cập số điện thoại Zalo
 */

import React, { useState } from 'react';
import { Box, Button, Icon, Text, Modal } from 'zmp-ui';
import { ZaloUserService } from '@/utils/zalo-user-service';

interface ZaloPhonePermissionProps {
  onPhoneReceived?: (phone: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  showModal?: boolean;
}

export const ZaloPhonePermission: React.FC<ZaloPhonePermissionProps> = ({
  onPhoneReceived,
  onError,
  buttonText = "Lấy số điện thoại từ Zalo",
  showModal = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    
    try {
      // Hiển thị modal giải thích trước khi request
      if (showModal) {
        setShowPermissionModal(true);
        return;
      }
      
      await requestPhonePermission();
    } catch (error) {
      console.error('Error in phone permission flow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPhonePermission = async () => {
    try {
      console.log('🔐 Bắt đầu quy trình xin quyền số điện thoại...');
      
      // Bước 1: Kiểm tra quyền hiện tại
      const permissions = await ZaloUserService.checkPermissions();
      console.log('📋 Quyền hiện tại:', permissions);

      if (permissions.phone) {
        console.log('✅ Đã có quyền số điện thoại, đang lấy thông tin...');
        const phone = await ZaloUserService.requestPhonePermission();
        if (phone) {
          onPhoneReceived?.(phone);
          return;
        }
      }

      // Bước 2: Request quyền số điện thoại
      console.log('📞 Đang yêu cầu quyền truy cập số điện thoại...');
      const phone = await ZaloUserService.requestPhonePermission();
      
      if (phone) {
        console.log('✅ Lấy số điện thoại thành công:', phone);
        onPhoneReceived?.(phone);
      } else {
        const errorMsg = 'Không thể lấy số điện thoại. Vui lòng kiểm tra quyền truy cập.';
        console.log('❌', errorMsg);
        onError?.(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = `Lỗi khi lấy số điện thoại: ${error.message || error}`;
      console.error('❌', errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleConfirmPermission = async () => {
    setShowPermissionModal(false);
    await requestPhonePermission();
    setIsLoading(false);
  };

  const handleCancelPermission = () => {
    setShowPermissionModal(false);
    setIsLoading(false);
    onError?.('Người dùng từ chối cấp quyền truy cập số điện thoại');
  };

  return (
    <>
      <Button
        size="small"
        variant="tertiary"
        onClick={handleRequestPermission}
        loading={isLoading}
        disabled={isLoading}
        className="text-blue-600"
      >
        <Icon icon="zi-call" className="mr-1" />
        {buttonText}
      </Button>

      {/* Modal giải thích quyền truy cập */}
      {showPermissionModal && (
        <Modal
          visible={showPermissionModal}
          title="Quyền truy cập số điện thoại"
          onClose={handleCancelPermission}
          actions={[
            {
              text: "Hủy",
              close: true,
              onClick: handleCancelPermission
            },
            {
              text: "Cho phép",
              highLight: true,
              onClick: handleConfirmPermission
            }
          ]}
        >
          <Box className="p-4">
            <Box className="flex items-center mb-4">
              <Icon icon="zi-check-circle" className="text-green-600 mr-3 text-2xl" />
              <Box>
                <Text.Title size="small">Yêu cầu quyền truy cập</Text.Title>
                <Text className="text-gray-600">Ứng dụng cần quyền để lấy số điện thoại</Text>
              </Box>
            </Box>

            <Box className="bg-blue-50 rounded-lg p-3 mb-4">
              <Text className="text-sm text-blue-800">
                <Icon icon="zi-info-circle" className="mr-1" />
                <strong>Tại sao cần quyền này?</strong>
              </Text>
              <Text className="text-sm text-blue-700 mt-2">
                • Tự động điền số điện thoại vào form{'\n'}
                • Liên hệ khẩn cấp khi cần thiết{'\n'}
                • Xác thực tài khoản an toàn hơn
              </Text>
            </Box>

            <Box className="bg-green-50 rounded-lg p-3 mb-4">
              <Text className="text-sm text-green-800">
                <Icon icon="zi-check-circle" className="mr-1" />
                <strong>Cam kết bảo mật:</strong>
              </Text>
              <Text className="text-sm text-green-700 mt-2">
                • Không chia sẻ thông tin với bên thứ 3{'\n'}
                • Chỉ sử dụng cho mục đích ứng dụng{'\n'}
                • Dữ liệu được mã hóa an toàn
              </Text>
            </Box>

            <Box className="border-l-4 border-orange-400 pl-3 py-2">
              <Text className="text-sm text-gray-700">
                <strong>Lưu ý:</strong> Bạn có thể thu hồi quyền này bất kỳ lúc nào trong cài đặt Zalo.
              </Text>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ZaloPhonePermission;