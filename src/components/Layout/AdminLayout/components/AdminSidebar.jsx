import { Link, useLocation } from "react-router-dom";
import logo from "../../../../assets/SVGs/creator/newctlogo.png";
import campaignsIcon from "../../../../assets/SVGs/brands/sidebarIcons/campaigns-gray.svg";
import campaignsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/campaigns.svg";
import creatorsIcon from "../../../../assets/SVGs/brands/sidebarIcons/creators.svg";
import creatorsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/creators-white.svg";
import settingsIcon from "../../../../assets/SVGs/brands/sidebarIcons/settings.svg";
import settingsIconActive from "../../../../assets/SVGs/brands/sidebarIcons/settings-white.svg";
import logoutIcon from "../../../../assets/SVGs/brands/sidebarIcons/Logout.svg";
import LogoutButton from "../../../../pages/auth/components/LogoutButton";

const AdminSidebar = ({ isOpen = true, onClose = () => {}, onToggle = () => {} }) => {
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <img src={campaignsIcon} alt="Dashboard" className="w-6 h-6 object-contain" />,
      activeIcon: <img src={campaignsIconActive} alt="Dashboard" className="w-6 h-6 object-contain" />,
    },
    {
      label: "Request Management",
      path: "/admin/users",
      icon: <img src={creatorsIcon} alt="Users" className="w-6 h-6 object-contain" />,
      activeIcon: <img src={creatorsIconActive} alt="Users" className="w-6 h-6 object-contain" />,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <img src={settingsIcon} alt="Settings" className="w-6 h-6 object-contain" />,
      activeIcon: <img src={settingsIconActive} alt="Settings" className="w-6 h-6 object-contain" />,
    },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/") ||
    location.pathname.startsWith(path);

  return (
    <>
      <button
        onClick={onToggle}
        className={`fixed top-2 z-50 md:hidden p-1.5 bg-white rounded-md shadow-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "left-[272px]" : "left-4"
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
        className={`w-64 h-screen overflow-y-auto bg-white px-4 py-3 border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex-1">
          <div className="mb-8 flex justify-center">
            <img src={logo} alt="Creatrend" className="h-16 w-auto" />
          </div>

          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block"
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
              >
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-gradient-to-b from-[#0353a4] to-[#4b96e3] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {isActive(item.path) && item.activeIcon ? item.activeIcon : item.icon}
                  </div>
                  <div className="flex-1 flex items-center justify-start gap-3">
                    <span className="font-['Manrope:Medium',sans-serif] font-medium leading-[20px] text-[14px]">{item.label}</span>
                  </div>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <LogoutButton className="cursor-pointer">
            <div className="flex pl-1 items-center gap-1 pb-4 text-red-500 font-medium">
              <div className="w-8 h-8 rounded-md flex items-center justify-center">
                <img src={logoutIcon} alt="logout" className="w-7 h-7 object-contain" />
              </div>
              Logout
            </div>
          </LogoutButton>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
