import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../../assets/SVGs/creator/creatrendLogoTagline.png";
import campaignsIcon from "../../../../assets/SVGs/brands/sidebarIcons/campaigns-gray.svg";
import campaignsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/campaigns.svg";
import creatorsIcon from "../../../../assets/SVGs/brands/sidebarIcons/creators.svg";
import creatorsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/creators-white.svg";
import shipmentsIcon from "../../../../assets/SVGs/brands/sidebarIcons/shipments.svg";
import shipmentsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/shipments-white.svg";
import reportsIcon from "../../../../assets/SVGs/brands/sidebarIcons/reports.svg";
import reportsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/reports-white.svg";
import complianceIcon from "../../../../assets/SVGs/brands/sidebarIcons/compliance-reports.svg";
import complianceIconActive from "../../../../assets/SVGs/brands/sidebarIcons/compliance-reports-white.svg";
import libraryIcon from "../../../../assets/SVGs/brands/sidebarIcons/resource-library.svg";
import libraryIconActive from "../../../../assets/SVGs/brands/sidebarIcons/resource-library-white.svg";
import settingsIcon from "../../../../assets/SVGs/brands/sidebarIcons/settings.svg";
import settingsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/settings-white.svg";
import contactIcon from "../../../../assets/SVGs/brands/sidebarIcons/contact.svg";
import logoutIcon from "../../../../assets/SVGs/brands/sidebarIcons/Logout.svg";
import LogoutButton from "../../../../pages/auth/components/LogoutButton";

const SIDEBAR_EASE = "ease-[cubic-bezier(0.4,0,0.2,1)]";
const SIDEBAR_DURATION = "duration-[350ms]";

const sidebarTransition = `${SIDEBAR_DURATION} ${SIDEBAR_EASE}`;

const HamburgerIcon = () => (
  <div className="space-y-0.75">
    <span className="block h-0.5 w-4 bg-gray-700 dark:bg-gray-200" />
    <span className="block h-0.5 w-4 bg-gray-700 dark:bg-gray-200" />
    <span className="block h-0.5 w-4 bg-gray-700 dark:bg-gray-200" />
  </div>
);

const CollapseChevron = () => (
  <svg
    className="h-4 w-4 text-gray-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 18l-6-6 6-6" />
    <path d="M19 18l-6-6 6-6" />
  </svg>
);

const ExpandChevron = () => (
  <svg
    className="h-3.5 w-3.5 text-gray-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18l6-6-6-6" />
    <path d="M5 18l6-6-6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-5 w-5 text-gray-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

function SidebarTooltip({ label, show }) {
  if (!show) return null;

  return (
    <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg md:group-hover:block">
      {label}
    </span>
  );
}

function SidebarNavItem({
  item,
  active,
  isCollapsed,
  onNavigate,
}) {
  return (
    <div className="group relative">
      <Link to={item.path} className="block" onClick={onNavigate}>
        <div
          className={`mx-auto flex items-center overflow-hidden rounded-[12px] transition-[width,padding,background-color,color,gap] ${sidebarTransition} ${
            isCollapsed
              ? "md:h-10 md:w-10 md:justify-center md:px-0 md:py-0"
              : "h-[46px] w-full gap-2 pl-3 pr-3"
          } ${
            active
              ? "btn-gradient text-white"
              : "text-[#5f6b7a] hover:bg-gray-100"
          }`}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            {active && item.activeIcon ? item.activeIcon : item.icon}
          </div>
          <div
            className={`flex min-w-0 flex-1 items-center justify-start gap-3 overflow-hidden transition-[max-width,opacity,margin] ${sidebarTransition} ${
              isCollapsed
                ? "md:ml-0 md:max-w-0 md:flex-none md:opacity-0"
                : "max-w-[220px] opacity-100"
            }`}
          >
            <span className="truncate text-[14px] font-medium leading-5">{item.label}</span>
            {item.badge ? (
              <span
                className={`${
                  active
                    ? "ml-2 inline-flex items-center justify-center rounded-full bg-white px-2 py-1 text-xs font-semibold text-blue-600"
                    : "ml-2 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600"
                }`}
              >
                {item.badge}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <SidebarTooltip label={item.label} show={isCollapsed} />
    </div>
  );
}

export default function BrandSidebar({
  isOpen = true,
  isCollapsed = false,
  onClose = () => {},
  onMenuToggle = () => {},
  onCollapseToggle = () => {},
}) {
  const location = useLocation();

  const navItems = [
    {
      label: "Creators",
      path: "/brand/creators",
      icon: (
        <img
          src={creatorsIcon}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={creatorsIconActive}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
    },
    {
      label: "Campaigns",
      path: "/brand/campaigns",
      icon: (
        <img
          src={campaignsIcon}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={campaignsIconActive}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
    },
    {
      label: "My Shipments",
      path: "/brand/shipments",
      icon: (
        <img
          src={shipmentsIcon}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={shipmentsIconActive}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
    },
    {
      label: "Media Vault",
      path: "/brand/resource-library",
      icon: (
        <img
          src={libraryIcon}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={libraryIconActive}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
    },
    {
      label: "Integrations",
      path: "/brand/integrations",
      icon: (
        <img
          src={reportsIcon}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={reportsIconActive}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
    },
    {
      label: "Compliance Reports",
      path: "/brand/compliance-reports",
      icon: (
        <img
          src={complianceIcon}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={complianceIconActive}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
    },
    {
      label: "Settings",
      path: "/brand/settings",
      icon: (
        <img
          src={settingsIcon}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={settingsIconActive}
          alt=""
          className="h-5 w-5 object-contain"
        />
      ),
    },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/") ||
    location.pathname.startsWith(path);

  const handleNavigate = () => {
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={onMenuToggle}
          className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2.5 md:hidden"
          aria-label="Open sidebar menu"
        >
          <HamburgerIcon />
        </button>
      )}

      <aside
        className={`fixed left-0 top-0 z-40 font-manrope flex h-screen w-64 flex-col overflow-visible border-r border-[#e5e8ec] bg-white transition-[width,transform] ${sidebarTransition} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0  ${isCollapsed ? "md:w-[72px]" : "md:w-64"}`}
      >
        <button
          type="button"
          onClick={onCollapseToggle}
          className={`absolute -right-3 top-7 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-[#e5e8ec] bg-white shadow-sm transition-[opacity,transform,background-color] hover:bg-gray-50 md:flex ${
            isCollapsed
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          } ${sidebarTransition}`}
          aria-label="Expand sidebar"
          aria-hidden={!isCollapsed}
          tabIndex={isCollapsed ? 0 : -1}
        >
          <ExpandChevron />
        </button>

        <div
          className={`relative flex shrink-0 items-center justify-center border-b border-[#e5e8ec] px-4 py-4 transition-[padding] md:h-[83px] md:py-0 ${sidebarTransition} ${
            isCollapsed ? "md:px-3" : ""
          }`}
        >
          <Link to="/" className="flex shrink-0 items-center">
                   <img
            src={logo}
            alt="Creatrend"           
            className={`shrink-0 object-contain transition-[height,width] dark:rounded-lg ${sidebarTransition} ${
              isCollapsed
                ? "h-14 w-auto md:h-[31.646px] md:w-[42.195px]"
                : "h-14 w-auto md:h-[63.292px] md:w-[84.389px]"
            }`}
          />    
                      </Link>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Close sidebar menu"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            onClick={onCollapseToggle}
            className={`absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg p-2 transition-[opacity,background-color] hover:bg-gray-100 md:flex ${
              isCollapsed ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
            } ${sidebarTransition}`}
            aria-label="Collapse sidebar"
            aria-hidden={isCollapsed}
            tabIndex={isCollapsed ? -1 : 0}
          >
            <CollapseChevron />
          </button>
        </div>

        <div
          className={`min-h-0 flex-1 scrollbar-none overflow-y-auto overscroll-contain px-4 py-4 transition-[padding] ${sidebarTransition} ${
            isCollapsed ? "md:px-2 md:py-7" : ""
          }`}
        >
          <nav className="space-y-3">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.path}
                item={item}
                active={isActive(item.path)}
                isCollapsed={isCollapsed}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>
        </div>

        <div
          className={`shrink-0 border-t border-gray-100 px-4 pb-4 pt-4 transition-[padding] ${sidebarTransition} ${
            isCollapsed ? "md:px-2" : ""
          }`}
        >
          <div className="group relative mb-3">
            <Link
              to="/contact-us"
              className={`mx-auto block overflow-hidden rounded-md bg-[#1E60DB26] transition-[width,padding,background-color] hover:bg-[#1E60DB40] ${sidebarTransition} ${
                isCollapsed
                  ? "md:flex md:h-10 md:w-10 md:items-center md:justify-center md:p-0 pb-2"
                  : "w-full pb-2"
              }`}
              onClick={handleNavigate}
            >
              <div className="flex items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <img
                    src={contactIcon}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                </div>
                <div
                  className={`overflow-hidden whitespace-nowrap text-sm font-medium text-gray-700 transition-[max-width,opacity] ${sidebarTransition} ${
                    isCollapsed
                      ? "md:max-w-0 md:opacity-0"
                      : "max-w-[140px] opacity-100"
                  }`}
                >
                  Contact Us
                </div>
              </div>

              <div
                className={`overflow-hidden transition-[max-height,opacity] ${sidebarTransition} ${
                  isCollapsed
                    ? "md:max-h-0 md:opacity-0"
                    : "max-h-16 opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="pl-3 pt-2 text-xs text-gray-600">
                    Connect with us
                  </div>
                  <svg
                    className="h-6 w-6 pt-2 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
            <SidebarTooltip label="Contact Us" show={isCollapsed} />
          </div>

          <div className="group relative">
            <LogoutButton className="cursor-pointer">
              <div
                className={`mx-auto flex items-center overflow-hidden font-medium text-red-500 transition-[width,padding,background-color] hover:bg-red-50 ${sidebarTransition} ${
                  isCollapsed
                    ? "md:h-10 md:w-10 md:justify-center md:rounded-xl md:pl-0"
                    : "w-full gap-1 pl-1"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                  <img
                    src={logoutIcon}
                    alt=""
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <span
                  className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] ${sidebarTransition} ${
                    isCollapsed
                      ? "md:max-w-0 md:opacity-0"
                      : "max-w-[80px] opacity-100"
                  }`}
                >
                  Logout
                </span>
              </div>
            </LogoutButton>
            <SidebarTooltip label="Logout" show={isCollapsed} />
          </div>
        </div>
      </aside>
    </>
  );
}
