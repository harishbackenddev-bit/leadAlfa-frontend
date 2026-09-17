import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { setTheme } from '../../utils/theme';

const EMPTY_AUTH = { user: null, token: null, isAuthenticated: false };

const safeRemoveStoredAuth = () => {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing stored auth:', error);
  }
};

// Helper function to decode token and check expiry
const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return null; // Token expired
    }

    return decoded;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Build a fully-resolved auth state from a stored token (used both at module
// init and by the loadAuthFromToken reducer). Returns EMPTY_AUTH if the token
// is missing, malformed, expired, or unrecoverable.
const buildAuthFromToken = (token) => {
  if (!token) return { ...EMPTY_AUTH };

  const decoded = decodeToken(token);
  if (!decoded) {
    safeRemoveStoredAuth();
    return { ...EMPTY_AUTH };
  }

  let user = { ...decoded };
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const stored = JSON.parse(userStr);
      const decodedRole = decoded && decoded.role && String(decoded.role).trim() ? decoded.role : null;
      const storedRole = stored && stored.role && String(stored.role).trim() ? stored.role : null;
      user.role = decodedRole || storedRole || stored?.role || decoded?.role || "";
      if (stored.profile !== undefined) {
        user.profile = stored.profile;
      }
      if (stored.plan !== undefined) {
        user.plan = stored.plan;
      }
      // Keep email-verification status across reloads. Verified is "sticky":
      // a token or stored flag marking the user verified wins, so a session
      // that just passed OTP survives a reload even if the backend did not
      // reissue the token. A stored `false` is preserved so an unverified
      // session is still gated to /verify-email after a refresh.
      if (decoded?.isEmailVerified === true || stored.isEmailVerified === true) {
        user.isEmailVerified = true;
      } else if (stored.isEmailVerified === false) {
        user.isEmailVerified = false;
      }
    }
  } catch (error) {
    console.error('Error parsing user:', error);
    safeRemoveStoredAuth();
    return { ...EMPTY_AUTH };
  }

  return { user, token, isAuthenticated: true };
};

// Synchronously rehydrate from localStorage so the very first render of
// ProtectedRoute already sees the correct auth state. This prevents the
// race between AuthRehydrator's effect and route guards.
const getInitialAuth = () => {
  if (typeof window === 'undefined') return { ...EMPTY_AUTH };
  try {
    return buildAuthFromToken(localStorage.getItem('access_token'));
  } catch (error) {
    console.error('Auth init error:', error);
    return { ...EMPTY_AUTH };
  }
};

const initialState = getInitialAuth();

// Auth slice - Simple state management only
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set auth after successful login/signup
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Store in localStorage
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setTheme('light');
    },
    
    // Logout - clear everything
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },
    
    // Update user data
    updateUser: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    
    // Load auth from token (decode and set)
    loadAuthFromToken: (state, action) => {
      const { token } = action.payload || {};
      const next = buildAuthFromToken(token);
      state.user = next.user;
      state.token = next.token;
      state.isAuthenticated = next.isAuthenticated;
    },
  },
});

export const { setAuth, logout, updateUser, loadAuthFromToken } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
