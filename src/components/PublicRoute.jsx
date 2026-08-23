import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

/**
 * PublicRoute component for pages that should only be accessible when NOT authenticated
 * (e.g., login, signup pages)
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @param {boolean} props.restricted - If true, authenticated users will be redirected
 */
const PublicRoute = ({ children, restricted = true }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // If route is restricted and user is authenticated, redirect to their dashboard
  if (restricted && isAuthenticated && user) {
    const roleRedirects = {
      brand: '/brand/campaigns',
      creator: '/creator/my-jobs',
      admin: '/admin/dashboard',
    };
    
    const redirectPath = roleRedirects[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated or route is not restricted
  return children;
};

export default PublicRoute;
