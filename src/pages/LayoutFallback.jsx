import React from "react";
import { useLocation } from "react-router-dom";
import BrandLayout from "../components/Layout/BrandLayout";
import CreatorLayout from "../components/Layout/CreatorLayout";
import PortfolioLayout from "../components/Layout/PortfolioLayout";

const LayoutFallback = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith("/brand")) {
    return <BrandLayout />;
  }

  if (pathname.startsWith("/creator")) {
    return <CreatorLayout />;
  }

  if (pathname.startsWith("/portfolio")) {
    return <PortfolioLayout />;
  }

  // Default: render a plain white page (no header/sidebar)
  return <div className="min-h-screen bg-white" />;
};

export default LayoutFallback;
