import React from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import CampaignsNav from "./CampaignsNav";

/**
 * Shared layout for Campaign Management section routes:
 * title, subtitle, search + filter + primary CTA, then nav tabs, then page body.
 */
export default function CampaignsSectionShell({
  subtitle,
  searchPlaceholder = "",
  searchValue = "",
  onSearchChange,
  onFilterClick,
  /** { label, onClick, icon?: ReactNode } — omit to hide the blue button */
  primaryAction = null,
  children,
}) {
  return (
    <div className="w-full min-w-0 bg-gray-50">
      <div className="mx-auto w-full min-w-0 space-y-5 p-4 md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 md:text-[28px] md:leading-tight">
              Campaign Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:flex-shrink-0">
            <div className="relative w-full min-w-0 xl:w-[480px] lg:w-[250px]">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-3 pr-10 text-sm text-black focus:border-[#1E60DB] focus:outline-none focus:ring-1 focus:ring-[#1E60DB]/20"
              />
            </div>
          
          </div>
        </div>

        <div className="pb-px">
          <CampaignsNav onFilterClick={onFilterClick} primaryAction={primaryAction} />
        </div>

        {children}
      </div>
    </div>
  );
}
