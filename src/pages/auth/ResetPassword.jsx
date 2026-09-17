import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import { LeftArrowIcon } from "../../assets/SVGs/portfolio/main/signUp_icons";
import { useAuth, toAuthErrorMessage } from "./hooks/useAuthHook";

const INVALID_TOKEN_MESSAGE =
  "This reset link is invalid or has expired. Reset links expire after 15 minutes.";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading } = useAuth();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [tokenError, setTokenError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token?.trim()) {
      setTokenError(true);
    }
  }, [token]);

  useEffect(() => {
    if (!success) return undefined;

    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");
    setBannerError("");

    if (newPassword.length < 8) {
      setFieldError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
    } catch (err) {
      if (err?.status === 429) {
        setBannerError(err.error || toAuthErrorMessage(err));
        return;
      }
      if (
        err?.status === 400 &&
        err.error === "Invalid or expired reset token"
      ) {
        setTokenError(true);
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

  if (tokenError) {
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
          <div className="max-w-md mx-auto flex flex-col gap-6 text-center">
            <h1 className="text-2xl font-semibold text-[#161C2B]">
              Reset link unavailable
            </h1>
            <p className="text-sm text-red-600">
              {!token?.trim()
                ? "Invalid or missing reset link. Please request a new one."
                : INVALID_TOKEN_MESSAGE}
            </p>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="main-btn text-white rounded-full px-8 py-3 text-sm font-medium transition shadow-md"
            >
              Request a new link
            </button>
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
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
              Reset password
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Choose a new password for your account.
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

          {success ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Your password has been reset. You can now log in with your new
                password.
              </div>
              <button
                type="button"
                onClick={() => navigate("/login", { replace: true })}
                className="main-btn text-white rounded-full px-8 py-3 text-sm font-medium transition shadow-md"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <label className="text-sm text-gray-900" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`p-3 pr-10 border rounded-md text-sm w-full ${
                    fieldError ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              <label className="text-sm text-gray-900" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`p-3 pr-10 border rounded-md text-sm w-full ${
                    fieldError ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              {fieldError && (
                <p className="text-sm text-red-600">{fieldError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 main-btn text-white rounded-full px-8 py-3 text-sm font-medium transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          )}

          {!success && (
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
          )}
        </div>
      </div>
    </div>
  );
}
