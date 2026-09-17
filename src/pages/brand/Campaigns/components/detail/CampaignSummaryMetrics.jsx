import React from "react";
import {
  CheckSquare,
  FileText,
  RefreshCw,
  UserCheck,
  Users,
} from "lucide-react";

const METRICS = [
  {
    key: "applications",
    label: "Applications",
    icon: Users,
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconColor: "text-blue-600",
    getValue: (d) => d.stats.applications,
  },
  {
    key: "hired",
    label: "Hired Creators",
    icon: UserCheck,
    bg: "bg-green-50",
    border: "border-green-100",
    iconColor: "text-green-600",
    getValue: (d) => d.stats.hired,
  },
  {
    key: "submitted",
    label: "Submitted Assets",
    icon: FileText,
    bg: "bg-purple-50",
    border: "border-purple-100",
    iconColor: "text-purple-600",
    getValue: (d) => d.stats.assetsSubmitted,
  },
  {
    key: "approved",
    label: "Approved Assets",
    icon: CheckSquare,
    bg: "bg-sky-50",
    border: "border-sky-100",
    iconColor: "text-sky-600",
    getValue: (d) => d.stats.approved,
  },
  {
    key: "revisions",
    label: "Revision Requests",
    icon: RefreshCw,
    bg: "bg-red-50",
    border: "border-red-100",
    iconColor: "text-red-500",
    getValue: (d) => d.stats.revisionRequested,
  },
];

export default function CampaignSummaryMetrics({ detail }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {METRICS.map(
        ({ key, label, icon: Icon, bg, border, iconColor, getValue }) => (
          <div
            key={key}
            className={`rounded-xl border ${border} ${bg} p-4`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.75} />
            <p className="mt-3 text-2xl font-semibold text-gray-900">
              {getValue(detail)}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
          </div>
        )
      )}
    </div>
  );
}
