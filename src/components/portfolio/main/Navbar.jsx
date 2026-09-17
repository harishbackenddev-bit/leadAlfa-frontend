import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/SVGs/creator/HeaderLogo.svg";
import { BrandIcon } from "../../../assets/SVGs/portfolio/nav/BrandIcon.jsx";
import { CreatorIcon } from "../../../assets/SVGs/portfolio/nav/CreatorIcon.jsx";
import ActionButton from "../../common/ActionButton";
import SelectDropdown from "../../common/SelectDropdown";

import serviceVideo from "../../../assets/SVGs/portfolio/nav/IMG_3514.MP4";
import servicePoster from "../../../assets/SVGs/portfolio/nav/thumbnailVideo.webp";

import shoppingBagOpenIcon from "../../../assets/images/portfolio/nav/ShoppingBagOpen.svg";
import videoIcon from "../../../assets/images/portfolio/nav/Video.svg"; 
import deviceMobileSpeaker from "../../../assets/images/portfolio/nav/DeviceMobileSpeaker.svg";
import tikTokIcon from "../../../assets/images/portfolio/nav/TikTok-Icon.svg";
import facebookIcon from "../../../assets/images/portfolio/nav/Facebook-Icon.svg";
import InstagramIcon from "../../../assets/images/portfolio/nav/Instagram-Icon.svg";

import ServiceCategory from "./ServiceCategory.jsx";
import HoverLinkArrow from "./HoverLinkArrow";
import { getRoleHomeRoute } from "../../../utils/roleRoutes";
import { useLandingHeaderAuth } from "../../../hooks/useLandingHeaderAuth";
import { resolveLandingHeaderUserDisplay } from "../../../utils/landingHeaderUser";
import LogoutButton from "../../../pages/auth/components/LogoutButton";

function LandingUserAvatar({ avatarUrl, initials, variant = "desktop" }) {
  const desktopClassName =
    "w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden flex items-center justify-center text-white font-semibold text-sm";
  const mobileClassName =
    "w-10 h-10 rounded-full bg-[#1E60DB26] overflow-hidden flex items-center justify-center text-[#0353a4] font-semibold text-sm";

  const className = variant === "mobile" ? mobileClassName : desktopClassName;

  return (
    <div className={className}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="profile" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, showAuthenticatedHeader: isLoggedIn } = useLandingHeaderAuth();
  const headerUser = resolveLandingHeaderUserDisplay(user);
  const userHomeRoute = getRoleHomeRoute(user?.role);

  const [open, setOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  let timeout;
  const handleMouseEnter = () => {
    clearTimeout(timeout);
    setShowServices(true);
  };
  const handleMouseLeave = () => {
    timeout = setTimeout(() => setShowServices(false), 150);
  };

  const closeServicesDropdown = () => {
    clearTimeout(timeout);
    setShowServices(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const getintouch = () => {
    navigate('/login');
  };
  const handleActionClick = () => {
    navigate('/book-a-call');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuClosing(true);
    setMobileServicesOpen(false);
    setTimeout(() => {
      setOpen(false);
      setIsMobileMenuClosing(false);
    }, 300);
  };

  // Safety net: close the services dropdown whenever the route changes
  useEffect(() => {
    setShowServices(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);


  const servicesCol1 = [
    {
      icon: shoppingBagOpenIcon,
      alt: "shopping-bag-open-icon",
      heading: "Apps",
      desc: "Showcase your products with engaging eCom creator videos.",
      to: "/apps"
    },
    {
      icon: videoIcon,
      alt: "video-icon",
      heading: "Agencies",
      desc: "Engage your audience with captivating creator videos.",
      to: "/agencies"
    }]

  const servicesCol2 = [
    {
      icon: shoppingBagOpenIcon,
      alt: "shopping-bag-open-icon",
      heading: "eCommerce",
      desc: "Showcase your products with engaging eCom creator videos.",
      to: "/ecommerce"
    },
    {
      icon: deviceMobileSpeaker,
      alt: "device-mobile-speaker",
      heading: "For Creators",
      desc: "Engage your audience with captivating creator videos.",
      to: "/for-creators"
    }
  ];

  // Lock/unlock scroll when menu is open
  useEffect(() => {
    const locked = open || isMobileMenuClosing;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobileMenuClosing]);



  return (
    <>
      <nav className="sticky top-0 font-sans bg-white w-full z-[1000]">
        {/* Left Section */}

        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-[2vw]">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="block"
            >
              <img src={logo} alt="Creatrend Logo" className="h-12" />
            </Link>

            <ul className="hidden lg:flex list-none gap-6 items-center whitespace-nowrap">
              <li className="relative">
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="flex flex-col"
                >
                  <Link className="text-[#111] font-medium flex items-center gap-1 group">
                  Solutions
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={"transition-transform duration-300 ease-in-out group-hover:rotate-180"}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="#898989"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </li>
              <li>
                <Link to="/pricing" className="text-[#111] font-medium">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/for-brands" className="text-[#111] font-medium">
                  For Brands
                </Link>
              </li>
              <li>
                <Link to="/for-creators" className="text-[#111] font-medium">
                  For Creators
                </Link>
              </li>
              <ActionButton label="Book A Call" onClick={handleActionClick} />
            </ul>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <SelectDropdown
                  label="Login"
                  className="bg-white rounded-full"
                  btnClassName="h-12"
                  liClassName="p-0!"
                  // menuAlign="right"
                  items={[
                    <Link to="/login/brand" className="flex gap-2 px-5 py-3">
                      <BrandIcon />
                      <div className="min-w-0">
                        <h5 className="font-bold">I'm a brand</h5>
                        <p className="text-[12px] text-gray-600">Connect with creators</p>
                      </div>
                    </Link>,
                    <Link to="/login/creator" className="flex gap-2 px-5 py-3">
                      <CreatorIcon />
                      <div className="min-w-0">
                        <h5 className="font-bold">I'm a creator</h5>
                        <p className="text-[12px] text-gray-600">Monetise your content</p>
                      </div>
                    </Link>,
                  ]}
                  trigger="hover"
                />
                  <ActionButton label="Get Started" onClick={getintouch} />
              </>
            ) : (
              <>
                <Link
                  to={userHomeRoute}
                  className="rounded-2xl bg-[#0c7bb3] px-4 py-2 flex items-center gap-3 hover:bg-[#1E60DB40] transition-colors"
                >
                  <LandingUserAvatar
                    avatarUrl={headerUser.avatarUrl}
                    initials={headerUser.initials}
                  />
                  <div className="leading-tight">
                    <div className="text-sm font-medium text-white">{headerUser.displayName}</div>
                    <div className="text-xs text-white capitalize">{headerUser.roleLabel}</div>
                  </div>
                </Link>

                <LogoutButton className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Logout
                </LogoutButton>
              </>
            )}
          </div>


          {/* Hamburger */}
          <div
            className="flex lg:hidden flex-col gap-1 cursor-pointer"
            onClick={() => {
              if (open) {
                setIsMobileMenuClosing(true);
                setTimeout(() => {
                  setOpen(false);
                  setIsMobileMenuClosing(false);
                }, 300);
              } else {
                setOpen(true);
              }
            }}
          >
            <div
              className={`w-6 h-[3px] bg-[#333] transition-all duration-300 ${open ? "rotate-42 translate-y-1.5" : ""
                }`}
            />
            <div
              className={`w-6 h-[3px] bg-[#333] transition-all duration-300 ${open ? "opacity-0" : ""
                }`}
            />
            <div
              className={`w-6 h-[3px] bg-[#333] transition-all duration-300 ${open ? "-rotate-42 -translate-y-[9.5px]" : ""
                }`}
            />
          </div>
        </div>


        {/* Desktop Services Dropdown - absolute overlay so it does not push page content */}
        {showServices && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="hidden md:block absolute left-0 right-0 top-full z-[1001]"
          >
            <div className="bg-[#F7F8F9] shadow-lg w-full px-9 pb-6 grid grid-cols-3 gap-6 rounded-lg">
              <div className="p-6 rounded-2xl overflow-hidden">
                <div className="mb-4 flex pl-2 flex-col gap-3">
                  <h5 className=" text-2xl font-medium hidden">Creatrend</h5>
                  <p className="text-md font-normal max-w-80 text-gray-400 hidden">Transform your brand with authentic UGC </p>
                </div>
                <video
                  className="w-100 h-100 rounded-2xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster={servicePoster}
                  aria-label="Promo video"
                >
                  <source src={serviceVideo} type="video/mp4" />
                </video>
              </div>
              <ServiceCategory
                title="Solutions"
                titleLink="#"
                items={servicesCol1}
                onItemClick={closeServicesDropdown}
              />
              <ServiceCategory
                title=""
                titleLink=""
                items={servicesCol2}
                onItemClick={closeServicesDropdown}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      {(open || isMobileMenuClosing) && (
        <>
          {/* Backdrop - z above sticky nav (z-1000) so it covers it on mobile */}
          <div
            className="lg:hidden fixed inset-0 z-[1100]"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeMobileMenu}
          />

          {/* Drawer - z above backdrop and sticky nav */}
          <nav
            className={`lg:hidden fixed top-0 right-0 bottom-0 w-[80%] max-w-md bg-white shadow-2xl z-[1110] overflow-y-auto overscroll-contain flex flex-col ${
              isMobileMenuClosing ? 'animate-slideLeft' : 'animate-slideRight'
            }`}
          >
            {/* Header (sticky inside drawer so it stays visible while scrolling) */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 p-4 border-b border-gray-200 bg-white">
              <img src={logo} alt="Creatrend" className="h-8 w-auto" />

              <button
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="hover:bg-gray-100 transition-colors"
              >
                <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>



            {/* Navigation Items - bottom padding so all items remain visible / scrollable */}
            <div className="flex-1 pb-10">
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  aria-expanded={mobileServicesOpen}
                  className="w-full flex items-center justify-between px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Solutions</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ease-in-out ${mobileServicesOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#898989"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {mobileServicesOpen && (
                  <div className="bg-[#F7F8F9] px-4 py-3 space-y-4">
                    <div className="mb-0">
                      <div className="space-y-1">
                        {servicesCol1.map(({ heading, desc, to, icon, alt }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={closeMobileMenu}
                            className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-white transition-colors"
                          >
                            <img src={icon} alt={alt} className="w-5 h-5 mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-black">{heading}</h4>
                              <p className="text-xs text-[#6A6A70] leading-snug">{desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="space-y-1">
                        {servicesCol2.map(({ heading, desc, to, icon, alt }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={closeMobileMenu}
                            className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-white transition-colors"
                          >
                            <img src={icon} alt={alt} className="w-5 h-5 mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-black">{heading}</h4>
                              <p className="text-xs text-[#6A6A70] leading-snug">{desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/pricing"
                onClick={closeMobileMenu}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/for-brands"
                onClick={closeMobileMenu}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                For Brands
              </Link>
              <Link
                to="/for-creators"
                onClick={closeMobileMenu}
                className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                For Creators
              </Link>

              {/* Action Buttons */}
              <div className="px-6 space-y-3 mt-4">
                {/* Book A Call - always visible (matches desktop behavior) */}
                <ActionButton
                  label="Book A Call"
                  onClick={() => {
                    handleActionClick();
                    closeMobileMenu();
                  }}
                />

                {!isLoggedIn ? (
                  <>
                    {/* Login Dropdown */}
                    <div>
                      <SelectDropdown
                        label="Login"
                        className="bg-white border border-gray-300 rounded-full"
                        btnClassName="h-12"
                        liClassName="p-0!"
                        items={[
                          <Link
                            to="/login/brand"
                            className="flex gap-2 px-5 py-3"
                            onClick={closeMobileMenu}
                          >
                            <BrandIcon />
                            <div>
                              <h5 className="font-bold">I'm a brand</h5>
                              <p className="text-[12px]">Connect with creators</p>
                            </div>
                          </Link>,
                          <Link
                            to="/login/creator"
                            className="flex gap-2 px-5 py-3"
                            onClick={closeMobileMenu}
                          >
                            <CreatorIcon />
                            <div>
                              <h5 className="font-bold">I'm a creator</h5>
                              <p className="text-[12px]">Monetise your content</p>
                            </div>
                          </Link>,
                        ]}
                        trigger="click"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to={userHomeRoute}
                      onClick={closeMobileMenu}
                      className="w-full rounded-2xl bg-[#1E60DB26] px-4 py-3 flex items-center gap-3"
                    >
                      <LandingUserAvatar
                        avatarUrl={headerUser.avatarUrl}
                        initials={headerUser.initials}
                        variant="mobile"
                      />
                      <div className="leading-tight">
                        <div className="text-sm font-medium text-black">{headerUser.displayName}</div>
                        <div className="text-xs text-gray-500 capitalize">{headerUser.roleLabel}</div>
                      </div>
                    </Link>

                    <LogoutButton className="w-full py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Logout
                    </LogoutButton>
                  </>
                )}
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
