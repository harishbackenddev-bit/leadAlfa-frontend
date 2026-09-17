import illustration from "../../assets/SVGs/brands/sidebarIcons/Illustration.svg";
import { resolveProfileVerificationState } from "../../utils/profileVerificationState";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/authSlice";

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

export default function BrandProfileVerification({ profile }) {
  const user = useAppSelector(selectUser);
  const verification = resolveProfileVerificationState(profile, user);

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
    ? "Brand Profile Verification was Rejected"
    : verification.isClarification
      ? "Additional Information Required"
      : "Brand Profile Verification is Under Review";

  const goToContactSupport = () => {
    window.location.href =
      "mailto:support@creatrend.co.za?subject=Brand%20Profile%20Verification%20Inquiry";
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
                  Your brand profile was reviewed and rejected. Please update your company
                  information and resubmit your application.
                </p>
              ) : verification.isClarification ? (
                <p className="text-sm text-gray-700">
                  Our admin team needs additional information before your brand profile
                  can be approved. A clarification email has been sent
                  {verification.notifyEmail ? (
                    <>
                      {" "}
                      to <span className="font-medium">{verification.notifyEmail}</span>
                    </>
                  ) : (
                    " to your registered company email address"
                  )}
                  . Please review the message and respond with the requested details.
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  Your brand profile is being reviewed by our admin team before full dashboard
                  access is granted. You will receive an email notification once approved.
                </p>
              )}

              {!verification.isClarification && !verification.isRejected ? (
                <p className="text-sm text-gray-700">
                  Please wait for admin approval. You will be notified by email once
                  your brand profile is verified.
                </p>
              ) : null}
            </div>

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
