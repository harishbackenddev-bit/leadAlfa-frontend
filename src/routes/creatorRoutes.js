import { createElement, lazy } from "react";

//creator layout
import CreatorLayout from "../components/Layout/CreatorLayout";
import ProtectedRoute from "../pages/auth/components/ProtectedRoute";
import CampaignDetailsView from "../pages/creator/ExploreCampaigns/CampaignDetailsView";
import BrandProfileView from "../pages/creator/ExploreCampaigns/BrandProfileView";
import ApplyNowform from "../pages/creator/ExploreCampaigns/ApplyNowform";
import InvitationApply from "../pages/creator/MyInvitation/InvitationApply";
import Messages from "../pages/creator/Messages/Messages";
import MyJobsDetailRouter from "../pages/creator/MyJobs/MyJobsDetailRouter";
import SubmitAssignment from "../pages/creator/MyJobs/OngoingJobs/SubmitAssignment";
import OngoingJobs from "../pages/creator/MyJobs/OngoingJobs/OngoingJobs";
import AddRatings from "../pages/creator/MyJobs/AddRatings";
import MyInvitation from "../pages/creator/MyInvitation/MyInvitation";
import InvitationDetailView from "../pages/creator/MyInvitation/InvitationDetailView";
import Settings from "../pages/settings/Settings";
import MyEarnings from "../pages/creator/MyEarnings/MyEarnings";
import MyProfile from "../pages/creator/MyProfile/MyProfile";
import EditProfile from "../pages/creator/MyProfile/EditProfile";
import Notifications from "../pages/notifications/Notifications";
import MyShipments from "../pages/creator/Shipments/MyShipments";
import ShipmentDetail from "../pages/creator/Shipments/ShipmentDetail";
import DeliveryAddress from "../pages/creator/Shipments/DeliveryAddress";
// import { Navigate, redirect } from "react-router-dom";

//import lazy
const MyJobs = lazy(() => import("../pages/creator/MyJobs/MyJobs"));
const Campaigns = lazy(() => import("../pages/creator/ExploreCampaigns/Campaings"));

const ProtectedCreatorLayout = () =>
    createElement(
        ProtectedRoute,
        { allowedRoles: ["creator"], redirectTo: "/login" },
        createElement(CreatorLayout)
    );

const creatorRoutes = [
    {
        path: "/creator",
        element: ProtectedCreatorLayout,
        children: [
            {
                index: true,
                element: Campaigns,
            },
            {
                path: "campaigns",
                element: Campaigns,
            },
            {
                path: "campaigns/:id",
                element: CampaignDetailsView,
            },
            {
                path: "campaigns/:id/apply",
                element: ApplyNowform,
            },
            {
                path: "brands/:brandId",
                element: BrandProfileView,
            },
            {
                path: "invitations/apply/:id",
                element: InvitationApply,
            },
            {
                path: "my-jobs",
                element: MyJobs,
            },
            {
                path: "my-jobs/:id",
                element: MyJobsDetailRouter,
            },
            {
                path: "my-jobs/:id/submit",
                element: SubmitAssignment,
            },
            {
                path: "my-jobs/:id/ratings",
                element: AddRatings,
            },
            {
                path: "shipments",
                element: MyShipments,
            },
            {
                path: "shipments/delivery-address",
                element: DeliveryAddress,
            },
            {
                path: "shipments/:id",
                element: ShipmentDetail,
            },
            {
                path: "messages",
                element: Messages,
            },
            {
                path: "invitations",
                element: MyInvitation,
            },
            {
                path: "invitations/:id",
                element: InvitationDetailView,
            },
            {
                path: "settings",
                element: Settings,
            },
            {
                path: "my-profile",
                element: MyProfile,
            },
            {
                path: "my-profile/edit",
                element: EditProfile,
            },
            {
                path: "earnings",
                element: MyEarnings,
            },
            {
                path: "notifications",
                element: Notifications,
            },
        ]
    }
];

export default creatorRoutes;
