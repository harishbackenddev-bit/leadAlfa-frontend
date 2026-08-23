import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialLogin } from "../../services/api/apiservices";
import { useAppDispatch } from "../../store/hooks";
import { setAuth, updateUser } from "../../store/slices/authSlice";
import { resolvePostAuthDestination } from "../../utils/onboardingProfile";

export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error: auth0Error, getAccessTokenSilently, user } = useAuth0();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      // Wait for Auth0 to finish loading
      if (isLoading) return;

      // Handle Auth0 errors
      if (auth0Error) {
        console.error("Auth0 error:", auth0Error);
        setError(auth0Error.message || "Authentication failed");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
        return;
      }

      // If authenticated, get token and send to backend
      if (isAuthenticated && !processing) {
        setProcessing(true);
        
        try {
          // Get Auth0 access token
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: `https://${import.meta.env.VITE_DOMAIN}/api/v2/`,
              scope: "openid profile email"
            }
          });

          console.log("Auth0 user:", user);
          console.log("Auth0 access token obtained");

          // Send token to backend for verification
          const backendResponse = await socialLogin(accessToken);
          
          console.log("Backend authentication successful:", backendResponse);
          
          const backendUser = backendResponse.user;
          const token =
            backendUser?.auth_token ||
            backendUser?.token ||
            backendResponse?.token;

          dispatch(setAuth({ user: backendUser, token }));

          const { path, state, profile } =
            await resolvePostAuthDestination(backendUser);
          dispatch(updateUser({ profile }));

          navigate(path, {
            replace: true,
            ...(state ? { state } : {}),
          });
        } catch (err) {
          console.error("Backend authentication error:", err);
          setError(err.message || "Authentication failed");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        }
      }
    };

    handleAuth();
  }, [isAuthenticated, isLoading, auth0Error, getAccessTokenSilently, user, navigate, processing, dispatch]);

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
