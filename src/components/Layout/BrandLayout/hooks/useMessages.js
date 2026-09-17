import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getChatRooms } from '../../../../services/api/chatService';
import { useSocket } from '../../../../hooks/useSocket';
import { onNewMessage } from '../../../../services/socket/socketService';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const location = useLocation();
  const { socket } = useSocket();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getChatRooms();
      const rooms = response?.rooms || response || [];
      if (Array.isArray(rooms)) {
        setMessages((prevMessages) => {
          const updatedRooms = rooms.map((room) => {
            const roomId = room.id ?? room.chatRoomId;
            const prev = prevMessages.find(
              (p) => String(p.id ?? p.chatRoomId) === String(roomId)
            );
            if (prev && (prev.unread === 0 || prev.unreadCount === 0)) {
              return { ...room, unread: 0, unreadCount: 0 };
            }
            return room;
          });
          const totalUnread = updatedRooms.reduce(
            (sum, r) => sum + (r.unreadCount || r.unread || 0),
            0
          );
          setUnreadCount(totalUnread);
          return updatedRooms;
        });
      }
    } catch (error) {
      setUnreadCount(0);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount, location.pathname]);

  useEffect(() => {
    const handleChatRead = (e) => {
      const readRoomId = e?.detail?.chatRoomId;
      if (readRoomId) {
        setMessages((prev) =>
          prev.map((r) =>
            String(r.id ?? r.chatRoomId) === String(readRoomId)
              ? { ...r, unread: 0, unreadCount: 0 }
              : r
          )
        );
      }
      fetchUnreadCount();
    };

    window.addEventListener("chat:read", handleChatRead);
    return () => window.removeEventListener("chat:read", handleChatRead);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!socket) return;
    const cleanup = onNewMessage(() => {
      fetchUnreadCount();
    });
    return cleanup;
  }, [socket, fetchUnreadCount]);

  const toggleMessages = () => {
    setIsMessageOpen(!isMessageOpen);
  };

  const closeMessages = () => {
    setIsMessageOpen(false);
  };

  const markAsRead = (id) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, unread: 0, unreadCount: 0 } : msg
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
    refreshUnreadCount: fetchUnreadCount,
  };
};

