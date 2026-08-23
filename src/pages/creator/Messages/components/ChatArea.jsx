import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import SendBtn from "../../../../assets/images/campaign/sendBtn.png";
import imageSelector from "../../../../assets/SVGs/messages/imageSelector.svg";

export default function ChatArea({
  selectedContact,
  messages,
  onSendMessage,
  onBackToSidebar,
  showBackButton,
}) {
  const [newMessage, setNewMessage] = useState("");
  const [mediaMenuOpen, setMediaMenuOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const menuRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change or component mounts
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      // Scroll to bottom after sending text message
      setTimeout(scrollToBottom, 100);
    }
    // If there are selected images/videos, send them as a grouped media message
    if (selectedImages.length > 0) {
      const msg = {
        id: Date.now() + Math.random(),
        text: "",
        files: selectedImages.map((img) => ({
          file: img.file,
          fileName: img.fileName,
          mimeType: img.mimeType,
          fileType: img.fileType,
        })),
        fileType: "media-group",
        isOwn: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      onSendMessage(msg);
      setSelectedImages([]);
      // Scroll to bottom after sending media
      setTimeout(scrollToBottom, 100);
    }
  };

  const removeImagePreview = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Close media menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMediaMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const imagePreview = {
          id: Date.now() + Math.random(),
          // keep raw File for upload and preview dataUrl for display
          file,
          preview: dataUrl,
          fileName: file.name,
          mimeType: file.type,
          fileType: "image",
        };
        setSelectedImages((prev) => [...prev, imagePreview]);
      };
      reader.readAsDataURL(file);
    });
    setMediaMenuOpen(false);
    // reset input so same file can be picked again
    e.target.value = null;
  };

  const handleVideoSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const videoPreview = {
          id: Date.now() + Math.random(),
          file,
          preview: dataUrl,
          fileName: file.name,
          mimeType: file.type,
          fileType: "video",
        };
        // Add to selectedImages so videos can be grouped with images before sending
        setSelectedImages((prev) => [...prev, videoPreview]);
      };
      reader.readAsDataURL(file);
    });
    setMediaMenuOpen(false);
    e.target.value = null;
  };

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-500">
            Choose a contact from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        {/* Back button for xs/sm/md screens */}
        {showBackButton && (
          <button
            onClick={onBackToSidebar}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div className="relative">
          <img
            src={selectedContact.avatar}
            alt={selectedContact.name}
            className="w-11 h-11 rounded-xl object-cover"
          />
          {selectedContact.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-1 border-white"></div>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">
            {selectedContact.name}
          </h2>
          <p className="text-xs pl-2 text-gray-500">Online</p>
        </div>
      </div>

      {/* Today Label */}
      <div className="flex justify-center py-4">
        <span className="text-sm text-gray-500 bg-white px-3">Today</span>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {messages.map((message, idx) => {
          const next = messages[idx + 1];
          // Show time only if next message is different time or different sender
          const showTime =
            !next || next.time !== message.time || next.isOwn !== message.isOwn;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.isOwn}
              showTime={showTime}
            />
          );
        })}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMediaMenuOpen((prev) => !prev)}
              className="flex-shrink-0 px-2 text-black font-bold text-3xl z-50 cursor-pointer"
              aria-label="add"
            >
              +
            </button>

            {mediaMenuOpen && (
              <div className="absolute left-3 bottom-full mb-2 transform-gpu shadow-xl z-50">
                <div className="bg-white rounded-lg shadow-xl py-2 w-36">
                  <button
                    type="button"
                    onClick={() =>
                      imageInputRef.current && imageInputRef.current.click()
                    }
                    className="w-full flex items-center gap-2 px-4 text-gray-700 hover:bg-gray-50"
                  >
                    <img src={imageSelector} alt="Image" className="w-4 h-4" />
                    <span className="text-md pb-1 pt-1">Image</span>
                  </button>
                  <div className="mx-2 border-t border-gray-600 pb-2" />
                  <button
                    type="button"
                    onClick={() =>
                      videoInputRef.current && videoInputRef.current.click()
                    }
                    className="w-full flex items-center gap-2 px-4 text-gray-700 hover:bg-gray-50"
                  >
                    <img src={imageSelector} alt="Video" className="w-4 h-4" />
                    <span className="text-md">Video</span>
                  </button>
                  <div className="mx-2 border-t border-gray-600 pb-1" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={selectedImages.length > 0 ? "" : "Type your message"}
              className="block w-full pl-4 pr-3 rounded-lg text-sm placeholder-gray-400 focus:outline-none bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              style={
                selectedImages.length > 0
                  ? { height: "240px", paddingTop: "10px" }
                  : {
                      height: "60px",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                    }
              }
            />
            {selectedImages.length > 0 && (
              <>
                {/* Mobile / small screens: full-width swipeable preview (keep large screens unchanged) */}
                <div className="absolute left-4 right-16 top-2 sm:hidden z-10 pointer-events-auto">
                  <div
                    className="chat-scroll flex overflow-x-auto snap-x snap-mandatory -mx-2"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {selectedImages.map((img) => (
                      <div
                        key={img.id}
                        className="snap-start min-w-full px-2 relative"
                      >
                        {img.fileType === "image" ? (
                          <img
                            src={img.preview}
                            alt={img.fileName}
                            className="w-full h-44 sm:h-56 object-contain rounded-lg border border-gray-200 opacity-60"
                          />
                        ) : (
                          <video
                            src={img.preview}
                            className="w-full h-44 sm:h-56 object-contain rounded-lg border border-gray-200 bg-black"
                            controls
                          />
                        )}
                        <button
                          onClick={() => removeImagePreview(img.id)}
                          className="absolute top-2 right-2 w-5 h-5 bg-white text-gray-800 rounded-full flex items-center justify-center text-2xl z-20 shadow-md"
                          type="button"
                          aria-label="remove-preview"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Large screens: keep original inline thumbnail row (unchanged behavior) */}
                <div className="hidden sm:absolute sm:left-4 sm:inset-y-0 sm:flex sm:gap-3 sm:items-center sm:z-10 sm:pointer-events-none">
                  {selectedImages.map((img) => (
                    <div key={img.id} className="relative pointer-events-auto">
                      {img.fileType === "image" ? (
                        <img
                          src={img.preview}
                          alt={img.fileName}
                          className="w-40 h-auto max-h-[160px] object-contain rounded-lg opacity-60 border border-gray-300"
                        />
                      ) : (
                        <video
                          src={img.preview}
                          className="w-40 h-auto max-h-[160px] object-contain rounded-lg border border-gray-300"
                          controls
                        />
                      )}
                      <button
                        onClick={() => removeImagePreview(img.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-100"
                        type="button"
                        aria-label="remove-preview"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* hide scrollbar for chat-scroll (webkit) */}
                <style>{`.chat-scroll::-webkit-scrollbar{display:none} .chat-scroll{ -ms-overflow-style:none; scrollbar-width:none; }`}</style>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() && selectedImages.length === 0}
            className="flex-shrink-0 w-13 h-13 flex items-center justify-center text-white cursor-pointer disabled:cursor-not-allowed"
          >
            <img src={SendBtn} alt="Send" className="w-13 h-13" />
          </button>
        </form>
      </div>
      {/* Hidden file inputs for image/video selection */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoSelect}
        className="hidden"
      />
    </div>
  );
}
