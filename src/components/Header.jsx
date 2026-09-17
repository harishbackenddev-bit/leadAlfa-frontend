import { useState } from "react";
import {
  ChevronDown,
  ArrowUpRight,
  X,
  Menu,
} from "lucide-react";

import logo from "../imports/ct-logo.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#F5F5F5] border-t border-[#B8D4D6] sticky top-0 z-50"
      style={{ fontFamily: "manrope" }} >
      <div className="max-w-[1600px] mx-auto px-5 lg:px-12 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Creatrend"
            className="h-10 lg:h-[62px] w-auto"
          />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center ml-10">
            <div className="flex items-center gap-12">
              <button className="flex items-center gap-2 text-[18px] text-[#111827]">
                Services
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              </button>

              <a href="#pricing" className="text-[18px] text-[#111827]">
                Pricing
              </a>

              <a href="#creators" className="text-[18px] text-[#111827]">
                For Creators
              </a>
            </div>

            <button className="ml-8 h-14 rounded-full bg-[#007BC4] pl-6 pr-3 flex items-center gap-4 text-white">
              <span className="text-[16px] font-medium">
                Book A Call
              </span>

              <div className="w-10 h-10 rounded-full bg-[#1C94D9] flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </button>
          </nav>
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-6">
          <button className="h-14 px-8 rounded-full border border-[#BFC5CE] flex items-center gap-3">
            <span className="text-[18px] text-[#374151]">
              Login
            </span>
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          </button>

          <button className="h-14 rounded-full bg-[#007BC4] pl-6 pr-3 flex items-center gap-4 text-white">
            <span className="text-[16px] font-medium">
              Get Started
            </span>

            <div className="w-10 h-10 rounded-full bg-[#1C94D9] flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col p-6 gap-5">

            <button className="flex items-center justify-between text-left">
              Services
              <ChevronDown className="w-4 h-4" />
            </button>

            <a href="#pricing">Pricing</a>

            <a href="#creators">For Creators</a>

            <button className="w-full border border-[#BFC5CE] rounded-full py-4">
              Login
            </button>

            <button className="w-full bg-[#007BC4] text-white rounded-full py-4">
              Get Started
            </button>

          </div>
        </div>
      )}
    </header>
  )
}

