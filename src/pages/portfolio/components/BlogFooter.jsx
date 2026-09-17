import logo from "../../../assets/images/portfolio/main/LOGO-LA1-01.png";

export default function BlogFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#F5F5F5] pt-6 pb-4">
      <div className="max-w-[90vw] mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Creatrend Logo" className="h-12 md:h-22" />
        </div>

        {/* Tagline */}
        <p className="text-gray-600 text-sm mb-4">
          Excel on paid social with authentic creator videos.
        </p>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-4" />

        {/* Copyright */}
        <p className="text-gray-500 text-xs">
          © {year} By LeadsAlpha. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
