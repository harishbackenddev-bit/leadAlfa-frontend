import { lazy } from "react";
import portfolioRoutes from "./portfolioRoutes";
import authRoutes from "./authRoutes";
import brandRoutes from "./brandRoutes";
import creatorRoutes from "./creatorRoutes";
import adminRoutes from "./adminRoutes";

const routes = [
  ...authRoutes,
  ...portfolioRoutes,
  ...brandRoutes,
  ...creatorRoutes,
  ...adminRoutes,
  // Fallback route: render layout for unknown routes instead of full 404 page
  {
    path: "*",
    element: lazy(() => import("../pages/LayoutFallback")),
  },
];

export default routes;
