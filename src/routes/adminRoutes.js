import { createElement } from "react";
import AdminLayout from "../components/Layout/AdminLayout";
import AdminPage from "../pages/admin";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import AdminSettings from "../pages/admin/Settings";
import RequestDetails from "../pages/admin/RequestDetails";
import ProtectedRoute from "../pages/auth/components/ProtectedRoute";

const ProtectedAdminLayout = () =>
  createElement(
    ProtectedRoute,
    { allowedRoles: ["admin"], redirectTo: "/login" },
    createElement(AdminLayout)
  );

const adminRoutes = [
  {
    path: "/admin",
    element: ProtectedAdminLayout,
    children: [
      {
        index: true,
        element: AdminPage,
      },
      {
        path: "dashboard",
        element: Dashboard,
      },
      {
        path: "users",
        element: Users,
      },
      {
        path: "users/:requestId",
        element: RequestDetails,
      },
      {
        path: "settings",
        element: AdminSettings,
      },
    ],
  },
];

export default adminRoutes;
