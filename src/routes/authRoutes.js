import { lazy } from "react";

const authRoutes = [
  {
    path: "/login",
    element: lazy(() => import("../pages/auth/Login")),
  },
  {
    path: "/login/:role",
    element: lazy(() => import("../pages/auth/Login")),
  },
  {
    path: "/signup",
    element: lazy(() => import("../pages/auth/SignUp")),
  },
  {
    path: "/verify-email",
    element: lazy(() => import("../pages/auth/VerifyEmail")),
  },
  {
    path: "/forgot-password",
    element: lazy(() => import("../pages/auth/ForgotPassword")),
  },
  {
    path: "/reset-password",
    element: lazy(() => import("../pages/auth/ResetPassword")),
  },
  {
    path: "/auth/callback",
    element: lazy(() => import("../pages/auth/Callback")),
  },  
];

export default authRoutes;
