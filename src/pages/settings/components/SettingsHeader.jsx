import React from "react";
import { Bell, CalendarDays, CreditCard, Palette, Scale, Shield, User } from "lucide-react";

export default function SettingsHeader({ activeTab, onTabChange }) {
  const tabs = [
    { label: "Profile", Icon: User },
    { label: "Security", Icon: Shield },
    { label: "Appearance", Icon: Palette },
    { label: "Notifications", Icon: Bell },
    { label: "Payment Settings", Icon: CreditCard },
    { label: "Security & Access", Icon: Shield },
    { label: "Availability", Icon: CalendarDays, hidden: true },
    { label: "Legal & Compliance", Icon: Scale },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1920px] overflow-x-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-max items-center gap-6 py-4 sm:gap-10 lg:gap-14">
          {tabs.filter((tab) => !tab.hidden).map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => onTabChange(tab.label)}
              className={`inline-flex h-14 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full text-[15px] font-medium transition-colors ${
                activeTab === tab.label
                  ? "btn-gradient px-6 text-white shadow-[0_4px_12px_rgba(3,83,164,0.25)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.Icon className="h-5 w-5" aria-hidden />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
