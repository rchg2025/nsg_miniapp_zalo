import { getUserInfo } from "zmp-sdk";

export class UserInfo {
  static async getZaloDisplayName(): Promise<string> {
    try {
      const userInfo = await getUserInfo({
        autoRequestPermission: true, // Tự động y�u cầu quyền
      });
      console.log('🔍 Zalo getUserInfo response:', userInfo);
      
      if (userInfo && userInfo.userInfo && userInfo.userInfo.name) {
        // Lưu t�n người d�ng v�o localStorage để d�ng offline
        localStorage.setItem('zalo_user_name', userInfo.userInfo.name);
        return userInfo.userInfo.name;
      }
      
      // Thử lấy từ localStorage nếu đ� lưu trước đ�
      const cachedName = localStorage.getItem('zalo_user_name');
      if (cachedName) {
        return cachedName;
      }
      
      return 'Kh�ch';
    } catch (error) {
      console.error('❌ Error getting Zalo user info:', error);
      
      // Thử lấy từ localStorage nếu lỗi
      const cachedName = localStorage.getItem('zalo_user_name');
      if (cachedName) {
        return cachedName;
      }
      
      return 'Kh�ch';
    }
  }

  static getUserId(): string {
    // C� thể lấy từ localStorage hoặc từ Zalo SDK
    const userId = localStorage.getItem('user_id');
    return userId || 'guest';
  }
}