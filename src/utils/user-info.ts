import { getUserInfo } from "zmp-sdk";

export class UserInfo {
  static async getZaloDisplayName(): Promise<string> {
    try {
      const userInfo = await getUserInfo({
        autoRequestPermission: true, // Tự động yêu cầu quyền
      });
      console.log('🔍 Zalo getUserInfo response:', userInfo);
      
      if (userInfo && userInfo.userInfo && userInfo.userInfo.name) {
        // Lưu tên người dùng vào localStorage để dùng offline
        localStorage.setItem('zalo_user_name', userInfo.userInfo.name);
        return userInfo.userInfo.name;
      }
      
      // Thử lấy từ localStorage nếu đã lưu trước đó
      const cachedName = localStorage.getItem('zalo_user_name');
      if (cachedName) {
        return cachedName;
      }
      
      return 'Khách';
    } catch (error) {
      console.error('❌ Error getting Zalo user info:', error);
      
      // Thử lấy từ localStorage nếu lỗi
      const cachedName = localStorage.getItem('zalo_user_name');
      if (cachedName) {
        return cachedName;
      }
      
      return 'Khách';
    }
  }

  static getUserId(): string {
    // Có thể lấy từ localStorage hoặc từ Zalo SDK
    const userId = localStorage.getItem('user_id');
    return userId || 'guest';
  }
}