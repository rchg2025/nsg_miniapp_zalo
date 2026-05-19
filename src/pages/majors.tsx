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
        console.error('Lỗi tải ngành:', e);
      }
    };loadMajors();

    // Láº¯ng nghe sá»± kiá»‡n storage Ä‘á»ƒ cáº­p nháº­t khi cÃ³ thay Ä‘á»•i tá»« admin
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminMajorsList') {
        console.log('ðŸ”„ PhÃ¡t hiá»‡n thay Ä‘á»•i ngÃ nh há»c tá»« admin, Ä‘ang reload...');
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
        return "Cao Ä‘áº³ng";
      case 'trungcap':
        return "Trung cáº¥p";
      case 'caodang-lienthong':
        return "Cao Ä‘áº³ng liÃªn thÃ´ng";
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
        title="NgÃ nh há»c" 
        showBackIcon={true}
        className="bg-blue-600 text-white"
      />
      
      <Box className="p-4">
        <Box className="space-y-3 mb-6">
          <Input
            type="text"
            placeholder="ðŸ” TÃ¬m kiáº¿m ngÃ nh há»c..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select
            placeholder="Chá»n há»‡ Ä‘Ã o táº¡o"
            value={selectedLevel}
            onChange={(value) => setSelectedLevel(value as string)}
          >
            <Select.Option value="all" title="Táº¥t cáº£ há»‡ Ä‘Ã o táº¡o" />
            <Select.Option value="caodang" title="Cao Ä‘áº³ng" />
            <Select.Option value="trungcap" title="Trung cáº¥p" />
            <Select.Option value="caodang-lienthong" title="Cao Ä‘áº³ng liÃªn thÃ´ng" />
          </Select>
        </Box>

        <Box className="grid grid-cols-2 gap-3 mb-6">
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-blue-600">{majorsData.length}</Text>
            <Text className="text-xs text-gray-500">Tá»•ng ngÃ nh</Text>
          </Box>
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-green-600">
              {majorsData.filter(m => m.educationLevel === 'caodang').length}
            </Text>
            <Text className="text-xs text-gray-500">Cao Ä‘áº³ng</Text>
          </Box>
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-orange-600">
              {majorsData.filter(m => m.educationLevel === 'trungcap').length}
            </Text>
            <Text className="text-xs text-gray-500">Trung cáº¥p</Text>
          </Box>
          <Box className="bg-white p-3 rounded-lg text-center">
            <Text className="text-lg font-bold text-purple-600">
              {majorsData.filter(m => m.educationLevel === 'caodang-lienthong').length}
            </Text>
            <Text className="text-xs text-gray-500">Cao Ä‘áº³ng liÃªn thÃ´ng</Text>
          </Box>
        </Box>

        <Box className="mb-4">
          <Text className="text-gray-600">
            Hiá»ƒn thá»‹ {filteredMajors.length} trong {majorsData.length} ngÃ nh há»c
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
                  <Text className="text-sm text-gray-500">MÃ£ ngÃ nh:</Text>
                  <Text className="text-sm font-medium">{major.code}</Text>
                </Box>
                
                <Box className="flex items-center justify-between">
                  <Text className="text-sm text-gray-500">Thá»i gian:</Text>
                  <Text className="text-sm font-medium">{major.duration}</Text>
                </Box>
                
                <Box className="flex items-center justify-between">
                  <Text className="text-sm text-gray-500">Há»c phÃ­:</Text>
                  <Text className="text-sm font-medium text-green-600">
                    {formatCurrency(major.tuitionFee)}
                  </Text>
                </Box>

                {major.website && (
                  <Box className="flex items-center justify-between">
                    <Text className="text-sm text-gray-500">Website:</Text>
                    <Text className="text-sm text-blue-600">ðŸŒ Xem chi tiáº¿t</Text>
                  </Box>
                )}
              </Box>

              <Button 
                variant="primary" 
                size="small"
                fullWidth
                onClick={() => handleMajorClick(major.id)}
              >
                Xem chi tiáº¿t
              </Button>
            </Box>
          ))}
        </Box>

        {filteredMajors.length === 0 && (
          <Box className="text-center py-12">
            <Text className="text-6xl mb-4">ðŸ”</Text>
            <Text className="text-gray-500 mb-2">KhÃ´ng tÃ¬m tháº¥y ngÃ nh há»c</Text>
            <Text className="text-gray-400 text-sm">
              Thá»­ thay Ä‘á»•i tá»« khÃ³a tÃ¬m kiáº¿m hoáº·c bá»™ lá»c
            </Text>
          </Box>
        )}

        <Box className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center">
          <Text.Title className="mb-2 text-white">ðŸŽ“ Sáºµn sÃ ng Ä‘Äƒng kÃ½?</Text.Title>
          <Text className="mb-4 text-blue-100">
            KhÃ¡m phÃ¡ cÆ¡ há»™i há»c táº­p táº¡i TrÆ°á»ng Cao Ä‘áº³ng BÃ¡ch khoa Nam SÃ i Gon
          </Text>
          <Button 
            variant="secondary"
            onClick={() => navigate('/admission-registration')}
          >
            ÄÄƒng kÃ½ tuyá»ƒn sinh ngay
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default MajorsPage;
