import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import Stepper from "../../components/portfolio/signUp/Stepper";
import RoleSelectionStep from "../../components/portfolio/signUp/RoleSelectionStep";
// import BasicInformationStep from "../../components/portfolio/signUp/BasicInformationStep";
import BasicInformationStep from "../../components/portfolio/signUp/BasicInformationStepNew";
import CreatorCategoriesStep from "../../components/portfolio/signUp/CreatorCategoriesStep";
import BrandPaymentStep from "../../components/portfolio/signUp/BrandPaymentStep";
import AddSkillStep from "../../components/portfolio/signUp/AddSkillStep";
import CreatorApplicationSubmittedStep from "../../components/portfolio/signUp/CreatorApplicationSubmittedStep";
import AccountCreationStep from "./components/AccountCreationStep";
import { useSignupFlow } from "./hooks/useSignupFlow";

export default function SignUp() {
  const {
    currentStep,
    formData,
    errors,
    loading,
    onboardingBusy,
    user,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleSocialLogin,
    handleNext,
    handleBack,
    handleFormDataChange,
    handleSkillNext,
    handleCreatorConfirmationContinue,
    handleSignInFromRoleStep,
    handleLogoFromRoleStep,
  } = useSignupFlow();

  const handleLogoClick = () => {
    if (currentStep === 2) {
      handleLogoFromRoleStep();
      return;
    }
    window.location.href = "/";
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountCreationStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            onSocialLogin={handleSocialLogin}
            loading={loading}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );
      case 2:
        return (
          <RoleSelectionStep
            selectedRole={formData.role}
            onNext={handleNext}
            loading={onboardingBusy}
            error={errors.submit}
          />
        );
      case 3:
        return (
          <BasicInformationStep
            role={user?.role || formData.role}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            onBack={handleBack}
            onSocialLogin={handleSocialLogin}
            isSubmitting={onboardingBusy}
          />
        );
      case 4:
        if (user?.role === "creator" || formData.role === "creator") {
          return (
            <CreatorCategoriesStep
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={handleNext}
              onBack={handleBack}
              submitting={onboardingBusy}
            />
          );
        } else if (user?.role === "brand" || formData.role === "brand") {
          return (
            <BrandPaymentStep
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={handleNext}
              onBack={handleBack}
              submitting={onboardingBusy}
            />
          );
        }
        return null;
      case 5:
        if (user?.role === "creator" || formData.role === "creator") {
          return (
            <AddSkillStep
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={handleSkillNext}
              onBack={handleBack}
              submitting={onboardingBusy}
            />
          );
        }
        return null;
      case 6:
        if (user?.role === "creator" || formData.role === "creator") {
          return (
            <CreatorApplicationSubmittedStep
              onContinue={handleCreatorConfirmationContinue}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  const isConfirmationStep = currentStep === 6;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-[#faf9f6]">
      <div className="text-center mb-8">
        <img
          src={leads_alpha_logo}
          alt="leads_alpha_logo"
          className="w-32 mx-auto cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>

      {currentStep > 2 &&
        !isConfirmationStep &&
        (user?.role || formData.role) && (
        <div className="w-[90%] md:w-[60vw] 2xl:w-[65vw] bg-white/70 mb-8 backdrop-blur rounded-2xl p-6 flex flex-col gap-8 shadow-md">
          <div className="sm:mb-4">
            <Stepper
              currentStep={currentStep}
              role={user?.role || formData.role}
            />
          </div>
        </div>
      )}

      {currentStep === 2 ? (
        <div className="w-full max-w-4xl px-4 flex flex-col items-center gap-10 pb-8">
          {renderCurrentStep()}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSignInFromRoleStep}
              className="font-medium text-[#0353a4] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      ) : (
        <div
          className={
            isConfirmationStep
              ? "w-[90%] max-w-lg bg-white rounded-2xl p-8 shadow-lg"
              : "w-[90%] md:w-[60vw] 2xl:w-[65vw] bg-white/70 backdrop-blur rounded-2xl sm:p-8 p-4 flex flex-col gap-8 shadow"
          }
        >
          {renderCurrentStep()}
        </div>
      )}
    </div>
  );
}
