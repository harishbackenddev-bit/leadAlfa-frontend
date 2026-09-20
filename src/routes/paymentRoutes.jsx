import { lazy } from "react";

const paymentRoutes = [
  {
    path: "/payment/success",
    element: lazy(() => import("../pages/payment/PaymentSuccess")),
  },
  {
    path: "/payment/error",
    element: lazy(() => import("../pages/payment/PaymentError")),
  },
];

export default paymentRoutes;