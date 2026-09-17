import React from "react";
import { Clock } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";

const STATUS_CONFIG = {
  in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700" },
};

export default function FeedbackRevisionCard({
  revision,
  onSendReminder,
  onApprove,
  isApproving = false,
}) {
  const status = STATUS_CONFIG[revision.status] || STATUS_CONFIG.pending;
  const canSendReminder = revision.canSendReminder !== false;
  const canApprove = revision.canApprove !== false;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              {revision.creatorName}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">{revision.deliverable}</p>
        </div>
        <p className="shrink-0 text-xs text-gray-400">
          Requested {revision.requestedDate}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-800">Brand Feedback</p>
        <p className="mt-1.5 text-sm leading-relaxed text-amber-900/90">
          {revision.feedback}
        </p>
      </div>

      <div className="mt-4 hidden flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
          <Clock className="h-4 w-4" />
          Due: {revision.dueDate}
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-gray-200 px-4 text-sm text-gray-700"
            disabled={!canSendReminder}
            onClick={() => onSendReminder?.(revision)}
          >
            Send Reminder
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-lg bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
            disabled={!canApprove || isApproving}
            onClick={() => onApprove?.(revision)}
          >
            Approve Revision
          </Button>
        </div>
      </div>
    </article>
  );
}
