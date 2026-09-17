import { Link } from "react-router-dom";
import walletIcon from "../../../../assets/SVGs/brands/headerIcons/wallet.svg";
import messageIcon from "../../../../assets/SVGs/brands/headerIcons/message.svg";
import notificationsIcon from "../../../../assets/SVGs/brands/headerIcons/notifications.svg";

const AdminHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 p-1">
      <div className="px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900 md:text-xl">Super Admin Portal</h1>

          <div className="flex items-center gap-2 md:gap-4">
            

            <div className="hidden h-10 w-[1px] bg-gray-200 sm:block" />

            <Link
              to="/admin/dashboard"
              className="h-9 w-9 hidden rounded-full bg-white shadow-sm flex items-center justify-center md:h-10 md:w-10"
            >
              <img src={messageIcon} alt="messages" className="w-10 h-10 object-contain dark:invert dark:hue-rotate-180" />
            </Link>

            <button
              type="button"
              className="relative h-9 w-9 rounded-full bg-white shadow-sm flex items-center justify-center md:h-10 md:w-10"
            >
              <img src={notificationsIcon} alt="notifications" className="w-10 h-10 object-contain dark:invert dark:hue-rotate-180" />
            </button>

            <div className="hidden rounded-2xl bg-[#1E60DB26] px-5 py-2 md:block">
              <div className="text-sm text-black font-medium">Admin</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
