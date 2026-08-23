import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import { useAuth } from "./hooks/useAuthHook";
import {
  EditIcon,
  LeftArrowIcon,
} from "../../assets/SVGs/portfolio/main/signUp_icons";

const SIGNUP_DRAFT_STORAGE_KEY = "signup_step1_draft";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendCode, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [fromLogin, setFromLogin] = useState(false);

  // Refs for OTP inputs
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from navigation state or query params
    const emailFromState = location.state?.email;
    const isFromLogin = location.state?.fromLogin || false;
    const params = new URLSearchParams(location.search);
    const emailFromParams = params.get("email");

    const userEmail = emailFromState || emailFromParams;

    if (userEmail) {
      setEmail(userEmail);
      setFromLogin(isFromLogin);

      // If coming from login, automatically resend verification code
      if (isFromLogin) {
        resendCodeAutomatically(userEmail);
      } else {
        // If coming from signup (first time), start timer immediately
        setResendCooldown(120);
        // setSuccess("Verification code sent to your email!");
      }
    } else {
      // If no email provided, redirect to signup
      navigate("/signup");
    }
  }, [location, navigate]);

  // Function to automatically resend code when coming from login
  const resendCodeAutomatically = async (userEmail) => {
    try {
      await resendCode({ email: userEmail });
      // setSuccess("Verification code sent to your email!");
      setResendCooldown(120);
    } catch (err) {
      // Silent fail or show error
      setError(err.message || "Failed to send verification code.");
    }
  };

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

      // Redirect based on where user came from
      setTimeout(() => {
        if (fromLogin) {
          // If came from login, redirect back to login
          navigate("/login");
        } else {
          // If came from signup, go to role selection
          navigate("/signup?step=role", { state: { email } });
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

    if (fromLogin) {
      navigate("/login");
      return;
    }

    navigate("/signup", { state: { restoreDraft: true } });
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      await resendCode({ email });
      setSuccess("Verification code sent successfully!");
      setResendCooldown(120); // 60 seconds cooldown
    } catch (err) {
      const errorMessage =
        err.error || err.message || "Failed to resend code. Please try again.";

      // Check if error is "Verification code is still valid"
      if (
        errorMessage.includes("Verification code is still valid") ||
        errorMessage.includes("still valid")
      ) {
        // Start timer if not already running
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
                  disabled={resendLoading}
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
              href={fromLogin ? "/login" : "/signup"}
              onClick={handleBackToAuth}
              className="inline-flex items-center gap-2 text-md font-medium text-gray-600 hover:text-gray-800"
            >
              <div className=" rounded-full  w-8 h-8 border border-black flex items-center justify-center">
                <LeftArrowIcon />
              </div>
              Go back to {fromLogin ? "sign-in" : "sign-up"}
            </a>
          </div>

          {/* Note */}
          <div className="sm:mt-2 sm:pt-2 ">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-[#0c7bb3]">Note:</span> If you
              didn't receive the OTP, please check your entered mobile number if
              correct then wait and request another OTP as per above mentioned
              timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
