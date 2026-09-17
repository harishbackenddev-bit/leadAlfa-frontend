import React from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function DeclineInvitationModal({
  invitation,
  onClose,
  onConfirm,
  isProcessing = false,
}) {
  const title = invitation?.title || "this campaign";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <Trash2 className="h-6 w-6 text-red-600" aria-hidden />
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
          Decline Campaign Invitation
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to decline the invitation for{" "}
          <span className="font-semibold text-gray-900">{title}</span>?
        </p>
        <p className="mt-1 text-sm text-gray-500">
          This action cannot be undone. The invitation will be removed from
          your list.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            onClick={() => onConfirm(invitation)}
            disabled={isProcessing}
          >
            {isProcessing ? "Declining..." : "Decline Invitation"}
          </Button>
        </div>
      </div>
    </div>
  );
}
