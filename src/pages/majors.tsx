import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header, Input, Select } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, Major } from "@/utils/data-manager";

function MajorsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [majorsData, setMajorsData] = useState<Major[]>([]);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);

  useEffect(() => {
    const loadMajors = async () => {
      try {
        const { getMajors } = await import('@/utils/api');
        const majors = await getMajors();
        setMajorsData(majors);
      } catch (e) {
        console.error('Lỗi tải ng�nh:', e);
      }
    };loadMajors();

    // Lắng nghe sự kiện storage để cập nhật khi có thay đổi từ admin
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminMajorsList') {
        console.log('🔄 Phát hiện thay đổi ngành học từ admin, đang reload...');
        loadMajors();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let filtered = majorsData.filter(major =>
      major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      major.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      major.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedLevel !== "all") {
      filtered = filtered.filter(major => 
        major.educationLevel === selectedLevel
      );
    }

    setFilteredMajors(filtered);
  }, [searchTerm, selectedLevel, majorsData]);

  const getEducationLevelText = (level: string) => {
    switch (level) {
      case 'caodang':
        return "Cao đẳng";
      case 'trungcap':
        return "Trung cấp";
      case 'caodang-lienthong':
        return "Cao đẳng liên thông";
      default:
        return level;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const handleMajorClick = (majorId: string) => {
    navigate(`/majors/${majorId}`);
  };

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Ngành học" 
        showBackIcon={true}
        className="bg-blue-600 text-white"
      />
      
      <Box className="p-4">
        <Box className="space-y-3 mb-6">
          <Input
            type="text"
            placeholder="🔍 Tìm kiếm ngành học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select
            placeholder="Chọn hệ đào tạo"
            value={selectedLevel}
            onChange={(value) => setSelectedLevel(value as string)}
          >
            <Select.Option value="all" title="Tất cả hệ đào tạo" />
            <Select.Option value="caodang" title="Cao đẳng" />
            <Select.Option value="trungcap" title="Trung cấp" />
            <Select.Option value="caodang-lienthong" title="Cao đẳng liên thông" />
          </Select>
        </Box>

        <Box className="grid grid-cols-2 gap-3 mb-6">
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-blue-600">{majorsData.length}</Text>
            <Text className="text-xs text-gray-500">Tổng ngành</Text>
          </Box>
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-green-600">
              {majorsData.filter(m => m.educationLevel === 'caodang').length}
            </Text>
            <Text className="text-xs text-gray-500">Cao đẳng</Text>
          </Box>
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-orange-600">
              {majorsData.filter(m => m.educationLevel === 'trungcap').length}
            </Text>
            <Text className="text-xs text-gray-500">Trung cấp</Text>
          </Box>
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-purple-600">
              {majorsData.filter(m => m.educationLevel === 'caodang-lienthong').length}
            </Text>
            <Text className="text-xs text-gray-500">Cao đẳng liên thông</Text>
          </Box>
        </Box>

        <Box className="mb-4">
          <Text className="text-gray-600">
            Hiển thị {filteredMajors.length} trong {majorsData.length} ngành học
          </Text>
        </Box>

        <Box className="space-y-4">
          {filteredMajors.map((major) => (
            <Box className="bg-white rounded-lg overflow-hidden shadow-sm border p-4" key={major.id}>
              <Box className="mb-2 flex items-center justify-between">
                <Text.Title>{major.name}</Text.Title>
                <Box className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {getEducationLevelText(major.educationLevel)}
                </Box>
              </Box>
              
              <Text className="text-gray-600 text-sm mb-3">{major.description}</Text>

              <Box className="space-y-2 mb-4">
                <Box className="flex items-center justify-between">
                  <Text className="text-sm text-gray-500">Mã ngành:</Text>
                  <Text className="text-sm font-medium">{major.code}</Text>
                </Box>
                
                <Box className="flex items-center justify-between">
                  <Text className="text-sm text-gray-500">Thời gian:</Text>
                  <Text className="text-sm font-medium">{major.duration}</Text>
                </Box>
                
                <Box className="flex items-center justify-between">
                  <Text className="text-sm text-gray-500">Học phí:</Text>
                  <Text className="text-sm font-medium text-green-600">
                    {formatCurrency(major.tuitionFee)}
                  </Text>
                </Box>

                {major.website && (
                  <Box className="flex items-center justify-between">
                    <Text className="text-sm text-gray-500">Website:</Text>
                    <Text className="text-sm text-blue-600">🌐 Xem chi tiết</Text>
                  </Box>
                )}
              </Box>

              <Button 
                variant="primary" 
                size="small"
                fullWidth
                onClick={() => handleMajorClick(major.id)}
              >
                Xem chi tiết
              </Button>
            </Box>
          ))}
        </Box>

        {filteredMajors.length === 0 && (
          <Box className="text-center py-12">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-gray-500 mb-2">Không tìm thấy ngành học</Text>
            <Text className="text-gray-400 text-sm">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </Text>
          </Box>
        )}

        <Box className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center">
          <Text.Title className="mb-2 text-white">🎓 Sẵn sàng đăng ký?</Text.Title>
          <Text className="mb-4 text-blue-100">
            Khám phá cơ hội học tập tại Trường Cao đẳng Bách khoa Nam Sài Gon
          </Text>
          <Button 
            variant="secondary"
            onClick={() => navigate('/admission-registration')}
          >
            Đăng ký tuyển sinh ngay
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default MajorsPage;
