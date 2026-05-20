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
// Supports both camelCase (frontend) and snake_case (PostgreSQL API response)
export function normalizeMajor(input: any): Major {
  // Parse education_level / educationLevels from DB (stored as single string or array)
  let educationLevels: string[];
  const rawLevel = input.educationLevels || input.education_level || input.educationLevel;
  if (Array.isArray(rawLevel) && rawLevel.length > 0) {
    educationLevels = rawLevel;
  } else if (typeof rawLevel === 'string' && rawLevel.trim()) {
    educationLevels = [rawLevel.trim()];
  } else {
    educationLevels = ['college', 'vocational'];
  }

  // Parse career_prospects / careerProspects (stored as TEXT, may be JSON array or plain string)
  const rawCareer = input.careerProspects || input.career_prospects;
  let careerProspects: string[];
  if (Array.isArray(rawCareer)) {
    careerProspects = rawCareer;
  } else if (typeof rawCareer === 'string' && rawCareer.trim()) {
    try { careerProspects = JSON.parse(rawCareer); } catch { careerProspects = [rawCareer]; }
  } else {
    careerProspects = ["Cơ hội nghề nghiệp rộng mở"];
  }

  // Parse requirements (may be JSON array or plain string)
  const rawReq = input.requirements;
  let requirements: string[];
  if (Array.isArray(rawReq)) {
    requirements = rawReq;
  } else if (typeof rawReq === 'string' && rawReq.trim()) {
    try { requirements = JSON.parse(rawReq); } catch { requirements = [rawReq]; }
  } else {
    requirements = ["Tốt nghiệp THPT"];
  }

  // tuition_fee from DB (snake_case)
  const rawTuition = input.tuitionFee ?? input.tuition_fee ?? input.tuition;
  const tuitionFee = rawTuition !== undefined && rawTuition !== null && rawTuition !== ''
    ? Number(rawTuition)
    : 0;

  return {
    id: String(input.id || input._id || Date.now() + Math.random()),
    name: input.name || 'Chưa đặt tên',
    code: input.code || 'N/A',
    description: input.description || 'Đang cập nhật mô tả ngành...',
    image: input.image || input.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    duration: input.duration || '',
    educationLevels,
    requirements,
    careerProspects,
    tuitionFee,
    subjects: input.subjects || '',
    website: input.website || '',
    isActive: input.isActive !== false,
    createdAt: input.createdAt || input.created_at || input.date || new Date().toISOString(),
    updatedAt: input.updatedAt || input.updated_at || input.modifiedAt || new Date().toISOString(),
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
