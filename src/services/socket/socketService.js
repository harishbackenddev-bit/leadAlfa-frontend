import { io } from "socket.io-client";

let socket = null;
// Track last join attempt and retry state for servers that emit errors instead of using acks
let _lastJoinAttempt = null;
let _lastJoinAttemptRetry = 0;

/**
 * Initialize socket connection with JWT authentication
 * @param {string} token - JWT access token
 * @returns {Socket} socket instance
 */
export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  const SOCKET_URL =
    import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
    "http://localhost:3000";

  socket = io(SOCKET_URL, {
    auth: {
      token: token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Connection events
  socket.on("connect", () => {
    if (typeof window !== "undefined") {
      window.__socket = socket;
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  // Handle servers that emit a join_room_error event instead of calling the emit ack
  socket.on("join_room_error", (err) => {
    if (_lastJoinAttempt && _lastJoinAttemptRetry === 1) {
      const original = _lastJoinAttempt;
      _lastJoinAttemptRetry = 2;
      socket.emit("join_room", { chatRoomId: original }, (ack2) => {
        if (ack2 && ack2.statusCode === 404) {
          const altId =
            typeof original === "string" &&
            !String(original).startsWith("chat_")
              ? `chat_${original}`
              : `chat_${original}`;
          socket.emit("join_room", altId, () => {});
        }
      });
    }
  });

  return socket;
};

/**
 * Get current socket instance
 * @returns {Socket|null}
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Join a chat room
 * @param {string} chatRoomId
 */
export const joinRoom = (chatRoomId) => {
  const activeSocket = socket || getSocket();
  if (activeSocket?.connected) {
    const payload = { chatRoomId };
    _lastJoinAttempt = payload;
    _lastJoinAttemptRetry = 1;
    if (typeof window !== "undefined") {
      window.__joinAttempts = window.__joinAttempts || [];
      window.__joinAttempts.push({
        ts: Date.now(),
        payload,
        socketId: activeSocket.id,
      });
    }

    activeSocket.emit("join_room", payload, () => {});
  }
};

/**
 * Send a message
 * @param {Object} messageData - { chatRoomId, message, mediaIds }
 */
export const sendMessage = (messageData) => {
  const activeSocket = socket || getSocket();
  return new Promise((resolve, reject) => {
    if (activeSocket?.connected) {
      activeSocket.emit("send_message", messageData, (ack) => {
        resolve(ack);
      });
    } else {
      reject(new Error("Socket not connected"));
    }
  });
};

/**
 * Send typing indicator
 * @param {string} chatRoomId
 */
export const sendTyping = (chatRoomId) => {
  const activeSocket = socket || getSocket();
  if (activeSocket?.connected) {
    activeSocket.emit("typing", { chatRoomId });
  }
};

/**
 * Listen for new messages
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onNewMessage = (callback) => {
  const activeSocket = socket || getSocket();
  if (activeSocket) {
    const handler = (msg) => {
      try {
        callback(msg);
      } catch (e) {
        console.error("Handler error in onNewMessage callback", e);
      }
    };
    activeSocket.on("new_message", handler);
    return () => {
      const s = socket || activeSocket;
      if (s && typeof s.off === "function") {
        s.off("new_message", handler);
      }
    };
  }
  return () => {};
};

/**
 * Listen for new chat availability (when brand accepts application)
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onNewChatAvailable = (callback) => {
  const activeSocket = socket || getSocket();
  if (activeSocket) {
    activeSocket.on("new_chat_available", callback);
    return () => {
      const s = socket || activeSocket;
      if (s && typeof s.off === "function") {
        s.off("new_chat_available", callback);
      }
    };
  }
  return () => {};
};

/**
 * Listen for unread counts
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onUnreadCounts = (callback) => {
  const activeSocket = socket || getSocket();
  if (activeSocket) {
    activeSocket.on("unread_counts", callback);
    return () => {
      const s = socket || activeSocket;
      if (s && typeof s.off === "function") {
        s.off("unread_counts", callback);
      }
    };
  }
  return () => {};
};

/**
 * Listen for user online/offline status
 * @param {Function} onlineCallback
 * @param {Function} offlineCallback
 * @returns {Function} cleanup function
 */
export const onUserPresence = (onlineCallback, offlineCallback) => {
  const activeSocket = socket || getSocket();
  if (activeSocket) {
    activeSocket.on("user_online", onlineCallback);
    activeSocket.on("user_offline", offlineCallback);
    return () => {
      const s = socket || activeSocket;
      if (s && typeof s.off === "function") {
        s.off("user_online", onlineCallback);
        s.off("user_offline", offlineCallback);
      }
    };
  }
  return () => {};
};

/**
 * Listen for typing indicator
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onTyping = (callback) => {
  const activeSocket = socket || getSocket();
  if (activeSocket) {
    const handler = (payload) => {
      try {
        callback(payload);
      } catch (e) {
        console.error("Handler error in onTyping callback", e);
      }
    };
    activeSocket.on("typing", handler);
    return () => {
      const s = socket || activeSocket;
      if (s && typeof s.off === "function") {
        s.off("typing", handler);
      }
    };
  }
  return () => {};
};

/**
 * Listen for work submission updates (creator review outcomes, brand reminders, etc.)
 * Event: "work_submission_update"
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onWorkSubmissionUpdate = (callback) => {
  const activeSocket = socket || getSocket();
  if (activeSocket) {
    const handler = (payload) => {
      try {
        callback(payload);
      } catch (e) {
        console.error("Handler error in onWorkSubmissionUpdate callback", e);
      }
    };
    activeSocket.on("work_submission_update", handler);
    return () => {
      const s = socket || activeSocket;
      if (s && typeof s.off === "function") {
        s.off("work_submission_update", handler);
      }
    };
  }
  return () => {};
};

/** True when a work_submission_update payload is a creator review reminder. */
export const isReminderSocketPayload = (payload) => {
  const type = String(payload?.type || "").toLowerCase();
  return (
    type === "reminder_sent" ||
    type === "submission_reminder" ||
    type === "reminder" ||
    type === "review_reminder"
  );
};

/** Map a reminder socket payload into a chat message shape. */
export const mapReminderPayloadToChatMessage = (payload = {}) => {
  const text =
    payload.message ||
    payload.reminderMessage ||
    payload.text ||
    "Creator sent a review reminder.";

  const createdAt = payload.createdAt || payload.sentAt || Date.now();

  return {
    id:
      payload.messageId ||
      payload.id ||
      `reminder_${payload.submissionPublicId || payload.jobPublicId || Date.now()}`,
    text,
    time: new Date(createdAt).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    createdAt,
    isOwn: false,
    isReminder: true,
    chatRoomId:
      payload.chatRoomId ?? payload.roomId ?? payload.chatRoom?.id ?? null,
    campaignTitle: payload.campaignTitle || payload.campaign?.title || "",
    creatorName:
      payload.creatorName ||
      payload.creator?.publicName ||
      payload.creator?.name ||
      "",
    submissionPublicId: payload.submissionPublicId || null,
    jobPublicId: payload.jobPublicId || null,
  };
};
