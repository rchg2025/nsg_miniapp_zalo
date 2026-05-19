import React, { useState, useEffect } from "react";
import { Box, Button, Page, Text, Header, List, Input, Modal } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, AdmissionApplication, Major } from "@/utils/data-manager";

function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [applicationsList, setApplicationsList] = useState<AdmissionApplication[]>([]);
  const [majorsList, setMajorsList] = useState<Major[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'contacted'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Kiểm tra quyền admin
  useEffect(() => {
    const adminStatus = localStorage.getItem("admin_logged_in");
    if (adminStatus !== "true") {
      navigate("/profile");
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = () => {
    const applicationsData = DataManager.getApplications();
    const majorsData = DataManager.getMajors();
    setApplicationsList(applicationsData);
    setMajorsList(majorsData);
  };

  const handleViewApplication = (application: AdmissionApplication) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (applicationId: string, newStatus: AdmissionApplication['status'], notes?: string) => {
    const updatedApplications = applicationsList.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: newStatus,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin NSG',
            notes: notes || app.notes
          }
        : app
    );
    
    DataManager.saveApplications(updatedApplications);
    setApplicationsList(updatedApplications);
    
    // Update enrolled count for major if approved
    if (newStatus === 'approved') {
      const application = applicationsList.find(app => app.id === applicationId);
      if (application) {
        const updatedMajors = majorsList.map(major => 
          major.id === application.majorId 
            ? { ...major, enrolled: major.enrolled + 1 }
            : major
        );
        DataManager.saveMajors(updatedMajors);
        setMajorsList(updatedMajors);
      }
    }
  };

  const handleDeleteApplication = (id: string) => {
    if (confirm('Bạn c� chắc chắn muốn x�a đơn tuyển sinh n�y?')) {
      const updatedApplications = applicationsList.filter(app => app.id !== id);
      DataManager.saveApplications(updatedApplications);
      setApplicationsList(updatedApplications);
    }
  };

  const getStatusName = (status: string) => {
    const statuses = {
      'pending': 'Chờ x�t duyệt',
      'approved': 'Đ� duyệt',
      'rejected': 'Từ chối',
      'contacted': 'Đ� li�n hệ'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'text-yellow-600',
      'approved': 'text-green-600',
      'rejected': 'text-red-600',
      'contacted': 'text-blue-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // Nếu đ� l� định dạng dd/mm/yyyy th� giữ nguy�n
    if (dateString.includes('/')) {
      return dateString;
    }
    
    // Convert từ ISO format sang dd/mm/yyyy
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    
    const today = new Date();
    let birth: Date;
    
    // Xử l� định dạng dd/mm/yyyy
    if (birthDate.includes('/')) {
      const parts = birthDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        birth = new Date(birthDate);
      }
    } else {
      birth = new Date(birthDate);
    }
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const filteredApplications = applicationsList.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.phone.includes(searchQuery) ||
                         app.majorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (app.email && app.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applicationsList.length,
    pending: applicationsList.filter(a => a.status === 'pending').length,
    approved: applicationsList.filter(a => a.status === 'approved').length,
    rejected: applicationsList.filter(a => a.status === 'rejected').length,
    contacted: applicationsList.filter(a => a.status === 'contacted').length,
    thisMonth: applicationsList.filter(a => {
      const submitDate = new Date(a.submittedAt);
      const now = new Date();
      return submitDate.getMonth() === now.getMonth() && submitDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <Page className="page-with-header bg-gray-50">
      <Header 
        title="Quản l� đơn tuyển sinh" 
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
        {/* Search & Filter */}
        <Box className="mb-4 space-y-3">
          <Input
            placeholder="T�m kiếm theo t�n, số điện thoại, ng�nh học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <Box className="flex gap-2 overflow-x-auto">
            {(['all', 'pending', 'approved', 'rejected', 'contacted'] as const).map((status) => (
              <Button
                key={status}
                size="small"
                variant={filterStatus === status ? "primary" : "tertiary"}
                onClick={() => setFilterStatus(status)}
                className="whitespace-nowrap"
              >
                {status === 'all' ? 'Tất cả' : getStatusName(status)}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Stats */}
        <Box className="grid grid-cols-3 gap-3 mb-4">
          <Box className="bg-white p-3 rounded text-center">
            <Text className="text-lg font-bold text-blue-600">{stats.total}</Text>
            <Text className="text-xs text-gray-500">Tổng đơn</Text>
          </Box>
          <Box className="bg-white p-3 rounded text-center">
            <Text className="text-lg font-bold text-yellow-600">{stats.pending}</Text>
            <Text className="text-xs text-gray-500">Chờ duyệt</Text>
          </Box>
          <Box className="bg-white p-3 rounded text-center">
            <Text className="text-lg font-bold text-green-600">{stats.approved}</Text>
            <Text className="text-xs text-gray-500">Đ� duyệt</Text>
          </Box>
        </Box>

        {/* Results count */}
        <Box className="mb-3">
          <Text className="text-sm text-gray-600">
            Hiển thị {filteredApplications.length} / {applicationsList.length} đơn tuyển sinh
          </Text>
        </Box>

        {/* Applications List */}
        <List>
          {filteredApplications.map((application) => (
            <List.Item
              key={application.id}
              title={application.studentName}
              subTitle={`${application.majorName} � ${application.phone} � ${getStatusName(application.status)} � ${formatDate(application.submittedAt)}`}
              prefix={
                <Box className={`w-3 h-3 rounded-full ${
                  application.status === 'approved' ? 'bg-green-500' :
                  application.status === 'pending' ? 'bg-yellow-500' :
                  application.status === 'rejected' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
              }
              suffix={
                <Box className="flex gap-2">
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => handleViewApplication(application)}
                  >
                    Xem
                  </Button>
                  {application.status === 'pending' && (
                    <>
                      <Button 
                        size="small" 
                        variant="tertiary"
                        onClick={() => handleUpdateStatus(application.id, 'approved')}
                        className="text-green-600"
                      >
                        Duyệt
                      </Button>
                      <Button 
                        size="small" 
                        variant="tertiary"
                        onClick={() => handleUpdateStatus(application.id, 'rejected', 'Kh�ng đủ điều kiện')}
                        className="text-red-600"
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  <Button 
                    size="small" 
                    variant="tertiary"
                    onClick={() => handleDeleteApplication(application.id)}
                    className="text-red-600"
                  >
                    X�a
                  </Button>
                </Box>
              }
            />
          ))}
        </List>

        {filteredApplications.length === 0 && (
          <Box className="text-center py-8">
            <Text className="text-gray-500">Kh�ng t�m thấy đơn tuyển sinh n�o</Text>
          </Box>
        )}
      </Box>

      {/* Application Detail Modal */}
      <Modal
        visible={showDetailModal}
        title="Chi tiết đơn tuyển sinh"
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApplication(null);
        }}
        actions={[
          {
            text: "Đ�ng",
            close: true,
          },
          ...(selectedApplication?.status === 'pending' ? [
            {
              text: "Duyệt đơn",
              highLight: true,
              onClick: () => {
                if (selectedApplication) {
                  handleUpdateStatus(selectedApplication.id, 'approved');
                  setShowDetailModal(false);
                }
              },
            }
          ] : []),
        ]}
      >
        {selectedApplication && (
          <Box className="space-y-4 max-h-96 overflow-y-auto">
            {/* Basic Info */}
            <Box className="bg-gray-50 p-4 rounded">
              <Text className="font-medium mb-3">Th�ng tin c� nh�n</Text>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Họ v� t�n:</Text>
                  <Text className="font-medium">{selectedApplication.studentName}</Text>
                </Box>
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Số điện thoại:</Text>
                  <Text className="font-medium">{selectedApplication.phone}</Text>
                </Box>
                {selectedApplication.email && (
                  <Box className="flex justify-between">
                    <Text className="text-gray-600">Email:</Text>
                    <Text className="font-medium">{selectedApplication.email}</Text>
                  </Box>
                )}
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Ng�y sinh:</Text>
                  <Text className="font-medium">{formatDate(selectedApplication.birthDate)} ({calculateAge(selectedApplication.birthDate)} tuổi)</Text>
                </Box>
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Địa chỉ:</Text>
                  <Text className="font-medium text-right max-w-48">{selectedApplication.address}</Text>
                </Box>
              </Box>
            </Box>

            {/* Academic Info */}
            <Box className="bg-gray-50 p-4 rounded">
              <Text className="font-medium mb-3">Th�ng tin học tập</Text>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Ng�nh đăng k�:</Text>
                  <Text className="font-medium">{selectedApplication.majorName}</Text>
                </Box>
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Điểm thi THPT:</Text>
                  <Text className="font-medium">{selectedApplication.highSchoolScore}</Text>
                </Box>
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Năm tốt nghiệp:</Text>
                  <Text className="font-medium">{selectedApplication.graduationYear}</Text>
                </Box>
              </Box>
            </Box>

            {/* Status Info */}
            <Box className="bg-gray-50 p-4 rounded">
              <Text className="font-medium mb-3">Trạng th�i x�t duyệt</Text>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Trạng th�i:</Text>
                  <Text className={`font-medium ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusName(selectedApplication.status)}
                  </Text>
                </Box>
                <Box className="flex justify-between">
                  <Text className="text-gray-600">Ng�y nộp:</Text>
                  <Text className="font-medium">{formatDate(selectedApplication.submittedAt)}</Text>
                </Box>
                {selectedApplication.reviewedAt && (
                  <Box className="flex justify-between">
                    <Text className="text-gray-600">Ng�y x�t duyệt:</Text>
                    <Text className="font-medium">{formatDate(selectedApplication.reviewedAt)}</Text>
                  </Box>
                )}
                {selectedApplication.reviewedBy && (
                  <Box className="flex justify-between">
                    <Text className="text-gray-600">Người x�t duyệt:</Text>
                    <Text className="font-medium">{selectedApplication.reviewedBy}</Text>
                  </Box>
                )}
                {selectedApplication.notes && (
                  <Box>
                    <Text className="text-gray-600 mb-1">Ghi ch�:</Text>
                    <Text className="font-medium bg-white p-2 rounded text-sm">{selectedApplication.notes}</Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Modal>
    </Page>
  );
}

export default AdminApplicationsPage;