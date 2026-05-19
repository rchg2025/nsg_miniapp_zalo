// Tạo dữ liệu mẫu thực tế cho ứng dụng Trường Cao đẳng Bách khoa Nam Sài Gòn
// Script này sẽ tạo 4 bài viết cho mỗi danh mục với thông tin thực tế

console.log('🚀 Bắt đầu tạo dữ liệu mẫu cho NSG News...');

// Xóa dữ liệu cũ
localStorage.removeItem('app_news_data');
localStorage.removeItem('adminNewsList');
localStorage.removeItem('app_majors_data');
localStorage.removeItem('adminMajorsList');

// Categories thực tế của trường
const categories = [
  { key: 'announcement', name: 'Thông báo' },
  { key: 'admission', name: 'Tuyển sinh' },
  { key: 'event', name: 'Sự kiện' },
  { key: 'achievement', name: 'Thành tích' },
  { key: 'education', name: 'Giáo dục' },
  { key: 'activity', name: 'Hoạt động' }
];

// Tạo tin tức mẫu - 4 bài cho mỗi danh mục
const sampleNews = [];
let newsId = 1;

categories.forEach(category => {
  for (let i = 1; i <= 4; i++) {
    let newsItem;
    
    switch (category.key) {
      case 'announcement':
        newsItem = {
          id: newsId++,
          title: [
            "Thông báo tuyển sinh năm học 2025-2026",
            "Thông báo lịch thi học kỳ 1 năm học 2024-2025", 
            "Thông báo nghỉ lễ Quốc khánh 2/9",
            "Thông báo điều chỉnh học phí năm học 2025"
          ][i-1],
          content: `Trường Cao đẳng Bách khoa Nam Sài Gòn thông báo chính thức về ${[
            "kế hoạch tuyển sinh năm học mới với nhiều chính sách ưu đãi",
            "lịch thi cuối học kỳ cho các ngành đào tạo", 
            "lịch nghỉ lễ Quốc khánh theo quy định của Bộ Giáo dục",
            "việc điều chỉnh học phí phù hợp với chất lượng đào tạo"
          ][i-1]}.`,
          summary: [
            "Tuyển sinh các ngành: CNTT, Kế toán, QLKD, Điện tử viễn thông, Cơ khí, Du lịch với nhiều ưu đãi hấp dẫn.",
            "Lịch thi chi tiết cho từng ngành đào tạo, thời gian và địa điểm thi cụ thể.",
            "Nghỉ lễ từ 2/9 đến 4/9, sinh viên lưu ý sắp xếp lịch học phù hợp.",
            "Học phí điều chỉnh nhẹ, duy trì chất lượng đào tạo cao nhất."
          ][i-1],
          category: category.key,
          author: "Ban Giám hiệu",
          date: new Date(2024, 8, 25 - i).toISOString().split('T')[0],
          status: "published",
          isHot: i === 1,
          image: `https://images.unsplash.com/photo-${1550000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 500) + 200,
          likeCount: Math.floor(Math.random() * 50) + 10
        };
        break;

      case 'admission':
        newsItem = {
          id: newsId++,
          title: [
            "Tuyển sinh Cao đẳng Công nghệ Thông tin 2025",
            "Thông tin tuyển sinh ngành Kế toán", 
            "Hướng dẫn đăng ký xét tuyển online",
            "Chính sách học bổng cho sinh viên xuất sắc"
          ][i-1],
          content: `Thông tin chi tiết về ${[
            "chương trình đào tạo CNTT với công nghệ hiện đại nhất",
            "ngành Kế toán - nghề nghiệp ổn định, thu nhập cao",
            "quy trình đăng ký xét tuyển trực tuyến đơn giản",
            "các loại học bổng dành cho sinh viên có thành tích tốt"
          ][i-1]}.`,
          summary: [
            "Ngành CNTT: 3 năm đào tạo, thực hành 70%, cam kết việc làm sau tốt nghiệp.",
            "Ngành Kế toán: Đào tạo theo chuẩn quốc tế, liên kết doanh nghiệp.",
            "Đăng ký online 24/7, hồ sơ xét tuyển đơn giản, kết quả nhanh chóng.",
            "Học bổng từ 30-100% học phí cho sinh viên xuất sắc."
          ][i-1],
          category: category.key,
          author: "Phòng Đào tạo",
          date: new Date(2024, 8, 20 - i).toISOString().split('T')[0],
          status: "published",
          isHot: i <= 2,
          image: `https://images.unsplash.com/photo-${1560000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 800) + 300,
          likeCount: Math.floor(Math.random() * 80) + 20
        };
        break;

      case 'event':
        newsItem = {
          id: newsId++,
          title: [  
            "Lễ khai giảng năm học 2024-2025",
            "Hội thi Olympic Tin học NSG 2024",
            "Ngày hội việc làm - Job Fair 2024", 
            "Workshop Kỹ năng mềm cho sinh viên"
          ][i-1],
          content: `Sự kiện ${[
            "khai giảng năm học mới với nhiều hoạt động ý nghĩa",
            "thi Olympic Tin học cấp trường thu hút hàng trăm thí sinh",
            "giao lưu với các doanh nghiệp hàng đầu tại TP.HCM",
            "đào tạo kỹ năng mềm cần thiết cho sinh viên"
          ][i-1]} được tổ chức tại trường.`,
          summary: [
            "Lễ khai giảng long trọng với sự tham gia của toàn thể thầy cô và sinh viên.",
            "Cuộc thi Olympic Tin học với giải thưởng hấp dẫn, nâng cao kỹ năng IT.",
            "Hơn 50 doanh nghiệp tham gia, cơ hội việc làm cho sinh viên sắp tốt nghiệp.",
            "Workshop miễn phí về giao tiếp, làm việc nhóm, thuyết trình."
          ][i-1],
          category: category.key,
          author: "Đoàn Thanh niên",
          date: new Date(2024, 8, 15 - i).toISOString().split('T')[0],
          status: "published",
          isHot: i === 1,
          image: `https://images.unsplash.com/photo-${1570000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 600) + 250,
          likeCount: Math.floor(Math.random() * 60) + 15
        };
        break;

      case 'achievement':
        newsItem = {
          id: newsId++,
          title: [
            "Sinh viên NSG đạt giải Nhất cuộc thi lập trình",
            "Trường NSG được công nhận chất lượng giáo dục",
            "Đội tuyển Robotics NSG vô địch khu vực",
            "100% sinh viên CNTT có việc làm sau tốt nghiệp"
          ][i-1],
          content: `Thành tích đáng tự hào ${[
            "của các sinh viên trong cuộc thi lập trình cấp thành phố",
            "về chất lượng giáo dục từ Bộ Giáo dục và Đào tạo",
            "trong cuộc thi Robotics dành cho sinh viên các trường Cao đẳng",
            "về tỷ lệ có việc làm của sinh viên ngành CNTT khóa 2023"
          ][i-1]} khẳng định uy tín của NSG.`,
          summary: [
            "3 sinh viên CNTT đạt giải Nhất, Nhì, Ba cuộc thi lập trình TP.HCM 2024.",
            "NSG được Bộ GD&ĐT công nhận đạt chuẩn chất lượng giáo dục cao đẳng.",
            "Đội Robotics NSG vượt qua 20 đội thi, giành chức vô địch khu vực Nam Bộ.",
            "Tất cả 120 sinh viên CNTT khóa 2021-2024 đều có việc làm với mức lương hấp dẫn."
          ][i-1],
          category: category.key,
          author: "Phòng Quan hệ Doanh nghiệp",
          date: new Date(2024, 8, 10 - i).toISOString().split('T')[0],
          status: "published",
          isHot: true,
          image: `https://images.unsplash.com/photo-${1580000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 1000) + 500,
          likeCount: Math.floor(Math.random() * 100) + 50
        };
        break;

      case 'education':
        newsItem = {
          id: newsId++,
          title: [
            "Chương trình học liên kết với doanh nghiệp",
            "Phòng lab CNTT mới được trang bị hiện đại",
            "Đào tạo theo mô hình CDIO tiên tiến",
            "Hợp tác quốc tế với trường Đại học Úc"
          ][i-1],
          content: `Tin tức về ${[
            "chương trình đào tạo gắn liền với thực tế doanh nghiệp",
            "cơ sở vật chất học tập được đầu tư hiện đại",
            "mô hình đào tạo CDIO tiên tiến từ Mỹ",
            "chương trình liên kết quốc tế mở rộng cơ hội học tập"
          ][i-1]} tại NSG.`,
          summary: [
            "Liên kết với 30+ doanh nghiệp, sinh viên thực tập ngay từ năm 2.",
            "Phòng lab 200 máy tính, cấu hình cao, phần mềm chuyên ngành đầy đủ.",
            "Đào tạo theo CDIO: Conceive - Design - Implement - Operate.",
            "Cơ hội chuyển tiếp học Đại học tại Úc với học phí ưu đãi."
          ][i-1],
          category: category.key,
          author: "Phòng Đào tạo",
          date: new Date(2024, 8, 5 - i).toISOString().split('T')[0],
          status: "published",
          isHot: i <= 2,
          image: `https://images.unsplash.com/photo-${1590000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 400) + 150,
          likeCount: Math.floor(Math.random() * 40) + 10
        };
        break;

      case 'activity':
        newsItem = {
          id: newsId++,
          title: [
            "Hoạt động tình nguyện mùa hè xanh 2024",
            "Cuộc thi tài năng sinh viên NSG",
            "Câu lạc bộ Tiếng Anh NSG English Club",
            "Giải bóng đá tranh Cup Hiệu trưởng"
          ][i-1],
          content: `Hoạt động ${[
            "tình nguyện ý nghĩa của đoàn thanh niên NSG",
            "tài năng thể hiện khả năng đa dạng của sinh viên",
            "học tiếng Anh miễn phí cho sinh viên NSG",
            "thể thao sôi nổi giữa các khoa trong trường"
          ][i-1]} được tổ chức sôi nổi.`,
          summary: [
            "200 sinh viên tham gia tình nguyện tại các tỉnh miền Tây, hỗ trợ giáo dục.",
            "Hơn 100 tiết mục đa dạng: ca hát, múa, thơ, kịch, thời trang.",
            "Lớp học tiếng Anh miễn phí mỗi thứ 7, giáo viên bản ngữ.",
            "16 đội bóng các khoa tham gia, giải thưởng hấp dẫn cho các đội."
          ][i-1],
          category: category.key,
          author: "Phòng Công tác Sinh viên",
          date: new Date(2024, 7, 30 - i).toISOString().split('T')[0],
          status: "published",
          isHot: i === 1,
          image: `https://images.unsplash.com/photo-${1600000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 300) + 100,
          likeCount: Math.floor(Math.random() * 30) + 5
        };
        break;

      default:
        newsItem = {
          id: newsId++,
          title: `Tin tức ${category.name} số ${i}`,
          content: `Nội dung tin tức ${category.name} số ${i}`,
          summary: `Tóm tắt tin tức ${category.name} số ${i}`,
          category: category.key,
          author: "Admin",
          date: new Date(2024, 8, 25 - i).toISOString().split('T')[0],
          status: "published",
          isHot: i === 1,
          image: `https://images.unsplash.com/photo-${1500000000000 + newsId}?w=400&h=250&fit=crop`,
          viewCount: Math.floor(Math.random() * 200) + 50,
          likeCount: Math.floor(Math.random() * 20) + 5
        };
    }
    
    sampleNews.push(newsItem);
  }
});

// Tạo dữ liệu ngành đào tạo thực tế
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

// Lưu dữ liệu vào localStorage
localStorage.setItem('app_news_data', JSON.stringify(sampleNews));
localStorage.setItem('adminNewsList', JSON.stringify(sampleNews));
localStorage.setItem('app_majors_data', JSON.stringify(sampleMajors));
localStorage.setItem('adminMajorsList', JSON.stringify(sampleMajors));

// Log thông tin
console.log('✅ Đã tạo', sampleNews.length, 'bài viết mẫu:');
categories.forEach(cat => {
  const count = sampleNews.filter(news => news.category === cat.key).length;
  console.log(`  📰 ${cat.name}: ${count} bài viết`);
});

console.log('\n✅ Đã tạo', sampleMajors.length, 'ngành đào tạo:');
sampleMajors.forEach(major => {
  console.log(`  🎓 ${major.name} (${major.code}) - ${major.enrolled}/${major.quota} sinh viên`);
});

console.log('\n🎯 Thống kê dữ liệu:');
console.log(`📊 Tổng tin tức: ${sampleNews.length}`);
console.log(`📊 Tin nổi bật: ${sampleNews.filter(n => n.isHot).length}`);
console.log(`📊 Tin đã đăng: ${sampleNews.filter(n => n.status === 'published').length}`);
console.log(`📊 Tổng ngành: ${sampleMajors.length}`);
console.log(`📊 Tổng sinh viên: ${sampleMajors.reduce((sum, m) => sum + m.enrolled, 0)}`);

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

localStorage.setItem('notifications', JSON.stringify(sampleNotifications));

console.log('\n🔔 Đã tạo', sampleNotifications.length, 'thông báo mẫu');
console.log('\n🚀 Hoàn thành tạo dữ liệu mẫu! Refresh trang để xem kết quả.');