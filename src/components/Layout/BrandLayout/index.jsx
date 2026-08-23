import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import BrandHeader from "./components/BrandHeader";
import BrandSidebar from "./components/BrandSidebar";
import { useOnboardingProfileGate } from "../../../hooks/useOnboardingProfileGate";

const BrandLayout = () => {
  const { checking: onboardingGateChecking } = useOnboardingProfileGate();
  // Seed from the current viewport so the first paint already matches the
  // final state — avoids a one-frame flicker where the sidebar starts hidden
  // on desktop before useEffect runs.
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 769 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 769);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (onboardingGateChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden relative">
      {/* Overlay for small screens when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 min-[769px]:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <BrandSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex min-w-0 flex-1 flex-col min-[769px]:ml-64">
        <BrandHeader />
        <main
          data-scroll-root
          className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BrandLayout;
