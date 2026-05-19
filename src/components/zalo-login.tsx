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
        throw new Error('Kh�ng thể lấy th�ng tin người d�ng từ Zalo');
      }

    } catch (error: any) {
      console.error('❌ Zalo login error:', error);
      
      let errorMessage = 'Đ� xảy ra lỗi khi đăng nhập bằng Zalo. Vui l�ng thử lại.';
      
      if (error.code === 10004) {
        errorMessage = 'Bạn đ� từ chối cấp quyền. Vui l�ng cấp quyền để sử dụng ứng dụng.';
      } else if (error.code === 10005) {
        errorMessage = 'Phi�n đăng nhập hết hạn. Vui l�ng thử lại.';
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
          Trường Cao đẳng B�ch khoa Nam S�i G�n
        </Text.Title>
        
        <Text className="text-gray-600 mb-6">
          Ứng dụng tin tức v� th�ng tin tuyển sinh ch�nh thức
        </Text>

        {/* Login Requirement Message */}
        <Box className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-blue-800 font-medium mb-2">
            🔐 Y�u cầu đăng nhập
          </Text>
          <Text className="text-blue-700 text-sm">
            Để sử dụng ứng dụng, bạn cần đăng nhập bằng t�i khoản Zalo của m�nh. 
            Th�ng tin của bạn sẽ được bảo mật v� chỉ d�ng để c� nh�n h�a trải nghiệm.
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

          {/* Đ� loại bỏ n�t Đăng nhập bằng Zalo theo y�u cầu kiểm duyệt */}

        {/* Privacy Note */}
        <Text className="text-xs text-gray-500 leading-relaxed">
          Bằng c�ch đăng nhập, bạn đồng � với{' '}
          <Text className="text-blue-600 underline">Điều khoản sử dụng</Text>
          {' '}v�{' '}
          <Text className="text-blue-600 underline">Ch�nh s�ch bảo mật</Text>
          {' '}của ch�ng t�i.
        </Text>
      </Box>
    </Modal>
  );
};

export default ZaloLogin;