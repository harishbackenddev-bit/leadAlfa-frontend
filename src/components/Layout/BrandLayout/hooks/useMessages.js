import { useState, useEffect } from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  useEffect(() => {
    // Mock messages - replace with actual API call
    const mockMessages = [
      {
        id: 1,
        sender: 'John Doe',
        avatar: 'https://via.placeholder.com/40',
        message: 'Hey, can we discuss the campaign details?',
        time: '2 min ago',
        read: false,
      },
      {
        id: 2,
        sender: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40',
        message: 'Thanks for the quick response!',
        time: '10 min ago',
        read: false,
      },
    ];

    setMessages(mockMessages);
    setUnreadCount(mockMessages.filter(m => !m.read).length);
  }, []);

  const toggleMessages = () => {
    setIsMessageOpen(!isMessageOpen);
  };

  const closeMessages = () => {
    setIsMessageOpen(false);
  };

  const markAsRead = (id) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, read: true } : msg
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return {
    messages,
    unreadCount,
    isMessageOpen,
    toggleMessages,
    closeMessages,
    markAsRead,
  };
};
