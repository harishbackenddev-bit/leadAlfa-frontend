import { createElement, lazy } from "react";
import { Navigate } from "react-router-dom";

const redirect = (to) => () => createElement(Navigate, { to, replace: true });

const portfolioRoutes = [
  {
    path: "/",
    element: lazy(() => import("../components/Layout/PortfolioLayout")),
    children: [
      {
        index: true,
        element: lazy(() => import("../pages/portfolio/Home")),
      },
      {
        path: "about",
        element: lazy(() => import("../pages/portfolio/About")),
      },
      {
        path: "services",
        element: lazy(() =>
           import("../pages/portfolio/Services")),
      },
      {
        path: "faqs-creators",
        element: lazy(() => import("../pages/portfolio/FAQCreators")),
      },
      {
        path: "faqs-brands",
        element: lazy(() => import("../pages/portfolio/FAQBrand")),
      },
      {
        path: "terms-conditions",
        element: lazy(() => import("../pages/portfolio/TermsConditions")),
      },
      {
        path: "terms-conditions-creators",
        element: lazy(() =>
          import("../pages/portfolio/TermsConditionsCreators")
        ),
      },
      {
        path: "site-notice",
        element: lazy(() => import("../pages/portfolio/SiteNotice")),
      },
      {
        path: "privacy-policy",
        element: lazy(() => import("../pages/portfolio/PrivacyPolicy")),
      },
      {
        path: "refund-policy",
        element: lazy(() => import("../pages/portfolio/RefundPolicy")),
      },
      {
        path: "blogs",
        element: lazy(() => import("../pages/portfolio/BlogsArticles1")),
      },
      {
        path: "blogs-articles",
        element: lazy(() => import("../pages/portfolio/BlogsArticles2")),
      },
      {
        path: "ugc",
        element: lazy(() => import("../pages/portfolio/WhatIsUGC")),
      },
      {
        path: "case-studies",
        element: lazy(() => import("../pages/portfolio/CaseStudies")),
      },
      {
        path: "tiktok-video-ads",
        element: lazy(() => import("../pages/portfolio/TikTokVideoAds")),
      },
      {
        path: "facebook-video-ads",
        element: lazy(() => import("../pages/portfolio/FacebookVideoAds")),
      },
      {
        path: "instagram-video-ads",
        element: lazy(() => import("../pages/portfolio/InstagramVideoAds")),
      },
      {
        path: "careers",
        element: lazy(() => import("../pages/portfolio/Career")),
      },
      {
        path: "for-creators",
        element: lazy(() => import("../pages/portfolio/ForCreators")),
      },
      {
        path: "masterclass",
        element: lazy(() => import("../pages/portfolio/Masterclass")),
      },
      {
        path: "affilate-program",
        element: lazy(() => import("../pages/portfolio/AffiliateProgram")),
      },
      {
        path: "pricing",
        element: lazy(() => import("../pages/pricing/pricing")),
      },
      {
        path: "apps",
        element: lazy(() => import("../pages/solution2/solution2")),
      },
      {
        path: "agencies",
        element: lazy(() => import("../pages/solution3/solution3")),
      },
      { path: "solution1", element: redirect("/ecommerce") },
      { path: "solution2", element: redirect("/apps") },
      { path: "solution3", element: redirect("/agencies") },
      {
        path: "book-a-call",
        element: lazy(() => import("../pages/bookacall/book-a-call")),
      },
      {
        path: "contact-us",
        element: lazy(() => import("../pages/contactus/contact-us")),
      },
      {
        path: "ecommerce",
        element: lazy(() =>
          import("../pages/solution1/solution1")
        )
      },
    ],

  },
];

export default portfolioRoutes;
