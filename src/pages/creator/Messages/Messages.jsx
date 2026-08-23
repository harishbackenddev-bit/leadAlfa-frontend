import React, { useState, useEffect } from "react";
import MessageSidebar from "./components/MessageSidebar";
import ChatArea from "./components/ChatArea";
import MessageAvatar from "../../../assets/images/campaign/chatImage.jpg";
import { useChat } from "../../../hooks/useChat";
import { useSocket } from "../../../hooks/useSocket";
import { useSelector } from "react-redux";
import {
  getChatRooms,
  getChatMessages,
  uploadChatMedia,
} from "../../../services/api/chatService";
import { onNewMessage } from "../../../services/socket/socketService";

export default function Messages() {
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

        // Map to chat format
        const mappedMessages = messages.map((msg) => ({
          id: msg.id,
          text: msg.text || msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: String(msg.senderUserId) === String(currentUser.id),
          file: msg.media?.[0]?.url,
          files: msg.media,
          fileType:
            msg.media?.length > 1 ? "media-group" : msg.media?.[0]?.type,
        }));

        setChatMessages(mappedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedMessageId]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket || !selectedMessageId) return;

    const cleanup = onNewMessage((newMsg) => {
      // Only add message if it's for the current room (coerce types)
      if (String(newMsg.chatRoomId) === String(selectedMessageId)) {
        const mappedMsg = {
          id: newMsg.id,
          text: newMsg.text || newMsg.message,
          time: new Date(newMsg.createdAt || Date.now()).toLocaleTimeString(
            "en-US",
            {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
          isOwn: String(newMsg.senderUserId) === String(currentUser.id),
          file: newMsg.media?.[0]?.url,
          files: newMsg.media,
          fileType:
            newMsg.media?.length > 1 ? "media-group" : newMsg.media?.[0]?.type,
        };
        setChatMessages((prev) => {
          // If server echoed a clientMessageId, replace that optimistic message
          if (newMsg.clientMessageId) {
            return prev.map((m) =>
              String(m.id) === String(newMsg.clientMessageId) ? mappedMsg : m,
            );
          }

          // If a message with the same server id already exists, update/merge it
          if (prev.some((m) => String(m.id) === String(mappedMsg.id))) {
            return prev.map((m) =>
              String(m.id) === String(mappedMsg.id)
                ? { ...m, ...mappedMsg }
                : m,
            );
          }

          // Otherwise append
          return [...prev, mappedMsg];
        });
      }

      // Update last message in sidebar
      setChatRooms((prev) =>
        prev.map((room) =>
          room.id === newMsg.chatRoomId
            ? { ...room, message: newMsg.text, time: newMsg.createdAt }
            : room,
        ),
      );
    });

    return cleanup;
  }, [socket, selectedMessageId]);

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
      let mediaIds = [];

      // Handle media upload for media-group (multiple files)
      if (
        messageOrObj &&
        typeof messageOrObj === "object" &&
        messageOrObj.fileType === "media-group" &&
        Array.isArray(messageOrObj.files)
      ) {
        const formData = new FormData();
        messageOrObj.files.forEach((fileObj) => {
          if (fileObj.file) {
            formData.append("files[]", fileObj.file);
          }
        });

        const uploadedMedia = await uploadChatMedia(formData);
        mediaIds = uploadedMedia.map((m) => m.id);

        // Optimistically add to UI (use a temp client id)
        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        // create preview URLs for optimistic display
        const filesPreviews = messageOrObj.files.map((fileObj) => ({
          id: Date.now() + Math.random(),
          file: URL.createObjectURL(fileObj.file),
          fileName: fileObj.fileName,
          fileType: fileObj.fileType,
        }));

        const newMessage = {
          id: tempId,
          text: messageOrObj.text || "",
          files: filesPreviews,
          fileType: "media-group",
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: true,
        };
        setChatMessages((prev) => [...prev, newMessage]);
        // send and reconcile
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
      // Handle single file upload
      else if (
        messageOrObj &&
        typeof messageOrObj === "object" &&
        ("file" in messageOrObj || messageOrObj.fileType)
      ) {
        if (messageOrObj.file) {
          const formData = new FormData();
          formData.append("files[]", messageOrObj.file);

          const uploadedMedia = await uploadChatMedia(formData);
          mediaIds = uploadedMedia.map((m) => m.id);
        }

        // Optimistically add to UI
        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        const newMessage = {
          id: tempId,
          text: messageOrObj.text || "",
          file: URL.createObjectURL(messageOrObj.file),
          fileName: messageOrObj.fileName,
          mimeType: messageOrObj.mimeType,
          fileType: messageOrObj.fileType,
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
      // Plain text message
      else {
        // Optimistically add to UI
        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        const newMessage = {
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

      // sending handled per-branch above (with ack reconciliation)
    } catch (error) {
      console.error("Failed to send message:", error);
      // Could add error notification here
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50 overflow-hidden py-4">
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
              isConnected={isConnected}
              isLoading={isLoadingMessages}
              onTyping={typing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
