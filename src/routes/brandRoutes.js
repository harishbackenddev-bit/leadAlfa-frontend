import { createElement, lazy } from "react";
import BrandLayout from "../components/Layout/BrandLayout/index.jsx";
import ProtectedRoute from "../pages/auth/components/ProtectedRoute";
import Campaigns from "../pages/brand/Campaigns/Campaigns.jsx";
import ProfileVerification from "../pages/brand/Campaigns/ProfileVerification.jsx";
import CreateCampaigns from "../pages/brand/Campaigns/CreateCampaigns.jsx";
import ViewAllCampaigns from "../pages/brand/Campaigns/components/ViewAllCampaigns.jsx";
import { Navigate } from "react-router-dom";
import BrandPage from "../pages/brand/index.jsx";
import Creators from "../pages/brand/creators/Creators.jsx";
import Settings from "../pages/brand/settings/Settings";
import Messages from "../pages/brand/messages/Messages";
import MyProfile from "../pages/brand/MyProfile/MyProfile";
import EditProfile from "../pages/brand/MyProfile/EditProfile";
import Credits from "../pages/brand/credits/Credits";
import AddCreditsPage from "../pages/brand/credits/AddCreditsPage";
import ViewCreator from "../pages/brand/creators/ViewCreator.jsx";
import AllInvites from "../pages/brand/creators/AllInvites.jsx";
import AllShipments from "../pages/brand/shipment/AllShipments.jsx";
import ViewShipment from "../pages/brand/shipment/ViewShipment.jsx";
import CollectionAddress from "../pages/brand/shipment/CollectionAddress.jsx";
import ModuleComingSoon from "../pages/brand/comingSoon/ModuleComingSoon.jsx";
import CampaignManagement from "../pages/brand/Campaigns/CampaignManagement";
import Notifications from "../pages/notifications/Notifications.jsx";

const EditCampaigns = lazy(() => import("../pages/brand/Campaigns/EditCampaigns.jsx"));

const ProtectedBrandLayout = () =>
  createElement(
    ProtectedRoute,
    { allowedRoles: ["brand"], redirectTo: "/login" },
    createElement(BrandLayout)
  );

const comingSoon = (title, description) => () => createElement(ModuleComingSoon, { title, description });

const brandRoutes = [
  {
    path: "/brand",
    element: ProtectedBrandLayout,
    children: [
      {
        index: true,
        element: BrandPage,
      },      
      {
        path: "campaigns",
        element: Campaigns,
      },
      {
        path: "campaigns/allCampaigns",
        element: ViewAllCampaigns,
      },
      {
        path: "campaigns/contracts",
        element: createElement(Navigate, { to: "/brand/campaigns", replace: true }),
      },
      {
        path: "campaigns/approvals",
        element: createElement(Navigate, { to: "/brand/campaigns", replace: true }),
      },
      {
        path: "campaigns/proposals",
        element: createElement(Navigate, { to: "/brand/campaigns", replace: true }),
      },
      {
        path: "campaigns/proposals/all",
        element: createElement(Navigate, { to: "/brand/campaigns", replace: true }),
      },
      {
        path: "campaigns/create",
        element: CreateCampaigns,
      },
      {
        path: "campaigns/:publicId/view",
        element: CampaignManagement,
      },
      {
        path: "campaigns/:id/view",
        element: CampaignManagement,
      },
      {
        path: "campaigns/edit",
        element: EditCampaigns,
      },
      {
        path: "campaigns/verification",
        element: ProfileVerification,
      },
      {
        path: "creators",
        element: Creators,
      },
      {
        path: "creators/:id/view",
        element: ViewCreator,
      },
      {
        path: "settings",
        element: Settings,
      },
      {
        path: "messages",
        element: Messages,
      },
      {
        path: "notifications",
        element: Notifications,
      },
      {
        path: "my-profile",
        element: MyProfile,
      },
      {
        path: "edit-profile",
        element: EditProfile,
      },
      {
        path: "credits",
        element: Credits,
      },
      {
        path: "credits/add",
        element: AddCreditsPage,
      },
      {
        path: "creators/allInvites",
        element: AllInvites,
      },
      {
        path: "shipments",
        element: AllShipments,
      },
      {
        path: "shipments/:id/view",
        element: ViewShipment,
      },
      {
        path: "integrations",
        element: comingSoon("Integrations", "Connect the tools you already use — storefronts, ad accounts, and analytics."),
      },
      {
        path: "compliance-reports",
        element: comingSoon("Compliance Reports", "Track disclosure compliance across every campaign and creator."),
      },
      {
        path: "resource-library",
        element: comingSoon("Media Vault", "Store brand guidelines, product briefs, and reusable assets in one place."),
      },
      {
        path: "billing",
        element: comingSoon("Billing", "Manage your plan, credits, and invoices."),
      },
      {
        path: "shipments/collection-address",
        element: CollectionAddress,
      },
    ],
  },
];

export default brandRoutes;
