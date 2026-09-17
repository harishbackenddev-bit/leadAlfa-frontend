import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import leads_alpha_logo from "../../assets/SVGs/creator/HeaderLogo.svg";
import { Eye, EyeOff } from "lucide-react";
import { G_icon } from "../../assets/SVGs/portfolio/main/auth_icons";
import creatorHero from "../../assets/images/auth/login/creator-hero.webp";
import brandHero from "../../assets/images/auth/login/brand-hero.webp";
import badgeFormalise from "../../assets/images/auth/login/badge-formalise.svg";
import badgeOutreach from "../../assets/images/auth/login/badge-outreach.svg";
import badgePayouts from "../../assets/images/auth/login/badge-payouts.svg";
import badgeStreamlined from "../../assets/images/auth/login/badge-streamlined.svg";
import { useAuth, toAuthErrorMessage } from "./hooks/useAuthHook";
import TurnstileField from "../../components/common/TurnstileField";
import { TURNSTILE_ENABLED } from "../../constants/turnstile";
import { useTurnstileCaptcha } from "../../hooks/useTurnstileCaptcha";
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

const LOGIN_HEADINGS = {
  brand: "Login as Brand",
  creator: "Login as Creator",
};

const PANEL = {
  brand: {
    tag: "For Brands",
    title: ["Streamline Your", "UGC."],
    accent: "Scale Your Brand.",
    sub: "Manage creators, approve content, and track ROI, all in one place.",
    hero: brandHero,
    stats: [
      ["50+", "Active Brands", "#0c7bb3"],
      ["50+", "Launched Campaigns", "#16a34a"],
      ["100%", "Customer Satisfaction", "#7c3aed"],
    ],
  },
  creator: {
    tag: "For Creators",
    title: ["Your creative", "career,"],
    accent: "on your terms.",
    sub: "Join thousands of SA creators earning from brands they love.",
    hero: creatorHero,
    stats: [
      ["300+", "Active Creators", "#0c7bb3"],
      ["R100K+", "Paid Out", "#16a34a"],
      ["100%", "Customer Satisfaction", "#7c3aed"],
    ],
  },
};

const BADGES = [
  ["Formalise your", "side gig! 🚀", badgeFormalise, "12,123,179", "#eff6ff, #dbeafe", "-rotate-2 left-[-75px] top-[-45px]"],
  ["Leave the outreach", "behind ✌️", badgeOutreach, "22,163,74", "#f0fdf4, #dcfce7", "rotate-2 left-[202px] top-[-62px]"],
  ["Guaranteed,", "secure payouts 💸", badgePayouts, "217,119,6", "#fffbeb, #fef3c7", "rotate-[-1.5deg] left-[-48px] top-[172px]"],
  ["Streamlined", "end-to-end ⚡", badgeStreamlined, "124,58,237", "#f5f3ff, #ede9fe", "rotate-[1.5deg] left-[246px] top-[89px]"],
];

const fieldClass =
  "h-[50px] w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 text-[14px] leading-[21px] tracking-[-0.3px] text-[#1e293b] placeholder:text-[rgba(30,41,59,0.5)] outline-none transition-colors focus:border-[#0c7bb3] focus:ring-2 focus:ring-[#0c7bb3]/15";

export default function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useParams();
  const heading = LOGIN_HEADINGS[role];
  const activeRole = role === "creator" ? "creator" : "brand";
  const panel = PANEL[activeRole];
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

        const dest = returnPath || path;
        if (state && !returnPath) {
          navigate(dest, { replace: true, state });
        } else {
          window.location.replace(dest);
        }
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
  const captcha = useTurnstileCaptcha();
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
    captcha.clearCaptchaError();

    if (!captcha.requireCaptchaToken()) {
      return;
    }

    try {
      await login(captcha.withCaptchaPayload(formData));
    } catch (err) {
      if (captcha.handleCaptchaApiError(err)) {
        return;
      }

      const errorMessage =
        toAuthErrorMessage(err) || "Login failed. Please check your credentials.";

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
    <div className="flex min-h-screen w-full font-manrope lg:h-screen">
      <aside
        className="relative hidden w-[48%] shrink-0 overflow-hidden lg:flex lg:h-screen lg:flex-col"
        style={{
          backgroundImage:
            "linear-gradient(156deg, #f7f9fc 8.49%, #eef2f8 50%, #e8eef6 91.51%)",
        }}
      >
        <div className="pointer-events-none absolute left-[-80px] top-[-80px] size-[340px] rounded-full bg-[radial-gradient(circle,rgba(12,123,179,0.07)_0%,rgba(12,123,179,0)_70%)]" />
        <div className="pointer-events-none absolute bottom-[60px] right-[-60px] size-[280px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.06)_0%,rgba(124,58,237,0)_70%)]" />
        <div className="pointer-events-none absolute bottom-[200px] right-[-40px] size-[200px] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.05)_0%,rgba(22,163,74,0)_70%)]" />

        <div className="relative flex items-center justify-between px-10 pt-1.5">
          <img
            src={leads_alpha_logo}
            alt="Creatrend"
            className="size-[68px] cursor-pointer object-contain"
            onClick={() => navigate("/")}
          />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0c7bb3]/25 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase leading-[15px] tracking-[1.6px] text-[#0c7bb3] shadow-[0_2px_4px_rgba(12,123,179,0.1)]">
            <span className="size-[5px] rounded-full bg-[#0c7bb3] opacity-70" />
            {panel.tag}
          </span>
        </div>

        <div className="relative px-10 pt-7">
          <p className="text-[15px] font-medium uppercase leading-[22px] tracking-[2px] text-[#0c7bb3]">
            Creatrend Platform
          </p>
          <h2 className="mt-2 max-w-[560px] text-[40px] font-medium leading-[46px] tracking-[-1px] text-[#0f1a2a]">
            {panel.title[0]}
            <br />
            {panel.title[1]}{" "}
            <span className="bg-[linear-gradient(170deg,#0c7bb3_0%,#0353a4_100%)] bg-clip-text text-transparent">
              {panel.accent}
            </span>
          </h2>
          <p className="mt-2.5 max-w-[560px] text-[16px] leading-[26px] text-[#64748b]">{panel.sub}</p>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-16">
          <div className="relative h-[183px] w-[340px] scale-[0.85] xl:scale-100">
            <div className="absolute left-[34px] top-[18px] h-[147px] w-[272px] rounded-full bg-[radial-gradient(circle,rgba(12,123,179,0.12)_0%,rgba(12,123,179,0)_70%)] blur-[24px]" />
            <img
              src={panel.hero}
              alt=""
              className="absolute left-[-88.5px] top-[-63px] h-[279px] w-[517px] max-w-none object-cover"
            />
            {activeRole === "creator" &&
              BADGES.map(([bold, light, icon, rgb, grad, pos]) => (
                <div
                  key={bold}
                  className={`absolute flex items-center gap-[9px] rounded-[14px] bg-white px-3 py-2.5 ${pos}`}
                  style={{
                    border: `1px solid rgba(${rgb},0.12)`,
                    boxShadow: `0 8px 24px rgba(${rgb},0.14), 0 2px 6px rgba(0,0,0,0.06)`,
                  }}
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ backgroundImage: `linear-gradient(135deg, ${grad})` }}
                  >
                    <img src={icon} alt="" className="size-[15px]" />
                  </span>
                  <span className="whitespace-nowrap text-[11px] leading-[13.75px]">
                    <span className="block font-bold text-[#0f1a2a]">{bold}</span>
                    <span className="block" style={{ color: `rgb(${rgb})` }}>
                      {light}
                    </span>
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="relative mx-8 mb-8 grid h-[73px] grid-cols-3 overflow-hidden rounded-[18px] border border-[#0c7bb3]/12 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          {panel.stats.map(([value, label, color], i) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center px-2 py-4 ${i < 2 ? "border-r border-[#eef1f5]" : ""} ${i === 1 ? "bg-[#0c7bb3]/2" : ""}`}
            >
              <p className="text-[18px] leading-[18px]" style={{ color }}>
                {value}
              </p>
              <p className="pt-1 text-[11px] font-medium leading-[16.5px] text-[#6b7280]">{label}</p>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col items-center overflow-x-clip bg-white px-4 py-10 max-[359px]:px-2.5 sm:px-8 lg:h-screen lg:overflow-y-auto lg:py-6">
        <div className="my-auto flex w-full max-w-[420px] flex-col gap-5">
          <img
            src={leads_alpha_logo}
            alt="Creatrend"
            className="mb-3 size-16 cursor-pointer self-center object-contain lg:hidden"
            onClick={() => navigate("/")}
          />
          <div>
            <p className="text-[13px] leading-[19.5px] text-[#6b7280]">Login as</p>
            <div className="mt-2.5 flex h-[47px] rounded-[12px] bg-[#f0f2f5] p-1">
              {["brand", "creator"].map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={activeRole === r}
                  onClick={() => navigate(`/login/${r}`)}
                  className={`flex-1 rounded-[9px] text-[13px] font-semibold capitalize leading-[19.5px] transition-colors ${
                    activeRole === r
                      ? "bg-white text-[#0c7bb3] shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
                      : "text-[#6b7280] hover:text-[#374151]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-[30px] font-semibold leading-[40px] tracking-[-0.7px] text-[#0f1a2a]">
             Welcome to Creatrend
            </h1>
            <p className="pt-1 text-[17px] leading-[26px] text-[#64748b]">
              Sign in to manage your UGC campaigns.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSocialLogin("google-oauth2")}
            className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[12px] border border-[#e0e4ea] bg-white text-[14px] font-medium leading-[21px] text-[#374151] shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
          >
            <G_icon width={24} height={24} /> Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[#e5e7eb]" />
            <span className="text-[12px] leading-[18px] text-[#9ca3af]">or</span>
            <span className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          {formError && (
            <div className="rounded-[12px] border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold leading-[19.5px] text-[#374151]">
                Email Address <span className="text-[#ff6467]">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold leading-[19.5px] text-[#374151]">
                  Password <span className="text-[#ff6467]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[12px] font-medium leading-[18px] text-[#0c7bb3] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`${fieldClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                >
                  {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
              </div>
            </div>

            {TURNSTILE_ENABLED && (
              <TurnstileField captcha={captcha} className="max-[359px]:-mx-2.5" />
            )}

            <button
              type="submit"
              disabled={loading || !captcha.isCaptchaReady}
              className="h-[50px] w-full rounded-[12px] bg-[linear-gradient(173deg,#0c7bb3_0%,#0353a4_100%)] text-[14px] font-semibold leading-[21px] text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : heading || "Login Now"}
            </button>
          </form>

          <p className="text-center text-[13px] leading-[19.5px] text-[#6b7280]">
            Don't have an account?{" "}
            <a href="/signup" className="font-bold text-[#0c7bb3] hover:underline">
              Create Account
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
