import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "app_notifications_v1";
const MAX_STORED = 100;

function loadStoredNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistNotifications(list) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list.slice(0, MAX_STORED))
    );
  } catch {
    // ignore quota / private mode
  }
}

function formatRelativeTime(value) {
  if (!value) return "Just now";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return "Just now";
  if (seconds < 90) return "1 minute ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(loadStoredNotifications);
  const [, setTick] = useState(0);

  // Refresh relative timestamps periodically.
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    persistNotifications(notifications);
  }, [notifications]);

  const displayNotifications = useMemo(
    () =>
      notifications.map((n) => ({
        ...n,
        time: formatRelativeTime(n.createdAt),
      })),
    [notifications]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;
  const totalCount = notifications.length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /**
   * Add a notification (socket events, toasts, etc.).
   * Also used as the app-wide toast entry point.
   */
  const showNotification = ({
    type = "message",
    message,
    description,
    title,
    meta,
  } = {}) => {
    const newNotification = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      title: title || message || "Notification",
      message: description || message || "",
      createdAt: new Date().toISOString(),
      read: false,
      meta: meta || null,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, MAX_STORED));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: displayNotifications,
        unreadCount,
        readCount,
        totalCount,
        markAllAsRead,
        clearAll,
        markAsRead,
        deleteNotification,
        showNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

export function useNotification() {
  return useNotifications();
}
