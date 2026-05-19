// 🎯 Complete Data Setup & Debugging Script
console.log("🚀 Setting up complete test data for NSG News App...");

// 1. Clear existing data first
console.log("🧹 Clearing existing data...");
localStorage.removeItem('adminNewsList');
localStorage.removeItem('adminMajorsList');
localStorage.removeItem('userNotifications');

// 2. Create comprehensive news data
console.log("📰 Creating comprehensive news data...");
const testNews = [
  {
    id: 1,
    title: "🔥 Thông báo tuyển sinh năm học 2025-2026 - Nhiều ưu đãi hấp dẫn",
    content: "Trường Cao đẳng Bách khoa Nam Sài Gòn thông báo chính thức mở đăng ký tuyển sinh cho năm học 2025-2026. Với 6 ngành đào tạo hot nhất hiện tại, học phí ưu đãi và nhiều chương trình học bổng.",
    category: "announcement",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isHot: true,
    author: "Ban Giám Hiệu",
    status: "published",
    views: 1500
  },
  {
    id: 2,
    title: "✨ Học bổng toàn phần dành cho sinh viên xuất sắc năm 2025",
    content: "Chương trình học bổng 100% học phí dành cho sinh viên có thành tích học tập cao, hoạt động tích cực và có hoàn cảnh khó khăn. Đăng ký ngay!",
    category: "news",
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isHot: true,
    author: "Phòng Đào Tạo",
    status: "published",
    views: 980
  },
  {
    id: 3,
    title: "🎓 Ngành Công nghệ Thông tin - Tỷ lệ có việc làm 95%",
    content: "Báo cáo mới nhất cho thấy ngành CNTT tại Trường Cao đẳng Bách khoa Nam Sài Gòn có tỷ lệ sinh viên có việc làm sau tốt nghiệp lên đến 95%, mức lương khởi điểm từ 8-15 triệu/tháng.",
    category: "admission",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isHot: false,
    author: "Khoa CNTT",
    status: "published",
    views: 750
  },
  {
    id: 4,
    title: "📈 Kết quả khảo sát việc làm sinh viên tốt nghiệp 2024",
    content: "95% sinh viên tốt nghiệp năm 2024 đã có việc làm sau 3 tháng. Các ngành hot nhất: CNTT, Marketing, Logistics.",
    category: "news",
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    isHot: false,
    author: "Phòng Công tác SV",
    status: "published",
    views: 654
  },
  {
    id: 5,
    title: "🚨 Thông báo lịch thi cuối kỳ học kỳ 1 năm học 2024-2025",
    content: "Thông báo chi tiết lịch thi cuối kỳ từ ngày 15/1 đến 25/1/2025. Sinh viên lưu ý chuẩn bị tốt cho kỳ thi.",
    category: "announcement",
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    isHot: false,
    author: "Phòng Đào Tạo",
    status: "published",
    views: 456
  }
];

// 3. Create comprehensive majors data
console.log("🎓 Creating comprehensive majors data...");
const testMajors = [
  {
    id: 'cntt',
    name: 'Công nghệ Thông tin',
    code: 'CNTT',
    description: 'Đào tạo chuyên gia CNTT với kiến thức toàn diện về lập trình, cơ sở dữ liệu, mạng máy tính, an ninh mạng và phát triển ứng dụng di động.',
    tuition: 12000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-01').toISOString(),
    isActive: true,
    requirements: ["Tốt nghiệp THPT", "Điểm trung bình ≥ 6.5", "Có kiến thức cơ bản về Toán"],
    careerProspects: ["Lập trình viên", "Quản trị hệ thống", "Chuyên viên IT", "Khởi nghiệp công nghệ"]
  },
  {
    id: 'ktoan',
    name: 'Kế toán',
    code: 'KTOAN',
    description: 'Đào tạo kế toán viên chuyên nghiệp, thành thạo các phần mềm kế toán hiện đại như MISA, FAST, SAP và am hiểu luật thuế.',
    tuition: 10000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-02').toISOString(),
    isActive: true,
    requirements: ["Tốt nghiệp THPT", "Điểm trung bình ≥ 6.0", "Tốt môn Toán"],
    careerProspects: ["Kế toán viên", "Kiểm toán viên", "Chuyên viên thuế", "CFO"]
  },
  {
    id: 'qtkd',
    name: 'Quản trị Kinh doanh',
    code: 'QTKD',
    description: 'Đào tạo nhà quản lý doanh nghiệp với tư duy chiến lược, kỹ năng lãnh đạo và khả năng phân tích thị trường.',
    tuition: 11000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-03').toISOString(),
    isActive: true,
    requirements: ["Tốt nghiệp THPT", "Điểm trung bình ≥ 6.0", "Kỹ năng giao tiếp tốt"],
    careerProspects: ["Quản lý doanh nghiệp", "Chuyên viên kinh doanh", "Consultant", "CEO"]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    code: 'MKT',
    description: 'Chuyên gia marketing số, thành thạo các kênh truyền thông hiện đại, Social Media Marketing, Google Ads, SEO/SEM.',
    tuition: 9500000,
    duration: '3 năm',
    createdAt: new Date('2024-01-04').toISOString(),
    isActive: true,
    requirements: ["Tốt nghiệp THPT", "Điểm trung bình ≥ 5.5", "Sáng tạo, năng động"],
    careerProspects: ["Digital Marketer", "Content Creator", "Brand Manager", "Influencer"]
  },
  {
    id: 'logistics',
    name: 'Logistics',
    code: 'LOG',
    description: 'Quản lý chuỗi cung ứng và vận tải, đáp ứng nhu cầu thương mại điện tử và logistics hiện đại.',
    tuition: 10500000,
    duration: '3 năm',
    createdAt: new Date('2024-01-05').toISOString(),
    isActive: true,
    requirements: ["Tốt nghiệp THPT", "Điểm trung bình ≥ 6.0", "Kỹ năng tổ chức tốt"],
    careerProspects: ["Chuyên viên Logistics", "Quản lý kho", "Supply Chain Manager", "Vận tải quốc tế"]
  },
  {
    id: 'dulich',
    name: 'Du lịch',
    code: 'DL',
    description: 'Quản lý dịch vụ du lịch và lữ hành, kết nối văn hóa và kinh tế, phát triển du lịch bền vững.',
    tuition: 9000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-06').toISOString(),
    isActive: true,
    requirements: ["Tốt nghiệp THPT", "Điểm trung bình ≥ 5.5", "Ngoại ngữ tốt"],
    careerProspects: ["Hướng dẫn viên du lịch", "Quản lý resort", "Tour operator", "Khởi nghiệp du lịch"]
  }
];

// 4. Create user notifications
console.log("🔔 Creating user notifications...");
const testNotifications = [
  {
    id: Date.now(),
    title: 'Chào mừng đến với Trường Cao đẳng Bách khoa Nam Sài Gòn!',
    message: 'Cảm ơn bạn đã quan tâm đến trường. Khám phá 6 ngành đào tạo hot nhất và nhận ngay ưu đãi học phí!',
    category: 'Hệ thống',
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    type: 'system'
  },
  {
    id: Date.now() + 1,
    title: 'Thông báo tuyển sinh mới',
    message: 'Đã cập nhật thông tin tuyển sinh 6 ngành: CNTT, Kế toán, QTKD, Marketing, Logistics, Du lịch. Xem ngay!',
    category: 'Tuyển sinh',
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    type: 'admission'
  },
  {
    id: Date.now() + 2,
    title: 'Chương trình học bổng 2025',
    message: 'Cơ hội nhận học bổng lên đến 100% học phí cho sinh viên xuất sắc. Deadline: 31/12/2024!',
    category: 'Học bổng',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    isRead: false,
    type: 'scholarship'
  }
];

// 5. Save all data to localStorage
try {
  localStorage.setItem('adminNewsList', JSON.stringify(testNews));
  localStorage.setItem('adminMajorsList', JSON.stringify(testMajors));
  localStorage.setItem('userNotifications', JSON.stringify(testNotifications));
  
  console.log("✅ Successfully saved all data:");
  console.log("📰 News articles:", testNews.length);
  console.log("🎓 Majors:", testMajors.length);
  console.log("🔔 Notifications:", testNotifications.length);
  
  // 6. Verify saved data
  console.log("\n🔍 Verifying saved data...");
  
  const savedNews = JSON.parse(localStorage.getItem('adminNewsList') || '[]');
  const savedMajors = JSON.parse(localStorage.getItem('adminMajorsList') || '[]');
  const savedNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  
  console.log("✅ Verification successful:");
  console.log("📰 Saved news:", savedNews.length, "items");
  console.log("🎓 Saved majors:", savedMajors.length, "items");
  console.log("🔔 Saved notifications:", savedNotifications.length, "items");
  
  // 7. Show sample data
  console.log("\n📊 Sample Data Preview:");
  console.table(savedNews.map(n => ({
    id: n.id,
    title: n.title.substring(0, 30) + '...',
    category: n.category,
    date: n.date.split('T')[0]
  })));
  
  console.table(savedMajors.map(m => ({
    id: m.id,
    name: m.name,
    code: m.code,
    tuition: (m.tuition / 1000000) + 'M VND'
  })));

  // 8. Auto reload to apply changes
  console.log("\n🔄 Reloading page to apply new data...");
  setTimeout(() => {
    window.location.reload();
  }, 2000);
  
} catch (error) {
  console.error("❌ Error saving data:", error);
}

console.log("\n🎯 SETUP COMPLETE! Check the homepage and detail pages now.");
console.log("📱 Features to test:");
console.log("  ✅ Homepage: Latest news, announcements, major slides");
console.log("  ✅ News page: All categories with proper filtering");
console.log("  ✅ Majors page: All 6 majors with details");
console.log("  ✅ Navigation: Click on any item to see details");
console.log("  ✅ Admin panel: User management functions");