import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header } from "zmp-ui";
import { openWebview } from "zmp-sdk/apis";
import { useNavigate, useParams } from "react-router-dom";
import { DataManager, Major } from "@/utils/data-manager";

function MajorDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [major, setMajor] = useState<Major | null>(null);
  const [loading, setLoading] = useState(true);

  // Get major-specific image based on major code/category
  const getMajorImage = (majorCode: string) => {
    const code = majorCode.toLowerCase();
    if (code.includes('cntt') || code.includes('it') || code.includes('tin')) {
      return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80';
    }
    if (code.includes('kt') || code.includes('kinh') || code.includes('tai')) {
      return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80';
    }
    if (code.includes('xd') || code.includes('xay') || code.includes('dung')) {
      return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80';
    }
    if (code.includes('co') || code.includes('may') || code.includes('dien')) {
      return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';
    }
    if (code.includes('y') || code.includes('duoc') || code.includes('sk')) {
      return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80';
    }
    return null;
  };

  // Get major-specific icon based on major code/category
  const getMajorIcon = (majorCode: string) => {
    const code = majorCode.toLowerCase();
    if (code.includes('cntt') || code.includes('it') || code.includes('tin')) {
      return '💻';
    }
    if (code.includes('kt') || code.includes('kinh') || code.includes('tai')) {
      return '💼';
    }
    if (code.includes('xd') || code.includes('xay') || code.includes('dung')) {
      return '🏗️';
    }
    if (code.includes('co') || code.includes('may') || code.includes('dien')) {
      return '⚙️';
    }
    if (code.includes('y') || code.includes('duoc') || code.includes('sk')) {
      return '⚕️';
    }
    if (code.includes('ngoai') || code.includes('anh') || code.includes('nn')) {
      return '🌍';
    }
    return '🎓';
  };

  useEffect(() => {
    const loadMajorDetail = async () => {
      try {
        if (id) {
          const { getMajors } = await import('@/utils/api');
          const allMajors = await getMajors();
          const foundMajor = allMajors.find((m: any) => 
            String(m.id) === String(id) || 
            (m.code && m.code.toLowerCase() === id.toLowerCase()) ||
            (m.code && m.code.toLowerCase().includes(id.toLowerCase()))
          );
          
          if (foundMajor) {
            setMajor(foundMajor);
          }
        }
      } catch (error) {
        console.error("Error loading major detail:", error);
      } finally {
        setLoading(false);
      }
    };

loadMajorDetail();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleRegister = () => {
    if (major) {
      console.log('🎯 Navigating to registration with major:', major.name, major.id);  
      navigate(`/admission-registration?majorId=${major.id}&majorName=${encodeURIComponent(major.name)}`);
    }
  };

  if (loading) {
    return (
      <Page className="bg-gray-50">
        <Header 
          title="Chi tiết ngành học"
          showBackIcon={true}
          onBackClick={() => navigate(-1)}
          className="bg-blue-600 text-white"
        />
        <Box className="p-4 text-center">
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (!major) {
    return (
      <Page className="bg-gray-50">
        <Header 
          title="Chi tiết ngành học"
          showBackIcon={true}
          onBackClick={() => navigate(-1)}
          className="bg-blue-600 text-white"
        />
        <Box className="p-4 text-center">
          <Icon icon="zi-info-circle" size={48} className="text-gray-400 mb-4" />
          <Text className="text-gray-500">Không tìm thấy thông tin ngành học</Text>
          <Button 
            className="mt-4"
            onClick={() => navigate("/majors")}
          >
            Quay lại danh sách ngành
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50">
      <Header 
        title={major.name}
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />

      {/* Spacing to prevent header overlap */}
      <Box className="h-4"></Box>

      {/* Hero Image & Title - Major representations */}
      <Box className="mx-4 mb-4">
        <Box 
          className="relative h-64 bg-cover bg-center rounded-lg overflow-hidden shadow-lg"
          style={{ 
            backgroundImage: `url(${major.imageUrl || getMajorImage(major.code) || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'})` 
          }}
        >
          <Box className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
            <Box className="w-full">
              <Box className="flex items-center mb-2">
                <Box className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4">
                  <Text className="text-3xl">{getMajorIcon(major.code)}</Text>
                </Box>
                <Box className="flex-1">
                  <Text.Title className="text-white text-2xl font-bold mb-1">
                    {major.name}
                  </Text.Title>
                  <Text className="text-blue-100 text-sm">
                    Mã ngành: {major.code}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Quick Info Cards */}
      <Box className="mx-4 mb-4">
        <Box className="grid grid-cols-2 gap-3">
          <Box className="bg-white rounded-lg p-4 shadow-sm">
            <Icon icon="zi-setting" className="text-blue-600 mb-2" />
            <Text className="text-sm text-gray-500">Thời gian đào tạo</Text>
            <Text.Title className="text-lg">{major.duration}</Text.Title>
          </Box>
          <Box className="bg-white rounded-lg p-4 shadow-sm">
            <Icon icon="zi-plus-circle" className="text-green-600 mb-2" />
            <Text className="text-sm text-gray-500">Học phí/năm</Text>
            <Text.Title className="text-lg text-green-600">
              {formatCurrency(major.tuitionFee)}
            </Text.Title>
          </Box>
        </Box>
      </Box>

      {/* Description */}
      <Box className="mx-4 mb-4 bg-white rounded-lg shadow-sm p-4">
        <Text.Title className="text-lg font-bold mb-3 text-gray-800">
          📝 Mô tả ngành học
        </Text.Title>
        <div
          className="text-gray-700 leading-relaxed text-sm"
          dangerouslySetInnerHTML={{ __html: major.description }}
        />
      </Box>

      {/* Education Level */}
      <Box className="mx-4 mb-4 bg-white rounded-lg shadow-sm p-4">
        <Text.Title className="text-lg font-bold mb-3 text-gray-800">
          🎓 Hệ đào tạo
        </Text.Title>
        <Box className="flex flex-wrap gap-2">
          <Box className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {major.educationLevel === 'caodang' ? 'Cao đẳng' : 
             major.educationLevel === 'trungcap' ? 'Trung cấp' :
             major.educationLevel === 'caodang-lienthong' ? 'Cao đẳng liên thông' : 
             major.educationLevel}
          </Box>
        </Box>
      </Box>

      {/* Subjects */}
      <Box className="mx-4 mb-4 bg-white rounded-lg shadow-sm p-4">
        <Text.Title className="text-lg font-bold mb-3 text-gray-800">
          📚 Môn học chính
        </Text.Title>
        <Box className="space-y-2">
          {major.subjects && major.subjects.length > 0 ? (
            major.subjects.map((subject, index) => (
              <Box key={index} className="flex items-start">
                <Icon icon="zi-check-circle" className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <Text className="text-gray-700">{subject}</Text>
              </Box>
            ))
          ) : (
            <Text className="text-gray-500">Chưa có thông tin môn học.</Text>
          )}
        </Box>
      </Box>

      {/* Career Prospects */}
      <Box className="mx-4 mb-4 bg-white rounded-lg shadow-sm p-4">
        <Text.Title className="text-lg font-bold mb-3 text-gray-800">
          🚀 Cơ hội nghề nghiệp
        </Text.Title>
        <Box className="space-y-2">
          {major.careerProspects && major.careerProspects.length > 0 ? (
            (() => {
              const joined = major.careerProspects.join('\n');
              if (joined.includes('<')) {
                return <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: joined }} />;
              }
              return (
                <Box className="space-y-2">
                  {major.careerProspects.map((prospect, index) => (
                    <Box key={index} className="flex items-start">
                      <Icon icon="zi-star" className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <Text className="text-gray-700">{prospect}</Text>
                    </Box>
                  ))}
                </Box>
              );
            })()
          ) : (
            <Text className="text-gray-500">Chưa có thông tin cơ hội nghề nghiệp.</Text>
          )}
        </Box>
      </Box>

      {/* Program Details */}
      {major.website && (
        <Box className="mx-4 mb-4 bg-white rounded-lg shadow-sm p-4">
          <Text.Title className="text-lg font-bold mb-3 text-gray-800">
            📋 Chương trình chi tiết
          </Text.Title>
          <Button 
            variant="secondary"
            fullWidth
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            onClick={() => openWebview({ url: major.website! })}
          >
            <Icon icon="zi-calendar" className="mr-2" />
            Xem chương trình đào tạo chi tiết
          </Button>
        </Box>
      )}

      {/* Action Buttons */}
      <Box className="mx-4 mb-8">
        <Box className="bg-white rounded-lg shadow-sm p-4">
          <Box className="space-y-3">
            <Button 
              fullWidth
              variant="primary"
              className="bg-blue-600"
              onClick={handleRegister}
            >
              <Icon icon="zi-edit" className="mr-2" />
              Đăng ký ngành này
            </Button>
            <Box className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary"
                onClick={() => navigate("/majors")}
              >
                <Icon icon="zi-arrow-left" className="mr-1" />
                Quay lại
              </Button>
              <Button 
                variant="secondary"
                onClick={() => openWebview({ url: "https://dkts.namsaigon.edu.vn" })}
              >
                <Icon icon="zi-location" className="mr-1" />
                Website
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom padding for navigation */}
      <Box className="h-20"></Box>
    </Page>
  );
}

export default MajorDetailPage;
