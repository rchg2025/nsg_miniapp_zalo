// Notification management system
export interface Notification {
  id: number;
  title: string;
  message: string;
  category: string;
  date: string;
  isRead: boolean;
  type: 'news' | 'announcement' | 'system' | 'major';
  relatedId?: number;
}

// Create notification when news is added/updated
export const createNewsNotification = (newsItem: any) => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: Date.now(),
    title: newsItem.category === 'announcement' ? 'Thông báo mới' : 'Tin tức mới',
    message: `"${newsItem.title}" vừa được đăng`,
    category: newsItem.category === 'announcement' ? 'Thông báo' : 'Tin tức', 
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    type: newsItem.category === 'announcement' ? 'announcement' : 'news',
    relatedId: newsItem.id
  };
  
  notifications.unshift(newNotification); // Add to beginning
  saveNotifications(notifications);
  return newNotification;
};

// Create notification when major is added/updated
export const createMajorNotification = (majorItem: any) => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: Date.now(),
    title: 'Ngành đào tạo mới',
    message: `Ngành "${majorItem.name}" vừa được thêm vào chương trình đào tạo`,
    category: 'Ngành đào tạo',
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    type: 'major',
    relatedId: majorItem.id
  };
  
  notifications.unshift(newNotification);
  saveNotifications(notifications);
  return newNotification;
};

// Get all notifications
export const getNotifications = (): Notification[] => {
  const stored = localStorage.getItem('userNotifications');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with default notifications
  const defaultNotifications: Notification[] = [
    {
      id: 1,
      title: "Chào mừng đến với Trường Cao đẳng Bách khoa Nam Sài Gòn",
      message: "Cảm ơn bạn đã sử dụng hệ thống thông tin của trường",
      category: "Hệ thống",
      date: "2025-09-23",
      isRead: false,
      type: 'system'
    }
  ];
  
  saveNotifications(defaultNotifications);
  return defaultNotifications;
};

// Save notifications to localStorage
export const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem('userNotifications', JSON.stringify(notifications));
  
  // Trigger storage event for real-time updates
  window.dispatchEvent(new Event('notifications-updated'));
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: number) => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notif => 
    notif.id === notificationId ? { ...notif, isRead: true } : notif
  );
  saveNotifications(updatedNotifications);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
  saveNotifications(updatedNotifications);
};

// Delete notification
export const deleteNotification = (notificationId: number) => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
  saveNotifications(updatedNotifications);
};

// Get unread count
export const getUnreadNotificationCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(notif => !notif.isRead).length;
};

// Get statistics for profile
export const getNotificationStats = () => {
  const notifications = getNotifications();
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  const totalCount = notifications.length;
  
  return {
    unread: unreadCount,
    total: totalCount
  };
};