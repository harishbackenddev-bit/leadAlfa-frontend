import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../../store/slices/authSlice";
import { getRoleHomeRoute, isAllowedRole } from "../../../utils/roleRoutes";

/**
 * ProtectedRoute guards a subtree of routes.
 *
 * - Auth is hydrated synchronously from localStorage in authSlice init, so this
 *   component can decide on the very first render — no fake loading timer is
 *   needed and there is no flash of "/login" for already-authenticated users.
 * - Unauthenticated users are sent to `redirectTo` with `state.from` set so the
 *   login page can return them to the original URL after sign-in.
 * - Authenticated users whose role is not in `allowedRoles` are sent to their
 *   own role's home route.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string[]} [props.allowedRoles] Empty/omitted means "any authenticated user".
 * @param {string} [props.redirectTo="/login"]
 * @param {boolean} [props.requireEmailVerification=false]
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/login",
  requireEmailVerification = false,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !user.isEmailVerified) {
    return (
      <Navigate to="/verify-email" state={{ email: user.email }} replace />
    );
  }

  if (!isAllowedRole(user.role, allowedRoles)) {
    return <Navigate to={getRoleHomeRoute(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
