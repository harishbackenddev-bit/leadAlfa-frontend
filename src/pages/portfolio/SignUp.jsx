import { useEffect, useState } from "react";
import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import {
  handleRedirectCallback,
  loginWithSocial,
  logout,
} from "../../services/auth0";
import { Eye, EyeOff } from "lucide-react";
import {
  A_icon,
  F_icon,
  G_icon,
  I_icon,
} from "../../assets/SVGs/portfolio/main/auth_icons";
import Stepper from "../../components/portfolio/signUp/Stepper";
import RoleSelectionStep from "../../components/portfolio/signUp/RoleSelectionStep";
import BasicInformationStep from "../../components/portfolio/signUp/BasicInformationStep";
import CreatorCategoriesStep from "../../components/portfolio/signUp/CreatorCategoriesStep";
import BrandPaymentStep from "../../components/portfolio/signUp/BrandPaymentStep";
import AddSkillStep from "../../components/portfolio/signUp/AddSkillStep";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    basicInfo: {},
    categories: [],
  });

  const handleNext = (roleFromButton) => {
    if (typeof roleFromButton === "string" && roleFromButton) {
      setFormData((prev) => ({ ...prev, role: roleFromButton }));
    }
    setCurrentStep((step) => step + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFormDataChange = (newData) => {
    setFormData(newData);
  };

  const renderAccountCreation = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#5B576F]">
            Create{" "}
            <span className="font-bold text-[#161C2B]"> Your Profile</span>
          </h2>
          <p className="text-sm text-gray-500 mt-3 px-4 md:px-10 leading-relaxed">
            Sign up by submitting your details. You can also use your social
            accounts for a quicker setup.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => loginWithSocial("google-oauth2")}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <G_icon className="w-5 h-5" /> Continue With Google
          </button>
          {/* social login button */}
          {/* <button
            onClick={() => loginWithSocial("facebook")}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <F_icon className="w-5 h-5" /> Continue With Facebook
          </button>
          <button
            onClick={() => loginWithSocial("apple")}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <A_icon className="w-5 h-5" /> Continue With Apple
          </button>
          <button
            onClick={() => loginWithSocial("instagram")}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <I_icon className="w-5 h-5" /> Continue With Instagram
          </button> */}
        </div>

        <div className="relative flex items-center my-2">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm font-medium bg-white/70">
            Or continue with
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
                required
                className="p-3 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    lastName: e.target.value,
                  })
                }
                required
                className="p-3 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={(e) =>
                  handleFormDataChange({ ...formData, email: e.target.value })
                }
                required
                className="p-3 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phone Number
              </label>
              <input
                type="number"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    phoneNumber: e.target.value,
                  })
                }
                required
                className="p-3 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleFormDataChange({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  required
                  className="p-3 pr-10 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleFormDataChange({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="p-3 pr-10 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="main-btn text-white rounded-full px-8 py-3 text-sm font-medium transition shadow-md"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#0c7bb3] font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderAccountCreation();
      case 2:
        return (
          <RoleSelectionStep
            selectedRole={formData.role}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <BasicInformationStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        if (formData.role === "creator") {
          return (
            <CreatorCategoriesStep
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else if (formData.role === "brand") {
          return (
            <BrandPaymentStep
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
        return null;
      case 5:
        if (formData.role === "creator") {
          return (
            <AddSkillStep
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      handleRedirectCallback(code).then((data) => {
        console.log("Auth Token:", data);
        setUser(data);
        window.history.replaceState({}, "", "/auth");
      });
    }
  }, []);

  if (user) {
    return (
      <div className="p-6">
        <p>
          Logged in! <span className="text-sm">This is for testing!</span>
        </p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-[#faf9f6]">
      <div className="text-center mb-8">
        <img
          src={leads_alpha_logo}
          alt="leads_alpha_logo"
          className="w-32 mx-auto cursor-pointer"
          onClick={() => (window.location.href = "/")}
        />
      </div>
      <div className="w-[90%] md:w-[60vw] bg-white/70 mb-8 backdrop-blur rounded-2xl p-6 flex flex-col gap-8 shadow">
        <div className="mb-4">
          <Stepper currentStep={currentStep} role={formData.role} />
        </div>
      </div>
      <div className="w-[90%] md:w-[60vw] bg-white/70 backdrop-blur rounded-2xl p-8 flex flex-col gap-8 shadow">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
