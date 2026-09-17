import React, { useEffect } from "react";
import { X, ExternalLink, Download, FileText } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function AdminDocumentModal({ open, documentUrl, title, onClose }) {
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

  if (!open || !documentUrl) return null;

  const path = String(documentUrl || "").split("?")[0].toLowerCase();
  const isPdf = /\.pdf$/i.test(path) || documentUrl?.includes("application/pdf");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Document Viewer"}
      onClick={onClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-2xl border border-slate-800"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
              <FileText className="h-4 w-4" />
            </div>
            <p className="truncate text-sm font-medium text-slate-100">
              {title || "Document"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={documentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open in New Tab</span>
            </a>
            <a
              href={documentUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center bg-slate-900 overflow-hidden">
          {isPdf ? (
            <iframe
              src={`${documentUrl}#toolbar=1&navpanes=0`}
              title={title || "PDF Viewer"}
              className="h-full w-full border-0 bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-200">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                <FileText className="h-10 w-10" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-white">{title || "Document"}</h3>
              <p className="mb-6 max-w-sm text-sm text-slate-400">
                Inline preview is not supported for this file type. You can view or download it directly.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500"
                >
                  <ExternalLink className="h-4 w-4" /> Open in New Tab
                </a>
                <a
                  href={documentUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
