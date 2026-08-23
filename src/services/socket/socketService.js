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
    console.log("✅ Socket connected:", socket.id);
    // Expose for quick debugging in browser console
    if (typeof window !== "undefined") {
      window.__socket = socket;
      window.__joinAttempts = window.__joinAttempts || [];
      console.log(
        "⚙️ debug: window.__socket set, check window.__joinAttempts for join payloads",
      );
    }
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  // Global event logger to aid debugging - logs every incoming event
  socket.onAny((event, ...args) => {
    console.log("🔔 socket event:", event, args);
  });

  // Handle servers that emit a join_room_error event instead of calling the emit ack
  socket.on("join_room_error", (err) => {
    console.warn(
      "⚠️ join_room_error received from server:",
      err,
      "lastJoinAttempt:",
      _lastJoinAttempt,
      "retry:",
      _lastJoinAttemptRetry,
    );
    // Try alternate formats only once
    if (_lastJoinAttempt && _lastJoinAttemptRetry === 1) {
      const original = _lastJoinAttempt;
      _lastJoinAttemptRetry = 2;
      // First try object payload
      console.log(
        "📥 join_room retrying with object payload (server emitted error)",
        { chatRoomId: original },
      );
      socket.emit("join_room", { chatRoomId: original }, (ack2) => {
        console.log("📥 join_room ack (object payload after error):", ack2);
        if (ack2 && ack2.statusCode === 404) {
          const altId =
            typeof original === "string" &&
            !String(original).startsWith("chat_")
              ? `chat_${original}`
              : `chat_${original}`;
          console.log(
            "📥 join_room retrying with prefixed id (after object failed):",
            altId,
          );
          socket.emit("join_room", altId, (ack3) => {
            console.log("📥 join_room ack (prefixed id after error):", ack3);
          });
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
    console.log("🔌 Socket disconnected manually");
  }
};

/**
 * Join a chat room
 * @param {string} chatRoomId
 */
export const joinRoom = (chatRoomId) => {
  if (socket?.connected) {
    console.log("📥 Emitting join_room", {
      chatRoomId,
      socketId: socket.id,
      connected: socket.connected,
    });

    // Always send object payload { chatRoomId } as server expects
    const payload = { chatRoomId };
    // Track last attempt for debugging
    _lastJoinAttempt = payload;
    _lastJoinAttemptRetry = 1;
    if (typeof window !== "undefined") {
      window.__joinAttempts = window.__joinAttempts || [];
      window.__joinAttempts.push({
        ts: Date.now(),
        payload,
        socketId: socket.id,
      });
    }

    socket.emit("join_room", payload, (ack) => {
      console.log("📥 join_room ack:", ack);
    });
    console.log("📥 Join attempt sent with object payload:", payload);
  } else {
    console.warn("📥 joinRoom called but socket not connected", {
      chatRoomId,
      socket,
    });
  }
};

/**
 * Send a message
 * @param {Object} messageData - { chatRoomId, message, mediaIds }
 */
export const sendMessage = (messageData) => {
  // Return a promise that resolves with server ack
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      console.log("📤 Emitting send_message", {
        socketId: socket.id,
        connected: socket.connected,
        messageData,
      });
      // include acknowledgement callback to detect server response
      socket.emit("send_message", messageData, (ack) => {
        console.log("📤 send_message ack:", ack);
        resolve(ack);
      });
    } else {
      console.warn("📤 sendMessage called but socket not connected", {
        messageData,
        socket,
      });
      reject(new Error("Socket not connected"));
    }
  });
};

/**
 * Send typing indicator
 * @param {string} chatRoomId
 */
export const sendTyping = (chatRoomId) => {
  if (socket?.connected) {
    socket.emit("typing", { chatRoomId });
  }
};

/**
 * Listen for new messages
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onNewMessage = (callback) => {
  if (socket) {
    const handler = (msg) => {
      console.log("📨 Received new_message", msg);
      try {
        callback(msg);
      } catch (e) {
        console.error("Handler error in onNewMessage callback", e);
      }
    };
    socket.on("new_message", handler);
    return () => socket.off("new_message", handler);
  }
  return () => {};
};

/**
 * Listen for new chat availability (when brand accepts application)
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onNewChatAvailable = (callback) => {
  if (socket) {
    socket.on("new_chat_available", callback);
    return () => socket.off("new_chat_available", callback);
  }
  return () => {};
};

/**
 * Listen for unread counts
 * @param {Function} callback
 * @returns {Function} cleanup function
 */
export const onUnreadCounts = (callback) => {
  if (socket) {
    socket.on("unread_counts", callback);
    return () => socket.off("unread_counts", callback);
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
  if (socket) {
    socket.on("user_online", onlineCallback);
    socket.on("user_offline", offlineCallback);
    return () => {
      socket.off("user_online", onlineCallback);
      socket.off("user_offline", offlineCallback);
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
  if (socket) {
    const handler = (payload) => {
      console.log("💭 Received typing event", payload);
      try {
        callback(payload);
      } catch (e) {
        console.error("Handler error in onTyping callback", e);
      }
    };
    socket.on("typing", handler);
    return () => socket.off("typing", handler);
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
  if (socket) {
    const handler = (payload) => {
      console.log("📦 work_submission_update", payload);
      try {
        callback(payload);
      } catch (e) {
        console.error("Handler error in onWorkSubmissionUpdate callback", e);
      }
    };
    socket.on("work_submission_update", handler);
    return () => socket.off("work_submission_update", handler);
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
