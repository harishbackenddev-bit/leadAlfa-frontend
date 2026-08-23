import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const EMPTY_AUTH = { 
  user: null, 
  token: null, 
  isAuthenticated: false,
  tradeSafeStatus: null, 
  tradeSafeUserId: null
};

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

// Build a fully-resolved auth state from a stored token
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
      user.firstName = stored.firstName;
      user.lastName = stored.lastName;
      user.role = decoded.role ? decoded.role : stored.role;
      if (stored.profile !== undefined) {
        user.profile = stored.profile;
      }
    }
  } catch (error) {
    console.error('Error parsing user:', error);
    safeRemoveStoredAuth();
    return { ...EMPTY_AUTH };
  }

  return { user, token, isAuthenticated: true };
};

// Synchronously rehydrate from localStorage
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

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, token, tradeSafeStatus, tradeSafeUserId } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.tradeSafeStatus = tradeSafeStatus || 'NOT_STARTED'; 
      state.tradeSafeUserId = tradeSafeUserId || null;
      
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tradeSafeStatus = null;
      state.tradeSafeUserId = null;
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },
    
    updateUser: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    
    loadAuthFromToken: (state, action) => {
      const { token } = action.payload || {};
      const next = buildAuthFromToken(token);
      state.user = next.user;
      state.token = next.token;
      state.isAuthenticated = next.isAuthenticated;
    },

    // --- THIS IS THE MISSING EXPORTED ACTION ---
    setTradeSafeStatus: (state, action) => {
      state.tradeSafeStatus = action.payload;
    },
  },
});

// --- FIXED EXPORT LINE ---
export const { setAuth, logout, updateUser, loadAuthFromToken, setTradeSafeStatus } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectTradeSafeStatus = (state) => state.auth.tradeSafeStatus;
export const selectTradeSafeUserId = (state) => state.auth.tradeSafeUserId;

export default authSlice.reducer;