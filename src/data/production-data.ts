/**
 * Production data - Dữ liệu thực tế cho production deployment
 * Generated from localStorage data
 */

import type { NewsItem, Major, AdmissionApplication } from '@/utils/data-manager';

export const PRODUCTION_DATA: {
  news: NewsItem[];
  majors: Major[];
  applications: AdmissionApplication[];
  exportedAt: string;
  version: string;
} = {
  // Sẽ được cập nhật với dữ liệu thực từ localStorage
  news: [],
  majors: [],
  applications: [],
  
  // Metadata
  exportedAt: new Date().toISOString(),
  version: '1.0.0'
};

// Dữ liệu mẫu fallback nếu production data chưa có
export const FALLBACK_DATA: {
  news: NewsItem[];
  majors: Major[];
  applications: AdmissionApplication[];
} = {
  news: [
    {
      id: '1',
      title: 'Thông báo tuyển sinh năm học 2024-2025',
      content: 'Trường Cao đẳng Bách khoa Nam Sài Gòn thông báo kế hoạch tuyển sinh năm học 2024-2025...',
      summary: 'Kế hoạch tuyển sinh năm học mới với nhiều ngành học hấp dẫn',
      category: 'tuyen-sinh',
      author: 'Ban Giám hiệu',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      status: 'published',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
      viewCount: 1250,
      likeCount: 89,
      tags: ['tuyển sinh', 'thông báo', 'năm học mới']
    }
  ],
  majors: [
    {
      id: '1',
      name: 'Công nghệ Thông tin',
      code: 'CNTT01',
      description: 'Đào tạo chuyên viên công nghệ thông tin có kỹ năng lập trình, quản trị hệ thống và phát triển ứng dụng.',
      duration: '3 năm',
      tuitionFee: 18000000,
      subjects: ['Lập trình C/C++', 'Java', 'Web Development', 'Database', 'Mạng máy tính', 'Toán cao cấp'],
      careerProspects: ['Lập trình viên', 'Quản trị hệ thống', 'Chuyên viên IT', 'Phát triển web/mobile'],
      admissionScore: 18.5,
      quota: 120,
      enrolled: 98,
      status: 'active' as const,
      createdAt: '2023-01-01T00:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
      educationLevel: 'caodang' as const,
      website: 'https://cntt.nsg.edu.vn'
    }
  ],
  applications: []
};