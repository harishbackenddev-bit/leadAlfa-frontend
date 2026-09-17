import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Pause, X } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { getStatusBadgeClasses } from "../../utils/campaignCardUtils";

const HEADER_STATS = [
  { key: "budget", label: "Budget", getValue: (d) => d.budget },
  {
    key: "applications",
    label: "Applications",
    getValue: (d) => d.stats.applications,
  },
  {
    key: "hired",
    label: "Creators Hired",
    getValue: (d) => d.stats.hired,
  },
  {
    key: "assets",
    label: "Assets Submitted",
    getValue: (d) => d.stats.assetsSubmitted,
  },
  {
    key: "completion",
    label: "Completion",
    getValue: (d) => `${d.completionPercent}%`,
  },
];

export default function CampaignDetailHeader({
  detail,
  onEdit,
  editDisabled,
  editDisabledTitle,
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <button
          type="button"
          onClick={() => navigate("/brand/campaigns")}
          className="hover:text-gray-700"
        >
          Campaigns
        </button>
        <span className="text-gray-300">›</span>
        <span className="font-medium text-gray-900">{detail.title}</span>
      </nav>

      <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
                {detail.title}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(
                  detail.statusKey
                )}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {detail.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {detail.displayId} · Started {detail.startedOn} ·{" "}
              {detail.creatorsHired} Creators
            </p>
          </div>

          <div className="hidden flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={editDisabled}
              title={editDisabled ? editDisabledTitle : undefined}
              className="h-9 gap-2 rounded-lg border-gray-200 px-4 text-sm text-gray-700"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-lg border-orange-200 px-4 text-sm text-orange-600 hover:bg-orange-50"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-lg border-red-200 px-4 text-sm text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3 lg:grid-cols-5">
          {HEADER_STATS.map(({ key, label, getValue }) => (
            <div key={key}>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {getValue(detail)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
