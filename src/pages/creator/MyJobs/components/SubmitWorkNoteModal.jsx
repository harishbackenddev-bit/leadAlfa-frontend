import React from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function SubmitWorkNoteModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0353A4] p-5 text-white shadow-xl sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-wide">Note</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm leading-relaxed sm:text-base">
        Your submission requirements depend on your specific project. Please upload photos if you are working on photography, or videos if you are working on videography. If your work involves both, you may upload both file types.
        </p>
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
