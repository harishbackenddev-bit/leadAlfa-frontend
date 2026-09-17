import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";

const PREVIEW_LIMIT = 8;

function NotificationIcon({ type }) {
  const base =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full";

  if (type === "reminder" || type === "info") {
    return (
      <div className={`${base} bg-amber-100 text-amber-700`}>
        <Bell className="h-4 w-4" />
      </div>
    );
  }
  if (type === "payment") {
    return (
      <div className={`${base} bg-green-100 text-green-700`}>
        <span className="text-sm font-bold">R</span>
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

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkAllAsRead,
  onClearAll,
  onMarkAsRead,
  viewAllPath = "/brand/notifications",
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const preview = notifications.slice(0, PREVIEW_LIMIT);
  const hasMore = notifications.length > PREVIEW_LIMIT;

  const handleViewAll = () => {
    onClose?.();
    navigate(viewAllPath);
  };

  const handleItemClick = (notification) => {
    if (!notification.read) onMarkAsRead?.(notification.id);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        aria-label="Close notifications"
        onClick={onClose}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-gray-100 bg-white shadow-2xl md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:max-h-[min(28rem,70vh)] md:w-[22rem] md:rounded-2xl lg:w-96"
        role="dialog"
        aria-label="Notifications"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base uppercase tracking-wide text-gray-900 md:text-lg">
              Notifications
            </h3>
            {unreadCount > 0 ? (
              <span className="rounded-full bg-[#0c7bb3] px-2 py-0.5 text-xs font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {notifications.length > 0 ? (
          <div className="flex items-center justify-between border-b border-gray-50 px-4 py-2">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0c7bb3] hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">No notifications</p>
              <p className="mt-1 text-sm text-gray-400">You&apos;re all caught up</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {preview.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(notification)}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      notification.read ? "bg-white" : "bg-blue-50/40"
                    }`}
                  >
                    <NotificationIcon type={notification.type} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        {!notification.read ? (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0c7bb3]" />
                        ) : null}
                      </div>
                      {notification.message ? (
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                          {notification.message}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={handleViewAll}
              className="w-full rounded-xl bg-gray-50 py-2.5 text-center text-sm font-semibold text-[#0c7bb3] transition-colors hover:bg-gray-100"
            >
              {hasMore
                ? `View all ${notifications.length} notifications`
                : "View all notifications"}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
