// Script để tạo dữ liệu mẫu cho tin tức và thông báo
// Chạy trong console của trình duyệt

const sampleNews = [
  {
    "id": "news-1",
    "title": "Khai giảng năm học 2024-2025",
    "content": "Trường Cao đẳng Bách khoa Nam Sài Gòn tổ chức lễ khai giảng năm học mới 2024-2025 với sự tham gia của toàn thể sinh viên và giảng viên.",
    "summary": "Lễ khai giảng năm học 2024-2025 sẽ được tổ chức trang trọng vào ngày 15/09/2024",
    "category": "news",
    "author": "Ban Biên tập",
    "createdAt": "2024-09-10T08:00:00Z",
    "updatedAt": "2024-09-10T08:00:00Z",
    "status": "published",
    "featured": true,
    "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400",
    "viewCount": 1250,
    "likeCount": 85,
    "tags": ["khai giảng", "năm học mới", "2024-2025"]
  },
  {
    "id": "news-2",
    "title": "Thông báo lịch thi cuối kỳ học kỳ I",
    "content": "Ban Đào tạo thông báo lịch thi cuối kỳ học kỳ I năm học 2024-2025 cho tất cả các khóa học và ngành đào tạo.",
    "summary": "Lịch thi cuối kỳ học kỳ I sẽ bắt đầu từ ngày 15/01/2025",
    "category": "announcement",
    "author": "Ban Đào tạo",
    "createdAt": "2024-09-20T14:30:00Z",
    "updatedAt": "2024-09-20T14:30:00Z",
    "status": "published",
    "featured": true,
    "imageUrl": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    "viewCount": 2100,
    "likeCount": 45,
    "tags": ["lịch thi", "cuối kỳ", "học kỳ I"]
  },
  {
    "id": "news-3",
    "title": "Hội thảo công nghệ thông tin 2024",
    "content": "Khoa Công nghệ thông tin tổ chức hội thảo với chủ đề 'Xu hướng công nghệ mới và cơ hội việc làm' dành cho sinh viên các ngành CNTT.",
    "summary": "Hội thảo CNTT với sự tham gia của các chuyên gia hàng đầu",
    "category": "news",
    "author": "Khoa CNTT",
    "createdAt": "2024-09-18T10:15:00Z",
    "updatedAt": "2024-09-18T10:15:00Z", 
    "status": "published",
    "featured": false,
    "imageUrl": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400",
    "viewCount": 750,
    "likeCount": 65,
    "tags": ["hội thảo", "công nghệ", "việc làm"]
  },
  {
    "id": "news-4", 
    "title": "Thông báo điều chỉnh học phí năm học 2024-2025",
    "content": "Nhà trường thông báo về việc điều chỉnh mức học phí cho các ngành đào tạo từ năm học 2024-2025 theo quyết định của Hội đồng trường.",
    "summary": "Điều chỉnh học phí các ngành đào tạo áp dụng từ năm học mới",
    "category": "announcement",
    "author": "Ban Tài chính",
    "createdAt": "2024-09-15T16:45:00Z",
    "updatedAt": "2024-09-15T16:45:00Z",
    "status": "published",
    "featured": false,
    "imageUrl": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    "viewCount": 1850,
    "likeCount": 25,
    "tags": ["học phí", "điều chỉnh", "năm học 2024-2025"]
  },
  {
    "id": "news-5",
    "title": "Cuộc thi lập trình sinh viên cấp trường",
    "content": "Khoa Công nghệ thông tin phối hợp với Đoàn thanh niên tổ chức cuộc thi lập trình dành cho sinh viên toàn trường với nhiều giải thưởng hấp dẫn.",
    "summary": "Cuộc thi lập trình với giải nhất 10 triệu đồng",
    "category": "news",
    "author": "Đoàn thanh niên",
    "createdAt": "2024-09-22T09:00:00Z",
    "updatedAt": "2024-09-22T09:00:00Z",
    "status": "published",
    "featured": true,
    "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    "viewCount": 980,
    "likeCount": 120,
    "tags": ["cuộc thi", "lập trình", "sinh viên"]
  }
];

// Lưu vào DataManager format
localStorage.setItem('newsList', JSON.stringify(sampleNews));

console.log('✅ Đã tạo', sampleNews.length, 'bài viết mẫu:');
sampleNews.forEach((news, index) => {
  console.log(`${index + 1}. ${news.title} - ${news.category} - ${news.featured ? '🔥' : ''}`);
});

console.log('\n📊 Thống kê theo danh mục:');
const newsCount = sampleNews.filter(n => n.category === 'news').length;
const announcementCount = sampleNews.filter(n => n.category === 'announcement').length;
const featuredCount = sampleNews.filter(n => n.featured).length;

console.log(`- Tin tức: ${newsCount} bài`);
console.log(`- Thông báo: ${announcementCount} bài`);
console.log(`- Tin nổi bật: ${featuredCount} bài`);

console.log('\n🔄 Dữ liệu đã được lưu vào localStorage với key "newsList"');
console.log('💡 Làm mới trang để xem dữ liệu mới!');