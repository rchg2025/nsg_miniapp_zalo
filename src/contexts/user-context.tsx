import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserInfo } from "zmp-sdk/apis";
import { UserInfo, UserRole, PERMISSIONS, Permission } from "@/types";

interface UserContextType {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
  isLoggedIn: boolean;
  hasPermission: (permission: Permission) => boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  refreshUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

// Hệ thống quản lý role dựa trên Zalo ID
interface UserRoleData {
  zaloId: string;
  role: UserRole;
  assignedBy?: string;
  assignedAt?: string;
  isActive: boolean;
}

// Mock database cho user roles (trong thực tế sẽ lưu trên server)
const getUserRoleDatabase = (): UserRoleData[] => {
  try {
    const stored = localStorage.getItem('user_roles_db');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
    // Default admin accounts với nhiều tài khoản demo
    const defaultRoles: UserRoleData[] = [
      {
        zaloId: 'admin123',
        role: UserRole.ADMIN,
        assignedBy: 'system',
        assignedAt: new Date().toISOString(),
        isActive: true
      },
      {
        zaloId: 'teacher123', 
        role: UserRole.TEACHER,
        assignedBy: 'admin123',
        assignedAt: new Date().toISOString(),
        isActive: true
      },
      // Thêm một số tài khoản demo cho các role khác nhau
      {
        zaloId: '1234567890', // Demo admin account
        role: UserRole.ADMIN,
        assignedBy: 'system',
        assignedAt: new Date().toISOString(),
        isActive: true
      },
      {
        zaloId: '0987654321', // Demo teacher account
        role: UserRole.TEACHER,
        assignedBy: 'admin123',
        assignedAt: new Date().toISOString(),
        isActive: true
      },
      {
        zaloId: '1111111111', // Demo student account
        role: UserRole.STUDENT,
        assignedBy: 'admin123',
        assignedAt: new Date().toISOString(),
        isActive: true
      }
    ];
    
    localStorage.setItem('user_roles_db', JSON.stringify(defaultRoles));
    return defaultRoles;
  } catch (error) {
    console.error("❌ Error in getUserRoleDatabase:", error);
    return [];
  }
};

// Lưu role database
const saveUserRoleDatabase = (roles: UserRoleData[]) => {
  try {
    localStorage.setItem('user_roles_db', JSON.stringify(roles));
    // Verify saved data
    const verification = localStorage.getItem('user_roles_db');
  } catch (error) {
    console.error("❌ Error saving roles:", error);
  }
};

// Thêm/cập nhật role cho user
export const assignUserRole = (zaloId: string, role: UserRole, assignedBy: string): boolean => {
  try {
    const roles = getUserRoleDatabase();
    const existingIndex = roles.findIndex(r => r.zaloId === zaloId);
    const roleData: UserRoleData = {
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
  } catch (error) {
    console.error("❌ Error in assignUserRole:", error);
    return false;
  }
};

// Xóa role của user
export const removeUserRole = (zaloId: string): boolean => {
  const roles = getUserRoleDatabase();
  const updatedRoles = roles.filter(r => r.zaloId !== zaloId);
  saveUserRoleDatabase(updatedRoles);
  return true;
};

// Lấy tất cả user roles (cho admin panel)
export const getAllUserRoles = (): UserRoleData[] => {
  return getUserRoleDatabase();
};

// Mock function to get user permissions based on role
const getUserPermissions = (role: UserRole): string[] => {
  switch (role) {
    case UserRole.ADMIN:
      return Object.values(PERMISSIONS);
    case UserRole.TEACHER:
      return [PERMISSIONS.NEWS_CREATE, PERMISSIONS.NEWS_EDIT, PERMISSIONS.NEWS_PUBLISH];
    case UserRole.STUDENT:
      return [];
    default:
      return [];
  }
};

// Determine user role from Zalo ID
const getUserRole = (zaloId: string): UserRole => {
  const roles = getUserRoleDatabase();
  const userRole = roles.find(r => r.zaloId === zaloId && r.isActive);
  return userRole ? userRole.role : UserRole.STUDENT; // Default là student
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Check if user is already logged in on app start
    checkUserInfo();
  }, []);

  const checkUserInfo = async () => {
    try {
      const user = await getUserInfo({ autoRequestPermission: true });
      if (user.userInfo) {
        const role = getUserRole(user.userInfo.id);
        const permissions = getUserPermissions(role);
        
        setUserInfo({
          id: user.userInfo.id,
          name: user.userInfo.name || 'Khách',
          avatar: user.userInfo.avatar || '',
          role,
          permissions
        });
      } else {
        // Auto create guest user if no Zalo login
        setUserInfo({
          id: 'guest',
          name: 'Khách',
          avatar: '',
          role: UserRole.STUDENT,
          permissions: []
        });
      }
    } catch (error) {
      // Auto create guest user on error
      setUserInfo({
        id: 'guest',
        name: 'Khách',
        avatar: '',
        role: UserRole.STUDENT,
        permissions: []
      });
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return userInfo?.permissions.includes(permission) || false;
  };

  const value = {
    userInfo,
    setUserInfo,
    isLoggedIn: !!userInfo,
    hasPermission,
    isAdmin: userInfo?.role === UserRole.ADMIN,
    isTeacher: userInfo?.role === UserRole.TEACHER || userInfo?.role === UserRole.ADMIN,
    refreshUserInfo: checkUserInfo
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};