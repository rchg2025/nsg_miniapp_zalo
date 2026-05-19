/**
 * Zalo User Service - Quản l� th�ng tin người d�ng Zalo
 * Chỉ lấy th�ng tin cơ bản: t�n v� ảnh đại diện
 */

import { getUserInfo, authorize } from 'zmp-sdk/apis';

export interface ZaloUserInfo {
  id: string;
  name: string;
  avatar: string;
}

export class ZaloUserService {
  private static userInfo: ZaloUserInfo | null = null;

  /**
   * Lấy th�ng tin cơ bản của người d�ng (t�n, ảnh đại diện)
   */
  static async getUserInfo(): Promise<ZaloUserInfo | null> {
    try {
      console.log('🔍 Getting Zalo user info...');
      
      const response = await getUserInfo({
        autoRequestPermission: true
      });

      // Kiểm tra response c� data kh�ng
      if (response && response.userInfo) {
        const userInfo: ZaloUserInfo = {
          id: response.userInfo.id,
          name: response.userInfo.name,
          avatar: response.userInfo.avatar
        };

        this.userInfo = userInfo;
        console.log('✅ Got Zalo user info:', userInfo);
        return userInfo;
      } else {
        console.error('❌ Failed to get user info:', response);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user info:', error);
      return null;
    }
  }

  /**
   * Lấy th�ng tin đ� cache
   */
  static getCachedUserInfo(): ZaloUserInfo | null {
    return this.userInfo;
  }

  /**
   * X�a th�ng tin đ� cache
   */
  static clearCachedUserInfo(): void {
    this.userInfo = null;
  }

  /**
   * Kiểm tra xem c� quyền truy cập th�ng tin người d�ng kh�ng
   */
  static async checkPermissions(): Promise<{
    userInfo: boolean;
    details: any;
  }> {
    try {
      console.log('🔍 [PERMISSIONS] Đang kiểm tra quyền truy cập...');
      
      // Kiểm tra quyền th�ng tin cơ bản
      let hasUserInfo = false;
      let userInfoResponse: any = null;
      
      try {
        userInfoResponse = await getUserInfo({});
        hasUserInfo = !!(userInfoResponse && userInfoResponse.userInfo);
        console.log('👤 [PERMISSIONS] Quyền th�ng tin cơ bản:', hasUserInfo);
      } catch (e) {
        console.log('❌ [PERMISSIONS] Lỗi khi kiểm tra quyền th�ng tin cơ bản:', e);
        hasUserInfo = false;
      }

      const result = {
        userInfo: hasUserInfo,
        details: {
          userInfoResponse,
          timestamp: new Date().toISOString()
        }
      };

      console.log('📋 [PERMISSIONS] Kết quả kiểm tra quyền:', result);
      return result;
    } catch (error) {
      console.error('❌ [PERMISSIONS] Lỗi khi kiểm tra quyền:', error);
      return {
        userInfo: false,
        details: { error: error }
      };
    }
  }
}