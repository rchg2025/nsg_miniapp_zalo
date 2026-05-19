/**
 * Zalo OA Service - Quản l� tương t�c với Official Account
 */

import { followOA, openChat } from 'zmp-sdk/apis';
import { OA_CONFIG } from '@/config/oa-config';

export class ZaloOAService {
  /**
   * Quan t�m OA của trường
   */
  static async followOA(): Promise<{
    success: boolean;
    message: string;
    error?: any;
  }> {
    try {
      console.log('🔗 [OA] Attempting to follow OA:', OA_CONFIG.OA_ID);
      
      await followOA({
        id: OA_CONFIG.OA_ID
      });
      
      // Lưu trạng th�i follow
      localStorage.setItem("oa_followed", "true");
      
      console.log('✅ [OA] Follow OA th�nh c�ng');
      return {
        success: true,
        message: "✅ Đ� quan t�m Zalo OA th�nh c�ng!"
      };
    } catch (error: any) {
      console.error('❌ [OA] Follow OA failed:', error);
      
      // Kiểm tra c�c loại lỗi kh�c nhau
      let errorMessage = "❌ Kh�ng thể quan t�m Zalo OA.";
      
      if (error.code === -1) {
        errorMessage += "\n� C� thể do OA ID kh�ng đ�ng hoặc OA kh�ng tồn tại";
      } else if (error.code === -2) {
        errorMessage += "\n� Người d�ng từ chối thao t�c";
      } else if (error.message?.includes('network')) {
        errorMessage += "\n� Lỗi kết nối mạng";
      } else {
        errorMessage += `\n� Chi tiết: ${error.message || 'Lỗi kh�ng x�c định'}`;
      }
      
      errorMessage += "\n\n🔄 Thử c�c c�ch kh�c:";
      errorMessage += `\n� Gọi điện: ${OA_CONFIG.CONTACT_INFO.phone}`;
      errorMessage += `\n� Website: ${OA_CONFIG.CONTACT_INFO.website}`;
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }

  /**
   * Mở chat với OA để hỗ trợ
   */
  static async openSupportChat(): Promise<{
    success: boolean;
    message: string;
    error?: any;
  }> {
    try {
      console.log('💬 [OA] Attempting to open chat with OA:', OA_CONFIG.OA_ID);
      
      await openChat({
        type: "oa",
        id: OA_CONFIG.OA_ID,
        message: OA_CONFIG.DEFAULT_MESSAGES.support
      });
      
      console.log('✅ [OA] Open chat th�nh c�ng');
      return {
        success: true,
        message: "✅ Đ� mở chat hỗ trợ th�nh c�ng!"
      };
    } catch (error: any) {
      console.error('❌ [OA] Open chat failed:', error);
      
      // Kiểm tra c�c loại lỗi kh�c nhau
      let errorMessage = "❌ Kh�ng thể mở chat hỗ trợ.";
      
      if (error.code === -1) {
        errorMessage += "\n� C� thể do OA ID kh�ng đ�ng hoặc OA kh�ng tồn tại";
      } else if (error.code === -2) {
        errorMessage += "\n� Người d�ng từ chối mở chat";
      } else if (error.message?.includes('network')) {
        errorMessage += "\n� Lỗi kết nối mạng";
      } else {
        errorMessage += `\n� Chi tiết: ${error.message || 'Lỗi kh�ng x�c định'}`;
      }
      
      errorMessage += "\n\n🔄 Thử c�c c�ch kh�c:";
      errorMessage += `\n� Gọi điện: ${OA_CONFIG.CONTACT_INFO.phone}`;
      errorMessage += `\n� Email: ${OA_CONFIG.CONTACT_INFO.email}`;
      errorMessage += `\n� Website: ${OA_CONFIG.CONTACT_INFO.website}`;
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }

  /**
   * Kiểm tra trạng th�i follow OA
   */
  static isOAFollowed(): boolean {
    return localStorage.getItem("oa_followed") === "true";
  }

  /**
   * Đặt lại trạng th�i follow OA
   */
  static resetFollowStatus(): void {
    localStorage.removeItem("oa_followed");
  }

  /**
   * Test kết nối với OA (kh�ng thực hiện thao t�c thực)
   */
  static async testOAConnection(): Promise<{
    oaId: string;
    canFollow: boolean;
    canChat: boolean;
    recommendations: string[];
  }> {
    const recommendations: string[] = [];
    
    // Kiểm tra OA ID format
    const isValidOAId = OA_CONFIG.OA_ID && OA_CONFIG.OA_ID.length > 0;
    if (!isValidOAId) {
      recommendations.push("❌ OA ID kh�ng hợp lệ hoặc trống");
    }
    
    // Kiểm tra m�i trường
    const isInZaloApp = navigator.userAgent.includes('ZaloApp');
    if (!isInZaloApp) {
      recommendations.push("⚠️ Đang test ngo�i ứng dụng Zalo, một số chức năng c� thể kh�ng hoạt động");
    }
    
    // Kiểm tra c�c API c� sẵn
    let canFollow = false;
    let canChat = false;
    
    try {
      // Test followOA API
      if (typeof followOA === 'function') {
        canFollow = true;
        recommendations.push("✅ followOA API khả dụng");
      } else {
        recommendations.push("❌ followOA API kh�ng khả dụng");
      }
      
      // Test openChat API
      if (typeof openChat === 'function') {
        canChat = true;
        recommendations.push("✅ openChat API khả dụng");
      } else {
        recommendations.push("❌ openChat API kh�ng khả dụng");
      }
    } catch (error) {
      recommendations.push(`❌ Lỗi khi test API: ${error}`);
    }
    
    return {
      oaId: OA_CONFIG.OA_ID,
      canFollow,
      canChat,
      recommendations
    };
  }
}