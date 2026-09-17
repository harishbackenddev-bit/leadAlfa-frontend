import React from "react";
import {
  CalendarDays,
  FileText,
  RotateCcw,
} from "lucide-react";

const TIMELINE_ICONS = {
  Deadline: CalendarDays,
  Submitted: FileText,
};

/**
 * Sticky sidebar for the creator revision page: payment, timeline and the
 * orange "Submit Revisions" action that opens the re-submit form.
 */
export default function RevisionSidebar({
  revision,
  paymentLabel,
  onSubmitRevisions,
}) {
  const timeline = revision?.timeline || [];
  const payment = paymentLabel || revision?.compensation || "—";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-[#0353A4] to-[#024080] px-5 py-5 text-white shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
          Payment
        </p>
        <p className="mt-2 text-2xl font-bold sm:text-3xl">{payment}</p>
        {revision?.releaseNote ? (
          <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80">
            {revision.releaseNote}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onSubmitRevisions}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#EA580C] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C2410C]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Submit Revisions
        </button>
      </div>

      {timeline.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Timeline</p>
          <div className="mt-3 space-y-3">
            {timeline.map((row, idx) => {
              const Icon = TIMELINE_ICONS[row.label] || RotateCcw;
              return (
                <div
                  key={`${row.label}-${idx}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-gray-500">
                    <Icon className="h-4 w-4 text-gray-400" aria-hidden />
                    {row.label}
                  </span>
                  <span
                    className={`font-medium ${
                      row.highlight ? "text-[#EA580C]" : "text-gray-900"
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
