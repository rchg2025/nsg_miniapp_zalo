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

// Dữ liệu mẫu fallback nếu production data chưa c�
export const FALLBACK_DATA: {
  news: NewsItem[];
  majors: Major[];
  applications: AdmissionApplication[];
} = {
  news: [
    {
      id: '1',
      title: 'Th�ng b�o tuyển sinh năm học 2024-2025',
      content: 'Trường Cao đẳng B�ch khoa Nam S�i G�n th�ng b�o kế hoạch tuyển sinh năm học 2024-2025...',
      summary: 'Kế hoạch tuyển sinh năm học mới với nhiều ng�nh học hấp dẫn',
      category: 'tuyen-sinh',
      author: 'Ban Gi�m hiệu',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      status: 'published',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
      viewCount: 1250,
      likeCount: 89,
      tags: ['tuyển sinh', 'th�ng b�o', 'năm học mới']
    }
  ],
  majors: [
    {
      id: '1',
      name: 'C�ng nghệ Th�ng tin',
      code: 'CNTT01',
      description: 'Đ�o tạo chuy�n vi�n c�ng nghệ th�ng tin c� kỹ năng lập tr�nh, quản trị hệ thống v� ph�t triển ứng dụng.',
      duration: '3 năm',
      tuitionFee: 18000000,
      subjects: ['Lập tr�nh C/C++', 'Java', 'Web Development', 'Database', 'Mạng m�y t�nh', 'To�n cao cấp'],
      careerProspects: ['Lập tr�nh vi�n', 'Quản trị hệ thống', 'Chuy�n vi�n IT', 'Ph�t triển web/mobile'],
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