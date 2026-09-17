import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import {
  joinRoom,
  sendMessage,
  sendTyping,
  onNewMessage,
  onTyping,
} from "../services/socket/socketService";

/**
 * Custom hook for chat functionality
 * @param {string} chatRoomId - The chat room ID to join
 * @returns {Object} Chat utilities and state
 */
export const useChat = (chatRoomId) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Join room when component mounts, chatRoomId changes, or socket connects
  useEffect(() => {
    const activeSocket = socket || getSocket();
    if (chatRoomId) {
      if (activeSocket?.connected || isConnected) {
        joinRoom(chatRoomId);
      }
      const handleConnect = () => {
        joinRoom(chatRoomId);
      };
      if (activeSocket) {
        activeSocket.on("connect", handleConnect);
      }
      return () => {
        if (activeSocket) {
          activeSocket.off("connect", handleConnect);
        }
      };
    }
  }, [chatRoomId, socket, isConnected]);

  // Listen for new messages
  useEffect(() => {
    const cleanup = onNewMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      cleanup();
    };
  }, [chatRoomId, socket]);

  // Listen for typing indicator
  useEffect(() => {
    if (!socket) return;

    let typingTimeout = null;

    const cleanup = onTyping(() => {
      setIsTyping(true);

      // Clear typing after 3 seconds
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    });

    return () => {
      cleanup();
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [socket]);

  /**
   * Send a chat message
   * @param {string} messageText
   * @param {Array<number>} mediaIds - Optional media IDs
   */
  const send = (messageText, mediaIds = [], clientMessageId) => {
    // Allow sending when there is text OR when mediaIds are provided
    if (
      !chatRoomId ||
      ((!messageText || !messageText.trim()) &&
        (!mediaIds || mediaIds.length === 0))
    )
      return;

    // Debug logging for outgoing messages
    console.log("💬 Sending message", { chatRoomId, messageText, mediaIds });

    // Return the promise from sendMessage so callers can reconcile optimistic UI
    return sendMessage({
      chatRoomId,
      message: messageText || "",
      mediaIds,
      clientMessageId,
    });
  };

  /**
   * Send typing indicator
   */
  const typing = () => {
    if (!chatRoomId) return;
    sendTyping(chatRoomId);
  };

  return {
    messages,
    isTyping,
    send,
    typing,
    isConnected,
  };
};

export default useChat;
