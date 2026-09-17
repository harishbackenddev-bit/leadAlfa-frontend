import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthRehydrator from "../../AuthRehydrator";
import { NotificationProvider } from "../../../context/NotificationContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthRehydrator>
      <NotificationProvider>
        <div className="dash-theme h-screen bg-gray-50 flex overflow-hidden relative">
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex min-w-0 flex-1 flex-col md:ml-64">
            <AdminHeader />
            <main
              data-scroll-root
              className="min-w-0 flex-1 overflow-y-auto"
            >
              <Outlet />
            </main>
          </div>
        </div>
      </NotificationProvider>
    </AuthRehydrator>
  );
};

export default AdminLayout;
