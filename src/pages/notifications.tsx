import React, { useState, useEffect } from "react";
import { Box, Button, Icon, List, Page, Text, Header, Modal } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  Notification 
} from "@/utils/notifications";
import { labelForCategory } from "@/utils/data-normalization";

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [openDetail, setOpenDetail] = useState<Notification | null>(null);

  useEffect(() => {
    // Load notifications using the utility function
    const loadNotifications = () => {
      const allNotifications = getNotifications();
      setNotifications(allNotifications);
    };

    loadNotifications();

    // Listen for notification updates
    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('notifications-updated', handleNotificationUpdate);
    window.addEventListener('storage', handleNotificationUpdate);

    return () => {
      window.removeEventListener('notifications-updated', handleNotificationUpdate);
      window.removeEventListener('storage', handleNotificationUpdate);
    };
  }, []);

  const markAsRead = (notificationId: number) => {
    markNotificationAsRead(notificationId);
  };

  const openNotification = (notif: Notification) => {
    // Mark as read
    if (!notif.isRead) markNotificationAsRead(notif.id);
    // Navigate based on type & related id
    if (notif.relatedId) {
      if (notif.type === 'news' || notif.type === 'announcement') {
        navigate(`/news/${notif.relatedId}`);
        return;
      }
      if (notif.type === 'major') {
        navigate(`/majors/${notif.relatedId}`);
        return;
      }
    }
    // If no related navigation, show detail modal
    setOpenDetail(notif);
  };

  const markAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const deleteNotif = (notificationId: number) => {
    deleteNotification(notificationId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return 'zi-notif';
      case 'news': return 'zi-bookmark';
      case 'system': return 'zi-setting';
      case 'major': return 'zi-calendar';
      default: return 'zi-notif';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'text-red-500';
      case 'news': return 'text-blue-500';
      case 'system': return 'text-green-500';
      case 'major': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread') {
      return !notif.isRead;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Th�ng b�o"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />

      {/* Header Stats and Actions */}
      <Box className="bg-white p-4 border-b border-gray-200">
        <Box className="flex items-center justify-between mb-3">
          <Text.Title className="text-lg">
            Th�ng b�o ({notifications.length})
          </Text.Title>
          {unreadCount > 0 && (
            <Button
              size="small"
              variant="secondary"
              onClick={markAllAsRead}
              className="text-blue-600"
            >
              Đ�nh dấu tất cả đ� đọc
            </Button>
          )}
        </Box>

        {/* Filter Tabs */}
        <Box className="flex space-x-2">
          <Button
            size="small"
            variant={activeTab === 'all' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('all')}
            className={activeTab === 'all' ? 'bg-blue-600' : ''}
          >
            Tất cả ({notifications.length})
          </Button>
          <Button
            size="small"
            variant={activeTab === 'unread' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('unread')}
            className={activeTab === 'unread' ? 'bg-red-600' : ''}
          >
            Chưa đọc ({unreadCount})
          </Button>
        </Box>
      </Box>

      {/* Notifications List */}
      <Box className="p-4">
        {filteredNotifications.length === 0 ? (
          <Box className="text-center py-8">
            <Icon icon="zi-notif" className="text-gray-400 text-4xl mb-3" />
            <Text className="text-gray-500">
              {activeTab === 'unread' ? 'Kh�ng c� th�ng b�o chưa đọc' : 'Chưa c� th�ng b�o n�o'}
            </Text>
          </Box>
        ) : (
          <Box className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Box
                key={notification.id}
                className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                  notification.isRead 
                    ? 'border-gray-300 opacity-75' 
                    : notification.type === 'announcement' 
                      ? 'border-red-500' 
                      : notification.type === 'news' 
                        ? 'border-blue-500' 
                        : 'border-green-500'
                } hover:bg-gray-50 cursor-pointer`}
                onClick={() => openNotification(notification)}
              >
                <Box className="flex items-start justify-between">
                  <Box className="flex items-start space-x-3 flex-1">
                    <Icon 
                      icon={getTypeIcon(notification.type)} 
                      className={`mt-1 ${getTypeColor(notification.type)}`} 
                    />
                    <Box className="flex-1">
                      <Box className="flex items-center space-x-2 mb-1">
                        <Text className={`font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                          {notification.title}
                        </Text>
                        {!notification.isRead && (
                          <Box className="w-2 h-2 bg-red-500 rounded-full"></Box>
                        )}
                      </Box>
                      <Text className={`text-sm mb-2 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </Text>
                      <Box className="flex items-center justify-between">
                        <Text className="text-xs text-gray-500">
                          {labelForCategory(notification.type === 'major' ? 'admission' : notification.type)} � {notification.date}
                        </Text>
                        <Box className="flex space-x-2">
                          {!notification.isRead && (
                            <Button
                              size="small"
                              variant="secondary"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              Đ�nh dấu đ� đọc
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="secondary"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600"
                          >
                            X�a
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Bottom padding for navigation */}
      <Box className="h-20"></Box>

      <Modal
        visible={!!openDetail}
        title={openDetail?.title || 'Th�ng b�o'}
        onClose={() => setOpenDetail(null)}
        maskClosable
      >
        <Box className="space-y-3">
          <Text className="text-sm text-gray-700 whitespace-pre-line">
            {openDetail?.message}
          </Text>
          <Text className="text-xs text-gray-500">
            {openDetail && (labelForCategory(openDetail.type === 'major' ? 'admission' : openDetail.type))} � {openDetail?.date}
          </Text>
          <Button fullWidth onClick={() => setOpenDetail(null)}>Đ�ng</Button>
        </Box>
      </Modal>
    </Page>
  );
}

export default NotificationsPage;