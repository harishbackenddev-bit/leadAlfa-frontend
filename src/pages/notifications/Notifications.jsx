import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

const PAGE_SIZE = 10;

function NotificationIcon({ type }) {
  const base =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10";

  if (type === "reminder" || type === "info") {
    return (
      <div className={`${base} bg-amber-100 text-amber-700`}>
        <Bell className="h-4 w-4" />
      </div>
    );
  }
  if (type === "success" || type === "approved") {
    return (
      <div className={`${base} bg-teal-100 text-teal-700`}>
        <CheckCheck className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className={`${base} bg-blue-100 text-[#0c7bb3]`}>
      <Bell className="h-4 w-4" />
    </div>
  );
}

export default function Notifications() {
  const location = useLocation();
  const isBrand = location.pathname.startsWith("/brand");
  const {
    notifications,
    unreadCount,
    readCount,
    totalCount,
    markAllAsRead,
    clearAll,
    markAsRead,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter === "read") return n.read;
      return true;
    });
  }, [notifications, filter]);

  const visibleNotifications = filteredNotifications.slice(0, visibleCount);
  const hasMore = filteredNotifications.length > visibleCount;

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isBrand ? "p-4 md:p-6" : "p-6"}`}>
      <div className="mx-auto max-w-[1920px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">
              {notifications.length === 0
                ? "You're all caught up!"
                : `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => {
              const active = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFilter(option.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#0c7bb3] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {notifications.length > 0 ? (
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0c7bb3] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#045992] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </button>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {visibleNotifications.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700">
                No notifications
              </p>
              <p className="mt-1 text-sm text-gray-400">
                New review reminders will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visibleNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex gap-3 px-4 py-4 md:gap-4 md:px-6 ${
                    notification.read ? "bg-white" : "bg-blue-50/30"
                  }`}
                >
                  <NotificationIcon type={notification.type} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 md:text-base">
                            {notification.title}
                          </p>
                          {!notification.read ? (
                            <span className="h-2 w-2 rounded-full bg-[#0c7bb3]" />
                          ) : null}
                        </div>
                        {notification.message ? (
                          <p className="mt-1 text-sm leading-relaxed text-gray-600">
                            {notification.message}
                          </p>
                        ) : null}
                      </div>
                      <span className="shrink-0 text-xs text-gray-400">
                        {notification.time}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {!notification.read ? (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm font-medium text-[#0c7bb3] hover:underline"
                        >
                          Mark as read
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasMore ? (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300"
            >
              Load more ({filteredNotifications.length - visibleCount} remaining)
            </button>
          </div>
        ) : null}

        {notifications.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
              <p className="text-[11px] text-gray-500 sm:text-xs">Total</p>
              <p className="text-2xl text-gray-900 sm:text-3xl">
                {totalCount}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
              <p className="text-[11px] text-gray-500 sm:text-xs">Unread</p>
              <p className="text-2xl text-[#1E60DB] sm:text-3xl">
                {unreadCount}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
              <p className="text-[11px] text-gray-500 sm:text-xs">Read</p>
              <p className="text-2xl text-green-600 sm:text-3xl">
                {readCount}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
