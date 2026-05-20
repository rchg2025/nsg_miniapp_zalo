/**
 * Zalo OA Service - Quản lý tương tác với Official Account
 */

import { followOA, openChat } from 'zmp-sdk/apis';
import { OA_CONFIG } from '@/config/oa-config';

export class ZaloOAService {
  /**
   * Quan tâm OA của trường
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
      
      // Lưu trạng thái follow
      localStorage.setItem("oa_followed", "true");
      
      console.log('✅ [OA] Follow OA thành công');
      return {
        success: true,
        message: "✅ Đã quan tâm Zalo OA thành công!"
      };
    } catch (error: any) {
      console.error('❌ [OA] Follow OA failed:', error);
      
      // Kiểm tra các loại lỗi khác nhau
      let errorMessage = "❌ Không thể quan tâm Zalo OA.";
      
      if (error.code === -1) {
        errorMessage += "\n• Có thể do OA ID không đúng hoặc OA không tồn tại";
      } else if (error.code === -2) {
        errorMessage += "\n• Người dùng từ chối thao tác";
      } else if (error.message?.includes('network')) {
        errorMessage += "\n• Lỗi kết nối mạng";
      } else {
        errorMessage += `\n• Chi tiết: ${error.message || 'Lỗi không xác định'}`;
      }
      
      errorMessage += "\n\n🔄 Thử các cách khác:";
      errorMessage += `\n• Gọi điện: ${OA_CONFIG.CONTACT_INFO.phone}`;
      errorMessage += `\n• Website: ${OA_CONFIG.CONTACT_INFO.website}`;
      
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
      
      console.log('✅ [OA] Open chat thành công');
      return {
        success: true,
        message: "✅ Đã mở chat hỗ trợ thành công!"
      };
    } catch (error: any) {
      console.error('❌ [OA] Open chat failed:', error);
      
      // Kiểm tra các loại lỗi khác nhau
      let errorMessage = "❌ Không thể mở chat hỗ trợ.";
      
      if (error.code === -1) {
        errorMessage += "\n• Có thể do OA ID không đúng hoặc OA không tồn tại";
      } else if (error.code === -2) {
        errorMessage += "\n• Người dùng từ chối mở chat";
      } else if (error.message?.includes('network')) {
        errorMessage += "\n• Lỗi kết nối mạng";
      } else {
        errorMessage += `\n• Chi tiết: ${error.message || 'Lỗi không xác định'}`;
      }
      
      errorMessage += "\n\n🔄 Thử các cách khác:";
      errorMessage += `\n• Gọi điện: ${OA_CONFIG.CONTACT_INFO.phone}`;
      errorMessage += `\n• Email: ${OA_CONFIG.CONTACT_INFO.email}`;
      errorMessage += `\n• Website: ${OA_CONFIG.CONTACT_INFO.website}`;
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }

  /**
   * Kiểm tra trạng thái follow OA
   */
  static isOAFollowed(): boolean {
    return localStorage.getItem("oa_followed") === "true";
  }

  /**
   * Đặt lại trạng thái follow OA
   */
  static resetFollowStatus(): void {
    localStorage.removeItem("oa_followed");
  }

  /**
   * Test kết nối với OA (không thực hiện thao tác thực)
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
      recommendations.push("❌ OA ID không hợp lệ hoặc trống");
    }
    
    // Kiểm tra môi trường
    const isInZaloApp = navigator.userAgent.includes('ZaloApp');
    if (!isInZaloApp) {
      recommendations.push("⚠️ Đang test ngoài ứng dụng Zalo, một số chức năng có thể không hoạt động");
    }
    
    // Kiểm tra các API có sẵn
    let canFollow = false;
    let canChat = false;
    
    try {
      // Test followOA API
      if (typeof followOA === 'function') {
        canFollow = true;
        recommendations.push("✅ followOA API khả dụng");
      } else {
        recommendations.push("❌ followOA API không khả dụng");
      }
      
      // Test openChat API
      if (typeof openChat === 'function') {
        canChat = true;
        recommendations.push("✅ openChat API khả dụng");
      } else {
        recommendations.push("❌ openChat API không khả dụng");
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