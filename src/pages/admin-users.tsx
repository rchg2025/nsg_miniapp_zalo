import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header, List, Input, Select, useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { DataManager, User } from "@/utils/data-manager";

const { Option } = Select;

function AdminUsersPage() {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "student" as "student" | "teacher" | "admin",
    studentCode: "",
    majorId: "",
    zaloId: ""
  });

  // Load users
  const loadUsers = () => {
    const allUsers = DataManager.getUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      role: "student",
      studentCode: "",
      majorId: "",
      zaloId: ""
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  // Handle form submit
  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      openSnackbar({
        text: "Vui lòng nhập đầy đủ họ tên và số điện thoại",
        type: "error",
        duration: 3000
      });
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        DataManager.updateUser(editingUser.id, {
          ...formData,
          status: editingUser.status
        });
        openSnackbar({
          text: "Cập nhật người dùng thành công",
          type: "success",
          duration: 2000
        });
      } else {
        // Add new user
        DataManager.addUser({
          ...formData,
          status: "active"
        });
        openSnackbar({
          text: "Thêm người dùng thành công",
          type: "success", 
          duration: 2000
        });
      }
      
      loadUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      openSnackbar({
        text: "Có lỗi xảy ra khi lưu thông tin",
        type: "error",
        duration: 3000
      });
    }
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email || "",
      role: user.role,
      studentCode: user.studentCode || "",
      majorId: user.majorId || "",
      zaloId: user.zaloId || ""
    });
    setShowAddForm(true);
  };

  // Handle toggle user status
  const toggleUserStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    DataManager.updateUser(user.id, { status: newStatus });
    loadUsers();
    
    openSnackbar({
      text: `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} người dùng ${user.name}`,
      type: "success",
      duration: 2000
    });
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery) ||
                         (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (user.studentCode && user.studentCode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Role mapping for display
  const roleLabels = {
    student: "Sinh viên",
    teacher: "Giảng viên", 
    admin: "Quản trị viên"
  };

  const roleColors = {
    student: "text-blue-600",
    teacher: "text-green-600",
    admin: "text-red-600"
  };

  return (
    <Page className="page">
      <Header
        title="Quản lý người dùng"
        showBackIcon={true}
        onBackClick={() => navigate("/admin")}
      />
      
      <Box className="p-4 space-y-4">
        {/* Statistics */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-2">Thống kê</Text>
          <Box className="grid grid-cols-2 gap-4">
            <Box className="text-center">
              <Text className="text-2xl font-bold text-blue-600">{users.length}</Text>
              <Text className="text-sm text-gray-600">Tổng số</Text>
            </Box>
            <Box className="text-center">
              <Text className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === "active").length}
              </Text>
              <Text className="text-sm text-gray-600">Hoạt động</Text>
            </Box>
            <Box className="text-center">
              <Text className="text-2xl font-bold text-blue-500">
                {users.filter(u => u.role === "student").length}
              </Text>
              <Text className="text-sm text-gray-600">Sinh viên</Text>
            </Box>
            <Box className="text-center">
              <Text className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.role === "teacher").length}
              </Text>
              <Text className="text-sm text-gray-600">Giảng viên</Text>
            </Box>
          </Box>
        </Box>

        {/* Controls */}
        <Box className="bg-white rounded-lg p-4 shadow-sm space-y-3">
          <Box className="flex justify-between items-center">
            <Text className="font-semibold">Danh sách người dùng</Text>
            <Button
              size="small"
              onClick={() => setShowAddForm(true)}
            >
              <Icon icon="zi-plus" className="mr-1" />
              Thêm mới
            </Button>
          </Box>
          
          {/* Search and Filter */}
          <Box className="space-y-2">
            <Input
              placeholder="Tìm kiếm theo tên, SĐT, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Icon icon="zi-search" />}
            />
            
            <Select
              placeholder="Lọc theo vai trò"
              value={filterRole}
              onChange={(value) => setFilterRole(value as string)}
            >
              <Option value="all" title="Tất cả vai trò" />
              <Option value="student" title="Sinh viên" />
              <Option value="teacher" title="Giảng viên" />
              <Option value="admin" title="Quản trị viên" />
            </Select>
          </Box>
        </Box>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Box className="bg-white rounded-lg p-4 shadow-sm space-y-3">
            <Box className="flex justify-between items-center">
              <Text className="font-semibold">
                {editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
              </Text>
              <Button size="small" variant="tertiary" onClick={resetForm}>
                <Icon icon="zi-close" />
              </Button>
            </Box>
            
            <Box className="space-y-3">
              <Input
                label="Họ và tên *"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              
              <Input
                label="Số điện thoại *"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              
              <Input
                label="Email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              
              <Select
                label="Vai trò"
                placeholder="Chọn vai trò"
                value={formData.role}
                onChange={(value) => setFormData({...formData, role: value as any})}
              >
                <Option value="student" title="Sinh viên" />
                <Option value="teacher" title="Giảng viên" />
                <Option value="admin" title="Quản trị viên" />
              </Select>
              
              {formData.role === "student" && (
                <Input
                  label="Mã sinh viên"
                  placeholder="Nhập mã sinh viên"
                  value={formData.studentCode}
                  onChange={(e) => setFormData({...formData, studentCode: e.target.value})}
                />
              )}
              
              <Input
                label="Zalo ID (để tự động đăng nhập)"
                placeholder="Nhập Zalo ID"
                value={formData.zaloId}
                onChange={(e) => setFormData({...formData, zaloId: e.target.value})}
              />
              
              <Box className="flex space-x-2">
                <Button onClick={handleSubmit} fullWidth>
                  {editingUser ? "Cập nhật" : "Thêm mới"}
                </Button>
                <Button variant="secondary" onClick={resetForm} fullWidth>
                  Hủy
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Users List */}
        <Box className="bg-white rounded-lg shadow-sm">
          <List>
            {filteredUsers.map((user) => (
              <List.Item
                key={user.id}
                prefix={
                  <Box className={`w-3 h-3 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                }
                title={user.name}
                subTitle={`${user.phone} • ${roleLabels[user.role]} • ${user.status === "active" ? "Hoạt động" : "Vô hiệu hóa"}`}
                suffix={
                  <Box className="flex space-x-1">
                    <Button size="small" variant="tertiary" onClick={() => handleEdit(user)}>
                      <Icon icon="zi-edit" />
                    </Button>
                    <Button
                      size="small"
                      variant="tertiary"
                      onClick={() => toggleUserStatus(user)}
                    >
                      <Icon icon={user.status === "active" ? "zi-pause" : "zi-play"} />
                    </Button>
                  </Box>
                }
              />
            ))}
          </List>
          
          {filteredUsers.length === 0 && (
            <Box className="p-8 text-center">
              <Icon icon="zi-user" className="text-4xl text-gray-400 mb-2" />
              <Text className="text-gray-600">Không tìm thấy người dùng nào</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
}

export default AdminUsersPage;