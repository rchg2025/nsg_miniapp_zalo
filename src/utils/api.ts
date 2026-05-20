// Cấu hình URL của Backend Vercel mà bạn cung cấp
import { convertGoogleDriveUrl } from './image-utils';

const normalizeNewsCategory = (cat: string): string => {
  if (!cat) return 'news';
  const lc = cat.toLowerCase();
  if (lc.includes('s\u1ef1 ki\u1ec7n') || lc.includes('su kien') || lc === 'event') return 'event';
  if (lc.includes('th\u00f4ng b\u00e1o') || lc.includes('thong bao') || lc === 'announcement') return 'announcement';
  if (lc.includes('tin t\u1ee9c') || lc.includes('tin tuc') || lc === 'news') return 'news';
  return lc;
};

const formatToHCMTime = (dateStr: string) => {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    // �p d?ng m�i gi? UTC+7
    return new Date(d.getTime() + (7 * 60 * 60 * 1000)).toISOString();
  } catch(e) {
    return new Date().toISOString();
  }
};

export const API_BASE_URL = 'https://nsg-miniapp-zalo-ipia.vercel.app/api';

/**
 * Hàm gọi API chung cho h�? th�?ng, tự �?�?ng bắt l�?i và parse JSON
 */
export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch API Error for ${endpoint}:`, error);
    throw error; // Qu�?ng l�?i ra �?�? component gọi có th�? hi�?n thông báo l�?i
  }
};

// =================== DANH SÁCH CÁC H�?M GET/POST/PUT/DELETE API ===================

// --- TIN TỨC ---
export const getNews = async () => {
  const data = await fetchAPI('/news');
  return data.map((item: any) => ({
    ...item,
    date: formatToHCMTime(item.created_at),
    image: convertGoogleDriveUrl(item.image_url || ''),
    imageUrl: convertGoogleDriveUrl(item.image_url || ''),
    category: normalizeNewsCategory(item.category),
    summary: item.content ? item.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 100) + '...' : '',
    status: 'published'
  }));
};
export const addNews = (data: any) => fetchAPI('/news', { method: 'POST', body: JSON.stringify(data) });
export const updateNews = (id: string, data: any) => fetchAPI(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNews = (id: string) => fetchAPI(`/news/${id}`, { method: 'DELETE' });

// --- NG�?NH H�?C ---
export const getMajors = async () => {
  const data = await fetchAPI('/majors');
  return data.map((item: any) => {
    // Normalize career_prospects (may be JSON string or array)
    let careerProspects = item.career_prospects || item.careerProspects || [];
    if (!Array.isArray(careerProspects)) {
      try { careerProspects = JSON.parse(careerProspects); } catch { careerProspects = careerProspects ? [careerProspects] : []; }
    }
    // Normalize subjects (may be JSON string or array)
    let subjects = item.subjects || [];
    if (!Array.isArray(subjects)) {
      try { subjects = JSON.parse(subjects); } catch { subjects = subjects ? [subjects] : []; }
    }
    return {
      ...item,
      tuitionFee: Number(item.tuition_fee ?? item.tuitionFee ?? 0),
      educationLevel: item.education_level || item.educationLevel || 'caodang',
      imageUrl: convertGoogleDriveUrl(item.image_url || item.imageUrl || ''),
      careerProspects,
      subjects,
      isActive: true,
      status: 'active'
    };
  });
};
export const addMajor = (data: any) => fetchAPI('/majors', { method: 'POST', body: JSON.stringify(data) });
export const updateMajor = (id: string, data: any) => fetchAPI(`/majors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMajor = (id: string) => fetchAPI(`/majors/${id}`, { method: 'DELETE' });

// --- TH�?NG BÁO ---
export const getNotifications = () => fetchAPI('/notifications');
export const addNotification = (data: any) => fetchAPI('/notifications', { method: 'POST', body: JSON.stringify(data) });
export const updateNotification = (id: string, data: any) => fetchAPI(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNotification = (id: string) => fetchAPI(`/notifications/${id}`, { method: 'DELETE' });

// --- SỰ KI�?N ---
export const getEvents = () => fetchAPI('/events');
export const addEvent = (data: any) => fetchAPI('/events', { method: 'POST', body: JSON.stringify(data) });
export const updateEvent = (id: string, data: any) => fetchAPI(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEvent = (id: string) => fetchAPI(`/events/${id}`, { method: 'DELETE' });

// --- Đ�?NG KÝ TUY�?N SINH ---
export const getAdmissions = () => fetchAPI('/admissions');
export const addAdmission = (data: any) => fetchAPI('/admissions', { method: 'POST', body: JSON.stringify(data) });
export const updateAdmissionStatus = (id: string, status: string) => fetchAPI(`/admissions/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteAdmission = (id: string) => fetchAPI(`/admissions/${id}`, { method: 'DELETE' });

// --- USERS (Người dùng, �?�?ng b�? khi login Zalo) ---
export const syncZaloUser = (userData: { zalo_id: string; name: string; avatar: string }) => 
  fetchAPI('/users', { method: 'POST', body: JSON.stringify(userData) });



