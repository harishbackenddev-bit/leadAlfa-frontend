import React, { useState } from "react";
import SettingsHeader from "./components/SettingsHeader";
import PaymentSettingsContent from "./components/PaymentSettingsContent";
import SecurityAccessContent from "./components/SecurityAccessContent";
import NotificationsContent from "./components/NotificationsContent";
import AvailabilityContent from "./components/AvailabilityContent";
import LegalComplianceContent from "./components/LegalComplianceContent";
import AppearanceSettings from "../brand/settings/AppearanceSettings";
import MyProfile from "../creator/MyProfile/MyProfile";

export default function Settings() {
  const [activeMainTab, setActiveMainTab] = useState("Profile");

  const renderContent = () => {
    switch (activeMainTab) {
      case "Profile":
        return <MyProfile embedded />;
      case "Security":
        return <SecurityAccessContent />;
      case "Appearance":
        return <AppearanceSettings />;
      case "Notifications":
        return <NotificationsContent />;
      case "Payment Settings":
        return <PaymentSettingsContent />;
      case "Security & Access":
        return <SecurityAccessContent />;
      case "Availability":
        return <AvailabilityContent />;
      case "Legal & Compliance":
        return <LegalComplianceContent />;
      default:
        return <MyProfile embedded />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <SettingsHeader activeTab={activeMainTab} onTabChange={setActiveMainTab} />
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {renderContent()}
      </div>
    </div>
  );
}
