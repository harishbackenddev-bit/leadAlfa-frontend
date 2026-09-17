import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useDragControls } from "motion/react";
import { submitUserFeedback } from "../../services/api/apiservices";

const UserFeedbackModal = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("bug"); // "bug" | "feedback"
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();

  const handleOpen = () => {
    setIsOpen(true);
    setError("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    setSuccessMessage("");
  };

  const startDrag = (event) => {
    dragControls.start(event);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedDesc = description.trim();

    if (!trimmedDesc) {
      setError("Please provide a description.");
      return;
    }

    if (trimmedDesc.length < 5) {
      setError("Description must be at least 5 characters long.");
      return;
    }

    if (trimmedDesc.length > 3000) {
      setError("Description cannot exceed 3000 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        type,
        description: trimmedDesc,
        pageUrl: location.pathname || window.location.pathname,
      };

      const res = await submitUserFeedback(payload);

      if (res?.success || res?.publicId) {
        setSuccessMessage(
          res?.message ||
            `Thank you for your report! Submitted successfully (${res?.publicId || ""}).`
        );
        setDescription("");
        setTimeout(() => {
          handleClose();
        }, 2500);
      } else {
        setError(res?.error || "Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      const msg =
        err?.message ||
        (Array.isArray(err?.errors) ? err.errors.map((e) => e.message).join(", ") : null) ||
        err?.error ||
        "An error occurred while submitting feedback.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Draggable & Collapsible Floating Trigger Button */}
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        className="fixed bottom-6 right-6 z-50 touch-none select-none"
      >
        <div className="relative group flex items-center rounded-full btn-gradient text-white shadow-xl hover:shadow-2xl transition-all duration-200">
          {/* 6-Dots Drag Handle - ONLY this handle moves the button */}
          <div
            onPointerDown={startDrag}
            className="cursor-grab active:cursor-grabbing flex items-center justify-center pl-3 pr-1 py-3 text-white/70 hover:text-white transition-colors"
            title="Hold & drag to move button"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="5" cy="4" r="1.2" />
              <circle cx="11" cy="4" r="1.2" />
              <circle cx="5" cy="8" r="1.2" />
              <circle cx="11" cy="8" r="1.2" />
              <circle cx="5" cy="12" r="1.2" />
              <circle cx="11" cy="12" r="1.2" />
            </svg>
          </div>

          {/* Main Button - Clicking opens the modal */}
          <button
            type="button"
            onClick={handleOpen}
            className={`flex items-center gap-2 text-white font-medium focus:outline-none ${
              isMinimized
                ? "py-3 pr-3 pl-1"
                : "py-2.5 pr-3.5 pl-1 sm:py-3 sm:pr-4 text-xs sm:text-sm"
            }`}
            aria-label="Feedback and Bug Report"
            title="Click to open report modal"
          >
            {/* Icon */}
            <svg
              className="w-5 h-5 text-white shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>

            {!isMinimized && (
              <span className="hidden sm:inline font-medium tracking-wide">
                Feedback & Bug Report
              </span>
            )}
          </button>

          {/* Minimize / Expand Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="absolute -top-1.5 -right-1.5 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-gray-800 text-white text-xs hover:bg-black transition-colors shadow-md"
            title={isMinimized ? "Expand button" : "Minimize button"}
          >
            {isMinimized ? "+" : "−"}
          </button>
        </div>
      </motion.div>

      {/* Modal Backdrop & Body */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl transition-all overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Fixed Header */}
            <div className="flex-none flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Feedback & Bug Report
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Help us improve Creatrend. Tell us what's working or report an issue.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              {/* Success Message Banner */}
              {successMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-sm flex items-start gap-3 my-2">
                  <svg
                    className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Thank you!</p>
                    <p className="mt-0.5 text-xs text-emerald-700">{successMessage}</p>
                  </div>
                </div>
              ) : (
                <form id="user-feedback-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Banner */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Type Segment Control */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Report Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setType("bug")}
                        className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-medium border transition-all ${
                          type === "bug"
                            ? "border-red-500 bg-red-50 text-red-700 font-semibold shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Report a Bug
                      </button>
                      <button
                        type="button"
                        onClick={() => setType("feedback")}
                        className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-medium border transition-all ${
                          type === "feedback"
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        Provide Feedback
                      </button>
                    </div>
                  </div>

                  {/* Description Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {description.length}/3000
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        type === "bug"
                          ? "Please describe what happened, expected behavior, and steps to reproduce..."
                          : "Share your ideas, suggestions, or feature requests with us..."
                      }
                      maxLength={3000}
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0353a4] focus:outline-none focus:ring-1 focus:ring-[#0353a4] transition-colors resize-none"
                    />
                  </div>

                  {/* Auto-Captured Page Context Info */}
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
                    <svg
                      className="w-4 h-4 text-gray-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span className="truncate">
                      Page: <code className="font-mono text-gray-700">{location.pathname || "/"}</code>
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Fixed Footer with Action Buttons */}
            {!successMessage && (
              <div className="flex-none border-t border-gray-100 bg-gray-50/80 px-5 py-3 sm:px-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200/70 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="user-feedback-form"
                  disabled={loading || !description.trim()}
                  className="rounded-xl btn-gradient px-5 py-2 text-xs font-medium text-white hover:bg-[#023e7d] disabled:cursor-not-allowed disabled:opacity-50 shadow-md transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserFeedbackModal;
