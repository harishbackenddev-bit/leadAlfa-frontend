# Redux Store Documentation

## Overview
This project uses Redux Toolkit for state management with a professional, scalable architecture.

## Structure

```
src/
├── store/
│   ├── index.js              # Store configuration
│   ├── slices/
│   │   └── authSlice.js      # Authentication slice
│   └── hooks/
│       └── index.js          # Custom Redux hooks
├── hooks/
│   └── useAuth.js            # Custom auth hook
└── components/
    ├── ProtectedRoute.jsx    # Protected route wrapper
    ├── PublicRoute.jsx       # Public route wrapper
    └── AuthRehydrator.jsx    # Auth state rehydration
```

## Features

### 1. Auth Slice (`authSlice.js`)
- **State Management**: User, token, authentication status
- **Token Handling**: JWT decode and expiry check
- **LocalStorage Sync**: Automatic persistence
- **Async Actions**: Login, signup, social login, verify email, etc.

### 2. Store Configuration (`index.js`)
- Configured with Redux Toolkit
- DevTools enabled in development
- Middleware for serialization checks
- Ready for multiple slices

### 3. Custom Hooks

#### `useAuth` Hook
```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use auth state and actions
}
```

#### Redux Hooks
```javascript
import { useAppDispatch, useAppSelector } from '../store/hooks';

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
}
```

### 4. Route Protection

#### ProtectedRoute
```javascript
import ProtectedRoute from '../components/ProtectedRoute';

<Route 
  path="/creator/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['creator']}>
      <CreatorDashboard />
    </ProtectedRoute>
  } 
/>
```

**Props:**
- `allowedRoles`: Array of roles allowed to access
- `redirectTo`: Path to redirect if not authenticated (default: '/login')
- `requireEmailVerification`: Whether email verification is required

#### PublicRoute
```javascript
import PublicRoute from '../components/PublicRoute';

<Route 
  path="/login" 
  element={
    <PublicRoute restricted={true}>
      <Login />
    </PublicRoute>
  } 
/>
```

**Props:**
- `restricted`: If true, authenticated users will be redirected to their dashboard

### 5. Auth Rehydration
The `AuthRehydrator` component automatically restores auth state from localStorage on app load and checks token expiry.

## Usage Examples

### Login
```javascript
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // User will be automatically redirected
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
}
```

### Signup
```javascript
const { signup } = useAuth();

const handleSignup = async (userData) => {
  try {
    await signup(userData);
    // Navigate to verification page
  } catch (err) {
    console.error('Signup failed:', err);
  }
};
```

### Social Login
```javascript
const { socialLogin } = useAuth();

const handleSocialLogin = async (auth0Data) => {
  try {
    await socialLogin(auth0Data);
    // User will be automatically redirected
  } catch (err) {
    console.error('Social login failed:', err);
  }
};
```

### Logout
```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout(); // Clears state and redirects to login
};
```

### Access User Data
```javascript
const { user, isAuthenticated, userRole } = useAuth();

if (isAuthenticated) {
  console.log('User:', user);
  console.log('Role:', userRole);
}
```

## Adding New Slices

To add a new slice (e.g., posts, notifications):

1. Create slice file:
```javascript
// src/store/slices/postsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [], loading: false },
  reducers: {
    // Your reducers
  },
});

export default postsSlice.reducer;
```

2. Add to store:
```javascript
// src/store/index.js
import postsReducer from './slices/postsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer, // Add here
  },
});
```

## Best Practices

1. **Use Custom Hooks**: Always use `useAuth` for auth operations
2. **Type Safety**: Consider adding TypeScript for better type safety
3. **Error Handling**: Always wrap async actions in try-catch
4. **Loading States**: Use loading state for better UX
5. **Token Refresh**: Implement token refresh logic if needed
6. **Secure Storage**: Consider using secure storage for sensitive data

## Security Notes

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- JWT expiry is checked on rehydration
- Protected routes prevent unauthorized access
- Token is automatically cleared on expiry

## Environment Variables

Required in `.env`:
```
VITE_API_URL=your_api_url
VITE_DOMAIN=your_auth0_domain
VITE_CLIENT_ID=your_auth0_client_id
```

## Troubleshooting

### Token Not Persisting
- Check localStorage in DevTools
- Verify token is being saved in async actions
- Check for token expiry

### Redirects Not Working
- Ensure `AuthRehydrator` is wrapping your routes
- Check role-based redirect logic
- Verify navigation paths

### State Not Updating
- Check Redux DevTools
- Verify actions are being dispatched
- Check reducer logic
