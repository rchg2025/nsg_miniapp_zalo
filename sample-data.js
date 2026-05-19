// Script để tạo dữ liệu mẫu cho hệ thống quản trị ngành học
// Chạy trong console của trình duyệt khi ở trang admin

const sampleMajors = [
  {
    "id": "major-1",
    "name": "Công nghệ thông tin",
    "code": "CNTT01",
    "description": "Ngành Công nghệ thông tin đào tạo sinh viên có kiến thức vững về lập trình, thiết kế hệ thống, quản trị cơ sở dữ liệu và phát triển ứng dụng.",
    "duration": "3 năm",
    "tuitionFee": 25000000,
    "subjects": ["Lập trình C/C++", "Cơ sở dữ liệu", "Mạng máy tính", "Kỹ thuật phần mềm", "Trí tuệ nhân tạo"],
    "careerProspects": ["Lập trình viên", "Chuyên viên IT", "Quản trị hệ thống", "Phân tích viên", "Tester"],
    "admissionScore": 18.0,
    "quota": 120,
    "enrolled": 95,
    "status": "active",
    "createdAt": "2024-01-15T00:00:00Z",
    "imageUrl": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
    "educationLevel": "caodang",
    "website": "https://cntt.nsg.edu.vn"
  },
  {
    "id": "major-2", 
    "name": "Kế toán doanh nghiệp",
    "code": "KTDN01",
    "description": "Ngành Kế toán doanh nghiệp trang bị kiến thức về kế toán tài chính, kế toán quản trị và thuế để sinh viên có thể làm việc tại các doanh nghiệp.",
    "duration": "2.5 năm",
    "tuitionFee": 22000000,
    "subjects": ["Nguyên lý kế toán", "Kế toán tài chính", "Kế toán quản trị", "Thuế", "Kiểm toán"],
    "careerProspects": ["Kế toán viên", "Kiểm toán viên", "Chuyên viên thuế", "Tư vấn tài chính", "Kế toán trưởng"],
    "admissionScore": 16.5,
    "quota": 80,
    "enrolled": 72,
    "status": "active",
    "createdAt": "2024-01-15T00:00:00Z",
    "imageUrl": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    "educationLevel": "trungcap"
  },
  {
    "id": "major-3",
    "name": "Quản trị kinh doanh",
    "code": "QTKD01", 
    "description": "Ngành Quản trị kinh doanh đào tạo những nhà quản lý có năng lực lãnh đạo, tư duy chiến lược và kỹ năng quản trị hiện đại.",
    "duration": "3 năm",
    "tuitionFee": 24000000,
    "subjects": ["Quản trị học", "Marketing", "Tài chính doanh nghiệp", "Quản trị nhân lực", "Quản trị chiến lược"],
    "careerProspects": ["Quản lý doanh nghiệp", "Chuyên viên marketing", "Tư vấn kinh doanh", "Nhân viên bán hàng", "Chuyên viên HR"],
    "admissionScore": 17.0,
    "quota": 100,
    "enrolled": 88,
    "status": "active", 
    "createdAt": "2024-01-15T00:00:00Z",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "educationLevel": "caodang-lienthong",
    "website": "https://qtkd.nsg.edu.vn"
  },
  {
    "id": "major-4",
    "name": "Điều dưỡng",
    "code": "DD01",
    "description": "Ngành Điều dưỡng đào tạo các điều dưỡng viên chuyên nghiệp, có kỹ năng chăm sóc bệnh nhân và hiểu biết về y học cơ bản.",
    "duration": "3 năm",
    "tuitionFee": 28000000,
    "subjects": ["Giải phẫu sinh lý", "Điều dưỡng cơ bản", "Điều dưỡng nội khoa", "Điều dưỡng ngoại khoa", "Cấp cứu"],
    "careerProspects": ["Điều dưỡng viên", "Y tá", "Chăm sóc sức khỏe", "Phụ tá y tế", "Tư vấn sức khỏe"],
    "admissionScore": 19.0,
    "quota": 60,
    "enrolled": 58,
    "status": "active",
    "createdAt": "2024-01-15T00:00:00Z",
    "imageUrl": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    "educationLevel": "caodang"
  },
  {
    "id": "major-5",
    "name": "Cơ khí chế tạo máy",
    "code": "CKCM01",
    "description": "Ngành Cơ khí chế tạo máy đào tạo kỹ thuật viên có khả năng thiết kế, chế tạo và bảo trì các loại máy móc, thiết bị công nghiệp.",
    "duration": "2.5 năm", 
    "tuitionFee": 26000000,
    "subjects": ["Vẽ kỹ thuật", "Cơ học kỹ thuật", "Vật liệu học", "Công nghệ chế tạo máy", "Tự động hóa"],
    "careerProspects": ["Kỹ thuật viên cơ khí", "Thiết kế máy", "Kỹ sư chế tạo", "Quản lý sản xuất", "Tư vấn kỹ thuật"],
    "admissionScore": 17.5,
    "quota": 70,
    "enrolled": 65,
    "status": "active",
    "createdAt": "2024-01-15T00:00:00Z", 
    "imageUrl": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400",
    "educationLevel": "trungcap"
  }
];

// Lưu vào localStorage
localStorage.setItem('majorsList', JSON.stringify(sampleMajors));

console.log('✅ Đã tạo', sampleMajors.length, 'ngành học mẫu:');
sampleMajors.forEach(major => {
  console.log(`- ${major.name} (${major.code}) - ${major.educationLevel}`);
});

console.log('\n📊 Thống kê theo hệ đào tạo:');
const caodang = sampleMajors.filter(m => m.educationLevel === 'caodang').length;
const trungcap = sampleMajors.filter(m => m.educationLevel === 'trungcap').length;
const lienthong = sampleMajors.filter(m => m.educationLevel === 'caodang-lienthong').length;

console.log(`- Cao đẳng: ${caodang} ngành`);
console.log(`- Trung cấp: ${trungcap} ngành`);
console.log(`- Cao đẳng liên thông: ${lienthong} ngành`);

console.log('\n🔄 Dữ liệu đã được lưu vào localStorage với key "majorsList"');
console.log('💡 Làm mới trang để xem dữ liệu mới!');