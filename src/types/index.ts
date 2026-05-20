export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher', 
  STUDENT = 'student',
  GUEST = 'guest'
}

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  permissions: string[];
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  authorId: string;
  isHot: boolean;
  status: 'draft' | 'published' | 'archived';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const PERMISSIONS = {
  NEWS_CREATE: 'news.create',
  NEWS_EDIT: 'news.edit',
  NEWS_DELETE: 'news.delete',
  NEWS_PUBLISH: 'news.publish',
  USER_MANAGE: 'user.manage',
  ADMIN_PANEL: 'admin.panel',
  MAJOR_MANAGE: 'major.manage',
  ADMISSION_MANAGE: 'admission.manage'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Education System Types
export enum EducationLevel {
  COLLEGE = 'college', // Cao đẳng
  VOCATIONAL = 'vocational', // Trung cấp
  BRIDGE_COLLEGE = 'bridge_college' // Cao đẳng liên thông
}

export interface Major {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  duration: string; // Thời gian đào tạo
  educationLevels: EducationLevel[];
  requirements: string[]; // Điều kiện đào tạo
  careerProspects: string[]; // Cơ hội nghề nghiệp
  subjects?: string; // Các môn học
  website?: string; // Website liên quan
  contactInfo?: string; // Thông tin liên hệ
  tuitionFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionRegistration {
  id: string;
  studentName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  majorId: string;
  majorName: string;
  educationLevel: EducationLevel;
  graduationYear: string;
  previousSchool: string;
  academicRecord: string; // Học lực
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  zaloId?: string;
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
}