import React from "react";
import { cn } from "../../../../../lib/utils";

export default function CampaignCreateStepCard({ title, description, children, className }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-7",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-[#64748B]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function ToggleSwitch({ checked, onChange, label, description, id }) {
  const switchId = id || label;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>
        ) : null}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#0C7BB3]" : "bg-[#CBD5E1]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export function ChoiceCard({ selected, onClick, icon: Icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-[#0C7BB3] bg-[#EFF6FF]"
          : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
      )}
    >
      {selected ? (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#0C7BB3] text-white">
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
      {Icon ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#64748B]">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <span>
        <span className="block text-sm font-semibold text-[#111827]">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-[#64748B]">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
