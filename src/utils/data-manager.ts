// Hệ thống quản l� dữ liệu tập trung cho to�n bộ ứng dụng
import { PRODUCTION_DATA, FALLBACK_DATA } from '@/data/production-data';

// Environment check
const IS_DEVELOPMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  featured: boolean;
  imageUrl?: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
}

export interface Major {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: string; // "3 năm", "2.5 năm"
  tuitionFee: number;
  subjects: string[];
  careerProspects: string[];
  admissionScore: number;
  quota: number; // Chỉ ti�u tuyển sinh
  enrolled: number; // Số đ� tuyển
  status: 'active' | 'inactive';
  createdAt: string;
  imageUrl?: string;
  educationLevel: 'caodang' | 'trungcap' | 'caodang-lienthong'; // Hệ tuyển sinh
  website?: string; // Website li�n quan
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  phone: string;
  email?: string;
  birthDate: string;
  address: string;
  majorId: string;
  majorName: string;
  highSchoolScore: number;
  graduationYear: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  documents: {
    transcript: boolean;
    certificate: boolean;
    idCard: boolean;
    photos: boolean;
  };
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  joinedAt: string;
  lastLogin?: string;
  avatar?: string;
  majorId?: string; // Nếu l� sinh vi�n
  studentCode?: string; // M� sinh vi�n
  zaloId?: string; // Zalo ID để tự động đăng nhập
  savedNews?: string[]; // Danh s�ch ID tin tức đ� lưu
}

export interface SystemStats {
  users: {
    total: number;
    active: number;
    students: number;
    teachers: number;
    admins: number;
    newThisMonth: number;
  };
  news: {
    total: number;
    published: number;
    draft: number;
    featured: number;
    totalViews: number;
    totalLikes: number;
  };
  majors: {
    total: number;
    active: number;
    totalQuota: number;
    totalEnrolled: number;
    admissionRate: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    thisMonth: number;
  };
  activities: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    popularMajors: Array<{majorId: string, majorName: string, applications: number}>;
    popularNews: Array<{newsId: string, title: string, views: number}>;
  };
}

export interface SystemSettings {
  general: {
    schoolName: string;
    schoolCode: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logoUrl: string;
  };
  admission: {
    isOpen: boolean;
    startDate: string;
    endDate: string;
    minScore: number;
    maxApplications: number;
    requiredDocuments: string[];
  };
  app: {
    theme: 'light' | 'dark' | 'auto';
    language: 'vi' | 'en';
    notifications: {
      push: boolean;
      email: boolean;
      sms: boolean;
    };
    features: {
      admissionEnabled: boolean;
      newsEnabled: boolean;
      majorInfoEnabled: boolean;
      chatEnabled: boolean;
    };
  };
  security: {
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    requireOAFollow: boolean;
    adminPasswordPolicy: {
      minLength: number;
      requireSpecialChar: boolean;
      requireNumber: boolean;
    };
  };
}

// Data Storage Keys
export const STORAGE_KEYS = {
  NEWS: 'app_news_data',
  MAJORS: 'app_majors_data', 
  APPLICATIONS: 'app_admission_applications',
  USERS: 'app_users_data',
  BANNERS: 'app_banners_data',
  SYSTEM_STATS: 'app_system_stats',
  SETTINGS: 'app_system_settings',
  USER_ACTIVITY: 'app_user_activity',
} as const;

// Utility functions for data management
export class DataManager {
  
  // News Management
  static getNews(): NewsItem[] {
    console.log('📖 DataManager: Getting news from storage...');
    
    // Trong development, ưu ti�n localStorage
    if (IS_DEVELOPMENT) {
      // Ưu ti�n adminNewsList (dữ liệu mới nhất từ admin)
      const adminData = localStorage.getItem('adminNewsList');
      const appData = localStorage.getItem(STORAGE_KEYS.NEWS);
      
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData);
          console.log(`✅ Found ${parsed.length} news items from adminNewsList`);
          // Đồng bộ sang app_news_data
          localStorage.setItem(STORAGE_KEYS.NEWS, adminData);
          return parsed;
        } catch (e) {
          console.error('❌ Error parsing adminNewsList:', e);
        }
      }
      
      if (appData) {
        try {
          const parsed = JSON.parse(appData);
          console.log(`✅ Found ${parsed.length} news items from app_news_data`);
          return parsed;
        } catch (e) {
          console.error('❌ Error parsing app_news_data:', e);
        }
      }
      
      console.log('⚠️ No news in localStorage, using defaults');
      return this.getDefaultNews();
    } else {
      // Trong production, sử dụng PRODUCTION_DATA
      console.log('🚀 Production mode: using PRODUCTION_DATA');
      if (PRODUCTION_DATA.news && PRODUCTION_DATA.news.length > 0) {
        console.log(`✅ Found ${PRODUCTION_DATA.news.length} news items from production data`);
        return PRODUCTION_DATA.news;
      } else {
        console.log('⚠️ No production news data, using fallback');
        return FALLBACK_DATA.news;
      }
    }
  }

  static saveNews(news: NewsItem[]): void {
    // Lưu v�o cả 2 keys để đồng bộ
    localStorage.setItem('adminNewsList', JSON.stringify(news));
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    console.log('💾 DataManager: Saved news to both adminNewsList and app_news_data');
    this.updateStats();
  }

  static addNews(news: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount'>): NewsItem {
    const newNews: NewsItem = {
      ...news,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
    };
    
    const allNews = this.getNews();
    allNews.unshift(newNews);
    this.saveNews(allNews);
    return newNews;
  }

  // Majors Management
  static getMajors(): Major[] {
    console.log('📚 DataManager: Getting majors from storage...');
    
    // Trong development, ưu ti�n localStorage
    if (IS_DEVELOPMENT) {
      // Ưu ti�n adminMajorsList (dữ liệu mới nhất từ admin)
      const adminData = localStorage.getItem('adminMajorsList');
      const appData = localStorage.getItem(STORAGE_KEYS.MAJORS);
      
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData);
          console.log(`✅ Found ${parsed.length} majors from adminMajorsList`);
          // Migration: Th�m educationLevel nếu thiếu
          const migratedData = this.migrateMajorsData(parsed);
          // Đồng bộ sang app_majors_data
          localStorage.setItem(STORAGE_KEYS.MAJORS, JSON.stringify(migratedData));
          return migratedData;
        } catch (e) {
          console.error('❌ Error parsing adminMajorsList:', e);
        }
      }
      
      if (appData) {
        try {
          const parsed = JSON.parse(appData);
          console.log(`✅ Found ${parsed.length} majors from app_majors_data`);
          // Migration: Th�m educationLevel nếu thiếu
          const migratedData = this.migrateMajorsData(parsed);
          if (JSON.stringify(parsed) !== JSON.stringify(migratedData)) {
            console.log('🔄 Migrated majors data with educationLevel');
            localStorage.setItem(STORAGE_KEYS.MAJORS, JSON.stringify(migratedData));
          }
          return migratedData;
        } catch (e) {
          console.error('❌ Error parsing app_majors_data:', e);
        }
      }
      
      console.log('⚠️ No majors in localStorage, using defaults');
      return this.getDefaultMajors();
    } else {
      // Trong production, sử dụng PRODUCTION_DATA
      console.log('🚀 Production mode: using PRODUCTION_DATA');
      if (PRODUCTION_DATA.majors && PRODUCTION_DATA.majors.length > 0) {
        console.log(`✅ Found ${PRODUCTION_DATA.majors.length} majors from production data`);
        return PRODUCTION_DATA.majors;
      } else {
        console.log('⚠️ No production majors data, using fallback');
        return FALLBACK_DATA.majors;
      }
    }
  }

  private static migrateMajorsData(majors: any[]): Major[] {
    return majors.map(major => {
      // Nếu major chưa c� educationLevel, th�m mặc định
      if (!major.educationLevel) {
        // Logic ph�n loại dựa tr�n t�n hoặc m� ng�nh
        const code = (major.code || '').toLowerCase();
        const name = (major.name || '').toLowerCase();
        
        if (code.includes('cntt') || name.includes('c�ng nghệ th�ng tin')) {
          major.educationLevel = 'caodang';
        } else if (code.includes('kt') || name.includes('kế to�n')) {
          major.educationLevel = 'trungcap';
        } else if (code.includes('qtkd') || name.includes('quản trị')) {
          major.educationLevel = 'caodang-lienthong';
        } else {
          // Mặc định l� cao đẳng
          major.educationLevel = 'caodang';
        }
        
        console.log(`🔄 Added educationLevel '${major.educationLevel}' for major: ${major.name}`);
      }

      // Đảm bảo subjects v� careerProspects l� arrays
      if (!Array.isArray(major.subjects)) {
        major.subjects = major.subjects ? 
          (typeof major.subjects === 'string' ? major.subjects.split(',').map(s => s.trim()) : []) : 
          [];
        console.log(`🔄 Converted subjects to array for major: ${major.name}`);
      }

      if (!Array.isArray(major.careerProspects)) {
        major.careerProspects = major.careerProspects ? 
          (typeof major.careerProspects === 'string' ? major.careerProspects.split(',').map(c => c.trim()) : []) : 
          [];
        console.log(`🔄 Converted careerProspects to array for major: ${major.name}`);
      }
      
      return major as Major;
    });
  }

  static saveMajors(majors: Major[]): void {
    // Lưu v�o cả 2 keys để đồng bộ
    localStorage.setItem('adminMajorsList', JSON.stringify(majors));
    localStorage.setItem(STORAGE_KEYS.MAJORS, JSON.stringify(majors));
    console.log('💾 DataManager: Saved majors to both adminMajorsList and app_majors_data');
    this.updateStats();
  }

  // Applications Management
  static getApplications(): AdmissionApplication[] {
    console.log('📋 DataManager: Getting applications from storage...');
    
    // Ưu ti�n admissionRegistrations (dữ liệu mới nhất từ admin)
    const adminData = localStorage.getItem('admissionRegistrations');
    const appData = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        console.log(`✅ Found ${parsed.length} applications from admissionRegistrations`);
        // Đồng bộ sang app_admission_applications
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, adminData);
        return parsed;
      } catch (e) {
        console.error('❌ Error parsing admissionRegistrations:', e);
      }
    }
    
    if (appData) {
      try {
        const parsed = JSON.parse(appData);
        console.log(`✅ Found ${parsed.length} applications from app_admission_applications`);
        return parsed;
      } catch (e) {
        console.error('❌ Error parsing app_admission_applications:', e);
      }
    }
    
    console.log('⚠️ No applications in storage, returning empty array');
    return [];
  }

  static saveApplications(applications: AdmissionApplication[]): void {
    // Lưu v�o cả 2 keys để đồng bộ
    localStorage.setItem('admissionRegistrations', JSON.stringify(applications));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    console.log('💾 DataManager: Saved applications to both admissionRegistrations and app_admission_applications');
    this.updateStats();
  }

  static submitApplication(application: Omit<AdmissionApplication, 'id' | 'submittedAt' | 'status'>): AdmissionApplication {
    const newApplication: AdmissionApplication = {
      ...application,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    
    const allApplications = this.getApplications();
    allApplications.unshift(newApplication);
    this.saveApplications(allApplications);
    return newApplication;
  }

  // Users Management
  static getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : this.getDefaultUsers();
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.updateStats();
  }

  static addUser(user: Omit<User, 'id' | 'joinedAt'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
    };
    
    const allUsers = this.getUsers();
    allUsers.push(newUser);
    this.saveUsers(allUsers);
    return newUser;
  }

  static updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    return users[userIndex];
  }

  static getUserByZaloId(zaloId: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.zaloId === zaloId) || null;
  }

  // Saved News Management - Sử dụng localStorage key đơn giản
  static saveNewsForUser(userId: string, newsId: string): boolean {
    try {
      const key = `user_saved_news_${userId}`;
      const savedNews = JSON.parse(localStorage.getItem(key) || '[]');
      if (!savedNews.includes(newsId)) {
        savedNews.push(newsId);
        localStorage.setItem(key, JSON.stringify(savedNews));
        console.log('✅ DataManager: Saved news', newsId, 'for user', userId);
      }
      return true;
    } catch (error) {
      console.error('❌ DataManager: Error saving news', error);
      return false;
    }
  }

  static unsaveNewsForUser(userId: string, newsId: string): boolean {
    try {
      const key = `user_saved_news_${userId}`;
      const savedNews = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedSavedNews = savedNews.filter((id: string) => id !== newsId);
      localStorage.setItem(key, JSON.stringify(updatedSavedNews));
      console.log('✅ DataManager: Unsaved news', newsId, 'for user', userId);
      return true;
    } catch (error) {
      console.error('❌ DataManager: Error unsaving news', error);
      return false;
    }
  }

  static getSavedNewsForUser(userId: string): NewsItem[] {
    try {
      const key = `user_saved_news_${userId}`;
      const savedNewsIds = JSON.parse(localStorage.getItem(key) || '[]');
      const allNews = this.getNews();
      const savedNews = allNews.filter(news => savedNewsIds.includes(news.id.toString()));
      console.log('📖 DataManager: Retrieved', savedNews.length, 'saved news for user', userId);
      return savedNews;
    } catch (error) {
      console.error('❌ DataManager: Error getting saved news', error);
      return [];
    }
  }

  static isNewsSavedByUser(userId: string, newsId: string): boolean {
    try {
      const key = `user_saved_news_${userId}`;
      const savedNews = JSON.parse(localStorage.getItem(key) || '[]');
      return savedNews.includes(newsId);
    } catch (error) {
      console.error('❌ DataManager: Error checking saved news', error);
      return false;
    }
  }

  // Banner Management
  static getBanners(): Banner[] {
    const data = localStorage.getItem(STORAGE_KEYS.BANNERS);
    return data ? JSON.parse(data) : this.getDefaultBanners();
  }

  static saveBanners(banners: Banner[]): void {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  }

  static addBanner(banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Banner {
    const newBanner: Banner = {
      ...banner,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const allBanners = this.getBanners();
    allBanners.push(newBanner);
    allBanners.sort((a, b) => a.order - b.order);
    this.saveBanners(allBanners);
    return newBanner;
  }

  static updateBanner(bannerId: string, updates: Partial<Banner>): Banner | null {
    const banners = this.getBanners();
    const bannerIndex = banners.findIndex(b => b.id === bannerId);
    
    if (bannerIndex === -1) return null;
    
    banners[bannerIndex] = { 
      ...banners[bannerIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.saveBanners(banners);
    return banners[bannerIndex];
  }

  static deleteBanner(bannerId: string): boolean {
    const banners = this.getBanners();
    const filteredBanners = banners.filter(b => b.id !== bannerId);
    
    if (filteredBanners.length === banners.length) return false;
    
    this.saveBanners(filteredBanners);
    return true;
  }

  // Statistics Management
  static getStats(): SystemStats {
    const data = localStorage.getItem(STORAGE_KEYS.SYSTEM_STATS);
    if (data) {
      return JSON.parse(data);
    }
    return this.calculateStats();
  }

  static updateStats(): SystemStats {
    const stats = this.calculateStats();
    localStorage.setItem(STORAGE_KEYS.SYSTEM_STATS, JSON.stringify(stats));
    return stats;
  }

  private static calculateStats(): SystemStats {
    const users = this.getUsers();
    const news = this.getNews();
    const majors = this.getMajors();
    const applications = this.getApplications();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Calculate majors stats with safe fallbacks
    const totalQuota = majors.reduce((sum, m) => sum + (Number(m.quota) || 0), 0);
    const totalEnrolled = majors.reduce((sum, m) => sum + (Number(m.enrolled) || 0), 0);
    const admissionRate = totalQuota > 0 ? (totalEnrolled / totalQuota) * 100 : 0;

    const stats: SystemStats = {
      users: {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        admins: users.filter(u => u.role === 'admin').length,
        newThisMonth: users.filter(u => {
          const joinDate = new Date(u.joinedAt);
          return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
        }).length,
      },
      news: {
        total: news.length,
        published: news.filter(n => n.status === 'published').length,
        draft: news.filter(n => n.status === 'draft').length,
        featured: news.filter(n => n.featured).length,
        totalViews: news.reduce((sum, n) => sum + (Number(n.viewCount) || 0), 0),
        totalLikes: news.reduce((sum, n) => sum + (Number(n.likeCount) || 0), 0),
      },
      majors: {
        total: majors.length,
        active: majors.filter(m => m.status === 'active').length,
        totalQuota: totalQuota,
        totalEnrolled: totalEnrolled,
        admissionRate: admissionRate,
      },
      applications: {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        thisMonth: applications.filter(a => {
          const submitDate = new Date(a.submittedAt);
          return submitDate.getMonth() === currentMonth && submitDate.getFullYear() === currentYear;
        }).length,
      },
      activities: {
        dailyActiveUsers: Math.floor(users.filter(u => u.status === 'active').length * 0.3), // Mock data
        monthlyActiveUsers: users.filter(u => u.status === 'active').length,
        popularMajors: this.getPopularMajors(applications, majors),
        popularNews: this.getPopularNews(news),
      },
    };

    return stats;
  }

  private static getPopularMajors(applications: AdmissionApplication[], majors: Major[]) {
    const majorCounts = applications.reduce((acc, app) => {
      acc[app.majorId] = (acc[app.majorId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(majorCounts)
      .map(([majorId, count]) => ({
        majorId,
        majorName: majors.find(m => m.id === majorId)?.name || 'Unknown',
        applications: count,
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);
  }

  private static getPopularNews(news: NewsItem[]) {
    return news
      .filter(n => n.status === 'published')
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(n => ({
        newsId: n.id,
        title: n.title,
        views: n.viewCount,
      }));
  }

  // Settings Management
  static getSettings(): SystemSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : this.getDefaultSettings();
  }

  static saveSettings(settings: SystemSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Default Data
  private static getDefaultNews(): NewsItem[] {
    return [
      {
        id: '1',
        title: 'Th�ng b�o tuyển sinh năm học 2024-2025',
        content: 'Trường Cao đẳng B�ch khoa Nam S�i G�n th�ng b�o tuyển sinh năm học 2024-2025 với nhiều ng�nh học hấp dẫn...',
        summary: 'Tuyển sinh năm học 2024-2025 với nhiều ưu đ�i',
        category: 'tuyen-sinh',
        author: 'Admin NSG',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
        status: 'published',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
        viewCount: 1250,
        likeCount: 89,
        tags: ['tuyển sinh', 'th�ng b�o', 'quan trọng'],
      },
      {
        id: '2',
        title: 'Lịch thi cuối kỳ học kỳ I năm học 2023-2024',
        content: 'Ph�ng Đ�o tạo th�ng b�o lịch thi cuối kỳ học kỳ I năm học 2023-2024...',
        summary: 'Lịch thi cuối kỳ học kỳ I chi tiết',
        category: 'lich-thi',
        author: 'Ph�ng Đ�o tạo',
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '2024-01-10T10:30:00Z',
        status: 'published',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
        viewCount: 856,
        likeCount: 45,
        tags: ['lịch thi', 'cuối kỳ', 'sinh vi�n'],
      },
      {
        id: '3',
        title: 'Khai giảng năm học mới 2024-2025',
        content: 'Lễ khai giảng năm học mới 2024-2025 sẽ được tổ chức tại hội trường ch�nh...',
        summary: 'Lễ khai giảng năm học mới trang trọng',
        category: 'su-kien',
        author: 'Ban Gi�m hiệu',
        createdAt: '2024-01-05T14:00:00Z',
        updatedAt: '2024-01-05T14:00:00Z',
        status: 'draft',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=400&fit=crop',
        viewCount: 0,
        likeCount: 0,
        tags: ['khai giảng', 'sự kiện', 'trang trọng'],
      },
    ];
  }

  private static getDefaultMajors(): Major[] {
    return [
      {
        id: '1',
        name: 'C�ng nghệ Th�ng tin',
        code: 'CNTT01',
        description: 'Đ�o tạo chuy�n vi�n c�ng nghệ th�ng tin c� kỹ năng lập tr�nh, quản trị hệ thống v� ph�t triển ứng dụng.',
        duration: '3 năm',
        tuitionFee: 18000000,
        subjects: ['Lập tr�nh C/C++', 'Java', 'Web Development', 'Database', 'Mạng m�y t�nh', 'To�n cao cấp'],
        careerProspects: ['Lập tr�nh vi�n', 'Quản trị hệ thống', 'Chuy�n vi�n IT', 'Ph�t triển web/mobile'],
        admissionScore: 18.5,
        quota: 120,
        enrolled: 98,
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
        educationLevel: 'caodang',
        website: 'https://cntt.nsg.edu.vn',
      },
      {
        id: '2',
        name: 'Kế to�n',
        code: 'KT01',
        description: 'Đ�o tạo cử nh�n kế to�n c� khả năng l�m việc trong c�c doanh nghiệp, tổ chức t�i ch�nh.',
        duration: '3 năm',
        tuitionFee: 15000000,
        subjects: ['Nguy�n l� kế to�n', 'Kế to�n t�i ch�nh', 'Kế to�n quản trị', 'Thuế', 'Kiểm to�n', 'To�n t�i ch�nh'],
        careerProspects: ['Kế to�n vi�n', 'Kiểm to�n vi�n', 'Chuy�n vi�n t�i ch�nh', 'Tư vấn thuế'],
        admissionScore: 16.0,
        quota: 80,
        enrolled: 75,
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
        educationLevel: 'trungcap',
        website: 'https://ketoan.nsg.edu.vn',
      },
      {
        id: '3',
        name: 'Quản trị Kinh doanh',
        code: 'QTKD01',
        description: 'Đ�o tạo nh�n lực quản l� c� khả năng điều h�nh v� ph�t triển doanh nghiệp.',
        duration: '3 năm',
        tuitionFee: 16000000,
        subjects: ['Quản trị học', 'Marketing', 'T�i ch�nh doanh nghiệp', 'Quản trị nh�n sự', 'Logistics', 'Kinh tế học'],
        careerProspects: ['Quản l� doanh nghiệp', 'Chuy�n vi�n marketing', 'Tư vấn kinh doanh', 'Khởi nghiệp'],
        admissionScore: 17.0,
        quota: 100,
        enrolled: 85,
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        educationLevel: 'caodang-lienthong',
        website: 'https://qtkd.nsg.edu.vn',
      },
    ];
  }

  private static getDefaultUsers(): User[] {
    return [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'nguyenvana@gmail.com',
        role: 'student',
        status: 'active',
        joinedAt: '2024-01-15T08:00:00Z',
        lastLogin: '2024-01-20T10:30:00Z',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        majorId: '1',
        studentCode: 'SV001',
      },
      {
        id: '2',
        name: 'Trần Thị B',
        phone: '0912345678',
        email: 'tranthib@gmail.com',
        role: 'student',
        status: 'active',
        joinedAt: '2024-01-10T09:00:00Z',
        lastLogin: '2024-01-19T14:20:00Z',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        majorId: '2',
        studentCode: 'SV002',
      },
      {
        id: '3',
        name: 'L� Văn C',
        phone: '0923456789',
        email: 'levanc@nsg.edu.vn',
        role: 'teacher',
        status: 'active',
        joinedAt: '2023-12-01T08:00:00Z',
        lastLogin: '2024-01-18T16:45:00Z',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: '4',
        name: 'Phạm Thị D',
        phone: '0934567890',
        email: 'phamthid@nsg.edu.vn',
        role: 'admin',
        status: 'active',
        joinedAt: '2023-10-15T08:00:00Z',
        lastLogin: '2024-01-20T08:15:00Z',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ];
  }

  private static getDefaultBanners(): Banner[] {
    return [
      {
        id: '1',
        title: 'Tuyển sinh năm học 2024-2025',
        description: 'Đăng k� ngay để kh�ng bỏ lỡ cơ hội học tập tại trường',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
        linkUrl: '/admission-registration',
        order: 1,
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
      },
      {
        id: '2',
        title: 'Kh�m ph� c�c ng�nh đ�o tạo',
        description: 'T�m hiểu về c�c ng�nh học ph� hợp với sở th�ch của bạn',
        imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop',
        linkUrl: '/majors',
        order: 2,
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
      },
      {
        id: '3',
        title: 'Cơ sở vật chất hiện đại',
        description: 'Học tập trong m�i trường chuy�n nghiệp với trang thiết bị tối t�n',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop',
        order: 3,
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
      },
    ];
  }

  private static getDefaultSettings(): SystemSettings {
    return {
      general: {
        schoolName: 'Trường Cao đẳng B�ch khoa Nam S�i G�n',
        schoolCode: 'NSG',
        address: 'Th�nh phố Hồ Ch� Minh',
        phone: '028-12345678',
        email: 'info@nsg.edu.vn',
        website: 'https://nsg.edu.vn',
        logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
      },
      admission: {
        isOpen: true,
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        minScore: 15.0,
        maxApplications: 500,
        requiredDocuments: ['Bản sao bằng tốt nghiệp', 'Bản sao học bạ', 'Chứng minh nh�n d�n', 'Ảnh 3x4'],
      },
      app: {
        theme: 'light',
        language: 'vi',
        notifications: {
          push: true,
          email: true,
          sms: false,
        },
        features: {
          admissionEnabled: true,
          newsEnabled: true,
          majorInfoEnabled: true,
          chatEnabled: false,
        },
      },
      security: {
        sessionTimeout: 1440, // 24 hours in minutes
        maxLoginAttempts: 5,
        requireOAFollow: true,
        adminPasswordPolicy: {
          minLength: 8,
          requireSpecialChar: true,
          requireNumber: true,
        },
      },
    };
  }

  // Activity tracking
  static trackActivity(userId: string, action: string, details?: any): void {
    const activity = {
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    
    const activities = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ACTIVITY) || '[]');
    activities.unshift(activity);
    
    // Keep only last 1000 activities
    if (activities.length > 1000) {
      activities.splice(1000);
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_ACTIVITY, JSON.stringify(activities));
  }

  // Initialize data if not exists
  static initializeData(): void {
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      this.saveNews(this.getDefaultNews());
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAJORS)) {
      this.saveMajors(this.getDefaultMajors());
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.saveUsers(this.getDefaultUsers());
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings(this.getDefaultSettings());
    }
    this.updateStats();
  }
}

// Initialize data when module loads
DataManager.initializeData();