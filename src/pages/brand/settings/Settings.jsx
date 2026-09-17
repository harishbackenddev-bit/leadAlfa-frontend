import { useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  CreditCard,
  Palette,
  Scale,
  Shield,
  User,
} from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import PaymentSettingsContent from "../../settings/components/PaymentSettingsContent";
import SecurityAccessContent from "../../settings/components/SecurityAccessContent";
import AvailabilityContent from "../../settings/components/AvailabilityContent";
import LegalComplianceContent from "../../settings/components/LegalComplianceContent";

const TABS = [
  { label: "Profile", Icon: User },
  { label: "Security", Icon: Shield },
  { label: "Appearance", Icon: Palette },
  { label: "Notifications", Icon: Bell },
  { label: "Company Settings", Icon: Building2 },
  { label: "Payment Settings", Icon: CreditCard },
  { label: "Availability", Icon: CalendarDays, hidden: true },
  { label: "Legal & Compliance", Icon: Scale },
];

function NotBuiltYet({ title }) {
  return (
    <div className="rounded-[14px] border border-[#e5e7eb] bg-white px-6 py-16 text-center dark:border-[#334155] dark:bg-[#1e293b]">
      <h2 className="text-[20px] font-bold leading-[30px] text-[#1e293b] dark:text-[#f1f5f9]">
        {title}
      </h2>
      <p className="pt-2 text-[14px] leading-[21px] text-[#64748b] dark:text-[#94a3b8]">
        This section is still in design.
      </p>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const renderTab = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileSettings />;
      case "Security":
        return <SecurityAccessContent />;
      case "Appearance":
        return <AppearanceSettings />;
      case "Notifications":
        return <NotificationSettings />;
      case "Payment Settings":
        return <PaymentSettingsContent />;
      case "Availability":
        return <AvailabilityContent />;
      case "Legal & Compliance":
        return <LegalComplianceContent />;
      default:
        return <NotBuiltYet title={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-manrope dark:bg-[#0f172a]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 pb-8">
              {TABS.filter((tab) => !tab.hidden).map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-[14px] font-semibold transition-colors ${
                    activeTab === tab.label
                      ? "btn-gradient shadow-[0_4px_12px_rgba(3,83,164,0.25)]"
                      : "border border-[#e5e7eb] bg-white text-[#334155] hover:border-[#0353a4]/40 hover:text-[#0353a4] dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#cbd5e1]"
                  }`}
                >
                  <tab.Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {renderTab()}
      </div>
    </div>
  );
}
