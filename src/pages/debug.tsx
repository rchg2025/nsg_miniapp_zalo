import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataExporter } from "@/utils/data-exporter";

function DebugPage() {
  const navigate = useNavigate();
  const [debugData, setDebugData] = useState<{
    newsData: any[] | null;
    bannersData: any[] | null;
    majorsData: any[] | null;
    adminUsersList: any[] | null;
  }>({
    newsData: null,
    bannersData: null,
    majorsData: null,
    adminUsersList: null
  });

  useEffect(() => {
    const loadDebugData = () => {
      try {
        const newsData = localStorage.getItem('app_news_data'); // DataManager key
        const bannersData = localStorage.getItem('app_banners_data'); // DataManager key
        const majorsData = localStorage.getItem('app_majors_data'); // DataManager key
        const adminUsersList = localStorage.getItem('adminUsersList');

        setDebugData({
          newsData: newsData ? JSON.parse(newsData) : null,
          bannersData: bannersData ? JSON.parse(bannersData) : null,
          majorsData: majorsData ? JSON.parse(majorsData) : null,
          adminUsersList: adminUsersList ? JSON.parse(adminUsersList) : null
        });
      } catch (error) {
        console.error('Error loading debug data:', error);
      }
    };

    loadDebugData();
  }, []);

  const createSampleData = () => {
    console.log('🚀 Tạo dữ liệu mẫu thực tế NSG...');
    
    // Xóa dữ liệu cũ
    localStorage.removeItem('app_news_data');
    localStorage.removeItem('adminNewsList');
    localStorage.removeItem('app_majors_data');
    localStorage.removeItem('adminMajorsList');

    // Tạo tin tức mẫu thực tế - 4 bài cho mỗi danh mục
    const categories = [
      { key: 'announcement', name: 'Thông báo' },
      { key: 'admission', name: 'Tuyển sinh' },
      { key: 'event', name: 'Sự kiện' },
      { key: 'achievement', name: 'Thành tích' },
      { key: 'education', name: 'Giáo dục' },
      { key: 'activity', name: 'Hoạt động' }
    ];

    const sampleNews: any[] = [];
    let newsId = 1;

    categories.forEach(category => {
      for (let i = 1; i <= 4; i++) {
        let title = "";
        let summary = "";
        let isHot = false;
        
        switch (category.key) {
          case 'announcement':
            title = [
              "Thông báo tuyển sinh năm học 2025-2026",
              "Thông báo lịch thi học kỳ 1 năm học 2024-2025", 
              "Thông báo nghỉ lễ Quốc khánh 2/9",
              "Thông báo điều chỉnh học phí năm học 2025"
            ][i-1];
            summary = [
              "Tuyển sinh các ngành: CNTT, Kế toán, QLKD, Điện tử viễn thông, Cơ khí, Du lịch với nhiều ưu đãi hấp dẫn.",
              "Lịch thi chi tiết cho từng ngành đào tạo, thời gian và địa điểm thi cụ thể.",
              "Nghỉ lễ từ 2/9 đến 4/9, sinh viên lưu ý sắp xếp lịch học phù hợp.",
              "Học phí điều chỉnh nhẹ, duy trì chất lượng đào tạo cao nhất."
            ][i-1];
            isHot = i === 1;
            break;
          case 'admission':
            title = [
              "Tuyển sinh Cao đẳng Công nghệ Thông tin 2025",
              "Thông tin tuyển sinh ngành Kế toán", 
              "Hướng dẫn đăng ký xét tuyển online",
              "Chính sách học bổng cho sinh viên xuất sắc"
            ][i-1];
            summary = [
              "Ngành CNTT: 3 năm đào tạo, thực hành 70%, cam kết việc làm sau tốt nghiệp.",
              "Ngành Kế toán: Đào tạo theo chuẩn quốc tế, liên kết doanh nghiệp.",
              "Đăng ký online 24/7, hồ sơ xét tuyển đơn giản, kết quả nhanh chóng.",
              "Học bổng từ 30-100% học phí cho sinh viên xuất sắc."
            ][i-1];
            isHot = i <= 2;
            break;
          case 'achievement':
            title = [
              "Sinh viên NSG đạt giải Nhất cuộc thi lập trình",
              "Trường NSG được công nhận chất lượng giáo dục",
              "Đội tuyển Robotics NSG vô địch khu vực",
              "100% sinh viên CNTT có việc làm sau tốt nghiệp"
            ][i-1];
            summary = [
              "3 sinh viên CNTT đạt giải Nhất, Nhì, Ba cuộc thi lập trình TP.HCM 2024.",
              "NSG được Bộ GD&ĐT công nhận đạt chuẩn chất lượng giáo dục cao đẳng.",
              "Đội Robotics NSG vượt qua 20 đội thi, giành chức vô địch khu vực Nam Bộ.",
              "Tất cả 120 sinh viên CNTT khóa 2021-2024 đều có việc làm với mức lương hấp dẫn."
            ][i-1];
            isHot = true;
            break;
          default:
            title = `${category.name} - ${i === 1 ? 'Tin nổi bật' : 'Tin tức số ' + i}`;
            summary = `Nội dung tóm tắt về ${category.name.toLowerCase()} của trường NSG.`;
            isHot = i === 1;
        }
        
        sampleNews.push({
          id: newsId++,
          title,
          summary,
          content: `Nội dung chi tiết về ${title.toLowerCase()}. Trường Cao đẳng Bách khoa Nam Sài Gòn luôn cập nhật thông tin mới nhất để phục vụ sinh viên và phụ huynh.`,
          category: category.key,
          author: "Ban Giám hiệu",
          date: new Date(2024, 8, 25 - i).toISOString().split('T')[0],
          status: "published",
          isHot,
          image: `https://images.unsplash.com/photo-${1550000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 500) + 100,
          likeCount: Math.floor(Math.random() * 50) + 5
        });
      }
    });

    // Tạo dữ liệu ngành đào tạo thực tế NSG
    const sampleMajors = [
      {
        id: "cntt",
        name: "Công nghệ Thông tin",
        code: "CNTT",
        description: "Đào tạo nhân lực công nghệ thông tin chất lượng cao, đáp ứng nhu cầu chuyển đổi số",
        duration: "3 năm",
        tuitionFee: 18000000,
        subjects: ["Lập trình C/C++", "Java", "Database", "Web Development", "Mobile App", "AI & Machine Learning"],
        careerProspects: ["Lập trình viên", "Phân tích hệ thống", "Quản trị mạng", "Chuyên gia bảo mật", "Data Scientist"],
        admissionScore: 15.0,
        quota: 120,
        enrolled: 118,
        status: "active",
        educationLevel: "caodang",
        imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "ketoan",
        name: "Kế toán",
        code: "KT",
        description: "Đào tạo nhân lực kế toán - kiểm toán chuyên nghiệp, thành thạo phần mềm kế toán hiện đại",
        duration: "2.5 năm",
        tuitionFee: 15000000,
        subjects: ["Nguyên lý kế toán", "Kế toán tài chính", "Kế toán quản trị", "Kiểm toán", "Thuế", "Excel & MISA"],
        careerProspects: ["Kế toán viên", "Kiểm toán viên", "Trưởng phòng kế toán", "Chuyên viên thuế", "Tư vấn tài chính"],
        admissionScore: 14.5,
        quota: 100,
        enrolled: 95,
        status: "active",
        educationLevel: "caodang",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "qlkd",
        name: "Quản lý Kinh doanh",
        code: "QLKD",
        description: "Đào tạo nhà quản lý doanh nghiệp tài năng, có tư duy kinh doanh sáng tạo",
        duration: "3 năm",
        tuitionFee: 16000000,
        subjects: ["Quản trị học", "Marketing", "Tài chính doanh nghiệp", "Quản lý nhân sự", "Khởi nghiệp", "Digital Marketing"],
        careerProspects: ["Quản lý dự án", "Chuyên viên Marketing", "Nhân viên kinh doanh", "Quản lý nhân sự", "Khởi nghiệp"],
        admissionScore: 14.0,
        quota: 80,
        enrolled: 76,
        status: "active",
        educationLevel: "caodang",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "dientu",
        name: "Điện tử Viễn thông",
        code: "ĐTVT",
        description: "Đào tạo kỹ thuật viên điện tử - viễn thông, chuyên sâu về IoT và hệ thống thông minh",
        duration: "3 năm",
        tuitionFee: 17000000,
        subjects: ["Mạch điện tử", "Vi xử lý", "Truyền thông số", "IoT", "Hệ thống nhúng", "5G Technology"],
        careerProspects: ["Kỹ sư điện tử", "Chuyên viên viễn thông", "Thiết kế mạch", "Kỹ sư IoT", "Bảo trì hệ thống"],
        admissionScore: 15.5,
        quota: 60,
        enrolled: 58,
        status: "active",
        educationLevel: "caodang",
        imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "cokhi",
        name: "Cơ khí",
        code: "CK",
        description: "Đào tạo kỹ thuật viên cơ khí chính xác, thành thạo công nghệ CAD/CAM và gia công CNC",
        duration: "3 năm",
        tuitionFee: 16500000,
        subjects: ["Vẽ kỹ thuật", "Cơ học", "CAD/CAM", "CNC", "Vật liệu", "Automation"],
        careerProspects: ["Kỹ sư cơ khí", "Thiết kế sản phẩm", "Vận hành CNC", "Quản lý sản xuất", "Kỹ sư tự động hóa"],
        admissionScore: 14.8,
        quota: 70,
        enrolled: 65,
        status: "active",
        educationLevel: "caodang",
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "dulich",
        name: "Du lịch - Khách sạn",
        code: "DL",
        description: "Đào tạo nhân lực du lịch chuyên nghiệp, thành thạo ngoại ngữ và kỹ năng dịch vụ",
        duration: "2.5 năm",
        tuitionFee: 14500000,
        subjects: ["Quản trị khách sạn", "Hướng dẫn du lịch", "Tiếng Anh chuyên ngành", "Dịch vụ lữ hành", "Marketing du lịch"],
        careerProspects: ["Hướng dẫn viên", "Nhân viên khách sạn", "Tư vấn du lịch", "Quản lý resort", "Tiếp viên hàng không"],
        admissionScore: 13.5,
        quota: 50,
        enrolled: 48,
        status: "active",
        educationLevel: "caodang",
        imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
        createdAt: new Date().toISOString()
      }
    ];

    // Create sample banners data
    const sampleBanners = [
      {
        id: Date.now().toString(),
        title: "Chào mừng năm học mới 2025",
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        link: "/news",
        status: "active",
        order: 1
      }
    ];

    // Tạo một số thông báo mẫu
    const sampleNotifications = [
      {
        id: 1,
        title: "Thông báo tuyển sinh mới",
        message: "Đã có thông báo tuyển sinh năm học 2025-2026",
        type: "announcement",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2, 
        title: "Sự kiện sắp diễn ra",
        message: "Lễ khai giảng năm học mới sẽ diễn ra vào tuần tới",
        type: "event",
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    // Save to localStorage - sync cả admin và app data
    localStorage.setItem('app_news_data', JSON.stringify(sampleNews));
    localStorage.setItem('adminNewsList', JSON.stringify(sampleNews));
    localStorage.setItem('app_majors_data', JSON.stringify(sampleMajors));
    localStorage.setItem('adminMajorsList', JSON.stringify(sampleMajors));
    localStorage.setItem('app_banners_data', JSON.stringify(sampleBanners));
    localStorage.setItem('notifications', JSON.stringify(sampleNotifications));

    console.log('✅ Đã tạo dữ liệu mẫu thành công!');
    console.log(`📊 Tin tức: ${sampleNews.length} bài`);
    console.log(`📊 Ngành đào tạo: ${sampleMajors.length} ngành`);
    console.log(`📊 Thông báo: ${sampleNotifications.length} thông báo`);
    
    alert(`✅ Đã tạo dữ liệu mẫu thực tế NSG!\n\n📰 ${sampleNews.length} tin tức (4 bài/danh mục)\n🎓 ${sampleMajors.length} ngành đào tạo\n🔔 ${sampleNotifications.length} thông báo\n\nDữ liệu đã được đồng bộ với trang admin!`);
    window.location.reload();
  };

  const clearAllData = () => {
    localStorage.removeItem('app_news_data');
    localStorage.removeItem('app_majors_data');
    localStorage.removeItem('app_banners_data');
    localStorage.removeItem('adminUsersList');
    alert('🗑️ Đã xóa tất cả dữ liệu!');
    window.location.reload();
  };

  const handleExportData = () => {
    DataExporter.downloadDataAsJSON();
  };

  const handleLogData = () => {
    DataExporter.logDataForCopy();
    alert('📋 Dữ liệu đã được log ra console! Mở DevTools để copy.');
  };

  const generateProductionDataFile = () => {
    const data = DataExporter.exportAllData();
    
    const productionDataContent = `/**
 * Production data - Dữ liệu thực tế cho production deployment  
 * Generated from localStorage on ${new Date().toLocaleString('vi-VN')}
 */

export const PRODUCTION_DATA = ${JSON.stringify(data, null, 2)};

// Dữ liệu mẫu fallback nếu production data chưa có
export const FALLBACK_DATA = {
  news: [],
  majors: [],
  applications: []
};`;

    const blob = new Blob([productionDataContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'production-data.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📥 Production data file generated');
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Debug - Kiểm tra dữ liệu"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-purple-600 text-white"
      />

      <Box className="p-4 space-y-4">
        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">🔧 Công cụ Debug</Text.Title>
          <Box className="space-y-3">
            <Button 
              fullWidth
              variant="primary"
              className="bg-green-600"
              onClick={createSampleData}
            >
              Tạo dữ liệu mẫu
            </Button>
            <Button 
              fullWidth
              variant="secondary"
              className="bg-red-50 text-red-600 border-red-200"
              onClick={clearAllData}
            >
              Xóa tất cả dữ liệu
            </Button>
          </Box>
        </Box>

        {/* Export Data Section */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">📤 Export dữ liệu để deploy</Text.Title>
          <Box className="space-y-3">
            <Button 
              fullWidth
              variant="primary"
              className="bg-blue-600"
              onClick={handleExportData}
            >
              📥 Tải file JSON
            </Button>
            <Button 
              fullWidth
              variant="secondary"
              className="bg-purple-50 text-purple-600 border-purple-200"
              onClick={generateProductionDataFile}
            >
              📄 Tạo file production-data.ts
            </Button>
            <Button 
              fullWidth
              variant="secondary"
              className="bg-gray-50 text-gray-600 border-gray-200"
              onClick={handleLogData}
            >
              📋 Log ra console để copy
            </Button>
          </Box>
        </Box>

        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">📊 Thống kê dữ liệu</Text.Title>
          <Box className="space-y-2 text-sm">
            <Text>📰 Tin tức: {debugData.newsData ? debugData.newsData.length : 0} bài</Text>
            <Text>🎓 Ngành học: {debugData.majorsData ? debugData.majorsData.length : 0} ngành</Text>
            <Text>🖼️ Banner: {debugData.bannersData ? debugData.bannersData.length : 0} banner</Text>
            <Text>👥 Người dùng: {debugData.adminUsersList ? debugData.adminUsersList.length : 0} user</Text>
          </Box>
        </Box>

        {debugData.newsData && (
          <Box className="bg-white rounded-lg p-4">
            <Text.Title className="mb-4">📰 Dữ liệu tin tức</Text.Title>
            <Box className="space-y-2 text-xs">
              {debugData.newsData.map((news, index) => (
                <Box key={index} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50">
                  <Text className="font-medium">{news.title}</Text>
                  <Text className="text-gray-600">
                    Category: {news.category} | Status: {news.status} | Featured: {news.featured ? 'Yes' : 'No'}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box className="h-20"></Box>
      </Box>
    </Page>
  );
}

export default DebugPage;