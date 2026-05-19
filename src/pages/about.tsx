import React from "react";
import { Box, Button, Icon, Page, Text, Header } from "zmp-ui";
import { useNavigate } from "react-router-dom";

function AboutPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📰",
      title: "Tin tức & Thông báo",
      description: "Cập nhật tin tức mới nhất từ trường và các thông báo quan trọng"
    },
    {
      icon: "🎓",
      title: "Ngành đào tạo",
      description: "Khám phá các ngành học với thông tin chi tiết về chương trình và cơ hội việc làm"
    },
    {
      icon: "📋",
      title: "Đăng ký tuyển sinh",
      description: "Nộp hồ sơ tuyển sinh trực tuyến một cách nhanh chóng và tiện lợi"
    },
    {
      icon: "🔔",
      title: "Thông báo thông minh",
      description: "Nhận thông báo kịp thời về các sự kiện và hoạt động của trường"
    },
    {
      icon: "👤",
      title: "Quản lý cá nhân",
      description: "Cập nhật thông tin cá nhân và theo dõi các hoạt động của bạn"
    },
    {
      icon: "⚙️",
      title: "Cài đặt linh hoạt",
      description: "Tùy chỉnh ứng dụng theo sở thích với nhiều tùy chọn cài đặt"
    }
  ];

  const contacts = [
    {
      icon: "zi-home",
      label: "Địa chỉ",
      value: "47 Cao Lỗ, Phường Chánh Hưng, TP. Hồ Chí Minh",
      color: "text-blue-600"
    },
    {
      icon: "zi-call",
      label: "Hotline",
      value: "0981146179",
      color: "text-green-600"
    },
    {
      icon: "zi-browser",
      label: "Website",
      value: "namsaigon.edu.vn",
      color: "text-purple-600"
    },
    {
      icon: "zi-chat",
      label: "Email",
      value: "info@namsaigon.edu.vn",
      color: "text-orange-600"
    }
  ];

  const developers = [
    {
      name: "Trường Cao đẳng Bách khoa Nam Sài Gòn",
      role: "Đơn vị phát triển",
      description: "Ứng dụng được phát triển bởi đội ngũ công nghệ thông tin của trường"
    }
  ];

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Về ứng dụng" 
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />
      
      <Box className="p-4 space-y-6">
        {/* App Info */}
        <Box className="bg-white rounded-lg p-6 text-center shadow-sm">
          <Box className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Text className="text-4xl">🎓</Text>
          </Box>
          <Text.Title className="text-xl font-bold mb-2">
            NSG News
          </Text.Title>
          <Text className="text-gray-600 mb-3">
            Ứng dụng thông tin tuyển sinh
          </Text>
          <Box className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Phiên bản 1.0.0
          </Box>
        </Box>

        {/* School Info */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text.Title className="text-lg font-bold mb-4 flex items-center">
            <Icon icon="zi-home" className="mr-2 text-blue-600" />
            Trường Cao đẳng Bách khoa Nam Sài Gòn
          </Text.Title>
          <Text className="text-gray-700 leading-relaxed mb-4">
            Trường Cao đẳng Bách khoa Nam Sài Gòn là một trong những cơ sở giáo dục uy tín 
            tại TP. Hồ Chí Minh, chuyên đào tạo các ngành kỹ thuật và công nghệ. 
            Với đội ngũ giảng viên giàu kinh nghiệm và cơ sở vật chất hiện đại, 
            trường cam kết mang đến chất lượng giáo dục tốt nhất cho sinh viên.
          </Text>
        </Box>

        {/* Features */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text.Title className="text-lg font-bold mb-4 flex items-center">
            <Icon icon="zi-star" className="mr-2 text-yellow-500" />
            Tính năng chính
          </Text.Title>
          <Box className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <Box key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Text className="text-2xl flex-shrink-0">{feature.icon}</Text>
                <Box>
                  <Text className="font-medium mb-1">{feature.title}</Text>
                  <Text className="text-sm text-gray-600">{feature.description}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Contact Info */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text.Title className="text-lg font-bold mb-4 flex items-center">
            <Icon icon="zi-chat" className="mr-2 text-green-600" />
            Thông tin liên hệ
          </Text.Title>
          <Box className="space-y-3">
            {contacts.map((contact, index) => (
              <Box key={index} className="flex items-center gap-3">
                <Icon icon={contact.icon as any} className={`${contact.color} flex-shrink-0`} />
                <Box>
                  <Text className="text-sm text-gray-500">{contact.label}</Text>
                  <Text className="font-medium">{contact.value}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Development Team */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text.Title className="text-lg font-bold mb-4 flex items-center">
            <Icon icon="zi-user" className="mr-2 text-purple-600" />
            Đội ngũ phát triển
          </Text.Title>
          {developers.map((dev, index) => (
            <Box key={index} className="p-3 bg-gray-50 rounded-lg">
              <Text className="font-medium mb-1">{dev.name}</Text>
              <Text className="text-sm text-blue-600 mb-2">{dev.role}</Text>
              <Text className="text-sm text-gray-600">{dev.description}</Text>
            </Box>
          ))}
        </Box>

        {/* Technical Info */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text.Title className="text-lg font-bold mb-4 flex items-center">
            <Icon icon="zi-setting" className="mr-2 text-gray-600" />
            Thông tin kỹ thuật
          </Text.Title>
          <Box className="grid grid-cols-2 gap-3 text-sm">
            <Box>
              <Text className="text-gray-500">Nền tảng</Text>
              <Text className="font-medium">Zalo Mini App</Text>
            </Box>
            <Box>
              <Text className="text-gray-500">Framework</Text>
              <Text className="font-medium">React + TypeScript</Text>
            </Box>
            <Box>
              <Text className="text-gray-500">UI Library</Text>
              <Text className="font-medium">ZMP UI</Text>
            </Box>
            <Box>
              <Text className="text-gray-500">Phiên bản</Text>
              <Text className="font-medium">1.0.0</Text>
            </Box>
          </Box>
        </Box>

        {/* Support Actions */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text.Title className="text-lg font-bold mb-4 flex items-center">
            <Icon icon="zi-help-circle" className="mr-2 text-blue-600" />
            Hỗ trợ
          </Text.Title>
          <Box className="space-y-3">
            <Button 
              variant="secondary" 
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <Icon icon="zi-setting" className="mr-3" />
              Cài đặt ứng dụng
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              <Icon icon="zi-user" className="mr-3" />
              Thông tin tài khoản
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full justify-start"
              onClick={() => window.open('https://namsaigon.edu.vn', '_blank')}
            >
              <Icon icon="zi-bookmark" className="mr-3" />
              Website chính thức
            </Button>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="text-center py-4">
          <Text className="text-gray-500 text-sm mb-2">
            © 2025 Trường Cao đẳng Bách khoa Nam Sài Gòn
          </Text>
          <Text className="text-gray-400 text-xs">
            Tất cả quyền được bảo lưu
          </Text>
        </Box>

        {/* Bottom padding for navigation */}
        <Box className="h-20"></Box>
      </Box>
    </Page>
  );
}

export default AboutPage;