import { Link } from "react-router-dom";
import logo from "../../../assets/images/portfolio/main/LOGO-LA1-01.png";

export default function BlogHeader() {
  return (
    <header className="w-full">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-b from-[#0C52D4] to-[#6094F4] text-white text-center py-3 px-4 text-sm">
        <span>
          You can now hire talented creators in the UK, Canada, and Australia!{" "}
          <Link to="#" className="underline font-medium hover:text-blue-100">
            Learn more
          </Link>
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white py-4">
        <div className="max-w-[91vw] mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="block"
          >
            <img src={logo} alt="Creatrend Logo" className="h-12 md:h-22" />
          </Link>

          {/* Get In Touch Button */}
          <Link
            to="/contact"
            className="bg-[#1E60DB] text-white pl-3 pr-1 py-1 md:pl-6 md:pr-2 md:py-2 rounded-full flex items-center gap-1.5 md:gap-3 hover:bg-[#1A54C4] transition-colors text-[10px] md:text-sm font-medium"
          >
            Get In Touch
            <span className="bg-[#4C86F3] rounded-full p-1.5 md:p-2.5 flex items-center justify-center">
              <svg
                className="w-3 h-3 md:w-[18px] md:h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
