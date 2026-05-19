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
    
    // X�a dữ liệu cũ
    localStorage.removeItem('app_news_data');
    localStorage.removeItem('adminNewsList');
    localStorage.removeItem('app_majors_data');
    localStorage.removeItem('adminMajorsList');

    // Tạo tin tức mẫu thực tế - 4 b�i cho mỗi danh mục
    const categories = [
      { key: 'announcement', name: 'Th�ng b�o' },
      { key: 'admission', name: 'Tuyển sinh' },
      { key: 'event', name: 'Sự kiện' },
      { key: 'achievement', name: 'Th�nh t�ch' },
      { key: 'education', name: 'Gi�o dục' },
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
              "Th�ng b�o tuyển sinh năm học 2025-2026",
              "Th�ng b�o lịch thi học kỳ 1 năm học 2024-2025", 
              "Th�ng b�o nghỉ lễ Quốc kh�nh 2/9",
              "Th�ng b�o điều chỉnh học ph� năm học 2025"
            ][i-1];
            summary = [
              "Tuyển sinh c�c ng�nh: CNTT, Kế to�n, QLKD, Điện tử viễn th�ng, Cơ kh�, Du lịch với nhiều ưu đ�i hấp dẫn.",
              "Lịch thi chi tiết cho từng ng�nh đ�o tạo, thời gian v� địa điểm thi cụ thể.",
              "Nghỉ lễ từ 2/9 đến 4/9, sinh vi�n lưu � sắp xếp lịch học ph� hợp.",
              "Học ph� điều chỉnh nhẹ, duy tr� chất lượng đ�o tạo cao nhất."
            ][i-1];
            isHot = i === 1;
            break;
          case 'admission':
            title = [
              "Tuyển sinh Cao đẳng C�ng nghệ Th�ng tin 2025",
              "Th�ng tin tuyển sinh ng�nh Kế to�n", 
              "Hướng dẫn đăng k� x�t tuyển online",
              "Ch�nh s�ch học bổng cho sinh vi�n xuất sắc"
            ][i-1];
            summary = [
              "Ng�nh CNTT: 3 năm đ�o tạo, thực h�nh 70%, cam kết việc l�m sau tốt nghiệp.",
              "Ng�nh Kế to�n: Đ�o tạo theo chuẩn quốc tế, li�n kết doanh nghiệp.",
              "Đăng k� online 24/7, hồ sơ x�t tuyển đơn giản, kết quả nhanh ch�ng.",
              "Học bổng từ 30-100% học ph� cho sinh vi�n xuất sắc."
            ][i-1];
            isHot = i <= 2;
            break;
          case 'achievement':
            title = [
              "Sinh vi�n NSG đạt giải Nhất cuộc thi lập tr�nh",
              "Trường NSG được c�ng nhận chất lượng gi�o dục",
              "Đội tuyển Robotics NSG v� địch khu vực",
              "100% sinh vi�n CNTT c� việc l�m sau tốt nghiệp"
            ][i-1];
            summary = [
              "3 sinh vi�n CNTT đạt giải Nhất, Nh�, Ba cuộc thi lập tr�nh TP.HCM 2024.",
              "NSG được Bộ GD&ĐT c�ng nhận đạt chuẩn chất lượng gi�o dục cao đẳng.",
              "Đội Robotics NSG vượt qua 20 đội thi, gi�nh chức v� địch khu vực Nam Bộ.",
              "Tất cả 120 sinh vi�n CNTT kh�a 2021-2024 đều c� việc l�m với mức lương hấp dẫn."
            ][i-1];
            isHot = true;
            break;
          default:
            title = `${category.name} - ${i === 1 ? 'Tin nổi bật' : 'Tin tức số ' + i}`;
            summary = `Nội dung t�m tắt về ${category.name.toLowerCase()} của trường NSG.`;
            isHot = i === 1;
        }
        
        sampleNews.push({
          id: newsId++,
          title,
          summary,
          content: `Nội dung chi tiết về ${title.toLowerCase()}. Trường Cao đẳng B�ch khoa Nam S�i G�n lu�n cập nhật th�ng tin mới nhất để phục vụ sinh vi�n v� phụ huynh.`,
          category: category.key,
          author: "Ban Gi�m hiệu",
          date: new Date(2024, 8, 25 - i).toISOString().split('T')[0],
          status: "published",
          isHot,
          image: `https://images.unsplash.com/photo-${1550000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 500) + 100,
          likeCount: Math.floor(Math.random() * 50) + 5
        });
      }
    });

    // Tạo dữ liệu ng�nh đ�o tạo thực tế NSG
    const sampleMajors = [
      {
        id: "cntt",
        name: "C�ng nghệ Th�ng tin",
        code: "CNTT",
        description: "Đ�o tạo nh�n lực c�ng nghệ th�ng tin chất lượng cao, đ�p ứng nhu cầu chuyển đổi số",
        duration: "3 năm",
        tuitionFee: 18000000,
        subjects: ["Lập tr�nh C/C++", "Java", "Database", "Web Development", "Mobile App", "AI & Machine Learning"],
        careerProspects: ["Lập tr�nh vi�n", "Ph�n t�ch hệ thống", "Quản trị mạng", "Chuy�n gia bảo mật", "Data Scientist"],
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
        name: "Kế to�n",
        code: "KT",
        description: "Đ�o tạo nh�n lực kế to�n - kiểm to�n chuy�n nghiệp, th�nh thạo phần mềm kế to�n hiện đại",
        duration: "2.5 năm",
        tuitionFee: 15000000,
        subjects: ["Nguy�n l� kế to�n", "Kế to�n t�i ch�nh", "Kế to�n quản trị", "Kiểm to�n", "Thuế", "Excel & MISA"],
        careerProspects: ["Kế to�n vi�n", "Kiểm to�n vi�n", "Trưởng ph�ng kế to�n", "Chuy�n vi�n thuế", "Tư vấn t�i ch�nh"],
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
        name: "Quản l� Kinh doanh",
        code: "QLKD",
        description: "Đ�o tạo nh� quản l� doanh nghiệp t�i năng, c� tư duy kinh doanh s�ng tạo",
        duration: "3 năm",
        tuitionFee: 16000000,
        subjects: ["Quản trị học", "Marketing", "T�i ch�nh doanh nghiệp", "Quản l� nh�n sự", "Khởi nghiệp", "Digital Marketing"],
        careerProspects: ["Quản l� dự �n", "Chuy�n vi�n Marketing", "Nh�n vi�n kinh doanh", "Quản l� nh�n sự", "Khởi nghiệp"],
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
        name: "Điện tử Viễn th�ng",
        code: "ĐTVT",
        description: "Đ�o tạo kỹ thuật vi�n điện tử - viễn th�ng, chuy�n s�u về IoT v� hệ thống th�ng minh",
        duration: "3 năm",
        tuitionFee: 17000000,
        subjects: ["Mạch điện tử", "Vi xử l�", "Truyền th�ng số", "IoT", "Hệ thống nh�ng", "5G Technology"],
        careerProspects: ["Kỹ sư điện tử", "Chuy�n vi�n viễn th�ng", "Thiết kế mạch", "Kỹ sư IoT", "Bảo tr� hệ thống"],
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
        name: "Cơ kh�",
        code: "CK",
        description: "Đ�o tạo kỹ thuật vi�n cơ kh� ch�nh x�c, th�nh thạo c�ng nghệ CAD/CAM v� gia c�ng CNC",
        duration: "3 năm",
        tuitionFee: 16500000,
        subjects: ["Vẽ kỹ thuật", "Cơ học", "CAD/CAM", "CNC", "Vật liệu", "Automation"],
        careerProspects: ["Kỹ sư cơ kh�", "Thiết kế sản phẩm", "Vận h�nh CNC", "Quản l� sản xuất", "Kỹ sư tự động h�a"],
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
        name: "Du lịch - Kh�ch sạn",
        code: "DL",
        description: "Đ�o tạo nh�n lực du lịch chuy�n nghiệp, th�nh thạo ngoại ngữ v� kỹ năng dịch vụ",
        duration: "2.5 năm",
        tuitionFee: 14500000,
        subjects: ["Quản trị kh�ch sạn", "Hướng dẫn du lịch", "Tiếng Anh chuy�n ng�nh", "Dịch vụ lữ h�nh", "Marketing du lịch"],
        careerProspects: ["Hướng dẫn vi�n", "Nh�n vi�n kh�ch sạn", "Tư vấn du lịch", "Quản l� resort", "Tiếp vi�n h�ng kh�ng"],
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
        title: "Ch�o mừng năm học mới 2025",
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        link: "/news",
        status: "active",
        order: 1
      }
    ];

    // Tạo một số th�ng b�o mẫu
    const sampleNotifications = [
      {
        id: 1,
        title: "Th�ng b�o tuyển sinh mới",
        message: "Đ� c� th�ng b�o tuyển sinh năm học 2025-2026",
        type: "announcement",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2, 
        title: "Sự kiện sắp diễn ra",
        message: "Lễ khai giảng năm học mới sẽ diễn ra v�o tuần tới",
        type: "event",
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    // Save to localStorage - sync cả admin v� app data
    localStorage.setItem('app_news_data', JSON.stringify(sampleNews));
    localStorage.setItem('adminNewsList', JSON.stringify(sampleNews));
    localStorage.setItem('app_majors_data', JSON.stringify(sampleMajors));
    localStorage.setItem('adminMajorsList', JSON.stringify(sampleMajors));
    localStorage.setItem('app_banners_data', JSON.stringify(sampleBanners));
    localStorage.setItem('notifications', JSON.stringify(sampleNotifications));

    console.log('✅ Đ� tạo dữ liệu mẫu th�nh c�ng!');
    console.log(`📊 Tin tức: ${sampleNews.length} b�i`);
    console.log(`📊 Ng�nh đ�o tạo: ${sampleMajors.length} ng�nh`);
    console.log(`📊 Th�ng b�o: ${sampleNotifications.length} th�ng b�o`);
    
    alert(`✅ Đ� tạo dữ liệu mẫu thực tế NSG!\n\n📰 ${sampleNews.length} tin tức (4 b�i/danh mục)\n🎓 ${sampleMajors.length} ng�nh đ�o tạo\n🔔 ${sampleNotifications.length} th�ng b�o\n\nDữ liệu đ� được đồng bộ với trang admin!`);
    window.location.reload();
  };

  const clearAllData = () => {
    localStorage.removeItem('app_news_data');
    localStorage.removeItem('app_majors_data');
    localStorage.removeItem('app_banners_data');
    localStorage.removeItem('adminUsersList');
    alert('🗑️ Đ� x�a tất cả dữ liệu!');
    window.location.reload();
  };

  const handleExportData = () => {
    DataExporter.downloadDataAsJSON();
  };

  const handleLogData = () => {
    DataExporter.logDataForCopy();
    alert('📋 Dữ liệu đ� được log ra console! Mở DevTools để copy.');
  };

  const generateProductionDataFile = () => {
    const data = DataExporter.exportAllData();
    
    const productionDataContent = `/**
 * Production data - Dữ liệu thực tế cho production deployment  
 * Generated from localStorage on ${new Date().toLocaleString('vi-VN')}
 */

export const PRODUCTION_DATA = ${JSON.stringify(data, null, 2)};

// Dữ liệu mẫu fallback nếu production data chưa c�
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
          <Text.Title className="mb-4">🔧 C�ng cụ Debug</Text.Title>
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
              X�a tất cả dữ liệu
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
          <Text.Title className="mb-4">📊 Thống k� dữ liệu</Text.Title>
          <Box className="space-y-2 text-sm">
            <Text>📰 Tin tức: {debugData.newsData ? debugData.newsData.length : 0} b�i</Text>
            <Text>🎓 Ng�nh học: {debugData.majorsData ? debugData.majorsData.length : 0} ng�nh</Text>
            <Text>🖼️ Banner: {debugData.bannersData ? debugData.bannersData.length : 0} banner</Text>
            <Text>👥 Người d�ng: {debugData.adminUsersList ? debugData.adminUsersList.length : 0} user</Text>
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