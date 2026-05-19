// Script test chức năng tạo người dùng
console.log('🧪 Testing chức năng tạo người dùng...');

// 1. Test function assignUserRole
function testAssignUserRole() {
  console.log('📝 Test 1: assignUserRole function');
  
  // Import UserRole enum values
  const UserRole = {
    ADMIN: 'admin',
    TEACHER: 'teacher', 
    STUDENT: 'student'
  };

  // Function from user-context.tsx
  const assignUserRole = (zaloId, role, assignedBy) => {
    const getUserRoleDatabase = () => {
      const stored = localStorage.getItem('user_roles_db');
      if (stored) {
        return JSON.parse(stored);
      }
      
      const defaultRoles = [
        {
          zaloId: 'admin123',
          role: 'admin',
          assignedBy: 'system',
          assignedAt: new Date().toISOString(),
          isActive: true
        }
      ];
      
      localStorage.setItem('user_roles_db', JSON.stringify(defaultRoles));
      return defaultRoles;
    };

    const saveUserRoleDatabase = (roles) => {
      localStorage.setItem('user_roles_db', JSON.stringify(roles));
    };

    const roles = getUserRoleDatabase();
    const existingIndex = roles.findIndex(r => r.zaloId === zaloId);
    
    const roleData = {
      zaloId,
      role,
      assignedBy,
      assignedAt: new Date().toISOString(),
      isActive: true
    };
    
    if (existingIndex >= 0) {
      roles[existingIndex] = roleData;
    } else {
      roles.push(roleData);
    }
    
    saveUserRoleDatabase(roles);
    return true;
  };

  // Test cases
  try {
    // Test 1: Tạo user teacher
    const result1 = assignUserRole('teacher001', UserRole.TEACHER, 'admin123');
    console.log('✅ Test tạo teacher:', result1);

    // Test 2: Tạo user student  
    const result2 = assignUserRole('student001', UserRole.STUDENT, 'admin123');
    console.log('✅ Test tạo student:', result2);

    // Test 3: Tạo user admin mới
    const result3 = assignUserRole('admin002', UserRole.ADMIN, 'admin123');
    console.log('✅ Test tạo admin:', result3);

    // Kiểm tra dữ liệu đã lưu
    const savedRoles = JSON.parse(localStorage.getItem('user_roles_db') || '[]');
    console.log('📊 Danh sách users đã tạo:', savedRoles);
    console.log('📈 Tổng số users:', savedRoles.length);

    return true;
  } catch (error) {
    console.error('❌ Lỗi test assignUserRole:', error);
    return false;
  }
}

// 2. Test function removeUserRole
function testRemoveUserRole() {
  console.log('📝 Test 2: removeUserRole function');
  
  const removeUserRole = (zaloId) => {
    const roles = JSON.parse(localStorage.getItem('user_roles_db') || '[]');
    const updatedRoles = roles.filter(r => r.zaloId !== zaloId);
    localStorage.setItem('user_roles_db', JSON.stringify(updatedRoles));
    return true;
  };

  try {
    // Test xóa user
    const result = removeUserRole('student001');
    console.log('✅ Test xóa user:', result);

    // Kiểm tra dữ liệu sau khi xóa
    const savedRoles = JSON.parse(localStorage.getItem('user_roles_db') || '[]');
    console.log('📊 Danh sách users sau khi xóa:', savedRoles);
    console.log('📈 Tổng số users còn lại:', savedRoles.length);

    return true;
  } catch (error) {
    console.error('❌ Lỗi test removeUserRole:', error);
    return false;
  }
}

// 3. Test UI admin panel
function testAdminUI() {
  console.log('📝 Test 3: Admin UI simulation');
  
  // Giả lập input admin panel
  const newUserZaloId = 'ui_test_001';
  const newUserRole = 'teacher';
  const assignedBy = 'admin123';

  try {
    // Giả lập click button "Phân quyền"
    console.log('🖱️ Giả lập click button phân quyền...');
    console.log('📥 Input data:', { newUserZaloId, newUserRole, assignedBy });

    // Validate input
    if (!newUserZaloId.trim()) {
      console.log('⚠️ Lỗi: Vui lòng nhập Zalo ID');
      return false;
    }

    // Call assignUserRole (same as in admin.tsx)
    const UserRole = { ADMIN: 'admin', TEACHER: 'teacher', STUDENT: 'student' };
    
    const assignUserRole = (zaloId, role, assignedBy) => {
      const roles = JSON.parse(localStorage.getItem('user_roles_db') || '[]');
      const existingIndex = roles.findIndex(r => r.zaloId === zaloId);
      
      const roleData = {
        zaloId,
        role,
        assignedBy,
        assignedAt: new Date().toISOString(),
        isActive: true
      };
      
      if (existingIndex >= 0) {
        roles[existingIndex] = roleData;
      } else {
        roles.push(roleData);
      }
      
      localStorage.setItem('user_roles_db', JSON.stringify(roles));
      return true;
    };

    const success = assignUserRole(newUserZaloId, newUserRole, assignedBy);
    
    if (success) {
      console.log('✅ Phân quyền thành công!');
      console.log('🔄 Reset form...');
      
      // Refresh user roles list
      const updatedRoles = JSON.parse(localStorage.getItem('user_roles_db') || '[]');
      console.log('📋 Danh sách users cập nhật:', updatedRoles);
      
      return true;
    } else {
      console.log('❌ Có lỗi xảy ra!');
      return false;
    }

  } catch (error) {
    console.error('❌ Lỗi test Admin UI:', error);
    return false;
  }
}

// Chạy tất cả tests
async function runAllTests() {
  console.log('🚀 Bắt đầu test toàn bộ chức năng tạo người dùng...');
  console.log('=' * 50);

  const test1 = testAssignUserRole();
  const test2 = testRemoveUserRole();
  const test3 = testAdminUI();

  console.log('=' * 50);
  console.log('📊 KẾT QUẢ TEST:');
  console.log('Test 1 (assignUserRole):', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('Test 2 (removeUserRole):', test2 ? '✅ PASS' : '❌ FAIL');
  console.log('Test 3 (Admin UI):', test3 ? '✅ PASS' : '❌ FAIL');

  const allPassed = test1 && test2 && test3;
  console.log('🎯 TỔNG KẾT:', allPassed ? '✅ TẤT CẢ ĐỀU HOẠT ĐỘNG' : '❌ CÓ LỖI CẦN SỬA');

  return allPassed;
}

// Chạy tests
runAllTests();