import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialLogin } from "../../services/api/apiservices";
import { useAppDispatch } from "../../store/hooks";
import { setAuth, updateUser } from "../../store/slices/authSlice";
import { resolvePostAuthDestination } from "../../utils/onboardingProfile";

const pickBackendToken = (response, backendUser) =>
  backendUser?.auth_token ||
  backendUser?.token ||
  response?.token ||
  response?.access_token ||
  response?.accessToken ||
  null;

export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    isLoading,
    error: auth0Error,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const processedRef = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (isLoading || processedRef.current) return;

      if (auth0Error) {
        console.error("Auth0 error:", auth0Error);
        setError(auth0Error.message || "Authentication failed");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
        return;
      }

      if (!isAuthenticated) {
        const params = new URLSearchParams(window.location.search);
        if (!params.get("code") && !params.get("error")) {
          navigate("/login", { replace: true });
        }
        return;
      }

      processedRef.current = true;
      setProcessing(true);

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            scope: "openid profile email",
          },
        });
        const claims = await getIdTokenClaims();
        const idToken = claims?.__raw;

        if (!accessToken && !idToken) {
          throw new Error("Auth0 did not return a token");
        }

        const backendResponse = await socialLogin({
          token: accessToken || idToken,
          rememberMe: false,
        });

        const backendUser =
          backendResponse?.user || backendResponse?.data?.user;
        const token = pickBackendToken(backendResponse, backendUser);

        if (!backendUser || !token) {
          throw new Error("Social login did not return a user session");
        }

        dispatch(setAuth({ user: backendUser, token }));

        const { path, state, profile } =
          await resolvePostAuthDestination(backendUser);
        dispatch(updateUser({ profile }));

        navigate(path, {
          replace: true,
          ...(state ? { state } : {}),
        });
      } catch (err) {
        processedRef.current = false;
        console.error("Backend authentication error:", err);
        const message =
          (typeof err === "string" && err) ||
          err?.message ||
          err?.error ||
          "Authentication failed";
        setError(message);
        setProcessing(false);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    };

    handleAuth();
  }, [
    isAuthenticated,
    isLoading,
    auth0Error,
    getAccessTokenSilently,
    getIdTokenClaims,
    navigate,
    dispatch,
  ]);

  if (isLoading || processing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
