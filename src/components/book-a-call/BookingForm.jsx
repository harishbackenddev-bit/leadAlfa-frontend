import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import ActionButton from "../common/ActionButton";
import TurnstileField from "../common/TurnstileField";
import {
  BOOK_CALL_BANNER_DURATION_MS,
  BOOK_CALL_FIELD_ERROR_DURATION_MS,
  BOOK_CALL_RATE_LIMIT_MESSAGE,
  BOOK_CALL_SUCCESS_MESSAGE,
  EMPTY_BOOK_CALL_FORM,
  normalizeWebsiteUrl,
  validateBookCallForm,
} from "../../constants/bookCallRequest";
import { useTurnstileCaptcha } from "../../hooks/useTurnstileCaptcha";
import { submitBookCallRequest } from "../../services/api/apiservices";
import { selectIsAuthenticated, selectUser } from "../../store/slices/authSlice";

const FIELD_IDS = {
  name: "book-call-name",
  businessEmail: "book-call-email",
  companyName: "book-call-company",
  companyWebsite: "book-call-website",
  agreedToTerms: "book-call-terms",
};

const buildPrefillFromUser = (user) => {
  if (!user) return EMPTY_BOOK_CALL_FORM;

  const profile = user.profile || {};
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  const companyWebsite = normalizeWebsiteUrl(
    profile.companyWebsite || profile.website || profile.companyUrl || ""
  );

  return {
    name,
    businessEmail: user.email || profile.companyEmail || "",
    companyName: profile.companyName || "",
    companyWebsite,
  };
};

export default function BookingForm() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const captcha = useTurnstileCaptcha();

  const [formData, setFormData] = useState(EMPTY_BOOK_CALL_FORM);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(BOOK_CALL_SUCCESS_MESSAGE);
  const [submitting, setSubmitting] = useState(false);
  const skipPrefillRef = useRef(false);

  useEffect(() => {
    if (skipPrefillRef.current) return;
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        ...buildPrefillFromUser(user),
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!success) return undefined;

    const timer = setTimeout(() => {
      setSuccess(false);
    }, BOOK_CALL_BANNER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!bannerError) return undefined;

    const timer = setTimeout(() => {
      setBannerError("");
    }, BOOK_CALL_BANNER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [bannerError]);

  useEffect(() => {
    if (!Object.keys(fieldErrors).length) return undefined;

    const timer = setTimeout(() => {
      setFieldErrors({});
    }, BOOK_CALL_FIELD_ERROR_DURATION_MS);

    return () => clearTimeout(timer);
  }, [fieldErrors]);

  const clearFieldError = (field) => {
    if (!fieldErrors[field]) return;
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const focusFirstError = (errors) => {
    const firstField = Object.keys(FIELD_IDS).find((field) => errors[field]);
    if (!firstField) return;
    document.getElementById(FIELD_IDS[firstField])?.focus();
  };

  const handleWebsiteBlur = () => {
    setFormData((prev) => ({
      ...prev,
      companyWebsite: normalizeWebsiteUrl(prev.companyWebsite),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerError("");
    setSuccess(false);
    captcha.clearCaptchaError();

    const clientErrors = validateBookCallForm({
      ...formData,
      agreedToTerms,
    });

    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      focusFirstError(clientErrors);
      return;
    }

    setFieldErrors({});

    if (!captcha.requireCaptchaToken()) {
      return;
    }

    const payload = captcha.withCaptchaPayload({
      name: formData.name.trim(),
      businessEmail: formData.businessEmail.trim(),
      companyName: formData.companyName.trim(),
      companyWebsite: normalizeWebsiteUrl(formData.companyWebsite),
    });

    try {
      setSubmitting(true);
      const data = await submitBookCallRequest(payload);

      setSuccessMessage(data?.message || BOOK_CALL_SUCCESS_MESSAGE);
      setSuccess(true);
      skipPrefillRef.current = true;
      setFormData({ ...EMPTY_BOOK_CALL_FORM });
      setAgreedToTerms(false);
      captcha.resetTurnstile();
    } catch (err) {
      if (captcha.handleCaptchaApiError(err)) {
        return;
      }
      if (err?.status === 429) {
        setBannerError(err.error || BOOK_CALL_RATE_LIMIT_MESSAGE);
        return;
      }

      if (err?.status === 400 && Array.isArray(err.errors) && err.errors.length) {
        const nextFieldErrors = err.errors.reduce((acc, item) => {
          if (item?.field) {
            acc[item.field] = item.message;
          }
          return acc;
        }, {});
        setFieldErrors(nextFieldErrors);
        if (!Object.keys(nextFieldErrors).length) {
          setBannerError(err.errors[0]?.message || "Please check your details and try again.");
        }
        return;
      }

      if (err?.status >= 500 || !err?.status) {
        setBannerError("Something went wrong. Please try again later.");
        return;
      }

      setBannerError(err?.error || err?.message || "Unable to submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName = (field) =>
    `w-full rounded-xl border-2 bg-gray-50/50 px-4 py-3.5 outline-none transition-all focus:border-[#0c7bb3] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${
      fieldErrors[field] ? "border-red-400" : "border-gray-200"
    }`;

  return (
    <section className="relative overflow-hidden bg-[#F7F8F9]">
      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-10 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-16 xl:gap-20">
        <div>
          <h1 className="text-[32px] font-bold leading-[1.18] tracking-[-0.025em] text-[#101727] sm:text-[42px] sm:leading-[1.16] lg:text-[46px]">
            Book A Call
          </h1>

          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.85] text-[#606977] sm:text-[16px]">
            Ready to scale with authentic user-generated content? Book a discovery call with Creatrend&apos;s UGC experts.
          </p>
          <p className="mt-4 max-w-[560px] text-[15px] leading-[1.85] text-[#606977] sm:text-[16px]">
            We&apos;ll walk you through our platform, showcase our solutions in action, and explore how the trust economy can drive your brand&apos;s growth. Here&apos;s what we&apos;ll cover during our chat:
          </p>

          <p className="mt-5 text-sm font-semibold italic text-[#606977]">
            No obligation — just a focused chat with our UGC team.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <ActionButton label="Join as a Brand" onClick={() => navigate("/login")} />
            <ActionButton
              label="Explore Case Study"
              onClick={() => navigate("/case-studies")}
              variant="secondary"
              arrow_bg="#0c7bb3"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 lg:p-10">
          <div className="mb-8">
            <h2 className="mb-2 text-[24px] font-bold tracking-[-0.02em] text-[#101727] sm:text-[28px]">Booking form</h2>
            <p className="text-[14px] text-[#606977]">Fill in your details to schedule a call</p>
          </div>

          

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="book-call-name" className="mb-2 block text-sm font-medium text-[#101727]">Your name</label>
              <input
                id="book-call-name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClassName("name")}
                maxLength={100}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "book-call-name-error" : undefined}
              />
              {fieldErrors.name ? (
                <p id="book-call-name-error" role="alert" className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="book-call-email" className="mb-2 block text-sm font-medium text-[#101727]">Business Email</label>
              <input
                id="book-call-email"
                type="email"
                name="businessEmail"
                placeholder="john@company.com"
                value={formData.businessEmail}
                onChange={(e) => updateField("businessEmail", e.target.value)}
                className={inputClassName("businessEmail")}
                maxLength={255}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.businessEmail)}
                aria-describedby={fieldErrors.businessEmail ? "book-call-email-error" : undefined}
              />
              {fieldErrors.businessEmail ? (
                <p id="book-call-email-error" role="alert" className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.businessEmail}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="book-call-company" className="mb-2 block text-sm font-medium text-[#101727]">Company Name</label>
              <input
                id="book-call-company"
                type="text"
                name="companyName"
                placeholder="Your Company Inc."
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                className={inputClassName("companyName")}
                maxLength={150}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.companyName)}
                aria-describedby={fieldErrors.companyName ? "book-call-company-error" : undefined}
              />
              {fieldErrors.companyName ? (
                <p id="book-call-company-error" role="alert" className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.companyName}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="book-call-website" className="mb-2 block text-sm font-medium text-[#101727]">Company Website</label>
              <input
                id="book-call-website"
                type="text"
                inputMode="url"
                autoComplete="url"
                name="companyWebsite"
                placeholder="https://yourcompany.com"
                value={formData.companyWebsite}
                onChange={(e) => updateField("companyWebsite", e.target.value)}
                onBlur={handleWebsiteBlur}
                className={inputClassName("companyWebsite")}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.companyWebsite)}
                aria-describedby={fieldErrors.companyWebsite ? "book-call-website-error" : undefined}
              />
              {fieldErrors.companyWebsite ? (
                <p id="book-call-website-error" role="alert" className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.companyWebsite}
                </p>
              ) : null}
            </div>

            <TurnstileField captcha={captcha} />

            {bannerError ? (
            <div className="mb-5 flex justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <span>{bannerError}</span>
              <button
                type="button"
                onClick={() => setBannerError("")}
                className="shrink-0 text-red-400 hover:text-red-600"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          ) : null}

          {success ? (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          ) : null}

            <button
              type="submit"
              disabled={submitting || !captcha.isCaptchaReady}
              className="main-btn mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full font-medium transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                "Schedule your call"
              )}
            </button>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <p className="text-xs leading-relaxed text-[#606977]">
                This call is for brands and agencies only. If you&apos;re a creator, please follow{" "}
                <Link to="/for-creators" className="text-[#0c7bb3] underline hover:opacity-80">
                  For Creators
                </Link>
              </p>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  id="book-call-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    clearFieldError("agreedToTerms");
                  }}
                  className={`mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0c7bb3] focus:ring-[#0c7bb3] focus:ring-offset-0 ${
                    fieldErrors.agreedToTerms ? "outline outline-2 outline-red-400" : ""
                  }`}
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.agreedToTerms)}
                  aria-describedby={fieldErrors.agreedToTerms ? "book-call-terms-error" : undefined}
                />
                <span className="text-xs leading-relaxed text-[#606977]">
                  By submitting your email, you agree to be contacted by Creatrend. You reserve the right to unsubscribe at your convenience. View{" "}
                  <Link to="/privacy-policy" className="text-[#0c7bb3] underline hover:opacity-80">Privacy Policy</Link>.
                </span>
              </label>
              {fieldErrors.agreedToTerms ? (
                <p id="book-call-terms-error" role="alert" className="text-sm text-red-600">
                  {fieldErrors.agreedToTerms}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
