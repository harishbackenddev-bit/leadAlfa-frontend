import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { selectAuth, updateUser, logout as logoutUser } from "../../../store/slices/authSlice";
import { useAuth, toAuthErrorMessage } from "./useAuthHook";
import { isTurnstileError } from "../../../utils/turnstileErrors";
import {
  createCreatorProfile,
  createBrandProfile,
} from "../../../services/api/apiservices";
import { buildCreatorProfileFormData as buildCreatorProfileFormDataPayload } from "../../../utils/creatorProfileFormData";
import {
  clearOnboardingProfileCache,
  fetchOnboardingProfileForRole,
  roleRequiresOnboardingProfile,
  shouldLeaveSignupForUser,
  userHasCompletedOnboardingProfile,
} from "../../../utils/onboardingProfile";
import { getRoleHomeRoute } from "../../../utils/roleRoutes";

const SIGNUP_DRAFT_STORAGE_KEY = "signup_step1_draft";
const CREATOR_CONFIRMATION_PENDING_KEY = "creator_signup_show_confirmation";
export const CREATOR_SIGNUP_CONFIRMATION_SEEN_KEY =
  "creator_signup_confirmation_seen";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hasPendingCreatorConfirmation = (userRole) => {
  if (!userRole || userRole !== "creator") return false;
  return sessionStorage.getItem(CREATOR_CONFIRMATION_PENDING_KEY) === "1";
};

const getEmptyFormData = (user = {}, email = "") => ({
  firstName: "",
  lastName: "",
  email,
  phone: "",
  password: "",
  confirmPassword: "",
  role: "",
  basicInfo: {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
  },
  categories: [],
});

export const useSignupFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithRedirect } = useAuth0();
  const { signup, updateRole, loading } = useAuth();
  const { user } = useAppSelector(selectAuth);
  const onboardingUser = user ?? readStoredUser();
  const dispatch = useAppDispatch();
  const shouldResumeOnboarding = Boolean(
    location.state?.resumeOnboarding || location.state?.restoreDraft
  );

  const [currentStep, setCurrentStep] = useState(() => {
    if (hasPendingCreatorConfirmation(onboardingUser?.role)) return 6;
    if (onboardingUser?.role) return 3;
    try {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("step") === "role" &&
        localStorage.getItem("access_token") &&
        onboardingUser?.isEmailVerified !== false
      ) {
        return 2;
      }
    } catch {
      // ignore
    }
    return 1;
  });
  const [isCreatingProfile, setIsCreatingProfile] = useState(() =>
    hasPendingCreatorConfirmation(onboardingUser?.role)
  );
  const [flowBusy, setFlowBusy] = useState(false);
  const [skillSubmitLoading, setSkillSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => {
    const defaultData = getEmptyFormData(user, location.state?.email || "");

    if (!location.state?.restoreDraft) {
      return defaultData;
    }

    try {
      const savedDraft = JSON.parse(
        sessionStorage.getItem(SIGNUP_DRAFT_STORAGE_KEY) || "null"
      );

      if (!savedDraft || typeof savedDraft !== "object") {
        return defaultData;
      }

      return {
        ...defaultData,
        ...savedDraft,
        basicInfo: {
          ...defaultData.basicInfo,
          ...(savedDraft.basicInfo || {}),
        },
      };
    } catch {
      return defaultData;
    }
  });

  const buildCreatorProfileFormData = () =>
    buildCreatorProfileFormDataPayload({ formData, user });

  const profileCheckKeyRef = useRef("");
  const roleStepLockedRef = useRef(false);
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const goToProfileStep = (roleValue) => {
    roleStepLockedRef.current = true;
    currentStepRef.current = 3;
    setCurrentStep(3);
    if (roleValue) {
      setFormData((prev) => ({
        ...prev,
        role: roleValue || prev.role,
      }));
    }
  };

  // Prevent brief flash of payment/skills steps if step advances before profile gate settles.
  useEffect(() => {
    if (roleStepLockedRef.current && currentStep > 3) {
      setCurrentStep(3);
    }
  }, [currentStep]);

  // Resume onboarding: token + role but no profile → step 3 (basic info after role).
  useEffect(() => {
    if (hasPendingCreatorConfirmation(onboardingUser?.role)) {
      return undefined;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      if (!roleStepLockedRef.current) {
        setCurrentStep(1);
      }
      return undefined;
    }

    if (!onboardingUser?.role) {
      if (!roleStepLockedRef.current) {
        // Known-unverified users stay on step 1 so "edit email / back" works;
        // verified-but-roleless users land on role selection.
        setCurrentStep(onboardingUser?.isEmailVerified === false ? 1 : 2);
      }
      return undefined;
    }

    if (!roleRequiresOnboardingProfile(onboardingUser.role)) {
      return undefined;
    }

    if (userHasCompletedOnboardingProfile(onboardingUser)) {
      return undefined;
    }

    const checkKey = `${onboardingUser.email || ""}:${onboardingUser.role}`;
    const shouldFetchProfile = profileCheckKeyRef.current !== checkKey;

    if (shouldFetchProfile) {
      profileCheckKeyRef.current = checkKey;
    }

    if (
      shouldFetchProfile &&
      (shouldResumeOnboarding || currentStepRef.current < 3)
    ) {
      goToProfileStep(onboardingUser.role);
    }

    if (!shouldFetchProfile) {
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const profile = await fetchOnboardingProfileForRole(onboardingUser.role, {
        cacheKey: checkKey,
      });
      if (cancelled) return;

      dispatch(updateUser({ profile: profile ?? null }));

      if (!profile && currentStepRef.current < 3) {
        goToProfileStep(onboardingUser.role);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    onboardingUser?.email,
    onboardingUser?.role,
    shouldResumeOnboarding,
    dispatch,
  ]);

  // If profile is complete, leave signup wizard (e.g. user opened /signup while logged in).
  useEffect(() => {
    if (hasPendingCreatorConfirmation()) {
      return;
    }
    if (
      user &&
      shouldLeaveSignupForUser(user) &&
      !isCreatingProfile &&
      currentStep !== 6
    ) {
      navigate(getRoleHomeRoute(user.role), { replace: true });
    }
  }, [user, navigate, isCreatingProfile, currentStep]);

  const handleSocialLogin = (connection) => {
    loginWithRedirect({
      authorizationParams: {
        connection: connection,
        redirect_uri: `${window.location.origin}/auth/callback`,
        screen_hint: "signup",
        prompt: "login",
      },
    });
  };

  const handleCreateBrandProfile = async (formSnapshot = formData) => {
    try {
      const fd = new FormData();
      const basic = formSnapshot.basicInfo || {};

      const normalizeBrandWebsite = (value) => {
        const trimmed = typeof value === "string" ? value.trim() : "";
        if (!trimmed) return "";
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      };

      fd.append("companyName", basic.companyName || "");
      const website = normalizeBrandWebsite(basic.companyUrl || "");
      if (website) {
        fd.append("website", website);
      }
      fd.append("companyEmail", basic.email || "");
      if (basic.phoneNumber && String(basic.phoneNumber).trim()) {
        fd.append("phoneNumber", String(basic.phoneNumber).trim());
      }
      fd.append("addressLine1", basic.addressLine1 || "");
      fd.append("addressLine2", basic.addressLine2 || "");
      fd.append("country", basic.country || "");
      fd.append("city", basic.city || "");
      fd.append("bio", basic.bio || "");
      fd.append("businessType", basic.businessType || "");
      fd.append("jobRole", basic.jobRole || "");
      fd.append(
        "companyRegistrationNumber",
        basic.companyRegistrationNumber || ""
      );
      fd.append(
        "brandPrimaryIndustry",
        JSON.stringify(formSnapshot.categories || [])
      );

      if (basic.logo) fd.append("logo", basic.logo);

      const profile = await createBrandProfile(fd);
      if (profile?.error) {
        if (Array.isArray(profile.errors)) {
          const fieldErrors = profile.errors.reduce((accumulator, item) => {
            if (item?.field) {
              accumulator[item.field] = item.message || "Invalid value";
            }
            return accumulator;
          }, {});
          setErrors({
            ...fieldErrors,
            submit: profile.error || "Failed to create brand profile",
          });
        } else {
          setErrors({ submit: profile.error });
        }
        return false;
      }

      const created =
        profile?.profile ?? profile?.data?.profile ?? profile ?? null;
      const media = profile?.media ?? profile?.data?.media;
      const mergedProfile =
        created && media
          ? {
              ...created,
              media: {
                ...(created.media || {}),
                ...media,
              },
            }
          : created;
      clearOnboardingProfileCache();
      dispatch(updateUser({ ...user, profile: mergedProfile }));
      setIsCreatingProfile(true);
      return true;
    } catch (error) {
      if (Array.isArray(error?.errors)) {
        const fieldErrors = error.errors.reduce((accumulator, item) => {
          if (item?.field) {
            accumulator[item.field] = item.message || "Invalid value";
          }
          return accumulator;
        }, {});
        setErrors({
          ...fieldErrors,
          submit: error.message || error.error || "Failed to create brand profile",
        });
        return false;
      }
      setErrors({ submit: error.message || "Failed to create brand profile" });
      return false;
    }
  };

  const handleNext = async (stepPayload) => {
    if (flowBusy || skillSubmitLoading) {
      return;
    }

    if (currentStep === 1) {
      // Validation handled in AccountCreationStep component
      try {
        sessionStorage.setItem(
          SIGNUP_DRAFT_STORAGE_KEY,
          JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          })
        );

        await signup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          ...(stepPayload?.captchaToken ? { captchaToken: stepPayload.captchaToken } : {}),
        });
        navigate("/verify-email", {
          state: { email: formData.email, fromSignup: true },
        });
      } catch (error) {
        setErrors({
          submit: toAuthErrorMessage(error),
          turnstileFailed: isTurnstileError(error),
        });
      }
    } else if (currentStep === 2) {
      if (roleStepLockedRef.current) {
        return;
      }

      const role =
        typeof stepPayload === "string" && stepPayload
          ? stepPayload
          : formData.role;
      if (!role) {
        setErrors({ submit: "Please select a role" });
        return;
      }

      try {
        setFlowBusy(true);
        goToProfileStep(role);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.submit;
          return next;
        });
        await updateRole(role);
      } catch (error) {
        roleStepLockedRef.current = false;
        setCurrentStep(2);
        setErrors({ submit: toAuthErrorMessage(error) });
      } finally {
        setFlowBusy(false);
      }
    } else if (currentStep === 3) {
      const isBrandFlow =
        (user && user.role === "brand") || formData.role === "brand";

      const brandFormSnapshot =
        stepPayload != null &&
        typeof stepPayload === "object" &&
        !Array.isArray(stepPayload) &&
        stepPayload.basicInfo != null
          ? stepPayload
          : null;

      if (brandFormSnapshot) {
        setFormData(brandFormSnapshot);
      }

      if (isBrandFlow) {
        setFlowBusy(true);
        try {
          const snapshotForApi = brandFormSnapshot || formData;
          const success = await handleCreateBrandProfile(snapshotForApi);
          if (success) {
            roleStepLockedRef.current = false;
            setCurrentStep((step) => step + 1);
          }
        } finally {
          setFlowBusy(false);
        }
      } else {
        roleStepLockedRef.current = false;
        setCurrentStep((step) => step + 1);
      }
    } else if (currentStep === 4) {
      if ((user && user.role === "brand") || formData.role === "brand") {
        setIsCreatingProfile(false);
        navigate(getRoleHomeRoute(user?.role || formData.role), {
          replace: true,
        });
      } else {
        setCurrentStep((step) => step + 1);
      }
    } else {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep <= 3 && roleStepLockedRef.current) {
      roleStepLockedRef.current = false;
      profileCheckKeyRef.current = "";
    }
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const handleFormDataChange = (newData) => {
    setFormData(newData);
    const changedFields = Object.keys(newData).filter(
      (key) => newData[key] !== formData[key]
    );
    const newErrors = { ...errors };
    changedFields.forEach((field) => delete newErrors[field]);
    setErrors(newErrors);
  };

  const handleSkillNext = async () => {
    try {
      setSkillSubmitLoading(true);
      const profile = await createCreatorProfile(buildCreatorProfileFormData());
      if (profile?.error) {
        if (Array.isArray(profile.errors)) {
          const fieldErrors = profile.errors.reduce((accumulator, item) => {
            if (item?.field) {
              accumulator[item.field] = item.message || "Invalid value";
            }
            return accumulator;
          }, {});

          setErrors({
            ...fieldErrors,
            submit: profile.error || "Failed to create profile",
          });
        } else {
          setErrors({ submit: profile.error });
        }
        return;
      }
      const created =
        profile?.profile ?? profile?.data?.profile ?? profile ?? null;
      clearOnboardingProfileCache();
      dispatch(updateUser({ profile: created }));
      sessionStorage.setItem(CREATOR_CONFIRMATION_PENDING_KEY, "1");
      setIsCreatingProfile(true);
      setCurrentStep(6);
      sessionStorage.removeItem(SIGNUP_DRAFT_STORAGE_KEY);
    } catch (error) {
      if (Array.isArray(error?.errors)) {
        const fieldErrors = error.errors.reduce((accumulator, item) => {
          if (item?.field) {
            accumulator[item.field] = item.message || "Invalid value";
          }
          return accumulator;
        }, {});

        setErrors({
          ...fieldErrors,
          submit: error.message || error.error || "Failed to create profile",
        });
        return;
      }

      setErrors({ submit: error.message || error.error || "Failed to create profile" });
    } finally {
      setSkillSubmitLoading(false);
    }
  };

  const handleCreatorConfirmationContinue = () => {
    sessionStorage.removeItem(CREATOR_CONFIRMATION_PENDING_KEY);
    localStorage.setItem(CREATOR_SIGNUP_CONFIRMATION_SEEN_KEY, "1");
    localStorage.removeItem("id_token");
    dispatch(logoutUser());
    setIsCreatingProfile(false);
    navigate("/login", { replace: true });
  };

  /** Role step — clear partial signup session without affecting app-wide logout. */
  const clearPartialSignupSession = () => {
    sessionStorage.removeItem(SIGNUP_DRAFT_STORAGE_KEY);
    sessionStorage.removeItem(CREATOR_CONFIRMATION_PENDING_KEY);
    localStorage.removeItem("id_token");
    clearOnboardingProfileCache();
    dispatch(logoutUser());
  };

  const handleSignInFromRoleStep = () => {
    clearPartialSignupSession();
    navigate("/login", { replace: true });
  };

  const handleLogoFromRoleStep = () => {
    clearPartialSignupSession();
    navigate("/", { replace: true });
  };

  const onboardingBusy = loading || flowBusy || skillSubmitLoading;

  return {
    currentStep,
    formData,
    errors,
    loading,
    flowBusy,
    skillSubmitLoading,
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
    setErrors,
  };
};
