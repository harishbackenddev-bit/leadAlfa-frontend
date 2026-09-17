import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Film, Lightbulb, Sparkles, Volume2, X } from "lucide-react";
import { Button } from "../../ui/button";

export function IntroVideoGuidelinesModal({ isOpen, onClose, onConfirmUpload }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const checkScrollState = (el) => {
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    // Allow a 15px threshold for cross-browser rounding differences
    if (scrollHeight - scrollTop <= clientHeight + 15) {
      setHasScrolledToBottom(true);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setHasScrolledToBottom(false);
      return;
    }
    // Check after DOM render if content fits without scrolling
    const timer = setTimeout(() => {
      const el = scrollRef.current;
      if (el) {
        checkScrollState(el);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleScroll = (e) => {
    checkScrollState(e.currentTarget);
  };

  const handleProceed = () => {
    onClose();
    if (typeof onConfirmUpload === "function") {
      onConfirmUpload();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click overlay */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative z-10 flex flex-col w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 transition-all my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0353a4] text-white shadow-md">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[#161C2B]">
                VIDEO GUIDELINES
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Application Video Requirements & Quality Standards
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700"
        >
          {/* Introduction Banner */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-4 sm:p-5 text-sm leading-relaxed text-[#1E3A8A]">
            <p className="flex items-center gap-2 font-semibold text-[#0353a4]">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
              Stand Out to Our Brand Partners
            </p>
            <p className="mt-1.5 text-slate-600 text-xs sm:text-sm">
              We've put together a quick guide for your application video. Please follow the structure and technical specifications below to ensure your submission meets our quality standards.
            </p>
          </div>

          {/* Section 1: Video Structure */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-base font-bold text-[#161C2B] border-b border-gray-100 pb-2">
              <Film className="h-4 w-4 text-[#0353a4]" />
              Video Structure
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 sm:p-4">
                <span className="font-bold text-[#161C2B] text-sm">
                  1. Intro (A-Roll & Hook):
                </span>{" "}
                Frame yourself in a well-lit mid-shot (waist-up) and speak directly to the camera. Keep it punchy: introduce your name, your location, and your core motivation for creating content.
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 sm:p-4">
                <span className="font-bold text-[#161C2B] text-sm">
                  2. Body (B-Roll Montage & Voiceover):
                </span>{" "}
                Cut to a dynamic montage of B-roll footage that showcases your production skills and personal brand. Include clips of your past branded content, hobbies, lifestyle, or favorite filming setups. Overlay this with a clear voiceover (VO) pitching why you are the ideal creator for brands to collaborate with.
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 sm:p-4">
                <span className="font-bold text-[#0353a4] text-sm">
                  3. Outro (Call to Action):
                </span>{" "}
                Cut back to your direct-to-camera mid-shot. Deliver your sign-off with energy and use this exact Call to Action (CTA):
                <p className="mt-2 rounded-lg border border-blue-200 bg-white p-2.5 font-mono font-bold text-[#0353a4] text-center shadow-xs">
                  "Invite me to your next campaign on Creatrend."
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-base font-bold text-[#161C2B] border-b border-gray-100 pb-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Technical Specifications
            </h4>
            <p className="text-xs text-gray-500">
              Ensure your final export meets the following platform requirements:
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span className="block font-semibold text-gray-400">Aspect Ratio</span>
                <span className="font-bold text-[#161C2B]">9:16 (Vertical)</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span className="block font-semibold text-gray-400">Duration</span>
                <span className="font-bold text-[#161C2B]">Max 30 Seconds</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span className="block font-semibold text-gray-400">Resolution</span>
                <span className="font-bold text-[#161C2B]">1080p (1080 × 1920)</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span className="block font-semibold text-gray-400">File Format</span>
                <span className="font-bold text-[#161C2B]">.MP4 or .MOV</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span className="block font-semibold text-gray-400">File Size</span>
                <span className="font-bold text-[#161C2B]">Under 500MB</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <span className="block font-semibold text-gray-400">Language</span>
                <span className="font-bold text-[#161C2B]">English</span>
              </div>
            </div>
          </div>

          {/* Section 3: Production Quality Standards */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-base font-bold text-[#161C2B] border-b border-gray-100 pb-2">
              <Volume2 className="h-4 w-4 text-emerald-600" />
              Production Quality Standards
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#161C2B]">Audio Fidelity:</span> Record in a controlled, sound-treated environment to avoid echo or background hums. You must use your authentic voice—strictly no AI Text-to-Speech (TTS) tools.
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#161C2B]">Lighting & Visuals:</span> Always wipe your camera lens before rolling. Shoot in a bright, evenly lit environment (natural daylight or softbox lighting) to ensure your footage is sharp and free of grain, pixelation, or blur.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            {!hasScrolledToBottom ? (
              <span className="text-amber-600 font-medium animate-pulse">
                Scroll down to read guidelines before uploading
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-1 justify-center sm:justify-start">
                <CheckCircle2 className="h-4 w-4 inline" /> Guidelines read — ready to upload
              </span>
            )}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!hasScrolledToBottom}
              onClick={handleProceed}
              className="flex-1 sm:flex-initial main-btn rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Video
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
