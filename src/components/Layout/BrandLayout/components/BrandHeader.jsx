import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useHeaderState } from "../hooks/useHeaderState";
import { useNotifications } from "../../../../context/NotificationContext";
import { useMessages } from "../hooks/useMessages";
import { useClickOutside } from "../hooks/useClickOutside";
import nikeLogo from "../../../../assets/images/brands/nikeLogo.png";
import walletIcon from "../../../../assets/SVGs/brands/headerIcons/wallet.svg";
import messageIcon from "../../../../assets/SVGs/brands/headerIcons/message.svg";
import notificationsIcon from "../../../../assets/SVGs/brands/headerIcons/notifications.svg";
import ellipseIcon from "../../../../assets/SVGs/brands/headerIcons/Ellipse.svg";
import NotificationPanel from "../../../../pages/notifications/components/NotificationPanel";

const BrandHeader = () => {
  const { credits, user } = useHeaderState();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAll,
    markAsRead,
  } = useNotifications();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { closeMessages } = useMessages();

  const notificationRef = useRef(null);
  const messageRef = useRef(null);

  useClickOutside(notificationRef, () => setIsNotificationOpen(false));
  useClickOutside(messageRef, closeMessages);

  const handleToggleNotifications = () => {
    setIsNotificationOpen((open) => {
      const next = !open;
      // Opening the panel clears the badge count.
      if (next && unreadCount > 0) {
        markAllAsRead();
      }
      return next;
    });
  };

  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white p-1">
      <div className="min-w-0 px-4 py-3 md:px-6">
        <div className="flex w-full min-w-0 items-center justify-end">
          <div className="flex min-w-0 items-center justify-end gap-2 md:gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-2 text-gray-700">
                <img
                  src={walletIcon}
                  alt="wallet"
                  className="h-6 w-6 object-contain"
                />
                <span className="text-sm font-medium">
                  {isNaN(credits) ? "0.00" : credits.toFixed(2)}
                </span>
              </div>

              <Link
                to="/brand/credits/add"
                className="ml-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                ADD CREDITS
              </Link>
            </div>

            <div className="mx-2 hidden h-14 w-px bg-gray-200 lg:block" />

            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/brand/messages"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm md:h-10 md:w-10"
              >
                <img
                  src={messageIcon}
                  alt="messages"
                  className="h-10 w-10 object-contain text-gray-600"
                />
              </Link>

              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  aria-label={
                    unreadCount > 0
                      ? `${unreadCount} unread notifications`
                      : "Notifications"
                  }
                  aria-expanded={isNotificationOpen}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm md:h-10 md:w-10"
                >
                  <img
                    src={notificationsIcon}
                    alt=""
                    className="h-10 w-10 object-contain text-gray-600"
                  />
                  {badgeLabel ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                      {badgeLabel}
                    </span>
                  ) : null}
                </button>

                <NotificationPanel
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllAsRead={markAllAsRead}
                  onClearAll={clearAll}
                  onMarkAsRead={markAsRead}
                  viewAllPath="/brand/notifications"
                />
              </div>
            </div>

            <Link
              to="/brand/my-profile"
              className="hidden cursor-pointer flex-col gap-2 rounded-2xl bg-[#1E60DB26] px-4 py-2 transition-colors hover:bg-[#1E60DB40] lg:flex"
            >
              <div className="-ml-6 flex items-center gap-2">
                <div className="relative h-11 w-11">
                  <div className="absolute inset-0.75 overflow-hidden rounded-full">
                    <img
                      src={user?.profilePicture || user?.photo || nikeLogo}
                      alt="brand"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <img
                    src={ellipseIcon}
                    alt=""
                    className="absolute inset-0.25 h-full w-full pl-1"
                  />
                </div>
                <div>
                  <div className="text-sm text-black">
                    {user?.profile?.companyName || "Brand"}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-gray-500">Brand</div>
                    <svg
                      className="h-4 w-4 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M9 18l6-6-6-6" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/brand/my-profile"
              className="inline-flex items-center rounded-full bg-[#1E60DB26] px-3 py-1.5 text-xs font-medium text-gray-800 lg:hidden"
            >
              {user?.profile?.companyName || "Brand"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrandHeader;
