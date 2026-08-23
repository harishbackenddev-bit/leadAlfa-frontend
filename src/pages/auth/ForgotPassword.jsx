import { useState } from "react";
import { useNavigate } from "react-router-dom";
import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import { LeftArrowIcon } from "../../assets/SVGs/portfolio/main/signUp_icons";
import { useAuth, toAuthErrorMessage } from "./hooks/useAuthHook";

const SUCCESS_MESSAGE =
  "If an account with that email exists, you'll receive a password reset link shortly. Please check your inbox and spam folder.";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");
    setBannerError("");
    setSuccess(false);

    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      if (err?.status === 429) {
        setBannerError(err.error || toAuthErrorMessage(err));
        return;
      }
      if (err?.status === 400 && Array.isArray(err.errors) && err.errors.length) {
        setFieldError(err.errors[0].message || toAuthErrorMessage(err));
        return;
      }
      if (err?.status >= 500 || !err?.status) {
        setBannerError("Something went wrong. Please try again later.");
        return;
      }
      setBannerError(toAuthErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 gap-4 bg-[#faf9f6]">
      <div className="text-center">
        <img
          src={leads_alpha_logo}
          alt="leads_alpha_logo"
          className="w-24 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="w-[90%] md:w-[60vw] 2xl:w-[65vw] bg-white/70 backdrop-blur rounded-2xl p-8 shadow">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#161C2B]">
              Forgot password
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Enter your registered email and we&apos;ll send you a reset link.
            </p>
          </div>

          {bannerError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex justify-between gap-3">
              <span>{bannerError}</span>
              <button
                type="button"
                onClick={() => setBannerError("")}
                className="text-red-400 hover:text-red-600 shrink-0"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {SUCCESS_MESSAGE}
            </div>
          )}

          {!success && (
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <label className="text-sm text-gray-900" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`p-3 border rounded-md text-sm ${
                  fieldError ? "border-red-400" : "border-gray-300"
                }`}
              />
              {fieldError && (
                <p className="text-sm text-red-600">{fieldError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 main-btn text-white rounded-full px-8 py-3 text-sm font-medium transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            <div className="rounded-full w-8 h-8 border border-black flex items-center justify-center">
              <LeftArrowIcon />
            </div>
            Back to sign-in
          </a>
        </div>
      </div>
    </div>
  );
}
