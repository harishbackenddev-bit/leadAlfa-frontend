import React from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Package,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import CreatorAvatar from "../shared/CreatorAvatar";

const AD_TYPE_STYLES = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
};

const STATUS_STYLES = {
  green: "text-green-600",
  orange: "text-orange-600",
  gray: "text-gray-500",
};

export function ContractSubTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-1.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#1E60DB] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ContractCard({ contract, onViewDetail, onRenew }) {
  const isExpiring = contract.tab === "expiring";
  const statusText =
    contract.statusLabel ||
    (contract.daysLeft > 0 ? `${contract.daysLeft} days left` : "Expired");

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 md:text-lg">
              {contract.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                AD_TYPE_STYLES[contract.adTypeTone] || AD_TYPE_STYLES.blue
              }`}
            >
              {contract.adType}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Contract ID: {contract.contractId}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {isExpiring ? (
            <Button
              type="button"
              size="sm"
              className="h-9 gap-1.5 rounded-lg bg-[#1E60DB] px-3 text-sm"
              onClick={() => onRenew?.(contract)}
            >
              <RefreshCw className="h-4 w-4" />
              Renew
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg border-gray-200 px-3 text-sm text-gray-700"
            onClick={() => onViewDetail?.(contract)}
          >
            <Eye className="h-4 w-4" />
            View Detail
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 lg:grid-cols-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Creator
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <CreatorAvatar initials={contract.creatorInitials} size="sm" />
            <span className="text-sm font-medium text-gray-900">
              {contract.creatorName}
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Platform
          </p>
          <p className="mt-1.5 text-sm font-medium text-gray-900">
            {contract.platform}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Usage Rights
          </p>
          <p className="mt-1.5 text-sm font-medium text-gray-900">
            {contract.usageRights}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Status
          </p>
          <p
            className={`mt-1.5 text-sm font-semibold ${
              STATUS_STYLES[contract.statusTone] || STATUS_STYLES.green
            }`}
          >
            {statusText}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            {contract.dateRange}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-4 w-4 text-gray-400" />
            {contract.contentType}
          </span>
        </div>
        <p className="text-base font-semibold text-[#1E60DB]">{contract.price}</p>
      </div>
    </article>
  );
}

export const CONTRACT_TAB_CONFIG = [
  { key: "active", label: "Active", icon: CheckCircle2 },
  { key: "expiring", label: "Expiring Soon", icon: Clock },
  { key: "expired", label: "Expired", icon: AlertCircle },
];
