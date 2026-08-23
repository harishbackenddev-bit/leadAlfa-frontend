import { useEffect, useState } from "react";
import leads_alpha_logo from "../assets/SVGs/creator/HeaderLogo.svg";
import {
  handleRedirectCallback,
  loginWithSocial,
  logout,
} from "../../services/auth0";
import { A_icon, Eye_icon, F_icon, G_icon, I_icon } from "../assets/auth_icons";

export default function LogIn() {
  const [user, setUser] = useState(null);

  // Handle Auth0 redirect
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
          Logged in! <small>This is for testing!</small>
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
    <div
      className="min-h-screen my-8 flex flex-col justify-center items-center gap-8 bg-cover bg-center"
      style={{ backgroundImage: `url('./assets/Background-Animation.jpg')` }}
    >
      {/* Logo */}
      <div className="text-center">
        <img
          src={leads_alpha_logo}
          alt="leads_alpha_logo"
          className="w-24 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        />
      </div>

      {/* Card */}
      <div className="w-[90%] md:w-[60vw] bg-white/70 backdrop-blur rounded-2xl border border-gray-300 p-8 flex flex-col gap-8 shadow-md">
        {/* SECTION 1: Social login */}
        <section className="text-center">
          <h1 className="text-xl font-medium text-gray-900">
            <span className="text-gray-600 font-normal">Hey!</span> Welcome Back
          </h1>
          <p className="text-xs text-gray-500 mt-3 px-4 md:px-10 leading-relaxed">
            Login by submitting essential company details, after which their
            profile undergoes admin review. Upon approval, they gain full access
            to the platform’s dashboard and campaign tools.
          </p>

          {/* Social Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              onClick={() => loginWithSocial("google-oauth2")}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 text-[10px] hover:border-gray-400"
            >
              <G_icon /> Continue With Google
            </button>
            {/* Uncomment when Facebook, Apple, and Instagram are configured in Auth0 */}
            {/* <button
              onClick={() => loginWithSocial("facebook")}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 text-[10px] hover:border-gray-400"
            >
              <F_icon /> Continue With Facebook
            </button>
            <button
              onClick={() => loginWithSocial("apple")}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 text-[10px] hover:border-gray-400"
            >
              <A_icon /> Continue With Apple
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 text-[10px] hover:border-gray-400">
              <I_icon /> Continue With Instagram
            </button> */}
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-3 text-gray-500 text-xs bg-white/70">
              Or continue with
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
        </section>

        {/* SECTION 2: Email login */}
        <section>
          <form className="flex flex-col gap-3">
            <label className="text-xs text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              required
              className="p-3 border border-gray-300 rounded-md text-sm"
            />

            <label className="text-xs text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Password"
                required
                className="p-3 border border-gray-300 rounded-md text-sm w-full"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500">
                <Eye_icon />
              </span>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-3 main-btn text-white rounded-full px-6 py-2 text-xs transition"
              >
                Login Now
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-xs text-gray-600">
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
