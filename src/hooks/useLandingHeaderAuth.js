import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";

/**
 * Landing header auth: show logged-in user from Redux when authenticated.
 */
export function useLandingHeaderAuth() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const showAuthenticatedHeader = isAuthenticated && Boolean(user);

  return {
    user: showAuthenticatedHeader ? user : null,
    showAuthenticatedHeader,
  };
}
