// User management utilities for admin system

export interface User {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  zaloId?: string;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  source: 'zalo' | 'manual' | 'import';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  permissions?: string[];
  notes?: string;
}

export interface ZaloUserInfo {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  loginAt: string;
}

const USERS_STORAGE_KEY = 'adminUsersList';
const ZALO_USERS_STORAGE_KEY = 'zaloLoggedUsers';

// Get all users from localStorage
export const getAllUsers = (): User[] => {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save users to localStorage
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Get all Zalo users who have logged in
export const getZaloLoggedUsers = (): ZaloUserInfo[] => {
  try {
    const saved = localStorage.getItem(ZALO_USERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading Zalo users:', error);
    return [];
  }
};

// Save Zalo user info when they login
export const saveZaloUserLogin = (userInfo: any): void => {
  try {
    const existingUsers = getZaloLoggedUsers();
    const userExists = existingUsers.find(u => u.id === userInfo.id);
    
    const zaloUser: ZaloUserInfo = {
      id: userInfo.id,
      name: userInfo.name,
      avatar: userInfo.avatar,
      phone: userInfo.phone,
      loginAt: new Date().toISOString()
    };

    if (userExists) {
      // Update existing user's last login
      const updatedUsers = existingUsers.map(u => 
        u.id === userInfo.id ? zaloUser : u
      );
      localStorage.setItem(ZALO_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } else {
      // Add new user
      existingUsers.push(zaloUser);
      localStorage.setItem(ZALO_USERS_STORAGE_KEY, JSON.stringify(existingUsers));
    }

    // Also add to main users list if not exists
    addUserFromZalo(userInfo);
    
  } catch (error) {
    console.error('Error saving Zalo user login:', error);
  }
};

// Add user from Zalo login to main users list
export const addUserFromZalo = (zaloUserInfo: any): User => {
  const users = getAllUsers();
  const existingUser = users.find(u => u.zaloId === zaloUserInfo.id);
  
  if (existingUser) {
    // Update existing user
    existingUser.name = zaloUserInfo.name;
    existingUser.avatar = zaloUserInfo.avatar;
    existingUser.phone = zaloUserInfo.phone;
    existingUser.lastLoginAt = new Date().toISOString();
    existingUser.updatedAt = new Date().toISOString();
    saveUsers(users);
    return existingUser;
  } else {
    // Create new user
    const newUser: User = {
      id: `zalo_${zaloUserInfo.id}`,
      name: zaloUserInfo.name,
      avatar: zaloUserInfo.avatar,
      phone: zaloUserInfo.phone,
      zaloId: zaloUserInfo.id,
      role: 'student', // Default role
      status: 'active',
      source: 'zalo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      permissions: []
    };
    
    users.push(newUser);
    saveUsers(users);
    return newUser;
  }
};

// Create new user manually
export const createUser = (userData: Partial<User>): User => {
  const users = getAllUsers();
  
  const newUser: User = {
    id: userData.id || `manual_${Date.now()}`,
    name: userData.name || 'Unnamed User',
    avatar: userData.avatar,
    phone: userData.phone,
    email: userData.email,
    role: userData.role || 'student',
    status: userData.status || 'active',
    source: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: userData.permissions || [],
    notes: userData.notes || ''
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Update user
export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveUsers(users);
  return users[userIndex];
};

// Delete user
export const deleteUser = (userId: string): boolean => {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) {
    return false; // User not found
  }
  
  saveUsers(filteredUsers);
  return true;
};

// Get user by ID
export const getUserById = (userId: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.id === userId) || null;
};

// Get users by role
export const getUsersByRole = (role: User['role']): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === role);
};

// Get users by status
export const getUsersByStatus = (status: User['status']): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.status === status);
};

// Search users
export const searchUsers = (query: string): User[] => {
  const users = getAllUsers();
  const lowerQuery = query.toLowerCase();
  
  return users.filter(u => 
    u.name.toLowerCase().includes(lowerQuery) ||
    u.email?.toLowerCase().includes(lowerQuery) ||
    u.phone?.includes(query) ||
    u.id.toLowerCase().includes(lowerQuery)
  );
};

// Get user statistics
export const getUserStats = () => {
  const users = getAllUsers();
  const zaloUsers = getZaloLoggedUsers();
  
  return {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
    guests: users.filter(u => u.role === 'guest').length,
    fromZalo: users.filter(u => u.source === 'zalo').length,
    manual: users.filter(u => u.source === 'manual').length,
    zaloLogins: zaloUsers.length,
    recentLogins: users.filter(u => {
      if (!u.lastLoginAt) return false;
      const loginDate = new Date(u.lastLoginAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return loginDate > weekAgo;
    }).length
  };
};

// Initialize with some demo data if empty
export const initializeUsersData = (): void => {
  const users = getAllUsers();
  
  if (users.length === 0) {
    const demoUsers: User[] = [
      {
        id: 'admin_1',
        name: 'Quản trị viên',
        role: 'admin',
        status: 'active',
        source: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: ['all']
      },
      {
        id: 'teacher_1',
        name: 'Giáo viên Nguyễn Văn A',
        email: 'teacher.a@nsg.edu.vn',
        role: 'teacher',
        status: 'active',
        source: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: ['manage_news', 'manage_majors']
      },
      {
        id: 'student_demo',
        name: 'Sinh viên Demo',
        role: 'student',
        status: 'active',
        source: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: []
      }
    ];
    
    saveUsers(demoUsers);
  }
};