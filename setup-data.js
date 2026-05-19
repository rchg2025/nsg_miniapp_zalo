// Script tự động setup dữ liệu test cho NSG News
console.log('🚀 Bắt đầu setup dữ liệu test...');

// 1. Tạo dữ liệu ngành đào tạo
const testMajors = [
  {
    id: 'cntt',
    name: 'Công nghệ Thông tin',
    code: 'CNTT',
    description: 'Đào tạo chuyên gia công nghệ thông tin với kiến thức toàn diện về lập trình, cơ sở dữ liệu, mạng máy tính',
    tuition: 12000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'ktoan',
    name: 'Kế toán',
    code: 'KTOAN',
    description: 'Đào tạo kế toán viên chuyên nghiệp, thành thạo các phần mềm kế toán hiện đại',
    tuition: 10000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-02').toISOString()
  },
  {
    id: 'qtkd',
    name: 'Quản trị Kinh doanh',
    code: 'QTKD',
    description: 'Đào tạo nhà quản lý doanh nghiệp với tư duy chiến lược và kỹ năng lãnh đạo',
    tuition: 11000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-03').toISOString()
  },
  {
    id: 'marketing',
    name: 'Marketing',
    code: 'MKT',
    description: 'Chuyên gia marketing số, thành thạo các kênh truyền thông hiện đại',
    tuition: 9500000,
    duration: '3 năm',
    createdAt: new Date('2024-01-04').toISOString()
  },
  {
    id: 'logistics',
    name: 'Logistics',
    code: 'LOG',
    description: 'Quản lý chuỗi cung ứng và vận tải, đáp ứng nhu cầu thương mại điện tử',
    tuition: 10500000,
    duration: '3 năm',
    createdAt: new Date('2024-01-05').toISOString()
  },
  {
    id: 'dulich',
    name: 'Du lịch',
    code: 'DL',
    description: 'Quản lý dịch vụ du lịch và lữ hành, kết nối văn hóa và kinh tế',
    tuition: 9000000,
    duration: '3 năm',
    createdAt: new Date('2024-01-06').toISOString()
  }
];

// 2. Tạo tin tức/thông báo
const testNews = [
  {
    id: Date.now(),
    title: 'Thông báo tuyển sinh năm 2025 - Nhiều ưu đãi hấp dẫn',
    content: 'Trường Cao đẳng Bách khoa Nam Sài Gòn thông báo tuyển sinh các ngành hot nhất năm 2025 với nhiều chương trình học bổng và ưu đãi học phí...',
    category: 'announcement',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isHot: true
  },
  {
    id: Date.now() + 1,
    title: 'Học bổng toàn phần cho sinh viên xuất sắc',
    content: 'Chương trình học bổng dành cho sinh viên có thành tích học tập cao, hoạt động tích cực...',
    category: 'news',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isHot: false
  },
  {
    id: Date.now() + 2,
    title: 'Ngành Công nghệ Thông tin - Cơ hội việc làm cao nhất',
    content: 'Tỷ lệ có việc làm sau tốt nghiệp lên đến 95%, mức lương khởi điểm từ 8-15 triệu...',
    category: 'admission',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isHot: true
  },
  {
    id: Date.now() + 3,
    title: 'Khai giảng khóa học Marketing Digital miễn phí',
    content: 'Chương trình đào tạo marketing số hoàn toàn miễn phí dành cho sinh viên...',
    category: 'news',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 ngày trước
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    isHot: false
  }
];

// 3. Tạo thông báo người dùng
const testNotifications = [
  {
    id: Date.now(),
    title: 'Chào mừng đến với Trường Cao đẳng Bách khoa Nam Sài Gòn!',
    message: 'Cảm ơn bạn đã quan tâm đến trường. Hãy khám phá các ngành đào tạo của chúng tôi!',
    category: 'Hệ thống',
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    type: 'system'
  },
  {
    id: Date.now() + 1,
    title: 'Thông báo tuyển sinh mới',
    message: 'Đã cập nhật thông tin tuyển sinh các ngành. Hãy xem ngay để không bỏ lỡ cơ hội!',
    category: 'Tuyển sinh',
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    type: 'admission'
  },
  {
    id: Date.now() + 2,
    title: 'Chương trình học bổng',
    message: 'Cơ hội nhận học bổng lên đến 100% học phí. Đăng ký ngay!',
    category: 'Học bổng',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    isRead: false,
    type: 'scholarship'
  }
];

// 4. Tạo cài đặt trường
const schoolSettings = {
  schoolName: "BKNSG",
  schoolFullName: "Trường Cao đẳng Bách khoa Nam Sài Gòn",
  description: "Đào tạo nhân lực chất lượng cao",
  address: "123 Đường ABC, Quận XYZ, TP HCM",
  phone: "0123456789",
  email: "info@nsg.edu.vn",
  website: "https://nsg.edu.vn"
};

// 5. Lưu tất cả vào localStorage
try {
  localStorage.setItem('adminMajorsList', JSON.stringify(testMajors));
  localStorage.setItem('adminNewsList', JSON.stringify(testNews));
  localStorage.setItem('userNotifications', JSON.stringify(testNotifications));
  localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
  
  console.log('✅ Đã tạo', testMajors.length, 'ngành đào tạo');
  console.log('✅ Đã tạo', testNews.length, 'tin tức/thông báo');
  console.log('✅ Đã tạo', testNotifications.length, 'thông báo người dùng');
  console.log('✅ Đã cấu hình thông tin trường');
  
  // Reload trang để áp dụng dữ liệu mới
  console.log('🔄 Đang reload trang để áp dụng dữ liệu...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
  
} catch (error) {
  console.error('❌ Lỗi khi lưu dữ liệu:', error);
}