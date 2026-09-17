export const ROLE_HOME_ROUTES = {
  admin: "/admin/dashboard",
  brand: "/brand/campaigns",
  creator: "/creator/campaigns",
};

export const normalizeRole = (role) =>
  typeof role === "string" ? role.trim().toLowerCase() : "";

export const getRoleHomeRoute = (role) => {
  const normalizedRole = normalizeRole(role);
  return ROLE_HOME_ROUTES[normalizedRole] || "/";
};

export const isAllowedRole = (role, allowedRoles = []) => {
  const normalizedRole = normalizeRole(role);

  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.map(normalizeRole).includes(normalizedRole);
};