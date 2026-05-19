/**
 * Data Exporter - Xuất dữ liệu từ localStorage để deploy lên server
 */

export class DataExporter {
  /**
   * Xuất toàn bộ dữ liệu từ localStorage
   */
  static exportAllData() {
    const data = {
      // Tin tức
      news: this.getLocalStorageData('adminNewsList') || this.getLocalStorageData('app_news_data') || [],
      
      // Ngành học  
      majors: this.getLocalStorageData('adminMajorsList') || this.getLocalStorageData('app_majors_data') || [],
      
      // Đơn đăng ký
      applications: this.getLocalStorageData('admissionRegistrations') || this.getLocalStorageData('app_admission_applications') || [],
      
      // Metadata
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    console.log('📤 Exported data:', data);
    return data;
  }

  /**
   * Helper để lấy và parse dữ liệu từ localStorage
   */
  private static getLocalStorageData(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing localStorage key ${key}:`, error);
      return null;
    }
  }

  /**
   * Tạo file JSON để download
   */
  static downloadDataAsJSON() {
    const data = this.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Tạo link download
    const a = document.createElement('a');
    a.href = url;
    a.download = `nsg-app-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📥 Data exported as JSON file');
    return data;
  }

  /**
   * Log dữ liệu ra console để copy
   */
  static logDataForCopy() {
    const data = this.exportAllData();
    console.log('=== COPY DATA BELOW ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('=== END DATA ===');
    return data;
  }
}