// Cấu hình URL của Backend Vercel mà bạn cung cấp
const formatToHCMTime = (dateStr: string) => {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    // �p dụng m�i giờ UTC+7
    return new Date(d.getTime() + (7 * 60 * 60 * 1000)).toISOString();
  } catch(e) {
    return new Date().toISOString();
  }
};

export const API_BASE_URL = 'https://nsg-miniapp-zalo-ipia.vercel.app/api';

/**
 * Hàm gọi API chung cho hệ thống, tự động bắt lỗi và parse JSON
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
    throw error; // Quăng lỗi ra để component gọi có thể hiện thông báo lỗi
  }
};

// =================== DANH SÁCH CÁC HÀM GET/POST/PUT/DELETE API ===================

// --- TIN TỨC ---
export const getNews = async () => {
  const data = await fetchAPI('/news');
  return data.map((item: any) => ({
    ...item,
    date: formatToHCMTime(item.created_at),
    image: item.image_url || 'https://via.placeholder.com/300x150',
    imageUrl: item.image_url || 'https://via.placeholder.com/300x150',
    summary: item.content ? item.content.substring(0, 100) + '...' : '',
    status: 'published'
  }));
};
export const addNews = (data: any) => fetchAPI('/news', { method: 'POST', body: JSON.stringify(data) });
export const updateNews = (id: string, data: any) => fetchAPI(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNews = (id: string) => fetchAPI(`/news/${id}`, { method: 'DELETE' });

// --- NGÀNH HỌC ---
export const getMajors = async () => {
  const data = await fetchAPI('/majors');
  return data.map((item: any) => ({
    ...item,
    isActive: true,
    status: 'active'
  }));
};
export const addMajor = (data: any) => fetchAPI('/majors', { method: 'POST', body: JSON.stringify(data) });
export const updateMajor = (id: string, data: any) => fetchAPI(`/majors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMajor = (id: string) => fetchAPI(`/majors/${id}`, { method: 'DELETE' });

// --- THÔNG BÁO ---
export const getNotifications = () => fetchAPI('/notifications');
export const addNotification = (data: any) => fetchAPI('/notifications', { method: 'POST', body: JSON.stringify(data) });
export const updateNotification = (id: string, data: any) => fetchAPI(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNotification = (id: string) => fetchAPI(`/notifications/${id}`, { method: 'DELETE' });

// --- SỰ KIỆN ---
export const getEvents = () => fetchAPI('/events');
export const addEvent = (data: any) => fetchAPI('/events', { method: 'POST', body: JSON.stringify(data) });
export const updateEvent = (id: string, data: any) => fetchAPI(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEvent = (id: string) => fetchAPI(`/events/${id}`, { method: 'DELETE' });

// --- ĐĂNG KÝ TUYỂN SINH ---
export const getAdmissions = () => fetchAPI('/admissions');
export const addAdmission = (data: any) => fetchAPI('/admissions', { method: 'POST', body: JSON.stringify(data) });
export const updateAdmissionStatus = (id: string, status: string) => fetchAPI(`/admissions/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteAdmission = (id: string) => fetchAPI(`/admissions/${id}`, { method: 'DELETE' });

// --- USERS (Người dùng, đồng bộ khi login Zalo) ---
export const syncZaloUser = (userData: { zalo_id: string; name: string; avatar: string }) => 
  fetchAPI('/users', { method: 'POST', body: JSON.stringify(userData) });



