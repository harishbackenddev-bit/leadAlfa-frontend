// CampaignDetailTabs.jsx
import React from "react";
import {
  CheckCircle2,
  FileText,
  LayoutGrid,
  MessageSquare,
  ScrollText,
  Upload,
  Users,
  Activity,
  Settings, // ← NEW
} from "lucide-react";
import { DETAIL_TABS } from "../../utils/campaignDetailUtils";

const TAB_ICONS = {
  layout: LayoutGrid,
  file: FileText,
  users: Users,
  upload: Upload,
  message: MessageSquare,
  contract: ScrollText,
  check: CheckCircle2,
  activity: Activity,
  settings: Settings, // ← NEW
};

export default function CampaignDetailTabs({ activeTab, onChange, tabBadges = {} }) {
  return (
    <div className="overflow-x-auto border-b border-gray-200">
      <div className="flex min-w-max items-center gap-1">
        {DETAIL_TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.icon];
          const isActive = activeTab === tab.key;
          const badge = tab.badgeKey ? tabBadges[tab.badgeKey] : null;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors ${
                isActive
                  ? "border-[#1E60DB] font-medium text-[#1E60DB]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} /> : null}
              {tab.label}
              {badge ? (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}