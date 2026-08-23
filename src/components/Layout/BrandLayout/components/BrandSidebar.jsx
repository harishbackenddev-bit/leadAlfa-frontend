import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../../assets/SVGs/creator/HeaderLogo.svg";
import campaignsIcon from "../../../../assets/SVGs/brands/sidebarIcons/campaigns-gray.svg";
import campaignsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/campaigns.svg";
import creatorsIcon from "../../../../assets/SVGs/brands/sidebarIcons/creators.svg";
import creatorsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/creators-white.svg";
import shipmentsIcon from "../../../../assets/SVGs/brands/sidebarIcons/shipments.svg";
import shipmentsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/shipments-white.svg";
import reportsIcon from "../../../../assets/SVGs/brands/sidebarIcons/reports.svg";
import reportsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/reports-white.svg";
import settingsIcon from "../../../../assets/SVGs/brands/sidebarIcons/settings.svg";
import settingsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/settings-white.svg";
import contactIcon from "../../../../assets/SVGs/brands/sidebarIcons/contact.svg";
import logoutIcon from "../../../../assets/SVGs/brands/sidebarIcons/Logout.svg";
import LogoutButton from "../../../../pages/auth/components/LogoutButton";

export default function BrandSidebar({
  isOpen = true,
  onClose = () => {},
  onToggle = () => {},
}) {
  const location = useLocation();

  const navItems = [
   
    {
      label: "Creators",
      path: "/brand/creators",
      icon: (
        <img
          src={creatorsIcon}
          alt="Creators"
          className="w-6 h-6 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={creatorsIconActive}
          alt="Creators"
          className="w-6 h-6 object-contain"
        />
      ),
    },
     {
      label: "Campaigns",
      path: "/brand/campaigns",
      icon: (
        <img
          src={campaignsIcon}
          alt="Campaigns"
          className="w-6 h-6 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={campaignsIconActive}
          alt="Campaigns"
          className="w-6 h-6 object-contain"
        />
      ),
      // badge: 3,
    },
    {
      label: "My Shipments",
      path: "/brand/shipments",
      icon: (
        <img
          src={shipmentsIcon}
          alt="Shipments"
          className="w-6 h-6 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={shipmentsIconActive}
          alt="Shipments"
          className="w-6 h-6 object-contain"
        />
      ),
    },
    {
      label: "Reports & Analytics",
      path: "/brand/reports",
      icon: (
        <img
          src={reportsIcon}
          alt="Reports"
          className="w-6 h-6 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={reportsIconActive}
          alt="Reports"
          className="w-6 h-6 object-contain"
        />
      ),
    },
    {
      label: "Settings",
      path: "/brand/settings",
      icon: (
        <img
          src={settingsIcon}
          alt="Settings"
          className="w-6 h-6 object-contain"
        />
      ),
      activeIcon: (
        <img
          src={settingsIconActive}
          alt="Settings"
          className="w-6 h-6 object-contain"
        />
      ),
    },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/") ||
    location.pathname.startsWith(path);

  return (
    <>
      {/* Hamburger button - positioned just outside sidebar on the right */}
      <button
        onClick={onToggle}
        className={`fixed top-2 z-50 min-[769px]:hidden p-3 bg-white rounded-md shadow transform transition-transform duration-300 ease-in-out ${
          isOpen ? "left-[236px]" : "left-4"
        }`}
        aria-label="Toggle sidebar"
      >
        <div className="space-y-0.75">
          <span className="block w-4 h-0.5 bg-gray-700"></span>
          <span className="block w-4 h-0.5 bg-gray-700"></span>
          <span className="block w-4 h-0.5 bg-gray-700"></span>
        </div>
      </button>

      <aside
        className={`w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } min-[769px]:translate-x-0`}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-3 flex flex-col min-h-0">
          <div>
            <div className="mb-6 flex justify-center">
              <img src={logo} alt="Creatrend" className="h-14 w-auto" />
            </div>

            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block"
                  onClick={() => {
                    if (window.innerWidth < 769) onClose();
                  }}
                >
                  <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                       ? "bg-gradient-to-b from-[#0353a4] to-[#4b96e3] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      {isActive(item.path) && item.activeIcon
                        ? item.activeIcon
                        : item.icon}
                    </div>
                    <div className="flex-1 flex items-center justify-start gap-3">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`${
                            isActive(item.path)
                              ? "inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-white rounded-full text-blue-600 ml-2"
                              : "inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-gray-200 rounded-full text-gray-600 ml-2"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-8">
            {/* Contact Support card: icon+title on first row, subtitle and chevron on second row */}
            <div className="bg-[#1E60DB26] rounded-md mb-6 pb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    src={contactIcon}
                    alt="contact"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-[500] text-gray-700">
                    Contact Support
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600 pl-3 pt-2">
                  Connect with us
                </div>
                <div>
                  <svg
                    className="w-6 h-6 pt-2 text-gray-600"
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
            </div>
            <LogoutButton className="cursor-pointer">
              <div className="flex pl-1 items-center gap-1 pb-4 text-red-500 font-medium">
                <div className="w-8 h-8 rounded-md flex items-center justify-center">
                  <img
                    src={logoutIcon}
                    alt="logout"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                Logout
              </div>
            </LogoutButton>
          </div>
        </div>
      </aside>
    </>
  );
}
