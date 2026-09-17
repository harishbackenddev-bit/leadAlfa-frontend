import React from "react";
import { CheckCircle2, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";

/**
 * Shared accept/reject confirmation dialog (brand proposals & applications).
 * @param {"accept"|"reject"} variant
 */
export default function ConfirmActionDialog({
  variant,
  creatorName,
  isProcessing = false,
  onCancel,
  onConfirm,
  acceptTitle = "Accept Proposal",
  rejectTitle = "Decline Proposal",
  acceptMessage = "Once accepted, a chat room will be created and the creator will be notified.",
  rejectMessage = "This action cannot be undone. The creator will be notified that their proposal was not selected.",
}) {
  const isAccept = variant === "accept";
  const Icon = isAccept ? CheckCircle2 : Trash2;
  const iconBg = isAccept ? "bg-emerald-50" : "bg-red-50";
  const iconColor = isAccept ? "text-emerald-600" : "text-red-600";
  const title = isAccept ? acceptTitle : rejectTitle;
  const confirmLabel = isAccept ? "Accept Proposal" : "Decline Proposal";
  const processingLabel = isAccept ? "Accepting..." : "Declining...";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close confirmation"
        onClick={isProcessing ? undefined : onCancel}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden />
        </div>

        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to {isAccept ? "accept" : "decline"} the proposal
          {creatorName ? (
            <>
              {" "}
              from{" "}
              <span className="font-semibold text-gray-900">{creatorName}</span>
            </>
          ) : null}
          ?
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {isAccept ? acceptMessage : rejectMessage}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isAccept ? "default" : "destructive"}
            className={`rounded-xl ${isAccept ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? processingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
