import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import { useAuth, toAuthErrorMessage } from "./hooks/useAuthHook";
import TurnstileField from "../../components/common/TurnstileField";
import { useTurnstileCaptcha } from "../../hooks/useTurnstileCaptcha";
import {
  EditIcon,
  LeftArrowIcon,
} from "../../assets/SVGs/portfolio/main/signUp_icons";

const SIGNUP_DRAFT_STORAGE_KEY = "signup_step1_draft";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendCode, loading, logout } = useAuth();
  const captcha = useTurnstileCaptcha();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [pendingAutoResend, setPendingAutoResend] = useState(false);

  // Refs for OTP inputs
  const inputRefs = useRef([]);
  const autoResendStartedRef = useRef(false);

  useEffect(() => {
    // Only skip OTP if the stored user is actually marked as verified —
    // access_token alone isn't proof, since signup now issues a token pre-verification
    const token = localStorage.getItem("access_token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (token && storedUser?.isEmailVerified) {
      navigate("/signup?step=role", { replace: true });
      return;
    }

    // Get email from navigation state or query params
    const emailFromState = location.state?.email;
    const isFromLogin = location.state?.fromLogin || false;
    const params = new URLSearchParams(location.search);
    const emailFromParams = params.get("email");

    const userEmail = emailFromState || emailFromParams;

    if (userEmail) {
      setEmail(userEmail);

      if (isFromLogin) {
        setPendingAutoResend(true);
      } else {
        setResendCooldown(120);
      }
    } else {
      // If no email provided, redirect to signup
      navigate("/signup");
    }
  }, [location, navigate]);

  const resendCodeAutomatically = useCallback(
    async (userEmail) => {
      if (!captcha.requireCaptchaToken()) {
        // Captcha not ready yet — no request made; allow a retry once it is.
        autoResendStartedRef.current = false;
        return;
      }

      // Auto-resend fires exactly once. Clear the pending flag up front so that
      // a rate-limit (429) or any other error cannot re-trigger the effect into
      // an infinite resend loop. The user can still resend manually afterwards.
      setPendingAutoResend(false);

      try {
        await resendCode(captcha.withCaptchaPayload({ email: userEmail }));
        setResendCooldown(120);
      } catch (err) {
        if (captcha.handleCaptchaApiError(err)) {
          return;
        }
        setError(toAuthErrorMessage(err) || "Failed to send verification code.");
      }
    },
    [captcha, resendCode]
  );

  // Auto-resend after login once Turnstile completes (resend-code is protected).
  useEffect(() => {
    if (!pendingAutoResend || !email || !captcha.captchaToken || autoResendStartedRef.current) {
      return;
    }

    autoResendStartedRef.current = true;
    resendCodeAutomatically(email);
  }, [pendingAutoResend, email, captcha.captchaToken, resendCodeAutomatically]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter complete 6-digit code");
      return;
    }

    try {
      await verifyEmail({ email, code });
      setSuccess("Email verified successfully! Redirecting...");
      sessionStorage.removeItem(SIGNUP_DRAFT_STORAGE_KEY);

      // Redirect based on whether a session is active — not on where the user
      // came from. verifyEmail() persists the verified session (adopting a
      // token if the backend returns one), so if we now have an access_token
      // the user should continue onboarding at role selection. Only when there
      // is no session (login was rejected pre-verification and verify returned
      // no token) do we send them to login to sign in with their now-verified email.
      setTimeout(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
          // replace: true so the back button won't return to verify-email
          navigate("/signup?step=role", { replace: true, state: { email } });
        } else {
          navigate("/login", { replace: true });
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    }
  };

  const handleEditEmail = (e) => {
    e.preventDefault();
    navigate("/signup", { state: { restoreDraft: true } });
  };

  const handleBackToAuth = (e) => {
    e.preventDefault();

    // Return to a clean login page. The signup flow leaves a pre-verification
    // token in storage; without clearing it the post-auth redirect would send
    // the user to role selection (or bounce them straight back here), so we
    // abandon the partial session via logout() (which also navigates to /login).
    logout();
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    captcha.clearCaptchaError();

    if (!captcha.requireCaptchaToken()) {
      return;
    }

    setResendLoading(true);

    try {
      await resendCode(captcha.withCaptchaPayload({ email }));
      setSuccess("Verification code sent successfully!");
      setResendCooldown(120);
      setPendingAutoResend(false);
    } catch (err) {
      if (captcha.handleCaptchaApiError(err)) {
        return;
      }

      const errorMessage = toAuthErrorMessage(err);

      if (
        errorMessage.includes("Verification code is still valid") ||
        errorMessage.includes("still valid")
      ) {
        if (resendCooldown === 0) {
          setResendCooldown(120);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-[#faf9f6]">
      {/* Logo */}
      <div className="text-center mb-8">
        <img
          src={leads_alpha_logo}
          alt="leads_alpha_logo"
          className="w-32 mx-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Card */}
      <div className="w-[90%] max-w-[90vw] md:w-5xl bg-white/70 backdrop-blur rounded-2xl  p-8 shadow">
        <div className="flex w-full  md:w-136 md:mx-auto flex-col gap-6">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-normal text-gray-700 mb-3">
              Enter{" "}
              <span className="text-[#161C2B] font-medium text-3xl">OTP</span>
            </h1>
            <p className="text-sm text-gray-400">
              Please enter 6 digit OTP sent to your Email Address:{" "}
              <a
                href="/signup"
                onClick={handleEditEmail}
                className="hover:text-[#0c7bb3] hover:underline inline-flex items-center gap-1"
              >
                {email}
                <EditIcon />
              </a>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* OTP Input Boxes */}
          <form
            onSubmit={handleVerify}
            className="flex flex-col sm:gap-6 gap-4"
          >
            <div className="flex justify-center sm:gap-5 gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="sm:w-12 sm:h-12 w-10 h-10 md:w-18 md:h-18  bg-gray-50/10 text-center sm:text-xl sm:font-semibold sm:border-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <TurnstileField captcha={captcha} className="px-2" />

            <div className="flex justify-between px-2 items-center text-sm">
              <span
                className={`font-medium ${
                  resendCooldown > 0 ? "text-green-600" : "text-gray-400"
                }`}
              >
                {resendCooldown > 0
                  ? `${resendCooldown.toString().padStart(2, "0")} s`
                  : "00 s"}
              </span>
              {resendCooldown > 0 ? (
                <span className="text-gray-400">Resend OTP</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading || !captcha.isCaptchaReady}
                  className="text-[#0c7bb3]  font-medium hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full mx-auto text-white rounded-full py-3.5 text-base font-medium main-btn transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          {/* Go Back Link */}
          <div className="sm:mt-2 ">
            <a
              href="/login"
              onClick={handleBackToAuth}
              className="inline-flex items-center gap-2 text-md font-medium text-gray-600 hover:text-gray-800"
            >
              <div className=" rounded-full  w-8 h-8 border border-black flex items-center justify-center">
                <LeftArrowIcon />
              </div>
              Go back to sign-in
            </a>
          </div>

          {/* Note */}
          <div className="sm:mt-2 sm:pt-2 ">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-[#0c7bb3]">Note:</span> If you
              didn't receive the OTP, please check your entered Email id if
              correct then wait and request another OTP as per above mentioned
              timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
