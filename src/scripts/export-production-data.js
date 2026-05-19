/**
 * Script to export data from localStorage and create production data file
 * Run this in browser console on localhost to export current data
 */

// Function to export all data and generate production-data.ts content
function exportProductionData() {
  console.log('🚀 Exporting production data...');
  
  // Get data from localStorage
  const newsData = localStorage.getItem('adminNewsList') || localStorage.getItem('app_news_data') || '[]';
  const majorsData = localStorage.getItem('adminMajorsList') || localStorage.getItem('app_majors_data') || '[]';
  const applicationsData = localStorage.getItem('admissionRegistrations') || localStorage.getItem('app_admission_applications') || '[]';
  
  try {
    const data = {
      news: JSON.parse(newsData),
      majors: JSON.parse(majorsData),
      applications: JSON.parse(applicationsData),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    console.log('📊 Exported data summary:');
    console.log(`- News: ${data.news.length} items`);
    console.log(`- Majors: ${data.majors.length} items`);
    console.log(`- Applications: ${data.applications.length} items`);
    
    // Generate TypeScript file content
    const productionDataContent = `/**
 * Production data - Dữ liệu thực tế cho production deployment
 * Generated from localStorage on ${new Date().toLocaleString('vi-VN')}
 */

import type { NewsItem, Major, AdmissionApplication } from '@/utils/data-manager';

export const PRODUCTION_DATA: {
  news: NewsItem[];
  majors: Major[];
  applications: AdmissionApplication[];
  exportedAt: string;
  version: string;
} = ${JSON.stringify(data, null, 2)};

// Dữ liệu mẫu fallback nếu production data chưa có
export const FALLBACK_DATA: {
  news: NewsItem[];
  majors: Major[];
  applications: AdmissionApplication[];
} = {
  news: [],
  majors: [],
  applications: []
};`;

    // Create and download file
    const blob = new Blob([productionDataContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'production-data.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Production data file downloaded!');
    console.log('📋 Copy this to src/data/production-data.ts');
    
    return data;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    return null;
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined' && window.localStorage) {
  console.log('💡 To export production data, run: exportProductionData()');
  window.exportProductionData = exportProductionData;
}