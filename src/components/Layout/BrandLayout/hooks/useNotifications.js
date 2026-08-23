import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    // Mock notifications - replace with actual API call
    const mockNotifications = [
      {
        id: 1,
        title: 'New campaign request',
        message: 'You have a new campaign request from Brand XYZ',
        time: '5 min ago',
        read: false,
      },
      {
        id: 2,
        title: 'Payment received',
        message: 'Payment of $500 has been credited to your account',
        time: '1 hour ago',
        read: false,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const closeNotifications = () => {
    setIsNotificationOpen(false);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    isNotificationOpen,
    toggleNotifications,
    closeNotifications,
    markAsRead,
    markAllAsRead,
  };
};
