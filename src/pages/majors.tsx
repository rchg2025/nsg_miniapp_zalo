import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header, Input } from "zmp-ui";
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
        const { getMajors } = await import("@/utils/api");
        const majors = await getMajors();
        setMajorsData(majors);
      } catch (e) {
        console.error("Lỗi tải ngành:", e);
      }
    };
    loadMajors();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminMajorsList") {
        loadMajors();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
      case "caodang":
        return "Cao đẳng";
      case "trungcap":
        return "Trung cấp";
      case "caodang-lienthong":
        return "Cao đẳng liên thông";
      default:
        return level;
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount || isNaN(amount)) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
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
        <Box className="space-y-3 mb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm ngành học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </Box>

        {/* Horizontal level tabs - dynamic from data */}
        <Box className="bg-white border-b border-gray-200 -mx-4 mb-4">
          <Box className="overflow-x-auto">
            <Box className="flex space-x-1 px-4 py-3 min-w-max">
              {[{ key: "all", label: "Tất cả" }, ...Array.from(new Set(majorsData.map(m => m.educationLevel))).filter(Boolean).map(lvl => ({ key: lvl, label: getEducationLevelText(lvl) }))].map((tab) => (
                <Button
                  key={tab.key}
                  size="small"
                  variant={selectedLevel === tab.key ? "primary" : "secondary"}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 ${selectedLevel === tab.key ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600"}`}
                  onClick={() => setSelectedLevel(tab.key)}
                >
                  {tab.label}
                  {tab.key !== "all" && (
                    <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                      {majorsData.filter(m => m.educationLevel === tab.key).length}
                    </span>
                  )}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        <Box className="mb-4">
          <Text className="text-gray-600">
            Hiển thị {filteredMajors.length} trong {majorsData.length} ngành học
          </Text>
        </Box>

        <Box className="space-y-4">
          {filteredMajors.map((major) => (
            <Box className="bg-white rounded-lg overflow-hidden shadow-sm border" key={major.id}>
              {major.imageUrl && (
                <img
                  src={major.imageUrl}
                  alt={major.name}
                  className="w-full h-36 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <Box className="p-4">
              <Box className="mb-2 flex items-center justify-between">
                <Text.Title>{major.name}</Text.Title>
                <Box className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {getEducationLevelText(major.educationLevel)}
                </Box>
              </Box>

              <Text className="text-gray-600 text-sm mb-3">{major.description ? major.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 120) + (major.description.replace(/<[^>]*>/g, '').length > 120 ? '...' : '') : ''}</Text>

              <Box className="space-y-2 mb-4">
                <Box className="flex items-center justify-between">
                  <Text className="text-sm text-gray-500">Mã ngành:</Text>
                  <Text className="text-sm font-medium">{major.code}</Text>
                </Box>

                <Box className="flex items-center justify-between">
                  <Text className="text-sm text-gray-500">Thời gian:</Text>
                  <Text className="text-sm font-medium">{major.duration || "Liên hệ"}</Text>
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
                    <Text className="text-sm text-blue-600">Xem chi tiết</Text>
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
            </Box>
          ))}
        </Box>

        {filteredMajors.length === 0 && (
          <Box className="text-center py-12">
            <Text className="text-gray-500 mb-2">Không tìm thấy ngành học</Text>
            <Text className="text-gray-400 text-sm">
              Thử thay đổi từ khóa tìm kiếm hoặc bỏ lọc
            </Text>
          </Box>
        )}

        <Box className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center">
          <Text.Title className="mb-2 text-white">Sẵn sàng đăng ký?</Text.Title>
          <Text className="mb-4 text-blue-100">
            Khám phá cơ hội học tập tại Trường Cao đẳng Bách khoa Nam Sài Gòn
          </Text>
          <Button
            variant="secondary"
            onClick={() => navigate("/admission-registration")}
          >
            Đăng ký tuyển sinh ngay
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default MajorsPage;
