import React, { useState, useEffect } from 'react';
import { authorize, getUserInfo } from 'zmp-sdk';
import { Box, Button, Text, Modal, Spinner } from 'zmp-ui';
import Logo from './logo';

interface ZaloLoginProps {
  onLoginSuccess: (userInfo: any) => void;
}

const ZaloLogin: React.FC<ZaloLoginProps> = ({ onLoginSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleZaloLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Request authorization from Zalo
      console.log('🔐 Requesting Zalo authorization...');
      
      const authResult = await authorize({
        scopes: ['scope.userInfo', 'scope.userPhonenumber']
      });

      console.log('✅ Authorization successful:', authResult);

      // Get user info after successful authorization
      const userInfo = await getUserInfo({
        avatarType: 'normal'
      });

      console.log('👤 User info retrieved:', userInfo);

      if (userInfo && userInfo.userInfo) {
        // Save user info to localStorage
        localStorage.setItem('zaloUserInfo', JSON.stringify(userInfo.userInfo));
        localStorage.setItem('isZaloLoggedIn', 'true');
        
        // Call success callback
        onLoginSuccess(userInfo.userInfo);
        setIsModalOpen(false);
      } else {
        throw new Error('Không thể lấy thông tin người dùng từ Zalo');
      }

    } catch (error: any) {
      console.error('❌ Zalo login error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi đăng nhập bằng Zalo. Vui lòng thử lại.';
      
      if (error.code === 10004) {
        errorMessage = 'Bạn đã từ chối cấp quyền. Vui lòng cấp quyền để sử dụng ứng dụng.';
      } else if (error.code === 10005) {
        errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng thử lại.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const savedUserInfo = localStorage.getItem('zaloUserInfo');
        const isLoggedIn = localStorage.getItem('isZaloLoggedIn') === 'true';
        
        if (savedUserInfo && isLoggedIn) {
          const userInfo = JSON.parse(savedUserInfo);
          console.log('✅ Found existing Zalo login:', userInfo);
          
          // Verify the session is still valid by getting fresh user info
          try {
            const freshUserInfo = await getUserInfo({ avatarType: 'normal' });
            if (freshUserInfo && freshUserInfo.userInfo) {
              localStorage.setItem('zaloUserInfo', JSON.stringify(freshUserInfo.userInfo));
              onLoginSuccess(freshUserInfo.userInfo);
              setIsModalOpen(false);
              return;
            }
          } catch (verifyError) {
            console.log('⚠️ Session verification failed, requiring fresh login');
            // Clear invalid session
            localStorage.removeItem('zaloUserInfo');
            localStorage.removeItem('isZaloLoggedIn');
          }
        }
      } catch (error) {
        console.error('Error checking existing login:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('zaloUserInfo');
        localStorage.removeItem('isZaloLoggedIn');
      }
    };

    checkExistingLogin();
  }, [onLoginSuccess]);

  return (
    <Modal
      visible={isModalOpen}
      title=""
      onClose={() => {}} // Prevent closing - login is required
      actions={[]}
      className="zalo-login-modal"
    >
      <Box className="text-center py-8 px-4">
        {/* Logo */}
        <Box className="flex justify-center mb-6">
          <Logo />
        </Box>

        {/* App Title */}
        <Text.Title className="text-xl font-bold text-gray-800 mb-2">
          Trường Cao đẳng Bách khoa Nam Sài Gòn
        </Text.Title>
        
        <Text className="text-gray-600 mb-6">
          Ứng dụng tin tức và thông tin tuyển sinh chính thức
        </Text>

        {/* Login Requirement Message */}
        <Box className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-blue-800 font-medium mb-2">
            🔐 Yêu cầu đăng nhập
          </Text>
          <Text className="text-blue-700 text-sm">
            Để sử dụng ứng dụng, bạn cần đăng nhập bằng tài khoản Zalo của mình. 
            Thông tin của bạn sẽ được bảo mật và chỉ dùng để cá nhân hóa trải nghiệm.
          </Text>
        </Box>

        {/* Error Message */}
        {error && (
          <Box className="bg-red-50 rounded-lg p-4 mb-4">
            <Text className="text-red-600 text-sm">
              ❌ {error}
            </Text>
          </Box>
        )}

          {/* Đã loại bỏ nút Đăng nhập bằng Zalo theo yêu cầu kiểm duyệt */}

        {/* Privacy Note */}
        <Text className="text-xs text-gray-500 leading-relaxed">
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <Text className="text-blue-600 underline">Điều khoản sử dụng</Text>
          {' '}và{' '}
          <Text className="text-blue-600 underline">Chính sách bảo mật</Text>
          {' '}của chúng tôi.
        </Text>
      </Box>
    </Modal>
  );
};

export default ZaloLogin;