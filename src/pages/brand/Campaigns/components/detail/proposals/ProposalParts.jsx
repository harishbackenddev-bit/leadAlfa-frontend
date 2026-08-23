import React from "react";
import { ChevronDown, ChevronUp, Play, Star } from "lucide-react";
import brandVideo from "../../../../../../assets/SVGs/brands/campaigns/brandVideo.svg";
import { formatMediaBytes } from "../../../utils/proposalUtils";

const SUMMARY_FILTERS = [
  { key: "all", label: "Total Proposals" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Declined" },
];

export default function ProposalSummaryCards({ counts, activeFilter, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {SUMMARY_FILTERS.map(({ key, label }) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`rounded-xl border bg-white px-4 py-4 text-left transition-colors ${
              isActive
                ? "border-[#1E60DB] ring-1 ring-[#1E60DB]/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="text-2xl font-semibold text-gray-900">{counts[key] ?? 0}</p>
            <p className="mt-0.5 text-sm text-gray-500">{label}</p>
          </button>
        );
      })}
    </div>
  );
}

export function ProposalStatusBadge({ status }) {
  const config = {
    pending: { label: "Pending", className: "bg-amber-50 text-amber-700" },
    accepted: { label: "Accepted", className: "bg-green-50 text-green-700" },
    rejected: { label: "Rejected", className: "bg-gray-100 text-gray-600" },
  };
  const { label, className } = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function ProposalVideoPitch({ media }) {
  if (!media) return null;

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        Video Pitch
      </p>
      <div className="mt-1.5 flex items-center gap-4 rounded-xl bg-[#F4F6FB] px-4 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white">
          <img src={brandVideo} alt="video" className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {media.name || "Video pitch"}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {[formatMediaBytes(media.size), "Video file"]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <a
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1E60DB]/30 text-[#1E60DB] hover:bg-[#1E60DB]/5"
          aria-label="Play video"
        >
          <Play className="h-4 w-4 fill-current" />
        </a>
      </div>
    </div>
  );
}

export function CreatorAvatar({ initials, size = "md" }) {
  const sizeClass = size === "lg" ? "h-12 w-12 text-base" : "h-11 w-11 text-sm";
  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0353a4] to-[#4b96e3] font-semibold text-white`}
    >
      {initials}
    </div>
  );
}

export function ProposalCardHeader({
  proposal,
  expanded,
  onToggle,
  onViewCreator,
  formatAmount,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle?.();
        }
      }}
      className="flex w-full cursor-pointer items-start gap-4 text-left"
    >
      <CreatorAvatar initials={proposal.initials} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {proposal.creatorId ? (
            <button
              type="button"
              className="font-semibold hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onViewCreator?.(proposal);
              }}
            >
              {proposal.name}
            </button>
          ) : (
            <span className="font-semibold text-gray-900">{proposal.name}</span>
          )}
          {proposal.handle ? (
            <span className="text-sm text-gray-500">{proposal.handle}</span>
          ) : null}
          <ProposalStatusBadge status={proposal.status} />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {proposal.rating}
          </span>
          <span>{proposal.jobsDone} jobs done</span>
          <span>{proposal.location}</span>
          <span>Asking {formatAmount(proposal.askingPrice)}</span>
        </div>
        {proposal.tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {proposal.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <span className="shrink-0 pt-1 text-gray-400">
        {expanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </span>
    </div>
  );
}
