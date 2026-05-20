/**
 * Cấu hình OA và các thông tin liên hệ
 */

export const OA_CONFIG = {
  // OA ID của trường - cần được cập nhật với OA ID thực
  // Để test: có thể dùng OA ID của Zalo Mini App Sample hoặc OA khác
  OA_ID: "4295375038644451656", // Thay đổi thành OA ID thực của trường
  
  // Thông tin liên hệ dự phòng
  CONTACT_INFO: {
    phone: "0981146179",
    website: "https://namsaigon.edu.vn",
    email: "info@namsaigon.edu.vn"
  },
  
  // Tin nhắn mặc định
  DEFAULT_MESSAGES: {
    follow: "Xin chào! Tôi muốn quan tâm OA của trường để nhận thông tin tuyển sinh.",
    support: "Xin chào! Tôi cần hỗ trợ về thông tin tuyển sinh và các dịch vụ của trường."
  }
};

export default OA_CONFIG;