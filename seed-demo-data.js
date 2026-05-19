// Chạy đoạn script này trong console (F12) của trình duyệt hoặc Zalo Mini App để seed dữ liệu mẫu cho app NSG NEWS

// ==== CHUẨN HÓA DỮ LIỆU SEED DEMO ==== //
// Đảm bảo chạy script này trong môi trường browser (F12 console)

// Import chuẩn hóa nếu có thể (hoặc copy lại hàm nếu chạy ngoài dự án)
function normalizeNewsItem(input) {
  const id = Number(input.id || input._id || Date.now() + Math.random());
  const category = input.category || 'news';
  
  // Ưu tiên sử dụng image từ input, nếu không có thì dùng placeholder
  const imageUrl = input.image || input.imageUrl || 'https://via.placeholder.com/800x400/cccccc/666666?text=Chưa+có+ảnh+đại+diện';
  
  return {
    id,
    title: input.title || 'Chưa có tiêu đề',
    summary: input.summary || (input.content ? String(input.content).substring(0,150) + '...' : 'Đang cập nhật nội dung...'),
    content: input.content || input.body || '',
    image: imageUrl,
    imageUrl: imageUrl, // Đồng bộ cả 2 trường
    category,
    date: input.date || input.createdAt || new Date().toISOString().split('T')[0],
    author: input.author || 'Admin',
    authorId: input.authorId || 'admin',
    isHot: Boolean(input.isHot || input.featured),
    featured: Boolean(input.isHot || input.featured),
    status: input.status || 'published',
    views: Number(input.views || 0),
    viewCount: Number(input.viewCount || input.views || 0),
    likeCount: Number(input.likeCount || 0),
    tags: input.tags || [],
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}
function normalizeNewsList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeNewsItem);
}
function normalizeMajor(input) {
  return {
    id: String(input.id || input._id || Date.now() + Math.random()),
    name: input.name || 'Chưa đặt tên',
    code: input.code || 'N/A',
    description: input.description || 'Đang cập nhật mô tả ngành...',
    image: input.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    duration: input.duration || '3 năm',
    educationLevels: input.educationLevels && Array.isArray(input.educationLevels) && input.educationLevels.length > 0
      ? input.educationLevels
      : ['college','vocational'],
    requirements: input.requirements || ["Tốt nghiệp THPT"],
    careerProspects: input.careerProspects || ["Cơ hội nghề nghiệp rộng mở"],
    tuitionFee: Number(input.tuitionFee ?? input.tuition ?? 0),
    quota: Number(input.quota || 100), // Chỉ tiêu tuyển sinh
    enrolled: Number(input.enrolled || 0), // Số đã tuyển
    admissionScore: Number(input.admissionScore || 15),
    subjects: input.subjects || [],
    educationLevel: input.educationLevel || 'caodang',
    isActive: input.isActive !== false,
    status: input.status || 'active',
    createdAt: input.createdAt || input.date || new Date().toISOString(),
    updatedAt: input.updatedAt || input.modifiedAt || new Date().toISOString(),
  };
}
function normalizeMajors(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeMajor);
}

(function seedNSGNewsDemoData() {
  // Tin tức mẫu - Thêm nhiều dữ liệu hơn
  const news = [
    // Thông báo
    {
      id: Date.now() + 1,
      title: "Thông báo tuyển sinh năm 2025",
      summary: "Trường Cao đẳng Nam Sài Gòn thông báo tuyển sinh năm 2025 với nhiều ngành học hấp dẫn và cơ hội nghề nghiệp rộng mở.",
      content: "Chi tiết về tuyển sinh năm 2025...",
      category: "thong-bao",
      status: "published",
      author: "Admin",
      date: "2025-09-20",
      createdAt: "2025-09-20T08:00:00Z",
      updatedAt: "2025-09-20T08:00:00Z",
      featured: true,
      imageUrl: "https://picsum.photos/seed/nsg1/800/400"
    },
    {
      id: Date.now() + 2,
      title: "Thông báo lịch thi cuối kỳ",
      summary: "Lịch thi cuối kỳ học kỳ 1 năm học 2024-2025 đã được công bố.",
      content: "Nội dung lịch thi...",
      category: "thong-bao",
      status: "published",
      author: "Phòng Đào tạo",
      date: "2025-09-18",
      createdAt: "2025-09-18T08:00:00Z",
      updatedAt: "2025-09-18T08:00:00Z",
      featured: false,
      imageUrl: "https://picsum.photos/seed/nsg2/800/400"
    },
    {
      id: Date.now() + 3,
      title: "Thông báo học phí học kỳ 2",
      summary: "Thông báo về học phí và thời gian đóng học phí học kỳ 2 năm học 2024-2025.",
      content: "Chi tiết học phí...",
      category: "thong-bao",
      status: "published",
      author: "Phòng Tài chính",
      date: "2025-09-17",
      createdAt: "2025-09-17T08:00:00Z",
      updatedAt: "2025-09-17T08:00:00Z",
      featured: false,
      imageUrl: "https://picsum.photos/seed/nsg3/800/400"
    },
    
    // Sự kiện
    {
      id: Date.now() + 4,
      title: "Lễ khai giảng năm học mới 2024-2025",
      summary: "Lễ khai giảng năm học mới tại NSG với nhiều hoạt động sôi nổi và ý nghĩa.",
      content: "Nội dung lễ khai giảng...",
      category: "su-kien",
      status: "published",
      author: "Giáo viên A",
      date: "2025-09-19",
      createdAt: "2025-09-19T08:00:00Z",
      updatedAt: "2025-09-19T08:00:00Z",
      featured: true,
      imageUrl: "https://picsum.photos/seed/event1/800/400"
    },
    {
      id: Date.now() + 5,
      title: "Hội thảo việc làm cho sinh viên",
      summary: "Hội thảo kết nối doanh nghiệp và sinh viên, tạo cơ hội việc làm cho sinh viên sắp tốt nghiệp.",
      content: "Nội dung hội thảo...",
      category: "su-kien",
      status: "published",
      author: "Phòng CTSV",
      date: "2025-09-16",
      createdAt: "2025-09-16T08:00:00Z",
      updatedAt: "2025-09-16T08:00:00Z",
      featured: false,
      imageUrl: "https://picsum.photos/seed/event2/800/400"
    },
    {
      id: Date.now() + 6,
      title: "Ngày hội tuyển sinh 2025",
      summary: "Ngày hội tư vấn tuyển sinh trực tiếp tại trường, học sinh và phụ huynh được tư vấn chi tiết về các ngành học.",
      content: "Nội dung ngày hội...",
      category: "su-kien",
      status: "published",
      author: "Phòng Tuyển sinh",
      date: "2025-09-15",
      createdAt: "2025-09-15T08:00:00Z",
      updatedAt: "2025-09-15T08:00:00Z",
      featured: true,
      imageUrl: "https://picsum.photos/seed/event3/800/400"
    },
    {
      id: Date.now() + 7,
      title: "Chương trình giao lưu văn hóa sinh viên",
      summary: "Chương trình giao lưu văn hóa giữa các lớp, các khoa tạo sân chơi bổ ích cho sinh viên.",
      content: "Nội dung chương trình...",
      category: "su-kien",
      status: "published",
      author: "Đoàn trường",
      date: "2025-09-14",
      createdAt: "2025-09-14T08:00:00Z",
      updatedAt: "2025-09-14T08:00:00Z",
      featured: false,
      imageUrl: "https://picsum.photos/seed/event4/800/400"
    },
    
    // Tin tức
    {
      id: Date.now() + 8,
      title: "Kết quả thi học sinh giỏi cấp trường",
      summary: "Công bố kết quả thi học sinh giỏi cấp trường năm học 2024-2025.",
      content: "Kết quả thi học sinh giỏi...",
      category: "tin-tuc",
      status: "published",
      author: "Admin",
      date: "2025-09-18",
      createdAt: "2025-09-18T08:00:00Z",
      updatedAt: "2025-09-18T08:00:00Z",
      featured: false,
      imageUrl: "https://picsum.photos/seed/news1/800/400"
    },
    {
      id: Date.now() + 9,
      title: "Sinh viên NSG đạt giải Nhất cuộc thi Khoa học Kỹ thuật",
      summary: "Đội thi của trường NSG xuất sắc giành giải Nhất cuộc thi Khoa học Kỹ thuật toàn quốc.",
      content: "Nội dung tin tức...",
      category: "tin-tuc",
      status: "published",
      author: "Giáo viên B",
      date: "2025-09-17",
      createdAt: "2025-09-17T08:00:00Z",
      updatedAt: "2025-09-17T08:00:00Z",
      featured: true,
      imageUrl: "https://picsum.photos/seed/news2/800/400"
    },
    {
      id: Date.now() + 10,
      title: "Trường NSG ký kết hợp tác với doanh nghiệp công nghệ",
      summary: "Trường ký kết hợp tác với các doanh nghiệp công nghệ hàng đầu để tạo cơ hội thực tập và việc làm cho sinh viên.",
      content: "Nội dung ký kết...",
      category: "tin-tuc",
      status: "published",
      author: "Ban Giám hiệu",
      date: "2025-09-16",
      createdAt: "2025-09-16T08:00:00Z",
      updatedAt: "2025-09-16T08:00:00Z",
      featured: false,
      imageUrl: "https://picsum.photos/seed/news3/800/400"
    },
    {
      id: Date.now() + 11,
      title: "Cập nhật chương trình đào tạo mới theo chuẩn quốc tế",
      summary: "Trường NSG cập nhật chương trình đào tạo theo chuẩn quốc tế, giúp sinh viên có kiến thức ngang tầm khu vực.",
      content: "Nội dung cập nhật...",
      category: "tin-tuc",
      status: "published",
      author: "Phòng Đào tạo",
      date: "2025-09-15",
      createdAt: "2025-09-15T08:00:00Z",
      updatedAt: "2025-09-15T08:00:00Z",
      featured: false,
      imageUrl: "https://picsum.photos/seed/news4/800/400"
    }
  ];
  const normalizedNews = normalizeNewsList(news);
  localStorage.setItem('adminNewsList', JSON.stringify(normalizedNews));
  localStorage.setItem('app_news_data', JSON.stringify(normalizedNews));

  // Ngành đào tạo mẫu - Thêm nhiều ngành hơn
  const majors = [
    { 
      id: "cntt", 
      name: "Công nghệ Thông tin", 
      code: "CNTT", 
      description: "Đào tạo chuyên gia về phát triển phần mềm, quản trị hệ thống, an ninh mạng", 
      tuitionFee: 18000000, 
      duration: "3 năm", 
      quota: 120,
      enrolled: 95,
      admissionScore: 18.5,
      subjects: ["Lập trình", "Cơ sở dữ liệu", "Mạng máy tính", "An ninh mạng"],
      careerProspects: ["Lập trình viên", "Quản trị hệ thống", "Chuyên viên an ninh mạng"],
      requirements: ["Tốt nghiệp THPT", "Yêu thích toán và công nghệ"],
      isActive: true, 
      status: "active",
      educationLevel: "caodang",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"
    },
    { 
      id: "kt", 
      name: "Kế toán", 
      code: "KT", 
      description: "Đào tạo kế toán viên chuyên nghiệp, am hiểu pháp luật thuế và tài chính", 
      tuitionFee: 15000000, 
      duration: "3 năm", 
      quota: 80,
      enrolled: 72,
      admissionScore: 16.0,
      subjects: ["Nguyên lý kế toán", "Kế toán tài chính", "Thuế", "Kiểm toán"],
      careerProspects: ["Kế toán viên", "Kiểm toán viên", "Chuyên viên thuế"],
      requirements: ["Tốt nghiệp THPT", "Cẩn thận, tỉ mỉ"],
      isActive: true, 
      status: "active",
      educationLevel: "trungcap",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"
    },
    { 
      id: "qlkd", 
      name: "Quản lý Kinh doanh", 
      code: "QLKD", 
      description: "Đào tạo nhà quản lý doanh nghiệp, khởi nghiệp và phát triển kinh doanh", 
      tuitionFee: 16000000, 
      duration: "3 năm", 
      quota: 100,
      enrolled: 88,
      admissionScore: 17.0,
      subjects: ["Quản trị học", "Marketing", "Tài chính doanh nghiệp", "Quản trị nhân sự"],
      careerProspects: ["Quản lý doanh nghiệp", "Chuyên viên marketing", "Tư vấn kinh doanh"],
      requirements: ["Tốt nghiệp THPT", "Kỹ năng giao tiếp tốt"],
      isActive: true, 
      status: "active",
      educationLevel: "caodang-lienthong",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400"
    },
    { 
      id: "dt", 
      name: "Điện tử Viễn thông", 
      code: "DT", 
      description: "Đào tạo kỹ sư điện tử, viễn thông và công nghệ IoT", 
      tuitionFee: 17000000, 
      duration: "3 năm", 
      quota: 60,
      enrolled: 48,
      admissionScore: 17.5,
      subjects: ["Điện tử cơ bản", "Viễn thông", "IoT", "Xử lý tín hiệu"],
      careerProspects: ["Kỹ sư điện tử", "Chuyên viên viễn thông", "Kỹ sư IoT"],
      requirements: ["Tốt nghiệp THPT", "Yêu thích vật lý và điện tử"],
      isActive: true, 
      status: "active",
      educationLevel: "caodang",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    },
    { 
      id: "xd", 
      name: "Xây dựng Dân dụng", 
      code: "XD", 
      description: "Đào tạo kỹ sư xây dựng công trình dân dụng và công nghiệp", 
      tuitionFee: 16500000, 
      duration: "3 năm", 
      quota: 70,
      enrolled: 65,
      admissionScore: 16.5,
      subjects: ["Cơ học kết cấu", "Vật liệu xây dựng", "Kỹ thuật thi công", "Dự toán"],
      careerProspects: ["Kỹ sư xây dựng", "Giám sát công trình", "Chuyên viên dự toán"],
      requirements: ["Tốt nghiệp THPT", "Sức khỏe tốt"],
      isActive: true, 
      status: "active",
      educationLevel: "caodang",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400"
    },
    { 
      id: "oto", 
      name: "Công nghệ Ô tô", 
      code: "OTO", 
      description: "Đào tạo kỹ thuật viên bảo dưỡng, sửa chữa và thiết kế ô tô", 
      tuitionFee: 17500000, 
      duration: "3 năm", 
      quota: 50,
      enrolled: 42,
      admissionScore: 16.0,
      subjects: ["Động cơ ô tô", "Hệ thống điện ô tô", "Chẩn đoán sửa chữa", "Công nghệ ô tô"],
      careerProspects: ["Kỹ thuật viên ô tô", "Tư vấn kỹ thuật", "Quản lý xưởng sửa chữa"],
      requirements: ["Tốt nghiệp THPT", "Đam mê ô tô"],
      isActive: true, 
      status: "active",
      educationLevel: "trungcap",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"
    }
  ];
  const normalizedMajors = normalizeMajors(majors);
  localStorage.setItem('adminMajorsList', JSON.stringify(normalizedMajors));
  localStorage.setItem('app_majors_data', JSON.stringify(normalizedMajors));

  // Thông báo mẫu
  const notifications = [
    { id: 1, title: "Chào mừng bạn đến với NSG NEWS!", content: "Cảm ơn bạn đã sử dụng ứng dụng.", read: false, createdAt: new Date().toISOString() },
    { id: 2, title: "Có tin tức mới!", content: "Hãy xem ngay các tin tức mới nhất.", read: false, createdAt: new Date().toISOString() }
  ];
  localStorage.setItem('notifications', JSON.stringify(notifications));

  console.log('✅ Đã tạo dữ liệu mẫu thành công!');
  console.log('📊 Thống kê:', {
    'Tin tức': news.filter(n => n.category === 'tin-tuc').length,
    'Thông báo': news.filter(n => n.category === 'thong-bao').length,
    'Sự kiện': news.filter(n => n.category === 'su-kien').length,
    'Ngành đào tạo': majors.length
  });
  
  alert('✅ Đã tạo dữ liệu mẫu (chuẩn hóa) thành công!\n\n📊 Dữ liệu:\n- Tin tức: ' + news.filter(n => n.category === 'tin-tuc').length + '\n- Thông báo: ' + news.filter(n => n.category === 'thong-bao').length + '\n- Sự kiện: ' + news.filter(n => n.category === 'su-kien').length + '\n- Ngành đào tạo: ' + majors.length + '\n\nHãy reload lại app để xem dữ liệu!');
})();
