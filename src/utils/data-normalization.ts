// Centralized data normalization utilities
import { Major, NewsItem } from "@/types";

export const CATEGORY_LABELS: Record<string, string> = {
  announcement: 'Thông báo',
  news: 'Tin tức',
  admission: 'Ngành tuyển sinh'
};

export const EDUCATION_LEVEL_LABELS: Record<string, string> = {
  college: 'Cao đẳng',
  vocational: 'Trung cấp',
  bachelor: 'Đại học',
  university: 'Đại học',
  highschool: 'Trung học phổ thông',
  intermediate: 'Trung cấp',
  advanced: 'Cao đẳng',
  bridge_college: 'Cao đẳng liên thông',
  'COLLEGE': 'Cao đẳng',
  'VOCATIONAL': 'Trung cấp',
  'BRIDGE_COLLEGE': 'Cao đẳng liên thông'
};

export function labelForCategory(raw: string | undefined): string {
  if (!raw) return 'Khác';
  return CATEGORY_LABELS[raw] || raw;
}

export function labelForEducationLevel(raw: string | undefined): string {
  if (!raw) return 'Khác';
  return EDUCATION_LEVEL_LABELS[raw] || raw;
}

// Normalize a single major object coming from arbitrary admin schema
export function normalizeMajor(input: any): Major {
  return {
    id: String(input.id || input._id || Date.now() + Math.random()),
    name: input.name || 'Chưa đặt tên',
    code: input.code || 'N/A',
    description: input.description || 'Đang cập nhật mô tả ngành...',
    image: input.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    duration: input.duration || '3 năm',
    educationLevels: input.educationLevels && Array.isArray(input.educationLevels) && input.educationLevels.length > 0
      ? input.educationLevels
      : ['college','vocational'],
    requirements: input.requirements || ["Tốt nghiệp THPT"],
    careerProspects: input.careerProspects || ["Cơ hội nghề nghiệp rộng mở"],
    tuitionFee: Number(input.tuitionFee ?? input.tuition ?? 0),
    isActive: input.isActive !== false,
    createdAt: input.createdAt || input.date || new Date().toISOString(),
    updatedAt: input.updatedAt || input.modifiedAt || new Date().toISOString(),
  } as Major;
}

export function normalizeMajors(list: any[]): Major[] {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeMajor);
}

// Normalize news item
export function normalizeNewsItem(input: any): Partial<NewsItem> & { id: number } {
  const id = Number(input.id || input._id || Date.now() + Math.random());
  const category = input.category || 'news';
  return {
    id,
    title: input.title || 'Chưa có tiêu đề',
    summary: input.summary || (input.content ? String(input.content).substring(0,150) + '...' : 'Đang cập nhật nội dung...'),
    content: input.content || input.body || '',
    image: input.image || '/api/placeholder/300/200',
    category,
    date: input.date || input.createdAt || new Date().toISOString().split('T')[0],
    author: input.author || 'Admin',
    authorId: input.authorId || 'admin',
    isHot: Boolean(input.isHot),
    status: input.status || 'published',
    views: Number(input.views || 0),
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}

export function normalizeNewsList(list: any[]): (Partial<NewsItem> & { id: number })[] {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeNewsItem);
}

// Optional migration to rewrite stored data in normalized form (idempotent)
export function migrateStoredData() {
  try {
    const majorsRaw = localStorage.getItem('adminMajorsList');
    if (majorsRaw) {
      const parsed = JSON.parse(majorsRaw);
      const normalized = normalizeMajors(parsed);
      localStorage.setItem('adminMajorsList', JSON.stringify(normalized));
    }
  } catch (e) { console.warn('Major migration skipped', e); }
  try {
    const newsRaw = localStorage.getItem('adminNewsList');
    if (newsRaw) {
      const parsed = JSON.parse(newsRaw);
      const normalized = normalizeNewsList(parsed);
      localStorage.setItem('adminNewsList', JSON.stringify(normalized));
    }
  } catch (e) { console.warn('News migration skipped', e); }
}
