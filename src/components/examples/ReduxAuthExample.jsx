import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../store/hooks';
import { selectUser, selectIsAuthenticated } from '../../store/slices/authSlice';

/**
 * Example component showing how to use Redux auth
 * This file is for reference only - delete after understanding
 */
const ReduxAuthExample = () => {
  // Method 1: Use custom useAuth hook (Recommended)
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    userRole,
    login, 
    logout,
    clearError 
  } = useAuth();

  // Method 2: Use Redux selectors directly (Advanced)
  const userDirect = useAppSelector(selectUser);
  const isAuthenticatedDirect = useAppSelector(selectIsAuthenticated);

  // Example: Login handler
  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // User will be automatically redirected based on their state
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // Example: Logout handler
  const handleLogout = () => {
    logout(); // Clears state and redirects to /login
  };

  // Example: Clear error
  const handleClearError = () => {
    clearError();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Redux Auth Example</h1>
      
      {/* Loading State */}
      {loading && (
        <div className="bg-blue-100 p-4 rounded mb-4">
          Loading...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={handleClearError}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Clear Error
          </button>
        </div>
      )}

      {/* Authentication Status */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Authentication Status:</h2>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        {user && (
          <>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Role: {userRole || 'Not set'}</p>
            <p>Email Verified: {user.isEmailVerified ? 'Yes' : 'No'}</p>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="space-x-4">
        {!isAuthenticated ? (
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            Login (Example)
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        )}
      </div>

      {/* Code Examples */}
      <div className="mt-8 bg-gray-900 text-white p-4 rounded">
        <h3 className="font-semibold mb-2">Usage Example:</h3>
        <pre className="text-sm overflow-x-auto">
{`// Import the hook
import { useAuth } from '../../hooks/useAuth';

// Use in your component
const { user, isAuthenticated, login, logout } = useAuth();

// Login
await login({ email, password });

// Logout
logout();

// Access user data
console.log(user.firstName);
console.log(user.role);`}
        </pre>
      </div>
    </div>
  );
};

export default ReduxAuthExample;
