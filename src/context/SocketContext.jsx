import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  initializeSocket,
  disconnectSocket,
  getSocket,
  onNewChatAvailable,
  onUnreadCounts,
  onUserPresence,
  onWorkSubmissionUpdate,
  isReminderSocketPayload,
  mapReminderPayloadToChatMessage,
} from "../services/socket/socketService";
import { useNotification } from "./NotificationContext";
import { queryClient } from "../services/tanstack/queryClient";
import { queryKeys } from "../services/tanstack/queryKeys";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { showNotification } = useNotification();
  const userRole = user?.role || null;

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    // Initialize socket connection
    const socket = initializeSocket(token);

    if (socket?.connected) {
      setIsConnected(true);
    }

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Listen for new chat notifications (when brand accepts application)
    const cleanupNewChat = onNewChatAvailable((data) => {
      const { campaignTitle, brandName } = data;
      showNotification({
        type: "success",
        message: `🎉 Your application was accepted by ${brandName || "a brand"}!`,
        description: `Campaign: ${campaignTitle}`,
      });
      console.log("📬 New chat available:", data);

      // Refetch chat rooms to show the new conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat?.rooms || ["chat", "rooms"],
      });
    });

    // Listen for unread counts
    const cleanupUnread = onUnreadCounts((counts) => {
      setUnreadCounts(counts);
    });

    // Listen for user presence (optional)
    const cleanupPresence = onUserPresence(
      () => {},
      () => {},
    );

    // Brand: creator review reminder (Ping Brand)
    const cleanupWorkSubmission =
      userRole === "brand"
        ? onWorkSubmissionUpdate((payload) => {
            if (!isReminderSocketPayload(payload)) return;

            const mapped = mapReminderPayloadToChatMessage(payload);
            const creatorLabel = mapped.creatorName
              ? ` from ${mapped.creatorName}`
              : "";
            const campaignLabel = mapped.campaignTitle
              ? ` · ${mapped.campaignTitle}`
              : "";

            showNotification({
              type: "reminder",
              title: `Review reminder${creatorLabel}`,
              message: `Review reminder${creatorLabel}`,
              description: `${mapped.text}${campaignLabel}`,
              meta: {
                jobPublicId: mapped.jobPublicId,
                submissionPublicId: mapped.submissionPublicId,
                campaignTitle: mapped.campaignTitle,
                creatorName: mapped.creatorName,
              },
            });
          })
        : () => {};

    // Cleanup on unmount
    return () => {
      cleanupNewChat();
      cleanupUnread();
      cleanupPresence();
      cleanupWorkSubmission();
      disconnectSocket();
    };
  }, [isAuthenticated, showNotification, userRole]);

  const value = {
    socket: getSocket(),
    isConnected,
    unreadCounts,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
