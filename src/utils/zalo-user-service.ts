/**
 * Zalo User Service - Quản lý thông tin người dùng Zalo
 * Chỉ lấy thông tin cơ bản: tên và ảnh đại diện
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
   * Lấy thông tin cơ bản của người dùng (tên, ảnh đại diện)
   */
  static async getUserInfo(options?: { autoRequestPermission?: boolean }): Promise<ZaloUserInfo | null> {
    try {
      console.log('🔍 Getting Zalo user info...');
      
      const response = await getUserInfo({
        autoRequestPermission: options?.autoRequestPermission ?? false
      });

      // Kiểm tra response có data không
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
   * Lấy thông tin đã cache
   */
  static getCachedUserInfo(): ZaloUserInfo | null {
    return this.userInfo;
  }

  /**
   * Xóa thông tin đã cache
   */
  static clearCachedUserInfo(): void {
    this.userInfo = null;
  }

  /**
   * Kiểm tra xem có quyền truy cập thông tin người dùng không
   */
  static async checkPermissions(): Promise<{
    userInfo: boolean;
    details: any;
  }> {
    try {
      console.log('🔍 [PERMISSIONS] Đang kiểm tra quyền truy cập...');
      
      // Kiểm tra quyền thông tin cơ bản
      let hasUserInfo = false;
      let userInfoResponse: any = null;
      
      try {
        userInfoResponse = await getUserInfo({});
        hasUserInfo = !!(userInfoResponse && userInfoResponse.userInfo);
        console.log('👤 [PERMISSIONS] Quyền thông tin cơ bản:', hasUserInfo);
      } catch (e) {
        console.log('❌ [PERMISSIONS] Lỗi khi kiểm tra quyền thông tin cơ bản:', e);
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