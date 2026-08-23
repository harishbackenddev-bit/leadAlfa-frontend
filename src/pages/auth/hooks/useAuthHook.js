import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { loginUser, signupUser, setUserRole, socialLogin as socialLoginAPI, verifyEmail as verifyEmailAPI, resendVerificationCode, forgotPassword as forgotPasswordAPI, resetPassword as resetPasswordAPI } from '../../../services/api/apiservices';
import { setAuth, updateUser as updateUserRedux, logout as logoutRedux } from '../../../store/slices/authSlice';
import { resolvePostAuthDestination } from '../../../utils/onboardingProfile';

function readUserFromStorage() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Axios / API often throw plain objects — normalize for UI + rethrow as Error. */
export function toAuthErrorMessage(err) {
  if (err == null) return 'Something went wrong';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message || 'Something went wrong';
  if (typeof err === 'object') {
    const firstNested =
      Array.isArray(err.errors) && err.errors.length > 0
        ? err.errors[0]?.message || err.errors[0]
        : null;
    return (
      err.message ||
      err.error ||
      err.msg ||
      (typeof firstNested === 'string' ? firstNested : null) ||
      'Request failed'
    );
  }
  return String(err);
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginUser(credentials);
      
      // Store tokens and user data
      const token = response.user?.auth_token || response.token;
      
      setUser(response.user);
      
      // ✅ Dispatch to Redux store
      dispatch(setAuth({ user: response.user, token }));

      const { path, state, profile } = await resolvePostAuthDestination(
        response.user
      );
      dispatch(updateUserRedux({ profile }));
      navigate(path, { replace: true, ...(state ? { state } : {}) });

      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await signupUser(userData);
      
      // Store tokens and user data
      const token = response.user?.auth_token || response.token;
      
      setUser(response.user);
      
      // ✅ Dispatch to Redux store if token exists
      if (token) {
        dispatch(setAuth({ user: response.user, token }));
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set role function
  const updateRole = async (role) => {
    try {
      setLoading(true);
      setError(null);

      const response = await setUserRole({ role });
      const resolvedRole = response?.role || role;

      // Prefer localStorage — `user` state can still be null after redirect while session exists
      const base = readUserFromStorage() || user || {};
      const updatedUser = { ...base, role: resolvedRole };

      setUser(updatedUser);
      dispatch(updateUserRedux(updatedUser));

      return response;
    } catch (err) {
      const msg = toAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Social login function
  const socialLogin = async (auth0Data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await socialLoginAPI(auth0Data);
      
      setUser(response.user);
      
      // ✅ Dispatch to Redux store
      dispatch(setAuth({ user: response.user, token: response.token }));

      const { path, state, profile } = await resolvePostAuthDestination(
        response.user
      );
      dispatch(updateUserRedux({ profile }));
      navigate(path, { replace: true, ...(state ? { state } : {}) });

      return response;
    } catch (err) {
      setError(err.message || 'Social login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email function
  const verifyEmail = async (verificationData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await verifyEmailAPI(verificationData);
      
      return response;
    } catch (err) {
      setError(err.message || 'Email verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code function
  const resendCode = async (emailData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await resendVerificationCode(emailData);
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to resend code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    setUser(null);
    dispatch(logoutRedux());
    navigate('/login',{replace: true});
  };

  const clearStoredAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    setUser(null);
    dispatch(logoutRedux());
  };

  const forgotPassword = async (emailData) => {
    try {
      setLoading(true);
      setError(null);
      return await forgotPasswordAPI(emailData);
    } catch (err) {
      const msg = toAuthErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resetPasswordAPI(resetData);
      clearStoredAuth();
      return response;
    } catch (err) {
      const msg = toAuthErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    signup,
    socialLogin,
    updateRole,
    verifyEmail,
    resendCode,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated: !!user
  };
};
