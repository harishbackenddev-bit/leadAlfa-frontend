import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderLogo from "../../../../assets/SVGs/creator/HeaderLogo.svg";
import CollaborationsIcon from "../../../../assets/SVGs/creator/newHeaderIcons/collaborations.svg";
import ConversationsIcon from "../../../../assets/SVGs/creator/newHeaderIcons/conversations.svg";
import CollabsIcon from "../../../../assets/SVGs/creator/newHeaderIcons/collabs.svg";
import InvitationsIcon from "../../../../assets/SVGs/creator/newHeaderIcons/invitations.svg";
import EarningIcon from "../../../../assets/SVGs/creator/newHeaderIcons/earning.svg";
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
// UPDATED: Import both selectors
import { selectUser, selectTradeSafeStatus } from "../../../../store/slices/authSlice";
import ProtectedRoute from "../../../../pages/auth/components/ProtectedRoute";

// Sub-component for TradeSafe banner
const TradeSafeBanner = ({ tradesafeStatus, tradesafeErrorMessage }) => {
  // FALLBACK: If status is null/undefined, treat it as NOT_STARTED so it shows while debugging
  const effectiveStatus = tradesafeStatus || 'NOT_STARTED';

  // Don't show if already verified
  if (effectiveStatus === 'VERIFIED') {
    return null;
  }

  let bannerConfig = {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    icon: '⚠️',
    message: '',
    actionText: '',
    actionLink: '/creator/settings?tab=payment'
  };

  switch (effectiveStatus) {
    case 'NOT_STARTED':
      bannerConfig.message = 'Complete your payment details to receive payouts from campaigns.';
      bannerConfig.actionText = 'Add Payment Details →';
      break;
    case 'PENDING':
      bannerConfig.message = 'Your payment details are being verified. You\'ll be able to receive payouts once verified.';
      bannerConfig.actionText = 'View Status →';
      bannerConfig.bgColor = 'bg-blue-50';
      bannerConfig.borderColor = 'border-blue-200';
      bannerConfig.textColor = 'text-blue-800';
      bannerConfig.icon = '⏳';
      break;
    case 'ACTION_REQUIRED':
      bannerConfig.message = `Action required: ${tradesafeErrorMessage || 'Please update your payment details.'}`;
      bannerConfig.actionText = 'Update Details →';
      bannerConfig.bgColor = 'bg-red-50';
      bannerConfig.borderColor = 'border-red-200';
      bannerConfig.textColor = 'text-red-800';
      bannerConfig.icon = '❌';
      break;
    case 'FAILED':
      bannerConfig.message = `Payment verification failed. ${tradesafeErrorMessage || 'Please re-enter your banking details.'}`;
      bannerConfig.actionText = 'Retry →';
      bannerConfig.bgColor = 'bg-red-50';
      bannerConfig.borderColor = 'border-red-200';
      bannerConfig.textColor = 'text-red-800';
      bannerConfig.icon = '❌';
      break;
    default:
      return null;
  }

  return (
    <div className={`${bannerConfig.bgColor} border-b ${bannerConfig.borderColor} px-4 py-2.5`}>
      <div className="max-w-[1920px] mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{bannerConfig.icon}</span>
          <p className={`text-sm ${bannerConfig.textColor}`}>
            {bannerConfig.message}
          </p>
        </div>
        <Link
          to={bannerConfig.actionLink}
          className={`text-sm font-medium whitespace-nowrap ${
            effectiveStatus === 'PENDING' 
              ? 'text-blue-600 hover:text-blue-800' 
              : effectiveStatus === 'NOT_STARTED'
              ? 'text-yellow-700 hover:text-yellow-900'
              : 'text-red-600 hover:text-red-800'
          }`}
        >
          {bannerConfig.actionText}
        </Link>
      </div>
    </div>
  );
};

export default function CreatorHeader({ disableNavigation = false }) {
  const user = useAppSelector(selectUser);
  // ADDED: Get trade safe status from Redux
  const tradesafeStatus = useAppSelector(selectTradeSafeStatus);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearAll } =
    useNotifications();
  const location = useLocation();
  const profileDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Get error message if any (can be passed from user profile)
  const tradesafeErrorMessage = user?.profile?.tradesafe_error_message || '';

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
    console.log("Logging out...");
    setIsProfileDropdownOpen(false);
  };

  const navItems = [
    {
      label: "Campaigns",
      path: "/creator/campaigns",
      icon: (
        <img
          src={CollaborationsIcon}
          alt="Campaigns"
          className="w-5.5 h-5.5"
        />
      ),
      activePaths: ["/creator/campaigns", "/creator/brands"],
    },
    {
      label: "Messages",
      path: "/creator/messages",
      icon: (
        <img
          src={ConversationsIcon}
          alt="Messages"
          className="w-5 h-5 mt-0.5"
        />
      ),
      activePaths: ["/creator/messages"],
    },
    {
      label: "My Collabs",
      path: "/creator/my-jobs",
      icon: <img src={CollabsIcon} alt="My Collabs" className="w-5.5 h-5.5" />,
      activePaths: ["/creator/my-jobs"],
    },
    {
      label: "Invitations",
      path: "/creator/invitations",
      icon: (
        <img src={InvitationsIcon} alt="Invitations" className="w-5.5 h-5.5" />
      ),
      activePaths: ["/creator/invitations"],
    },
    {
      label: "Wallet",
      path: "/creator/earnings",
      icon: <img src={EarningIcon} alt="Wallet" className="w-5 h-5" />,
      activePaths: ["/creator/earnings"],
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-stretch h-16">
            <Link
              to="/"
              className="flex items-center flex-shrink-0"
            >
              <img src={HeaderLogo} alt="Creatrend" className="h-12 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-stretch space-x-8 flex-1 justify-center">
              {navItems.map((item) => {
                const itemClassName = `flex items-center gap-2 px-1 text-sm font-medium transition-colors relative ${
                  isActive(item)
                    ? "text-[#0c7bb3]"
                    : "text-gray-600 hover:text-[#0c7bb3]"
                }`;

                if (disableNavigation) {
                  return (
                    <div
                      key={item.path}
                      className={`${itemClassName} cursor-not-allowed opacity-45`}
                      aria-disabled="true"
                    >
                      <span className="w-5.5 h-5.5">{item.icon}</span>
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
                    <span className="w-5.5 h-5.5">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive(item) && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 rounded bg-gradient-to-r from-[#1E60DB] to-[#8AB1FA]"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 flex-shrink-0 p-2">
              {/* Notification Bell */}
              <div className="relative hidden md:block" ref={notificationRef}>
                <button
                  disabled={disableNavigation}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative p-2 transition ${
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
              <span className="w-0.5 h-full bg-gray-300"></span>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md overflow-hidden">
                    {user?.profile?.media?.profilePhoto?.mediaDetails?.url ? (
                      <img
                        src={user.profile.media.profilePhoto.mediaDetails.url}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold">
                        {user?.firstName?.[0] || ""}
                        {user?.lastName?.[0] || ""}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-[#0c7bb3] transition">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="fixed right-4 top-16 w-42 lg:absolute lg:top-full lg:right-0 mt-0 lg:mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/creator/my-profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ProfileIcon className="w-5 h-5 text-gray-500" />
                      My Profile
                    </Link>
                    {!disableNavigation ? (
                      <Link
                        to="/creator/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <SettingsIcon className="w-5 h-5 text-gray-500" />
                        Settings
                      </Link>
                    ) : null}
                    <div className="border-t border-gray-100 my-1"></div>
                    <LogoutButton
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogoutIcon className="w-5 h-5 text-red-600" />
                      Log Out
                    </LogoutButton>
                  </div>
                )}
              </div>

              <button
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
                className={`lg:hidden p-2 transition ${
                  disableNavigation
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <svg
                  className="w-6 h-6"
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
            <div
              className="lg:hidden fixed inset-0 z-40"
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
              className={`lg:hidden fixed top-0 right-0 bottom-0 w-[80%] max-w-md bg-white shadow-2xl z-50 overflow-y-auto flex flex-col ${
                isMobileMenuClosing ? "animate-slideLeft" : "animate-slideRight"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <h2 className="text-xl font-anton text-gray-900">MENU</h2>
                <button
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
                  {user?.profile?.media?.profilePhoto?.mediaDetails?.url ? (
                    <img
                      src={user.profile.media.profilePhoto.mediaDetails.url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {user?.firstName?.[0] || ""}
                      {user?.lastName?.[0] || ""}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-md font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 py-6">
                {disableNavigation ? (
                  <p className="px-6 py-2 text-sm text-gray-500">
                    Navigation is disabled until profile verification is complete.
                  </p>
                ) : (
                  <>
                    {navItems.map((item) => (
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
                        <span className="w-3 h-3 flex items-center justify-center">
                          {item.icon}
                        </span>
                        <span>
                          {item.label
                            .replace("Message", "Messages")
                            .replace("My Invitation", "My Invitations")}
                        </span>
                      </Link>
                    ))}
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
                  </>
                )}
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

      {/* TradeSafe Banner - Rendered outside the header tag so it sits directly below it */}
      <TradeSafeBanner 
        tradesafeStatus={tradesafeStatus} 
        tradesafeErrorMessage={tradesafeErrorMessage} 
      />
    </ProtectedRoute>
  );
}