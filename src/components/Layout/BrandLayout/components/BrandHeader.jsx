import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useHeaderState } from "../hooks/useHeaderState";
import { useNotifications } from "../../../../context/NotificationContext";
import { useMessages } from "../hooks/useMessages";
import { useClickOutside } from "../hooks/useClickOutside";
import BrandAvatar from "../../../brand/BrandAvatar";
import LogoutButton from "../../../../pages/auth/components/LogoutButton";
import headerLogo from "../../../../assets/SVGs/creator/HeaderLogo.svg";
import walletIcon from "../../../../assets/SVGs/brands/headerIcons/wallet.svg";
import messageIcon from "../../../../assets/SVGs/brands/headerIcons/message.svg";
import notificationsIcon from "../../../../assets/SVGs/brands/headerIcons/notifications.svg";
import logoutIcon from "../../../../assets/SVGs/brands/sidebarIcons/Logout.svg";
import NotificationPanel from "../../../../pages/notifications/components/NotificationPanel";

const BrandHeader = ({ disableNavigation = false }) => {
  const { credits, user } = useHeaderState();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAll,
    markAsRead,
  } = useNotifications();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { closeMessages, unreadCount: messageUnreadCount } = useMessages();

  const notificationRef = useRef(null);
  const messageRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useClickOutside(notificationRef, () => setIsNotificationOpen(false));
  useClickOutside(messageRef, closeMessages);
  useClickOutside(profileDropdownRef, () => setIsProfileDropdownOpen(false));

  const handleToggleNotifications = () => {
    setIsNotificationOpen((open) => {
      const next = !open;
      if (next && unreadCount > 0) {
        markAllAsRead();
      }
      return next;
    });
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
  };

  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  const companyName = user?.profile?.companyName || "Brand";
  const profileTriggerClassName =
    "cursor-pointer rounded-[12px] bg-[rgba(30,96,219,0.08)] transition-colors hover:bg-[rgba(30,96,219,0.15)]";

  const renderProfileDropdown = () =>
    isProfileDropdownOpen ? (
      <div className="fixed right-4 top-16 z-50 w-44 rounded-lg border border-gray-200 bg-white py-2 shadow-lg lg:absolute lg:right-0 lg:top-full lg:mt-2">
        <LogoutButton
          onLogout={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <img src={logoutIcon} alt="" className="h-5 w-5 object-contain" />
          Log Out
        </LogoutButton>
      </div>
    ) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e8ec] bg-white">
      <div className="flex min-h-[58px] min-w-0 items-center px-4 md:h-[82px] md:px-8">
        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          {disableNavigation ? (
            <Link to="/" className="shrink-0">
              <img
                src={headerLogo}
                alt="Creatrend"
                className="h-10 w-auto object-contain md:h-12"
              />
            </Link>
          ) : (
            <div className="hidden shrink-0 md:block md:w-0" aria-hidden="true" />
          )}

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:gap-4">
            {!disableNavigation ? (
              <>
                <div className="hidden items-center gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={walletIcon}
                      alt="wallet"
                      className="h-5 w-5 object-contain dark:invert dark:hue-rotate-180"
                    />
                    <span className="text-[14px] font-medium leading-[21px] tracking-[-0.3px] text-[#1c1d22]">
                      {isNaN(credits) ? "0.00" : credits.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to="/brand/credits/add"
                    className="flex h-9 items-center rounded-[34px] bg-black px-5 text-[12px] font-semibold uppercase leading-[18px] tracking-[-0.3px] text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-[#e2e8f0]"
                  >
                    Add Credits
                  </Link>
                </div>

                <div className="hidden h-10 w-px bg-[#e5e8ec] md:block" />

                <div className="flex items-center gap-2 md:gap-3">
                  <Link
                    to="/brand/messages"
                    className="relative flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-75"
                  >
                    <img
                      src={messageIcon}
                      alt="messages"
                      className="h-full w-full object-contain dark:invert dark:hue-rotate-180"
                    />
                    {messageUnreadCount > 0 ? (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[9px] font-semibold leading-[9px] text-white">
                        {messageUnreadCount > 99 ? "99+" : messageUnreadCount}
                      </span>
                    ) : null}
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
                      className="relative flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-75"
                    >
                      <img
                        src={notificationsIcon}
                        alt=""
                        className="h-full w-full object-contain dark:invert dark:hue-rotate-180"
                      />
                      {badgeLabel ? (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[9px] font-semibold leading-[9px] text-white">
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

                  <div className="hidden h-10 w-px bg-[#e5e8ec] md:block" />
                </div>
              </>
            ) : null}

            {disableNavigation ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen((open) => !open)}
                  className={`hidden lg:flex ${profileTriggerClassName} flex-col px-3 py-2`}
                  aria-label={`${companyName} menu`}
                  aria-expanded={isProfileDropdownOpen}
                >
                  <div className="flex items-center gap-2.5">
                    <BrandAvatar user={user} size="sm" />
                    <div className="text-left">
                      <div className="text-[13px] font-semibold leading-[16.25px] text-[#1c1d22]">{companyName}</div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] leading-[13.75px] text-[#6e7079]">Brand</span>
                        </div>
                        <svg
                          className="h-3.5 w-3.5 text-[#6e7079]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M6 9l6 6 6-6" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen((open) => !open)}
                  className={`inline-flex items-center rounded-full p-1 lg:hidden ${profileTriggerClassName}`}
                  aria-label={`${companyName} menu`}
                  aria-expanded={isProfileDropdownOpen}
                >
                  <BrandAvatar user={user} size="sm" />
                </button>

                {renderProfileDropdown()}
              </div>
            ) : (
              <>
                <Link
                  to="/brand/my-profile"
                  className="hidden cursor-pointer flex-col gap-2 rounded-[12px] bg-[rgba(30,96,219,0.08)] px-3 py-2 transition-colors hover:bg-[rgba(30,96,219,0.15)] lg:flex"
                >
                  <div className="flex items-center gap-2.5">
                    <BrandAvatar user={user} size="sm" />
                    <div>
                      <div className="text-[13px] font-semibold leading-[16.25px] text-[#1c1d22]">{companyName}</div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] leading-[13.75px] text-[#6e7079]">Brand</span>
                        </div>
                        <svg
                          className="h-3.5 w-3.5 text-[#6e7079]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M6 9l6 6 6-6" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/brand/my-profile"
                  className="inline-flex items-center rounded-full bg-[rgba(30,96,219,0.08)] p-1 transition-colors hover:bg-[rgba(30,96,219,0.15)] lg:hidden"
                  aria-label={companyName}
                >
                  <BrandAvatar user={user} size="sm" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrandHeader;
