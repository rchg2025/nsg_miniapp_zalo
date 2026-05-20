import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header, Input, DatePicker } from "zmp-ui";
import { openChat, getUserInfo, followOA, openWebview } from "zmp-sdk/apis";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { DataManager, Major, AdmissionApplication } from "@/utils/data-manager";
import { getMajors as getMajorsFromAPI, API_BASE_URL } from "@/utils/api";

function AdmissionRegistrationPage() {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const [searchParams] = useSearchParams();
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [majorSearch, setMajorSearch] = useState('');
  const [showMajorList, setShowMajorList] = useState(false);
  
  const [formData, setFormData] = useState({
    majorId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    idCard: '',
    dateOfBirth: '',
    address: '',
    educationLevel: '' as string,
    graduationYear: '',
    school: '',
    academicScore: '',
    note: ''
  });

  const [documents, setDocuments] = useState({
    transcript: false,
    certificate: false,
    idCard: false,
    photos: false
  });

  useEffect(() => {
    // Load majors from API
    getMajorsFromAPI().then(data => {
      setMajors(data);
    }).catch(err => {
      console.error('Failed to load majors from API, using local fallback:', err);
      setMajors(DataManager.getMajors());
    });
    console.log('🎓 Loading majors for registration...');

    // Get majorId from URL parameter
    const majorIdFromUrl = searchParams.get('majorId');
    const majorNameFromUrl = searchParams.get('majorName');
    
    if (majorIdFromUrl) {
      console.log('🎯 Auto-selecting major from URL:', majorIdFromUrl, majorNameFromUrl);
      setFormData(prev => ({
        ...prev,
        majorId: majorIdFromUrl
      }));
      
      // Show notification that major was auto-selected
      if (majorNameFromUrl) {
        setTimeout(() => {
          alert(`✅ Đã tự động chọn ngành: ${decodeURIComponent(majorNameFromUrl)}`);
        }, 500);
      }
    }

    // Automatically collect Zalo user data and pre-fill form
    const loadZaloUserData = async () => {
      try {
        const zaloUser = await getUserInfo({ autoRequestPermission: true });
        if (zaloUser?.userInfo) {
          setFormData(prev => ({
            ...prev,
            fullName: zaloUser.userInfo.name || userInfo?.name || '',
            phoneNumber: '',
            email: ''
          }));
          
          // Save Zalo user data for admin analytics
          const userData = {
            zaloId: zaloUser.userInfo.id,
            name: zaloUser.userInfo.name,
            avatar: zaloUser.userInfo.avatar,
            accessTime: new Date().toISOString(),
            pageAccessed: 'admission-registration'
          };
          
          localStorage.setItem(`admission_user_${zaloUser.userInfo.id}`, JSON.stringify(userData));
          console.log('📋 Admission user data collected:', userData);
        }
      } catch (error) {
        console.log('ℹ️ Using fallback user info:', error);
        // Fallback to context user info
        if (userInfo) {
          setFormData(prev => ({
            ...prev,
            fullName: userInfo.name || '',
            phoneNumber: '',
            email: ''
          }));
        }
      }
    };

    loadZaloUserData();
  }, [userInfo, searchParams]);

  useEffect(() => {
    // Update selected major when majorId changes
    if (formData.majorId) {
      const major = majors.find(m => m.id === formData.majorId);
      setSelectedMajor(major || null);
    } else {
      setSelectedMajor(null);
    }
  }, [formData.majorId, majors]);

  const getEducationLevelText = (level: string) => {
    switch (level) {
      case 'caodang': return 'Cao đẳng';
      case 'trungcap': return 'Trung cấp';
      case 'caodang-lienthong': return 'Cao đẳng liên thông';
      default: return 'Cao đẳng';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.majorId || !formData.fullName || !formData.phoneNumber || 
        !formData.idCard || !formData.dateOfBirth || !formData.address ||
        !formData.graduationYear || !formData.school) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate date format dd/mm/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(formData.dateOfBirth)) {
      alert('Vui lòng nhập ngày sinh đúng định dạng dd/mm/yyyy');
      return;
    }

    // Validate date values
    const dateParts = formData.dateOfBirth.match(dateRegex);
    if (dateParts) {
      const day = parseInt(dateParts[1]);
      const month = parseInt(dateParts[2]);
      const year = parseInt(dateParts[3]);
      
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
        alert('Ngày sinh không hợp lệ');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Convert date from dd/mm/yyyy to ISO format
      const convertDateToISO = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };

      // Send to API server
      const appPayload = {
        student_name: formData.fullName,
        date_of_birth: convertDateToISO(formData.dateOfBirth),
        phone: formData.phoneNumber,
        email: formData.email,
        major_code: selectedMajor?.code || formData.majorId,
        major_name: selectedMajor?.name || '',
        high_school: formData.school,
        id_card: formData.idCard,
        address: formData.address,
        graduation_year: formData.graduationYear,
        notes: formData.note,
        desired_education_level: formData.educationLevel,
        zalo_id: (userInfo as any)?.id || ''
      };
      const apiRes = await fetch(`${API_BASE_URL}/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appPayload)
      });
      if (!apiRes.ok) {
        const err = await apiRes.json().catch(() => ({}));
        throw new Error(err.error || `Lỗi ${apiRes.status}`);
      }

      // Automatically follow Zalo OA for admission updates
      try {
        await followOA({ id: "297335769392043040" });
        console.log('✅ User automatically followed NSG Zalo OA');
      } catch (error) {
        console.log('ℹ️ Could not auto-follow OA:', error);
      }

      // Send welcome message to Zalo OA
      try {
        await openChat({
          type: "oa",
          id: "297335769392043040",
          message: `Xin chào! Tôi vừa đăng ký tuyển sinh ngành ${selectedMajor?.name}. Mong nhận được hướng dẫn tiếp theo.`
        });
      } catch (error) {
        console.log('ℹ️ Could not send welcome message:', error);
      }

      alert('Đơn đăng ký đã được gửi thành công! Bạn đã được kết nối với Zalo OA nhà trường để nhận thông báo cập nhật.');
      
      // Reset form
      setFormData({
        majorId: '',
        fullName: userInfo?.name || '',
        phoneNumber: '',
        email: '',
        idCard: '',
        dateOfBirth: '',
        address: '',
        educationLevel: '',
        graduationYear: '',
        school: '',
        academicScore: '',
        note: ''
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Có lỗi khi gửi đơn đăng ký. Vui lòng thử lại.');
    }

    setIsSubmitting(false);
  };

  const handleContactSupport = async () => {
    try {
      await openWebview({ url: "https://zalo.me/namsaigon" });
    } catch (error) {
      // Fallback: mở chat OA trực tiếp
      try {
        await openChat({
          type: "oa",
          id: "297335769392043040",
          message: "Xin chào! Tôi cần hỗ trợ về tuyển sinh."
        });
      } catch (e) {
        console.error('Error opening contact:', e);
      }
    }
  };

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Đăng ký tuyển sinh" 
        showBackIcon={true}
        className="bg-blue-600 text-white"
      />
      
      <Box className="p-4 space-y-6">
        {/* Major Selection */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">🎓 Chọn ngành học</Text.Title>
          
          <Box className="mb-4">
            <Text className="mb-2 font-medium">Ngành học *</Text>
            {/* Searchable major dropdown */}
            <Box
              className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
              onClick={() => { setShowMajorList(true); setMajorSearch(''); }}
            >
              {selectedMajor ? (
                <Text className="text-sm flex-1">
                  {selectedMajor.name} ({selectedMajor.code}) - {getEducationLevelText(selectedMajor.educationLevel)}
                </Text>
              ) : (
                <Text className="text-sm text-gray-400 flex-1">Chọn ngành học</Text>
              )}
              <Text className="text-gray-400 ml-2">▾</Text>
            </Box>

            {showMajorList && (
              <Box
                className="fixed inset-0 z-50 flex items-end bg-black/40"
                onClick={() => setShowMajorList(false)}
              >
                <Box
                  className="w-full bg-white rounded-t-2xl shadow-xl"
                  style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <Box className="flex items-center justify-between px-4 py-3 border-b">
                    <Text className="font-semibold text-gray-700">Chọn ngành học</Text>
                    <Box
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer"
                      onClick={() => setShowMajorList(false)}
                    >
                      <Text className="text-gray-500 text-sm">✕</Text>
                    </Box>
                  </Box>
                  {/* Search input */}
                  <Box className="px-4 py-2 border-b">
                    <input
                      autoFocus
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Gõ tên hoặc mã ngành để tìm kiếm..."
                      value={majorSearch}
                      onChange={(e) => setMajorSearch(e.target.value)}
                    />
                  </Box>
                  {/* List */}
                  <Box style={{ overflowY: 'auto', flex: 1 }}>
                    {majors
                      .filter(m =>
                        majorSearch === '' ||
                        m.name.toLowerCase().includes(majorSearch.toLowerCase()) ||
                        (m.code || '').toLowerCase().includes(majorSearch.toLowerCase())
                      )
                      .map(major => (
                        <Box
                          key={major.id}
                          className={`px-4 py-3 border-b cursor-pointer flex items-center justify-between ${
                            formData.majorId === major.id ? 'bg-blue-50' : 'active:bg-gray-50'
                          }`}
                          onClick={() => {
                            setSelectedMajor(major);
                            setFormData(prev => ({ ...prev, majorId: major.id, educationLevel: major.educationLevel || '' }));
                            setShowMajorList(false);
                            setMajorSearch('');
                          }}
                        >
                          <Text className={`text-sm ${formData.majorId === major.id ? 'text-blue-600 font-medium' : 'text-gray-800'}`}>
                            {major.name} ({major.code}) - {getEducationLevelText(major.educationLevel)}
                          </Text>
                          {formData.majorId === major.id && (
                            <Text className="text-blue-500 ml-2">✓</Text>
                          )}
                        </Box>
                      ))}
                    {majors.filter(m =>
                      majorSearch === '' ||
                      m.name.toLowerCase().includes(majorSearch.toLowerCase()) ||
                      (m.code || '').toLowerCase().includes(majorSearch.toLowerCase())
                    ).length === 0 && (
                      <Box className="p-6 text-center">
                        <Text className="text-gray-400 text-sm">Không tìm thấy ngành học phù hợp</Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {selectedMajor && (
            <Box className="bg-blue-50 p-4 rounded-lg">
              <Box className="flex items-start gap-3">
                {selectedMajor.imageUrl ? (
                  <img 
                    src={selectedMajor.imageUrl} 
                    alt={selectedMajor.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <Box className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Text className="text-2xl">📚</Text>
                  </Box>
                )}
                
                <Box className="flex-1">
                  <Text className="font-bold text-blue-800">{selectedMajor.name}</Text>
                  <Text className="text-sm text-blue-600 mb-2">
                    {getEducationLevelText(selectedMajor.educationLevel)} • {selectedMajor.duration}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-2">
                    {selectedMajor.description}
                  </Text>
                  <Text className="text-sm font-medium text-green-600">
                    Học phí: {formatCurrency(selectedMajor.tuitionFee)}/năm
                  </Text>
                  {selectedMajor.website && (
                    <Text className="text-sm text-blue-600 mt-1">
                      🌐 {selectedMajor.website}
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Personal Information */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">👤 Thông tin cá nhân</Text.Title>
          
          <Box className="space-y-4">
            <Box>
              <Text className="mb-2 font-medium">Họ và tên *</Text>
              <Input
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </Box>

            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Số điện thoại *</Text>
                <Input
                  placeholder="0901234567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Email</Text>
                <Input
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </Box>
            </Box>

            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">CMND/CCCD *</Text>
                <Input
                  placeholder="123456789"
                  value={formData.idCard}
                  onChange={(e) => setFormData({...formData, idCard: e.target.value})}
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Ngày sinh *</Text>
                <Input
                  placeholder="dd/mm/yyyy"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ''); // Chỉ giữ lại số
                    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2);
                    if (value.length >= 5) value = value.substring(0, 5) + '/' + value.substring(5, 9);
                    setFormData({...formData, dateOfBirth: value});
                  }}
                  maxLength={10}
                />
              </Box>
            </Box>

            <Box>
              <Text className="mb-2 font-medium">Địa chỉ *</Text>
              <Input.TextArea
                placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={2}
              />
            </Box>
          </Box>
        </Box>

        {/* Education Information */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">🎒 Thông tin học vấn</Text.Title>
          
          <Box className="space-y-4">
            <Box className="grid grid-cols-2 gap-3">
              <Box>
                <Text className="mb-2 font-medium">Năm tốt nghiệp *</Text>
                <Input
                  type="number"
                  placeholder="2024"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                />
              </Box>
              <Box>
                <Text className="mb-2 font-medium">Điểm trung bình</Text>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  value={formData.academicScore}
                  onChange={(e) => setFormData({...formData, academicScore: e.target.value})}
                />
              </Box>
            </Box>

            <Box>
              <Text className="mb-2 font-medium">Trường học *</Text>
              <Input
                placeholder="THPT Nguyễn Du"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
              />
            </Box>

            <Box>
              <Text className="mb-2 font-medium">Ghi chú</Text>
              <Input.TextArea
                placeholder="Thông tin bổ sung, sở thích, định hướng nghề nghiệp..."
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                rows={3}
              />
            </Box>
          </Box>
        </Box>

        {/* Documents Upload */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title className="mb-4">📁 Hồ sơ nộp kèm</Text.Title>
          
          <Box className="space-y-4">
            <Text className="text-sm text-gray-600">
              Đánh dấu các loại hồ sơ bạn đã chuẩn bị và sẽ nộp trực tiếp tại trường:
            </Text>
            
            <Box className="space-y-3">
              <Box className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Box>
                  <Text className="font-medium">📊 Bảng điểm THPT</Text>
                  <Text className="text-sm text-gray-600">Bản sao có công chứng</Text>
                </Box>
                <input
                  type="checkbox"
                  checked={documents.transcript}
                  onChange={(e) => setDocuments({...documents, transcript: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </Box>

              <Box className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Box>
                  <Text className="font-medium">🎓 Bằng tốt nghiệp THPT</Text>
                  <Text className="text-sm text-gray-600">Bản sao có công chứng</Text>
                </Box>
                <input
                  type="checkbox"
                  checked={documents.certificate}
                  onChange={(e) => setDocuments({...documents, certificate: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </Box>

              <Box className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Box>
                  <Text className="font-medium">🆔 CMND/CCCD</Text>
                  <Text className="text-sm text-gray-600">Bản sao 2 mặt</Text>
                </Box>
                <input
                  type="checkbox"
                  checked={documents.idCard}
                  onChange={(e) => setDocuments({...documents, idCard: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </Box>

              <Box className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Box>
                  <Text className="font-medium">📷 Ảnh 3x4</Text>
                  <Text className="text-sm text-gray-600">8 ảnh màu, nền trắng</Text>
                </Box>
                <input
                  type="checkbox"
                  checked={documents.photos}
                  onChange={(e) => setDocuments({...documents, photos: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </Box>
            </Box>

            <Box className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Text className="text-sm text-blue-800">
                💡 <strong>Lưu ý:</strong> Bạn cần mang hồ sơ gốc đến trường để đối chiếu và nộp hồ sơ trong vòng 7 ngày sau khi được duyệt đơn.
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Actions */}
        <Box className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!formData.majorId || !formData.fullName || !formData.phoneNumber}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đơn đăng ký'}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleContactSupport}
          >
            💬 Liên hệ tư vấn
          </Button>
        </Box>

        {/* Info */}
        <Box className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <Text className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Sau khi gửi đơn đăng ký, nhà trường sẽ liên hệ với bạn trong vòng 24h để hướng dẫn các bước tiếp theo và nộp hồ sơ.
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

export default AdmissionRegistrationPage;