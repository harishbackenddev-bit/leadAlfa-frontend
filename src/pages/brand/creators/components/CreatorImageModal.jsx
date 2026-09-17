import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function CreatorImageModal({ open, imageUrl, title, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !imageUrl) return null;

  const isPdf = /\.pdf$/i.test(imageUrl?.split("?")[0] || "");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} preview` : "Submission preview"}
      onClick={onClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-black shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="truncate text-sm font-semibold text-white">
            {title || "Submission preview"}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 shrink-0 rounded-full text-white hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-2 sm:p-4">
          {isPdf ? (
            <iframe
              src={`${imageUrl}#toolbar=1`}
              title={title || "PDF Document"}
              className="h-full w-full rounded-lg border-0 bg-white"
            />
          ) : (
            <img
              src={imageUrl}
              alt={title || "Submission image"}
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
              className="max-h-[75vh] w-auto max-w-full select-none object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
