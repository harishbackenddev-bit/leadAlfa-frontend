import { CalendarDays, Clock3 } from "lucide-react";
import { buildContactRequestHistory } from "./contactRequestNotes";

const HistoryDateTime = ({ dateLabel, timeLabel }) => (
  <div className="mb-3 flex flex-col gap-2 border-b border-gray-200 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
    {dateLabel ? (
      <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600 sm:text-xs">
        <CalendarDays className="h-3.5 w-3.5 flex-shrink-0 text-[#0353a4]" />
        <span>{dateLabel}</span>
      </div>
    ) : null}

    {timeLabel ? (
      <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600 sm:text-xs">
        <Clock3 className="h-3.5 w-3.5 flex-shrink-0 text-[#0353a4]" />
        <span>{timeLabel}</span>
      </div>
    ) : null}
  </div>
);

const ContactRequestReplyHistory = ({
  adminNotes = "",
  originalMessage = "",
  submittedAt = null,
  updatedAt = null,
}) => {
  const entries = buildContactRequestHistory({
    adminNotes,
    originalMessage,
    submittedAt,
    updatedAt,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xs font-semibold text-gray-900 sm:text-sm">Saved Notes History</h4>
        <span className="text-[11px] text-gray-500 sm:text-xs">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-xs text-gray-500 sm:text-sm">
          No history yet. Add a reply above and save to start the thread.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <article
              key={`${entry.type}-${entry.iso || entry.timestamp || "legacy"}-${index}`}
              className={`rounded-xl border px-4 py-3 ${
                entry.type === "original"
                  ? "border-blue-100 bg-blue-50/40"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-[11px] ${
                    entry.type === "original"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {entry.label}
                </span>
              </div>

              <HistoryDateTime dateLabel={entry.dateLabel} timeLabel={entry.timeLabel} />

              <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-800 sm:text-sm">
                {entry.text}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactRequestReplyHistory;
