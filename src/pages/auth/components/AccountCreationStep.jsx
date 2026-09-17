import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { G_icon } from "../../../assets/SVGs/portfolio/main/auth_icons";
import TurnstileField from "../../../components/common/TurnstileField";
import { InternationalPhoneField } from "../../../components/ui/phone-input";
import { useTurnstileCaptcha } from "../../../hooks/useTurnstileCaptcha";
import { isE164Phone } from "../../../utils/phone";

export default function AccountCreationStep({
  formData,
  onFormDataChange,
  onNext,
  onSocialLogin,
  loading,
  errors: externalErrors,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}) {
  const [errors, setErrors] = useState({});
  const captcha = useTurnstileCaptcha();
  const allErrors = { ...errors, ...externalErrors };

  useEffect(() => {
    if (allErrors.turnstileFailed) {
      captcha.resetTurnstile();
    }
  }, [allErrors.turnstileFailed, captcha.resetTurnstile]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push("at least 6 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[!@#$%^&*]/.test(password))
      errors.push("one special character (!@#$%^&*)");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim() || !isE164Phone(formData.phone)) {
      const digits = String(formData.phone || "").replace(/\D/g, "");
      newErrors.phone =
        digits.length < 5
          ? "Phone number is required"
          : "Enter a valid South African mobile number";
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = `Password must contain ${passwordErrors.join(", ")}`;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (!captcha.requireCaptchaToken()) {
      return;
    }
    onNext({ captchaToken: captcha.captchaToken });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#5B576F]">
          Create Your <span className="text-[#041C4A]">Profile</span>
        </h2>
        <p className="text-sm text-gray-500 mt-3 px-4 md:px-10 leading-relaxed">
          Sign up by submitting your details. You can also use your social
          accounts for a quicker setup.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => onSocialLogin("google-oauth2")}
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
        >
          <G_icon className="w-5 h-5" /> Continue With Google
        </button>
      </div>

      <div className="relative flex items-center my-2">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm font-medium bg-white/70">
          Or continue with
        </span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      {allErrors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {allErrors.submit}
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              First Name{" "}
              <span aria-hidden className="text-red-500 ml-0.5">
                *
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  firstName: e.target.value,
                })
              }
              className={`p-3 border rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 transition ${
                allErrors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {allErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">{allErrors.firstName}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Last Name{" "}
              <span aria-hidden className="text-red-500 ml-0.5">
                *
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  lastName: e.target.value,
                })
              }
              className={`p-3 border rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 transition ${
                allErrors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {allErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">{allErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email Address{" "}
              <span aria-hidden className="text-red-500 ml-0.5">
                *
              </span>
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={(e) =>
                onFormDataChange({ ...formData, email: e.target.value })
              }
              className={`p-3 border rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 transition ${
                allErrors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {allErrors.email && (
              <p className="text-red-500 text-xs mt-1">{allErrors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Phone Number{" "}
              <span aria-hidden className="text-red-500 ml-0.5">
                *
              </span>
            </label>
            <InternationalPhoneField
              autoComplete="tel"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={(phone) =>
                onFormDataChange({
                  ...formData,
                  phone,
                })
              }
              error={Boolean(allErrors.phone)}
            />
            {allErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{allErrors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password{" "}
              <span aria-hidden className="text-red-500 ml-0.5">
                *
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className={`p-3 border rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 transition pr-10 ${
                  allErrors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
            {allErrors.password && (
              <p className="text-red-500 text-xs mt-1">{allErrors.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirm Password{" "}
              <span aria-hidden className="text-red-500 ml-0.5">
                *
              </span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className={`p-3 border rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 transition pr-10 ${
                  allErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
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
            {allErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {allErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <TurnstileField captcha={captcha} />

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading || !captcha.isCaptchaReady}
            className="main-btn text-white rounded-full px-8 py-3 text-sm font-medium transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-[#0c7bb3] font-medium hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
