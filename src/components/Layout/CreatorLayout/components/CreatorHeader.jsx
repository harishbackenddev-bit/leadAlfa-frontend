import React, { useState, useRef, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import HeaderLogo from "../../../../assets/SVGs/creator/HeaderLogo.svg";
import {
  BriefcaseBusiness,
  ChevronDown,
  CreditCard,
  Mail,
  MessageSquare,
  Package,
  Briefcase,
} from "lucide-react";
import {
  NoticeBell,
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
} from "../../../../assets/SVGs/creator/HeaderIcons";
import NotificationPanel from "../../../../pages/notifications/components/NotificationPanel";
import { useNotifications } from "../../../../context/NotificationContext";
import LogoutButton from "../../../../pages/auth/components/LogoutButton";
import { useAppSelector } from "../../../../store/hooks";
import { selectUser } from "../../../../store/slices/authSlice";
import ProtectedRoute from "../../../../pages/auth/components/ProtectedRoute";
import {
  getCreatorDisplayName,
  getCreatorProfileHandle,
  getProfilePhotoSrc,
} from "../../../../utils/profileMedia";

function ComingSoonNavItem({ item, variant = "desktop" }) {
  if (variant === "mobile") {
    return (
      <span
        className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-gray-500 opacity-60 cursor-not-allowed"
        aria-disabled="true"
        aria-label={`${item.label} - Coming Soon`}
      >
        {item.icon}
        <span>{item.label}</span>
        <span className="rounded-full bg-[#E8F1FD] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#0c7bb3]">
          Coming Soon
        </span>
      </span>
    );
  }

  return (
    <span
      className="group relative flex items-center gap-2.5 whitespace-nowrap text-sm font-medium text-gray-500 opacity-60 cursor-not-allowed xl:text-[15px]"
      aria-disabled="true"
      aria-label={`${item.label} - Coming Soon`}
    >
      {item.icon}
      <span>{item.label}</span>
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-[60] -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100">
        Coming Soon
      </span>
    </span>
  );
}

export default function CreatorHeader({ disableNavigation = false }) {
  const user = useAppSelector(selectUser);
  const profile = user?.profile || {};
  const profilePhotoSrc = getProfilePhotoSrc(profile);
  const displayName = getCreatorDisplayName(user, profile);
  const profileHandle = getCreatorProfileHandle(profile, user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearAll } =
    useNotifications();
  const location = useLocation();
  const profileDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    setIsProfileDropdownOpen(false);
  };

  const navItems = [
    {
      label: "Campaigns",
      path: "/creator/campaigns",
      icon: <BriefcaseBusiness className="w-5 h-5" strokeWidth={1.75} />,
      activePaths: ["/creator/campaigns", "/creator/brands"],
    },
    {
      label: "Messages",
      path: "/creator/messages",
      icon: <MessageSquare className="w-5 h-5" strokeWidth={1.75} />,
      activePaths: ["/creator/messages"],
    },
    {
      label: "My Collabs",
      path: "/creator/my-jobs",
      icon: <Briefcase className="w-5 h-5" strokeWidth={1.75} />,
      activePaths: ["/creator/my-jobs"],
    },
    {
      label: "My Invitations",
      path: "/creator/invitations",
      icon: <Mail className="w-5 h-5" strokeWidth={1.75} />,
      activePaths: ["/creator/invitations"],
    },
    {
      label: "My Earnings",
      path: "/creator/earnings",
      icon: <CreditCard className="w-5 h-5" strokeWidth={1.75} />,
      activePaths: ["/creator/earnings"],
      // comingSoon: true,
    },
    {
      label: "My Shipments",
      path: "/creator/shipments",
      icon: <Package className="w-5 h-5" strokeWidth={1.75} />,
      activePaths: ["/creator/shipments"],
    },
  ];

  const isActive = (item) => {
    if (
      location.pathname === "/creator" &&
      item.path === "/creator/campaigns"
    ) {
      return true;
    }

    return item.activePaths.some(
      (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <ProtectedRoute allowedRoles={["creator"]}>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-0">
          <div className="flex h-20 items-stretch justify-between 2xl:mx-auto 2xl:h-[88px] 2xl:w-4/5">
            <Link to="/" className="flex shrink-0 items-center">
              <img src={HeaderLogo} alt="Creatrend" className="h-10 w-auto md:h-12" />
            </Link>
            <nav className="hidden flex-1 items-stretch justify-center gap-6 overflow-visible lg:flex xl:gap-5 2xl:gap-5">
              {navItems.map((item) => {
                const itemClassName = `flex items-center gap-2.5 whitespace-nowrap text-sm font-medium transition-colors relative xl:text-[15px] ${
                  isActive(item)
                    ? "text-[#0c7bb3]"
                    : "text-gray-600 hover:text-[#0c7bb3]"
                }`;

                if (item.comingSoon) {
                  return (
                    <ComingSoonNavItem key={item.path} item={item} variant="desktop" />
                  );
                }

                if (disableNavigation) {
                  return (
                    <div
                      key={item.path}
                      className={`${itemClassName} cursor-not-allowed opacity-45`}
                      aria-disabled="true"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={itemClassName}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive(item) && (
                      <div className="absolute bottom-2 left-0 right-0 h-[3px] rounded-t bg-[#0c7bb3]"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-4">
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  aria-label="Open notifications"
                  aria-expanded={isNotificationOpen}
                  disabled={disableNavigation}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative p-1 transition ${
                    disableNavigation
                      ? "cursor-not-allowed text-gray-400"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <NoticeBell />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 inline-block w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </button>
                <NotificationPanel
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllAsRead={markAllAsRead}
                  onClearAll={clearAll}
                  viewAllPath="/creator/notifications"
                />
              </div>
              <span className="hidden h-14 w-px bg-gray-200 md:block"></span>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  aria-label="Open profile menu"
                  aria-expanded={isProfileDropdownOpen}
                  className="group flex items-center gap-3"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <div className="flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-semibold text-white shadow-md">
                    {profilePhotoSrc ? (
                      <img
                        key={profilePhotoSrc}
                        src={profilePhotoSrc}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-bold leading-none">
                        {user?.firstName?.[0] || profile?.firstName?.[0] || ""}
                        {user?.lastName?.[0] || profile?.lastName?.[0] || ""}
                      </span>
                    )}
                  </div>
                  <span className="hidden max-w-44 truncate text-sm font-medium text-gray-700 transition group-hover:text-[#0c7bb3] xl:block">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`hidden h-4 w-4 text-gray-500 transition-transform xl:block ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="fixed right-3 top-20 z-50 w-40 rounded-xl border border-gray-200 bg-white py-1.5 shadow-md lg:absolute lg:right-0 lg:top-full lg:mt-2">
                    {!disableNavigation ? (
                      <Link
                        to="/creator/my-profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex min-h-10 items-center gap-2.5 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <ProfileIcon className="h-4 w-4 text-gray-500" />
                        My Profile
                      </Link>
                    ) : null}
                    {!disableNavigation ? (
                      <Link
                        to="/creator/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex min-h-10 items-center gap-2.5 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <SettingsIcon className="h-4 w-4 text-gray-500" />
                        Settings
                      </Link>
                    ) : null}
                    {!disableNavigation ? (
                      <div className="border-t border-gray-100 my-1"></div>
                    ) : null}
                    <LogoutButton
                      onLogout={handleLogout}
                      className="flex min-h-10 w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogoutIcon className="h-4 w-4 text-red-600" />
                      Log Out
                    </LogoutButton>
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                disabled={disableNavigation}
                onClick={() => {
                  if (isMobileMenuOpen) {
                    setIsMobileMenuClosing(true);
                    setTimeout(() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileMenuClosing(false);
                    }, 300);
                  } else {
                    setIsMobileMenuOpen(true);
                  }
                }}
                className={`p-2 transition lg:hidden ${
                  disableNavigation
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {(isMobileMenuOpen || isMobileMenuClosing) && (
          <>
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => {
                setIsMobileMenuClosing(true);
                setTimeout(() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileMenuClosing(false);
                }, 300);
              }}
            />

            {/* Drawer */}
            <nav
              className={`fixed top-0 right-0 bottom-0 z-50 flex w-[80%] max-w-md flex-col overflow-y-auto bg-white shadow-2xl lg:hidden ${
                isMobileMenuClosing ? "animate-slideLeft" : "animate-slideRight"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <h2 className="text-xl text-gray-900">MENU</h2>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => {
                    setIsMobileMenuClosing(true);
                    setTimeout(() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileMenuClosing(false);
                    }, 300);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2 p-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md overflow-hidden">
                  {profilePhotoSrc ? (
                    <img
                      key={profilePhotoSrc}
                      src={profilePhotoSrc}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {user?.firstName?.[0] || profile?.firstName?.[0] || ""}
                      {user?.lastName?.[0] || profile?.lastName?.[0] || ""}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-md font-bold text-gray-900">
                    {displayName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {profileHandle || "Creator"}
                  </p>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 py-6">
                {disableNavigation ? (
                  <p className="px-6 py-2 text-sm text-gray-500">
                    Navigation is disabled until profile verification is complete.
                  </p>
                ) : null}
                {navItems.map((item) =>
                  item.comingSoon ? (
                    <ComingSoonNavItem
                      key={item.path}
                      item={item}
                      variant="mobile"
                    />
                  ) : disableNavigation ? null : (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileMenuClosing(false);
                      }}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                        isActive(item)
                          ? "text-[#0c7bb3] bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )
                )}
                {!disableNavigation ? (
                  <Link
                    to="/creator/settings"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileMenuClosing(false);
                    }}
                    className="flex items-center gap-2 px-6 pt-8 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <SettingsIcon className="w-3 h-3" />
                    <span>Settings</span>
                  </Link>
                ) : null}
                <LogoutButton
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 pt-6 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <LogoutIcon className="w-3 h-3" />
                  <span>Logout</span>
                </LogoutButton>
              </div>
            </nav>
          </>
        )}
      </header>
    </ProtectedRoute>
  );
}
