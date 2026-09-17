import React, { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, XCircle } from "lucide-react";

/**
 * Amber, collapsible "Brand Feedback" box shown on the creator job detail page
 * when a brand requests a revision. Splits revisionFeedback on `\n\n` into
 * revision notes (first) and rejection notes (second).
 */
export default function RevisionBrandFeedback({ feedback = [] }) {
  const [open, setOpen] = useState(true);

  if (!feedback.length) return null;

  const count = feedback.length;
  const latestDate = feedback[feedback.length - 1]?.date;

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <RotateCcw className="h-4 w-4" aria-hidden />
          </span>
          <span>
            <span className="block text-[15px] font-semibold text-amber-900">
              Brand Feedback — {count} {count === 1 ? "Revision" : "Revisions"}{" "}
              Requested
            </span>
            {latestDate ? (
              <span className="mt-0.5 block text-xs text-amber-700/80">
                Latest: {latestDate}
              </span>
            ) : null}
          </span>
        </span>
        <span className="mt-1 text-amber-700">
          {open ? (
            <ChevronUp className="h-5 w-5" aria-hidden />
          ) : (
            <ChevronDown className="h-5 w-5" aria-hidden />
          )}
        </span>
      </button>

      {open ? (
        <div className="space-y-4 px-5 pb-5">
          {feedback.map((item, idx) => {
            const revisionNotes = item.revisionNotes || "";
            const rejectionNotes = item.rejectionNotes || "";
            const hasSplit = Boolean(revisionNotes || rejectionNotes);

            return (
              <div key={item.id ?? idx}>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
                    {item.revisionLabel || `R${idx + 1}`}
                  </span>
                  <span className="text-sm font-semibold text-amber-900">
                    {item.brandName || "Brand"}
                  </span>
                  {item.date ? (
                    <span className="text-xs text-amber-700/80">
                      · {item.date}
                    </span>
                  ) : null}
                </div>

                {hasSplit ? (
                  <div className="mt-2 space-y-2">
                    {revisionNotes ? (
                      <div className="rounded-xl border border-amber-200/70 bg-white px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                          Revision notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                          {revisionNotes}
                        </p>
                      </div>
                    ) : null}
                    {rejectionNotes ? (
                      <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3">
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-700">
                          <XCircle className="h-3.5 w-3.5" aria-hidden />
                          Rejection notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                          {rejectionNotes}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : item.message ? (
                  <div className="mt-2 rounded-xl border border-amber-200/70 bg-white px-4 py-3 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {item.message}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
