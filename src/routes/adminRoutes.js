import { createElement } from "react";
import AdminLayout from "../components/Layout/AdminLayout";
import AdminPage from "../pages/admin";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import ContactRequests from "../pages/admin/ContactRequests";
import ContactRequestDetails from "../pages/admin/ContactRequestDetails";
import BookCallRequests from "../pages/admin/BookCallRequests";
import BookCallRequestDetails from "../pages/admin/BookCallRequestDetails";
import UserFeedback from "../pages/admin/UserFeedback";
import UserFeedbackDetails from "../pages/admin/UserFeedbackDetails";
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
        path: "contact-requests",
        element: ContactRequests,
      },
      {
        path: "contact-requests/:publicId",
        element: ContactRequestDetails,
      },
      {
        path: "book-call-requests",
        element: BookCallRequests,
      },
      {
        path: "book-call-requests/:publicId",
        element: BookCallRequestDetails,
      },
      {
        path: "user-feedback",
        element: UserFeedback,
      },
      {
        path: "user-feedback/:publicId",
        element: UserFeedbackDetails,
      },
      {
        path: "settings",
        element: AdminSettings,
      },
    ],
  },
];

export default adminRoutes;
