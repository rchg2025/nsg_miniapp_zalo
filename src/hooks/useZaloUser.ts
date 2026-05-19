import { useState, useEffect } from 'react';
import { ZaloUserService, ZaloUserInfo } from '@/utils/zalo-user-service';

export const useZaloUser = () => {
  const [userInfo, setUserInfo] = useState<ZaloUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const info = await ZaloUserService.getUserInfo();
      setUserInfo(info);
      
      if (!info) {
        setError('Kh�ng thể lấy th�ng tin người d�ng Zalo');
      }
    } catch (err) {
      setError('Lỗi khi lấy th�ng tin người d�ng');
      console.error('Error loading Zalo user info:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserInfo = () => {
    loadUserInfo();
  };

  return {
    userInfo,
    loading,
    error,
    refreshUserInfo
  };
};