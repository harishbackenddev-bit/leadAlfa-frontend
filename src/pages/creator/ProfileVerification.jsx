import { useRef, useState } from "react";
import { Loader2, Paperclip, X } from "lucide-react";
import illustration from "../../assets/SVGs/brands/sidebarIcons/Illustration.svg";
import { resolveProfileVerificationState } from "../../utils/profileVerificationState";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectUser, updateUser } from "../../store/slices/authSlice";
import { reuploadCreatorDocuments } from "../../services/api/apiservices";
import { normalizeProfileFromApiResponse } from "../../utils/onboardingProfile";
import {
  buildReuploadDocumentsFormData,
  getReuploadIntroVideoFileError,
  getReuploadResidencePermitFileError,
} from "../../utils/creatorProfileFormData";

function DocumentPicker({
  label,
  hint,
  accept,
  file,
  error,
  disabled,
  onSelect,
  onRemove,
}) {
  const inputRef = useRef(null);

  return (
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="mb-2 text-xs text-gray-500">{hint}</p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label={label}
        onChange={(event) => {
          const selected = event.target.files?.[0] || null;
          event.target.value = "";
          if (selected) onSelect(selected);
        }}
      />

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <span className="flex min-w-0 items-center gap-2 text-sm text-gray-700">
            <Paperclip className="h-4 w-4 flex-shrink-0" aria-hidden />
            <span className="truncate">{file.name}</span>
          </span>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${label}`}
            className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-50 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="w-full rounded-lg border-2 border-dashed border-gray-200 px-3 py-3 text-sm font-medium text-[#0c7bb3] transition hover:border-[#0c7bb3] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          Choose File
        </button>
      )}

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReuploadDocumentsForm({ onSuccess }) {
  const [residencePermit, setResidencePermit] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [residencePermitError, setResidencePermitError] = useState("");
  const [introVideoError, setIntroVideoError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSelectResidencePermit = (file) => {
    const error = getReuploadResidencePermitFileError(file);
    setResidencePermitError(error || "");
    setSuccessMessage("");
    setResidencePermit(error ? null : file);
  };

  const handleSelectIntroVideo = (file) => {
    const error = getReuploadIntroVideoFileError(file);
    setIntroVideoError(error || "");
    setSuccessMessage("");
    setIntroVideo(error ? null : file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!residencePermit && !introVideo) {
      setFormError(
        "At least one document (residencePermit or introVideo) is required for re-upload."
      );
      return;
    }

    setFormError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const formData = buildReuploadDocumentsFormData({
        residencePermit,
        introVideo,
      });
      const data = await reuploadCreatorDocuments(formData);

      setResidencePermit(null);
      setIntroVideo(null);
      setSuccessMessage(
        data?.message ||
          "Documents re-uploaded successfully. Your profile has been resubmitted for review."
      );
      onSuccess?.(data);
    } catch (error) {
      setFormError(
        error?.error || error?.message || "Failed to re-upload documents."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(residencePermit || introVideo) && !submitting;

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-lg border border-gray-200 bg-white p-4 md:mb-8 md:p-6"
    >
      <h3 className="mb-1 text-base font-semibold text-gray-900">
        Re-upload Documents
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        Upload a new residence permit and/or introduction video to resubmit
        your profile for review.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <DocumentPicker
          label="Residence Permit"
          hint="PDF, up to 10MB"
          accept="application/pdf,.pdf"
          file={residencePermit}
          error={residencePermitError}
          disabled={submitting}
          onSelect={handleSelectResidencePermit}
          onRemove={() => setResidencePermit(null)}
        />
        <DocumentPicker
          label="Introduction Video"
          hint="MP4 or MOV, up to 100MB"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          file={introVideo}
          error={introVideoError}
          disabled={submitting}
          onSelect={handleSelectIntroVideo}
          onRemove={() => setIntroVideo(null)}
        />
      </div>

      {formError ? (
        <p className="mt-4 text-sm font-medium text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 text-sm font-medium text-green-700" role="status">
          {successMessage}
        </p>
      ) : null}

      <div className="mt-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="main-btn flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Resubmitting...</span>
            </>
          ) : (
            <span>Resubmit Documents</span>
          )}
        </button>
      </div>
    </form>
  );
}

const formatSubmittedAt = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export default function CreatorProfileVerification({ profile }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const verification = resolveProfileVerificationState(profile, user);

  const handleReuploadSuccess = (data) => {
    const normalized = normalizeProfileFromApiResponse(data) || data?.profile;
    if (normalized) {
      dispatch(updateUser({ profile: normalized }));
    }
  };

  const badgeText = verification.isRejected
    ? "Application Rejected"
    : verification.isClarification
      ? "Clarification Needed"
      : "Application Pending";

  const cardStatusText = verification.isRejected
    ? "Rejected"
    : verification.isClarification
      ? "Clarification"
      : "Pending";

  const headingText = verification.isRejected
    ? "Profile Verification was Rejected"
    : verification.isClarification
      ? "Additional Information Required"
      : "Profile Verification is Under Review";

  const goToContactSupport = () => {
    window.location.href =
      "mailto:support@creatrend.co.za?subject=Creator%20Profile%20Verification%20Inquiry";
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 md:p-6">
      <div
        className={`mb-6 rounded-lg px-4 py-4 shadow-sm md:px-6 ${
          verification.isRejected
            ? "bg-red-50"
            : verification.isClarification
              ? "bg-amber-50"
              : "bg-blue-50"
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div
            className={`w-fit rounded-3xl px-3 py-1 text-sm font-medium ${
              verification.isRejected
                ? "bg-red-100 text-red-700"
                : verification.isClarification
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700"
            }`}
          >
            {badgeText}
          </div>

          <div className="md:flex-1 md:text-center">
            <h1 className="text-lg md:text-xl font-[900] text-gray-900 tracking-tight">
              {headingText}
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600">Have Any Questions?</span>
            <button
              type="button"
              onClick={goToContactSupport}
              className="px-4 py-2 border border-blue-600 text-[#0c7bb3] rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <div className="relative m-0 rounded-lg bg-white p-6 shadow-sm md:m-4 md:p-10">
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 md:pr-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 md:gap-4">
              <h2 className="text-xl md:text-2xl font-[900] text-black">
                Profile Verification Status
              </h2>
              <span
                className={`rounded-xl px-3 py-0.5 text-sm font-medium tracking-wide ${
                  verification.isRejected
                    ? "bg-red-50 text-red-700"
                    : verification.isClarification
                      ? "bg-amber-50 text-amber-700"
                      : "bg-blue-50 text-[#0c7bb3]"
                }`}
              >
                {cardStatusText}
              </span>
            </div>

            <p className="mb-6 text-sm text-gray-600 md:mb-8">
              Your application is submitted: {formatSubmittedAt(profile?.createdAt)}
            </p>

            {verification.isRejected ? (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mb-8">
                <span className="font-semibold">Reason:</span>{" "}
                {verification.rejectionReason || "No reason provided."}
              </div>
            ) : null}

            {verification.isClarification ? (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 md:mb-8">
                <span className="font-semibold">Admin message:</span>{" "}
                {verification.clarificationMessage ||
                  "Please check your email for the clarification request from our admin team."}
              </div>
            ) : null}

            <div className="mb-6 border-b border-gray-200 md:mb-8" />

            <div className="space-y-3 md:space-y-4">
              {verification.isRejected ? (
                <p className="text-sm text-gray-700">
                  Your creator profile was reviewed and rejected. Please update your
                  information and resubmit your application.
                </p>
              ) : verification.isClarification ? (
                <p className="text-sm text-gray-700">
                  Our admin team needs additional information before your creator profile
                  can be approved. A clarification email has been sent
                  {verification.notifyEmail ? (
                    <>
                      {" "}
                      to <span className="font-medium">{verification.notifyEmail}</span>
                    </>
                  ) : (
                    " to your registered email address"
                  )}
                  . Please review the message and respond with the requested details.
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  Your creator profile is being reviewed before it is published on
                  Creatrend. You will receive an email notification within 24 hours.
                </p>
              )}

              {!verification.isClarification && !verification.isRejected ? (
                <p className="text-sm text-gray-700">
                  Please wait for admin approval. You will be notified by email once
                  your profile is verified.
                </p>
              ) : null}
            </div>

            {verification.isRejected || verification.isClarification ? (
              <ReuploadDocumentsForm onSuccess={handleReuploadSuccess} />
            ) : null}

            <div className="mt-6 md:mt-8">
              <button
                type="button"
                onClick={goToContactSupport}
                className="px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>

          <div className="flex justify-center md:block md:flex-shrink-0">
            <div className="rounded-full bg-gray-50 p-3">
              <img
                src={illustration}
                alt="illustration"
                className="h-20 w-20 object-contain md:h-24 md:w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
