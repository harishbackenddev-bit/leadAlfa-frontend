import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function SubmitWorkSuccessModal({ isResubmit = false, onClose }) {
  const title = isResubmit
    ? "Revision submitted successfully"
    : "Work submitted successfully";
  const message = isResubmit
    ? "Your updated work has been sent to the brand for review. You'll be notified once they respond."
    : "Your work has been submitted successfully. The brand will review it and notify you of the outcome.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-hidden />
        </div>

        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="rounded-xl btn-gradient px-6"
            onClick={onClose}
          >
            Back to My Collabs
          </Button>
        </div>
      </div>
    </div>
  );
}
