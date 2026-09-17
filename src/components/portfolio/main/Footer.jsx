import { Link } from "react-router-dom";
import logo from "../../../assets/SVGs/creator/HeaderLogo.svg";

const footerColumns = [
  {
    groups: [
      {
        title: "Solutions",
        items: [
          { label: "Apps", to: "/services" }, // ?
          { label: "Agencies", to: "/services" }, // ?
          { label: "eCommerce", to: "/services" }, // ?
          { label: "For Creators", to: "/#" }, // ?
        ],
      },
      {
        title: "Media",
        items: [
          { label: "TikTok", to: "/tiktok-video-ads" },
          { label: "Facebook", to: "/facebook-video-ads" },
          { label: "Instagram", to: "/instagram-video-ads" },
          // { label: "Other", to: "#" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: "Resources",
        items: [
          { label: "What is UGC?", to: "/ugc" },
          { label: "Case Studies", to: "/case-studies" },
          { label: "Blogs", to: "/blogs" },
          { label: "Masterclass", to: "/masterclass" },
          { label: "Affiliate program", to: "/affilate-program" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: "Follow Us",
        items: [
          {
            label: "Instagram",
            href: "https://www.instagram.com/creatrend.za?igsh=MW13N203NWhybTR1eQ%3D%3D&utm_source=qr",
            
          },
          {
            label: "TikTok",
            href: "https://www.tiktok.com/@creatrend.za?_r=1&_t=ZS-95SVUcnCykG",
          },
          { label: "Facebook", href: "https://www.facebook.com/" },
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/company/creatrend/",
          },
          { label: "X", href: "https://x.com/creatrend_za?s=11&t=7v7jTjfx6LicKrQMe_SzSA" },
          { label: "Threads", href: "https://www.threads.com/@creatrend.za?igshid=NTc4MTIwNjQ2YQ==" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: "Company",
        items: [
          { label: "About Us", to: "/about" },
          { label: "Contact Us", to: "/contact-us" },
          { label: "Site Notice", to: "/site-notice" },
          { label: "Refund Policy", to: "/refund-policy" },
          { label: "Privacy Policy", to: "/privacy-policy" },
          { label: "Careers", to: "/careers" },
          { label: "T&Cs - Creators", to: "/terms-conditions-creators" },
          { label: "T&Cs - Brands", to: "/terms-conditions" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: "FAQs",
        items: [
          { label: "FAQ's Brands", to: "/faqs-brands" },
          { label: "FAQ's Creators", to: "/faqs-creators" },
        ],
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 font-sans px-[6vw] ">
      <div className="flex flex-wrap justify-between gap-2 md:gap-4! py-[7vh] pb-2">
        {/* Auto-generated Columns */}
        {footerColumns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-[150px] space-y-4">
            {col.groups.map((section, secIdx) => (
              <div key={secIdx}>
                <h4 className="text-[#6A6A70] text-xs mb-3">{section.title}</h4>
                <ul className="space-y-2 text-xs">
                  {section.items.map((item, i) => {
                    if (item.to) {
                      return (
                        <li key={i}>
                          <Link
                            to={item.to}
                            onClick={() =>
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            className="hover:underline"
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    }
                    if (item.href) {
                      return (
                        <li key={i}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}

        {/* Brand Section */}
        <div className="flex-1 min-w-[200px] mt-6 md:mt-0!">
          <div className="flex items-center gap-2 mb-3 -mt-3">
            <img src={logo} alt="Creatrend" className="w-18 h-auto" />
          </div>
          <p className="text-xs mb-3">
            ©️ 2026 Creatrend (PTY) LTD Company number 2025/465256

          </p>
          <p className="text-xs"><a href="mailto:hello@creatrend.co.za" className="hover:underline">
            hello@creatrend.co.za
          </a></p>
          <p className="text-xs mb-3">
            <a href="tel:+27 784558222">+27 784558222</a> <br />
            Cape Town, South Africa
          </p>

        </div>
      </div>
      <div className="text-center pb-4">
        <p className="text-[#6A6A70] text-sm">©️ 2026 Creatrend (PTY) LTD Company number 2025/465256</p>
      </div>
    </footer>
  );
};

export default Footer;
