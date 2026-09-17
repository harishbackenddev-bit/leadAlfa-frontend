import React, { useState, useEffect, useRef } from "react";
import MessageSidebar from "../../creator/Messages/components/MessageSidebar";
import ChatArea from "../../creator/Messages/components/ChatArea";
import MessageAvatar from "../../../assets/images/campaign/chatImage.jpg";
import { useChat } from "../../../hooks/useChat";
import { useSocket } from "../../../hooks/useSocket";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getChatRooms,
  getChatMessages,
  uploadChatMedia,
  markChatAsRead,
} from "../../../services/api/chatService";
import { onNewMessage } from "../../../services/socket/socketService";

function mapChatMessage(msg, currentUserId) {
  return {
    id: msg.id,
    text: msg.text || msg.message,
    time: new Date(msg.createdAt || Date.now()).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    isOwn: String(msg.senderUserId) === String(currentUserId),
    file: msg.media?.[0]?.url,
    files: msg.media,
    fileType: msg.media?.length > 1 ? "media-group" : msg.media?.[0]?.type,
  };
}

export default function Messages() {
  const location = useLocation();
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const { socket, isConnected } = useSocket();
  const { send: socketSend, typing } = useChat(selectedMessageId);

  const currentUser = useSelector((state) => state.auth.user) || {};
  const userRole = currentUser.role || null;

  const selectedContact = chatRooms.find((msg) => msg.id === selectedMessageId);
  const selectedMessageIdRef = useRef(selectedMessageId);

  useEffect(() => {
    selectedMessageIdRef.current = selectedMessageId;
  }, [selectedMessageId]);

  // Fetch chat rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoadingRooms(true);
        const response = await getChatRooms();
        const rooms = response?.rooms || response || [];

        // Map to sidebar format — show the OTHER participant depending on current user's role

        const mappedRooms = rooms.map((room) => {
          const brand = room.brand || room.brandDetails || null;
          const creator = room.creator || room.creatorDetails || null;

          // Try multiple possible fields for the "other" participant
          const otherCandidates =
            userRole === "brand"
              ? [
                  creator,
                  room.otherParticipant,
                  room.participant,
                  room.creatorDetails,
                ]
              : [
                  brand,
                  room.otherParticipant,
                  room.participant,
                  room.brandDetails,
                ];

          const other =
            otherCandidates.find((c) => c && Object.keys(c).length > 0) || null;

          let name = "Unknown";
          let avatar = MessageAvatar;

          if (other) {
            if (other.companyName) {
              name = other.companyName;
              avatar = other.mediaLinks?.[0]?.mediaDetails?.url || avatar;
            } else if (other.firstName || other.lastName) {
              name = `${other.firstName ?? ""} ${other.lastName ?? ""}`.trim();
              avatar =
                other.mediaLinks?.find((l) => l.usageType === "profile_photo")
                  ?.mediaDetails?.url || avatar;
            } else if (other.name) {
              name = other.name;
            }
          }

          return {
            id: room.id ?? room.chatRoomId,
            name,
            campaignTitle:
              room.campaign?.campaignTitle || room.campaignTitle || "",
            message: room.lastMessage?.text || room.lastMessage || "",
            time: room.lastMessage?.createdAt || room.updatedAt,
            unread: room.unreadCount || 0,
            avatar,
          };
        });

        setChatRooms(mappedRooms);

        // If navigated with a specific room to open, select it
        const openRoomId = location?.state?.openRoomId;
        if (openRoomId) {
          setSelectedMessageId(openRoomId);
          setShowChat(true);
          return;
        }

        // Auto-select first room on large screens
        if (
          window.matchMedia("(min-width: 1024px)").matches &&
          mappedRooms.length > 0
        ) {
          setSelectedMessageId(mappedRooms[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // Fetch messages when a room is selected
  useEffect(() => {
    if (!selectedMessageId) return;

    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const response = await getChatMessages(selectedMessageId);
        const messages = response?.messages || response || [];

        setChatMessages(
          messages.map((msg) => mapChatMessage(msg, currentUser.id))
        );

        // Mark room as read
        markChatAsRead(selectedMessageId).catch(() => {});
        setChatRooms((prev) =>
          prev.map((room) =>
            String(room.id) === String(selectedMessageId)
              ? { ...room, unread: 0, unreadCount: 0 }
              : room
          )
        );
        window.dispatchEvent(
          new CustomEvent("chat:read", { detail: { chatRoomId: selectedMessageId } })
        );
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedMessageId]);

  // Listen for new chat messages only (reminders go to the notification panel).
  useEffect(() => {
    const cleanup = onNewMessage((newMsg) => {
      const mappedMsg = mapChatMessage(newMsg, currentUser.id);
      const activeRoomId = selectedMessageIdRef.current;

      if (String(newMsg.chatRoomId) === String(activeRoomId)) {
        setChatMessages((prev) => {
          if (newMsg.clientMessageId) {
            return prev.map((m) =>
              String(m.id) === String(newMsg.clientMessageId) ? mappedMsg : m
            );
          }
          if (prev.some((m) => String(m.id) === String(mappedMsg.id))) {
            return prev.map((m) =>
              String(m.id) === String(mappedMsg.id)
                ? { ...m, ...mappedMsg }
                : m
            );
          }
          return [...prev, mappedMsg];
        });

        markChatAsRead(activeRoomId).catch(() => {});
        window.dispatchEvent(
          new CustomEvent("chat:read", { detail: { chatRoomId: activeRoomId } })
        );
      }

      setChatRooms((prev) =>
        prev.map((room) =>
          String(room.id) === String(newMsg.chatRoomId)
            ? {
                ...room,
                message: newMsg.text || mappedMsg.text,
                time: newMsg.createdAt,
                unread:
                  String(newMsg.chatRoomId) === String(activeRoomId)
                    ? 0
                    : (room.unread || 0) + 1,
              }
            : room
        )
      );
    });

    return cleanup;
  }, [socket, currentUser.id]);

  const handleSelectMessage = (messageId) => {
    setSelectedMessageId(messageId);
    setShowChat(true); // Show chat on mobile when message selected
  };

  const handleBackToSidebar = () => {
    setShowChat(false);
    setSelectedMessageId(null);
  };

  const handleSendMessage = async (messageOrObj) => {
    if (!selectedMessageId) return;

    try {
      let newMessage;
      let mediaIds = [];

      // Handle file uploads first if present
      if (messageOrObj instanceof File || Array.isArray(messageOrObj)) {
        const formData = new FormData();
        const files = Array.isArray(messageOrObj)
          ? messageOrObj
          : [messageOrObj];

        files.forEach((file) => {
          formData.append("files", file);
        });

        // Upload media and get IDs
        const uploadedMedia = await uploadChatMedia(formData);
        mediaIds = uploadedMedia.map((m) => m.id);

        // Create preview message for UI (use temp id)
        if (Array.isArray(messageOrObj)) {
          const filesPreviews = messageOrObj.map((file) => {
            const fileType = file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
                ? "video"
                : file.type === "application/pdf"
                  ? "pdf"
                  : "document";

            return {
              id: Date.now() + Math.random(),
              url: URL.createObjectURL(file),
              type: fileType,
              name: file.name,
            };
          });

          const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
          newMessage = {
            id: tempId,
            text: "",
            time: new Date().toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: true,
            files: filesPreviews,
            fileType: "media-group",
          };
          setChatMessages((prev) => [...prev, newMessage]);
          const ack = await socketSend(newMessage.text || "", mediaIds, tempId);
          if (ack && ack.message) {
            const serverMsg = ack.message;
            const mappedAck = {
              id: serverMsg.id,
              text: serverMsg.text || serverMsg.message,
              time: new Date(
                serverMsg.createdAt || Date.now(),
              ).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              }),
              isOwn: String(serverMsg.senderUserId) === String(currentUser.id),
              file: serverMsg.media?.[0]?.url,
              files: serverMsg.media,
              fileType:
                serverMsg.media?.length > 1
                  ? "media-group"
                  : serverMsg.media?.[0]?.type,
            };
            setChatMessages((prev) => {
              // remove any existing message with server id or the temp id, then append mappedAck
              const cleaned = prev.filter(
                (m) =>
                  String(m.id) !== String(mappedAck.id) &&
                  String(m.id) !== String(tempId),
              );
              return [...cleaned, mappedAck];
            });
          }
        } else {
          const fileType = messageOrObj.type.startsWith("image/")
            ? "image"
            : messageOrObj.type.startsWith("video/")
              ? "video"
              : messageOrObj.type === "application/pdf"
                ? "pdf"
                : "document";

          const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
          newMessage = {
            id: tempId,
            text: "",
            time: new Date().toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: true,
            file: URL.createObjectURL(messageOrObj.file),
            fileType: fileType,
            fileName: messageOrObj.name,
          };
          setChatMessages((prev) => [...prev, newMessage]);
          const ack = await socketSend(newMessage.text || "", mediaIds, tempId);
          if (ack && ack.message) {
            const serverMsg = ack.message;
            const mappedAck = {
              id: serverMsg.id,
              text: serverMsg.text || serverMsg.message,
              time: new Date(
                serverMsg.createdAt || Date.now(),
              ).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              }),
              isOwn: String(serverMsg.senderUserId) === String(currentUser.id),
              file: serverMsg.media?.[0]?.url,
              files: serverMsg.media,
              fileType:
                serverMsg.media?.length > 1
                  ? "media-group"
                  : serverMsg.media?.[0]?.type,
            };
            setChatMessages((prev) => {
              const cleaned = prev.filter(
                (m) =>
                  String(m.id) !== String(mappedAck.id) &&
                  String(m.id) !== String(tempId),
              );
              return [...cleaned, mappedAck];
            });
          }
        }
      }
      // Handle text message or message with file info already formatted
      else if (typeof messageOrObj === "object" && messageOrObj.text) {
        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        newMessage = {
          id: tempId,
          text: messageOrObj.text,
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: true,
        };
        setChatMessages((prev) => [...prev, newMessage]);
        const ack = await socketSend(newMessage.text || "", mediaIds, tempId);
        if (ack && ack.message) {
          const serverMsg = ack.message;
          const mappedAck = {
            id: serverMsg.id,
            text: serverMsg.text || serverMsg.message,
            time: new Date(
              serverMsg.createdAt || Date.now(),
            ).toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: String(serverMsg.senderUserId) === String(currentUser.id),
            file: serverMsg.media?.[0]?.url,
            files: serverMsg.media,
            fileType:
              serverMsg.media?.length > 1
                ? "media-group"
                : serverMsg.media?.[0]?.type,
          };
          setChatMessages((prev) => {
            const cleaned = prev.filter(
              (m) =>
                String(m.id) !== String(mappedAck.id) &&
                String(m.id) !== String(tempId),
            );
            return [...cleaned, mappedAck];
          });
        }
      }
      // Handle plain text string
      else if (typeof messageOrObj === "string") {
        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        newMessage = {
          id: tempId,
          text: messageOrObj,
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: true,
        };
        setChatMessages((prev) => [...prev, newMessage]);
        const ack = await socketSend(newMessage.text || "", mediaIds, tempId);
        if (ack && ack.message) {
          const serverMsg = ack.message;
          const mappedAck = {
            id: serverMsg.id,
            text: serverMsg.text || serverMsg.message,
            time: new Date(
              serverMsg.createdAt || Date.now(),
            ).toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: String(serverMsg.senderUserId) === String(currentUser.id),
            file: serverMsg.media?.[0]?.url,
            files: serverMsg.media,
            fileType:
              serverMsg.media?.length > 1
                ? "media-group"
                : serverMsg.media?.[0]?.type,
          };
          setChatMessages((prev) => {
            const cleaned = prev.filter(
              (m) =>
                String(m.id) !== String(mappedAck.id) &&
                String(m.id) !== String(tempId),
            );
            return [...cleaned, mappedAck];
          });
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 overflow-hidden py-4">
      <div className="max-w-8xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex h-full relative">
          {/* Sidebar - Slides in/out on xs/sm/md, always visible on lg+ */}
          <div
            className={`w-full lg:w-80 border-r border-gray-50 h-full transition-transform duration-300 ease-in-out lg:translate-x-0 ${
              showChat
                ? "-translate-x-full lg:translate-x-0 lg:block"
                : "translate-x-0"
            }`}
          >
            <MessageSidebar
              messages={chatRooms}
              selectedMessageId={selectedMessageId}
              onSelectMessage={handleSelectMessage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isLoading={isLoadingRooms}
            />
          </div>

          {/* Chat area - Slides in from right on xs/sm/md, always visible on lg+ */}
          <div
            className={`absolute lg:relative inset-0 lg:inset-auto flex-1 h-full transition-transform duration-300 ease-in-out ${
              !showChat ? "translate-x-full lg:translate-x-0" : "translate-x-0"
            } ${!showChat ? "lg:block" : "block"}`}
          >
            <ChatArea
              selectedContact={selectedContact}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onBackToSidebar={handleBackToSidebar}
              showBackButton={showChat}
              isLoading={isLoadingMessages}
              isConnected={isConnected}
              onTyping={typing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
