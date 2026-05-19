import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header, List, Input, Modal } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, Major } from "@/utils/data-manager";

function AdminMajorsPage() {
  const navigate = useNavigate();
  const [majorsList, setMajorsList] = useState<Major[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    duration: '3 năm',
    tuitionFee: 15000000,
    subjects: '',
    careerProspects: '',
    admissionScore: 15.0,
    quota: 50,
    status: 'active' as 'active' | 'inactive',
    imageUrl: '',
    educationLevel: 'caodang' as 'caodang' | 'trungcap' | 'caodang-lienthong',
    website: ''
  });

  // Kiểm tra quyền admin
  useEffect(() => {
    const adminStatus = localStorage.getItem("admin_logged_in");
    if (adminStatus !== "true") {
      navigate("/profile");
      return;
    }

    loadMajors();
  }, [navigate]);

  const loadMajors = () => {
    const majorsData = DataManager.getMajors();
    setMajorsList(majorsData);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      duration: '3 năm',
      tuitionFee: 15000000,
      subjects: '',
      careerProspects: '',
      admissionScore: 15.0,
      quota: 50,
      status: 'active',
      imageUrl: '',
      educationLevel: 'caodang',
      website: ''
    });
  };

  const handleCreateMajor = () => {
    if (!formData.name || !formData.code || !formData.description) {
      alert('Vui lòng nhập đầy đủ thông tin cơ bản');
      return;
    }

    // Check if code already exists
    if (majorsList.some(m => m.code === formData.code)) {
      alert('Mã ngành đã tồn tại');
      return;
    }

    const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);
    const careersArray = formData.careerProspects.split(',').map(c => c.trim()).filter(c => c);

    const newMajor: Major = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code,
      description: formData.description,
      duration: formData.duration,
      tuitionFee: formData.tuitionFee,
      subjects: subjectsArray,
      careerProspects: careersArray,
      admissionScore: formData.admissionScore,
      quota: formData.quota,
      enrolled: 0,
      status: formData.status,
      createdAt: new Date().toISOString(),
      imageUrl: formData.imageUrl || undefined,
      educationLevel: formData.educationLevel,
      website: formData.website || undefined,
    };

    const updatedMajors = [newMajor, ...majorsList];
    DataManager.saveMajors(updatedMajors);
    setMajorsList(updatedMajors);
    resetForm();
    setShowCreateModal(false);
  };

  const handleEditMajor = (major: Major) => {
    setEditingMajor(major);
    setFormData({
      name: major.name,
      code: major.code,
      description: major.description,
      duration: major.duration,
      tuitionFee: major.tuitionFee,
      subjects: Array.isArray(major.subjects) ? major.subjects.join(', ') : '',
      careerProspects: Array.isArray(major.careerProspects) ? major.careerProspects.join(', ') : '',
      admissionScore: major.admissionScore,
      quota: major.quota,
      status: major.status,
      imageUrl: major.imageUrl || '',
      educationLevel: major.educationLevel,
      website: major.website || ''
    });
    setShowCreateModal(true);
  };

  const handleUpdateMajor = () => {
    if (!editingMajor) return;

    const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);
    const careersArray = formData.careerProspects.split(',').map(c => c.trim()).filter(c => c);

    const updatedMajors = majorsList.map(major => 
      major.id === editingMajor.id 
        ? { 
            ...major, 
            name: formData.name,
            code: formData.code,
            description: formData.description,
            duration: formData.duration,
            tuitionFee: formData.tuitionFee,
            subjects: subjectsArray,
            careerProspects: careersArray,
            admissionScore: formData.admissionScore,
            quota: formData.quota,
            status: formData.status,
            imageUrl: formData.imageUrl || undefined,
            educationLevel: formData.educationLevel,
            website: formData.website || undefined,
          }
        : major
    );
    
    DataManager.saveMajors(updatedMajors);
    setMajorsList(updatedMajors);
    setEditingMajor(null);
    resetForm();
    setShowCreateModal(false);
  };

  const handleDeleteMajor = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa ngành học này?')) {
      const updatedMajors = majorsList.filter(major => major.id !== id);
      DataManager.saveMajors(updatedMajors);
      setMajorsList(updatedMajors);
    }
  };

  const toggleStatus = (id: string) => {
    const updatedMajors = majorsList.map(major => 
      major.id === id ? { ...major, status: (major.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' } : major
    );
    DataManager.saveMajors(updatedMajors);
    setMajorsList(updatedMajors);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const getEnrollmentRate = (major: Major) => {
    const quota = Number(major.quota) || 0;
    const enrolled = Number(major.enrolled) || 0;
    return quota > 0 ? Math.round((enrolled / quota) * 100) : 0;
  };

  const getEducationLevelText = (level: string) => {
    switch (level) {
      case 'caodang': return 'Cao đẳng';
      case 'trungcap': return 'Trung cấp';
      case 'caodang-lienthong': return 'CĐ Liên thông';
      default: return 'Cao đẳng';
    }
  };  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Quản lý ngành học" 
        showBackIcon={true}
        className="bg-blue-600 text-white"
      />
      
      {/* Back Button */}
      <Box className="absolute top-4 left-4 z-20">
        <Button
          size="small"
          variant="tertiary"
          onClick={() => navigate("/admin")}
          className="bg-white/20 text-white rounded-full"
        >
          ← Quay lại
        </Button>
      </Box>

      <Box className="p-4">
        {/* Header actions */}
        <Box className="flex justify-between items-center mb-4">
          <Text.Title>Danh sách ngành học ({majorsList.length})</Text.Title>
          <Button 
            variant="primary"
            size="small"
            onClick={() => {
              resetForm();
              setEditingMajor(null);
              setShowCreateModal(true);
            }}
          >
            + Thêm ngành
          </Button>
        </Box>

        {/* Stats */}
        <Box className="grid grid-cols-4 gap-3 mb-4">
          <Box className="bg-white p-3 rounded text-center">
            <Text className="text-lg font-bold text-green-600">
              {majorsList.filter(m => m.status === 'active').length}
            </Text>
            <Text className="text-xs text-gray-500">Đang tuyển</Text>
          </Box>
          <Box className="bg-white p-3 rounded text-center">
            <Text className="text-lg font-bold text-blue-600">
              {majorsList.reduce((sum, m) => sum + (Number(m.quota) || 0), 0)}
            </Text>
            <Text className="text-xs text-gray-500">Chỉ tiêu</Text>
          </Box>
          <Box className="bg-white p-3 rounded text-center">
            <Text className="text-lg font-bold text-purple-600">
              {majorsList.reduce((sum, m) => sum + (Number(m.enrolled) || 0), 0)}
            </Text>
            <Text className="text-xs text-gray-500">Đã tuyển</Text>
          </Box>
          <Box className="bg-white p-3 rounded text-center">
            <Text className="text-lg font-bold text-orange-600">
              {majorsList.length > 0 ? Math.round(
                majorsList.reduce((sum, m) => {
                  const quota = Number(m.quota) || 0;
                  const enrolled = Number(m.enrolled) || 0;
                  return sum + (quota > 0 ? (enrolled / quota) * 100 : 0);
                }, 0) / majorsList.length
              ) : 0}%
            </Text>
            <Text className="text-xs text-gray-500">Tỷ lệ tuyển</Text>
          </Box>
        </Box>

        {/* Majors List */}
        <List>
          {majorsList.map((major) => (
            <List.Item
              key={major.id}
              title={`${major.name} (${major.code})`}
              subTitle={`${getEducationLevelText(major.educationLevel)} • ${major.duration} • ${formatCurrency(major.tuitionFee)} • ${major.enrolled}/${major.quota} sinh viên • ${major.status === 'active' ? 'Đang tuyển' : 'Tạm dừng'}`}
              prefix={
                major.imageUrl ? (
                  <img 
                    src={major.imageUrl} 
                    alt={major.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <Box className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Text className="text-gray-500 text-xs">📚</Text>
                  </Box>
                )
              }
              suffix={
                <Box className="flex gap-2">
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => toggleStatus(major.id)}
                    className={major.status === 'active' ? "text-orange-600" : "text-green-600"}
                  >
                    {major.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => handleEditMajor(major)}
                  >
                    Sửa
                  </Button>
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => handleDeleteMajor(major.id)}
                    className="text-red-600"
                  >
                    Xóa
                  </Button>
                </Box>
              }
            />
          ))}
        </List>

        {majorsList.length === 0 && (
          <Box className="text-center py-8">
            <Text className="text-gray-500">Chưa có ngành học nào</Text>
          </Box>
        )}
      </Box>

      {/* Create/Edit Modal */}
      <Modal
        visible={showCreateModal}
        title={editingMajor ? "Chỉnh sửa ngành học" : "Thêm ngành học mới"}
        onClose={() => {
          setShowCreateModal(false);
          setEditingMajor(null);
          resetForm();
        }}
        actions={[
          {
            text: "Hủy",
            close: true,
            highLight: false,
          },
          {
            text: editingMajor ? "Cập nhật" : "Thêm mới",
            highLight: true,
            onClick: editingMajor ? handleUpdateMajor : handleCreateMajor,
          },
        ]}
      >
        <Box className="space-y-4 max-h-96 overflow-y-auto">
          <Box className="grid grid-cols-2 gap-3">
            <Box>
              <Text className="mb-2 font-medium">Tên ngành</Text>
              <Input
                placeholder="Công nghệ Thông tin"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Box>
            <Box>
              <Text className="mb-2 font-medium">Mã ngành</Text>
              <Input
                placeholder="CNTT01"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
              />
            </Box>
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Mô tả ngành học</Text>
            <Input.TextArea
              placeholder="Mô tả chi tiết về ngành học"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </Box>

          <Box className="grid grid-cols-3 gap-3">
            <Box>
              <Text className="mb-2 font-medium">Hệ tuyển sinh</Text>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({...formData, educationLevel: e.target.value as 'caodang' | 'trungcap' | 'caodang-lienthong'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="caodang">Cao đẳng</option>
                <option value="trungcap">Trung cấp</option>
                <option value="caodang-lienthong">Cao đẳng liên thông</option>
              </select>
            </Box>
            <Box>
              <Text className="mb-2 font-medium">Thời gian đào tạo</Text>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2 năm">2 năm</option>
                <option value="2.5 năm">2.5 năm</option>
                <option value="3 năm">3 năm</option>
                <option value="3.5 năm">3.5 năm</option>
                <option value="4 năm">4 năm</option>
              </select>
            </Box>
            <Box>
              <Text className="mb-2 font-medium">Học phí (VNĐ/năm)</Text>
              <Input
                type="number"
                placeholder="15000000"
                value={formData.tuitionFee}
                onChange={(e) => setFormData({...formData, tuitionFee: parseInt(e.target.value) || 0})}
              />
            </Box>
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Môn học chính (cách nhau bằng dấu phẩy)</Text>
            <Input.TextArea
              placeholder="Lập trình C/C++, Java, Database, Mạng máy tính"
              value={formData.subjects}
              onChange={(e) => setFormData({...formData, subjects: e.target.value})}
              rows={2}
            />
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Cơ hội nghề nghiệp (cách nhau bằng dấu phẩy)</Text>
            <Input.TextArea
              placeholder="Lập trình viên, Quản trị hệ thống, Chuyên viên IT"
              value={formData.careerProspects}
              onChange={(e) => setFormData({...formData, careerProspects: e.target.value})}
              rows={2}
            />
          </Box>

          <Box className="grid grid-cols-2 gap-3">
            <Box>
              <Text className="mb-2 font-medium">Điểm chuẩn</Text>
              <Input
                type="number"
                step="0.1"
                placeholder="18.5"
                value={formData.admissionScore}
                onChange={(e) => setFormData({...formData, admissionScore: parseFloat(e.target.value) || 0})}
              />
            </Box>
            <Box>
              <Text className="mb-2 font-medium">Chỉ tiêu tuyển sinh</Text>
              <Input
                type="number"
                placeholder="50"
                value={formData.quota}
                onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value) || 0})}
              />
            </Box>
          </Box>

          <Box className="grid grid-cols-2 gap-3">
            <Box>
              <Text className="mb-2 font-medium">URL ảnh minh họa</Text>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
              {formData.imageUrl && (
                <Box className="mt-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box>
              <Text className="mb-2 font-medium">Website liên quan</Text>
              <Input
                placeholder="https://cntt.nsg.edu.vn"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
              {formData.website && (
                <Box className="mt-2">
                  <Text className="text-xs text-blue-600">
                    🌐 {formData.website}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          <Box>
            <Text className="mb-2 font-medium">Trạng thái</Text>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Đang tuyển sinh</option>
              <option value="inactive">Tạm dừng tuyển sinh</option>
            </select>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
}

export default AdminMajorsPage;