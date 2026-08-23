import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import { Eye, EyeOff } from "lucide-react";
import {
  A_icon,
  F_icon,
  G_icon,
  I_icon,
} from "../../assets/SVGs/portfolio/main/auth_icons";
import { useAuth } from "./hooks/useAuthHook";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectAuth, updateUser } from "../../store/slices/authSlice";
import {
  resolvePostAuthDestination,
  roleRequiresOnboardingProfile,
} from "../../utils/onboardingProfile";
import { getRoleHomeRoute, normalizeRole } from "../../utils/roleRoutes";

// When ProtectedRoute redirects an unauthenticated user, it stashes the
// originally requested URL in location.state.from. After a successful login
// we want to return them there, but only when:
//   1. The path belongs to this user's role (e.g. /brand/... for a brand)
//   2. Onboarding is complete (resolved path == role home)
// Otherwise we fall through to the normal post-auth destination.
const getSafeReturnPath = (fromLocation, role) => {
  const pathname = fromLocation?.pathname;
  if (!pathname || typeof pathname !== "string") return null;
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) return null;
  const rolePrefix = `/${normalizedRole}`;
  if (pathname !== rolePrefix && !pathname.startsWith(`${rolePrefix}/`)) {
    return null;
  }
  return `${pathname}${fromLocation.search || ""}${fromLocation.hash || ""}`;
};

export default function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loginWithRedirect } = useAuth0();
  const { login, loading } = useAuth();
  const { isAuthenticated, user } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!isAuthenticated || !user) return undefined;

    let cancelled = false;
    (async () => {
      try {
        const { path, state, profile } = await resolvePostAuthDestination(user);
        if (cancelled) return;
        dispatch(updateUser({ profile }));

        const roleHome = getRoleHomeRoute(user.role);
        const returnPath =
          path === roleHome
            ? getSafeReturnPath(location.state?.from, user.role)
            : null;

        navigate(returnPath || path, {
          replace: true,
          ...(returnPath ? {} : state ? { state } : {}),
        });
      } catch {
        if (cancelled) return;
        if (user?.role && !roleRequiresOnboardingProfile(user.role)) {
          navigate(getRoleHomeRoute(user.role), { replace: true });
          return;
        }
        dispatch(updateUser({ profile: null }));
        navigate("/signup", {
          replace: true,
          state: { resumeOnboarding: true },
        });
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- gate once per auth session keys
  }, [isAuthenticated, user?.email, user?.role, dispatch, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSocialLogin = (connection) => {
    loginWithRedirect({
      authorizationParams: {
        connection: connection,
        redirect_uri: `${window.location.origin}/auth/callback`,
        prompt: "login",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      await login(formData);
    } catch (err) {
      const errorMessage =
        err.message ||
        err.error ||
        "Login failed. Please check your credentials.";

      if (
        errorMessage.toLowerCase().includes("email not verified") ||
        err.error === "Email not verified"
      ) {
        navigate("/verify-email", {
          state: {
            email: formData.email,
            fromLogin: true,
          },
        });
      } else {
        setFormError(errorMessage);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      <div className="w-[90%] md:w-[60vw] 2xl:w-[65vw] bg-white/70 backdrop-blur rounded-2xl  p-8 pt-0 flex flex-col gap-8 shadow">
        <section className="text-center">
          {/* <h2 className="text-2xl font-semibold text-[#5B576F]">
            Hey! <span className="font-bold text-[#161C2B]"> Welcome Back</span>
          </h2> */}
          {/* <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto">
            Login by submitting essential company details, after which their
            profile undergoes admin review. Upon approval, they gain full access
            to the platform’s dashboard and campaign tools.
          </p> */}

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              onClick={() => handleSocialLogin("google-oauth2")}
              className="flex items-center  gap-2 bg-white  rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow"
            >
              <G_icon className="w-5 h-5" /> Continue With Google
            </button>
            {/* social login button */}
            {/* <button
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center sm:w-max w-full gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <F_icon className="w-5 h-5" /> Continue With Facebook
            </button>
            <button
              onClick={() => handleSocialLogin("apple")}
              className="flex items-center sm:w-max w-full gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <A_icon className="w-5 h-5" /> Continue With Apple
            </button>
            <button
              onClick={() => handleSocialLogin("instagram")}
              className="flex items-center sm:w-max w-full gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <I_icon className="w-5 h-5" /> Continue With Instagram
            </button> */}
          </div>
          <div className="relative my-6 flex items-center">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-3 text-gray-500 text-xs bg-white/70">
              Or continue with
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
        </section>
        <section>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {formError}
            </div>
          )}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label className="text-sm text-gray-900">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-md text-sm"
            />
            <label className="text-sm text-gray-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-3 pr-10 border border-gray-300 rounded-md text-sm w-full"
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
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#0c7bb3] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="mt-3 main-btn text-white rounded-full px-8 py-3 text-sm font-medium transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>
            </div>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-900 font-medium hover:underline"
            >
              Create Account
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
