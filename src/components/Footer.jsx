import { Link } from "react-router-dom";

import logo from "../imports/ct-logo.png";

import ozow from "../assets/images/footerpayment/ozow.png";
import payJustNow from "../assets/images/footerpayment/payjustnow.png";
import snapScan from "../assets/images/footerpayment/snapscan.png";
import visa from "../assets/images/footerpayment/visa.png";
import mastercard from "../assets/images/footerpayment/mastercard-removebg-preview.png";
import tradeSafe from "../assets/images/footerpayment/tradesafe.png";

// every file is 80 tall — the widths below drive flex-grow, so the row splits on them without waiting for the images
const paymentLogos = [
    { src: visa, alt: "Visa", width: 120 },
    { src: mastercard, alt: "Mastercard", width: 134 },
    { src: ozow, alt: "Ozow", width: 248 },
    { src: snapScan, alt: "SnapScan", width: 380 },
    { src: payJustNow, alt: "PayJustNow", width: 244 },
    { src: tradeSafe, alt: "TradeSafe", width: 336 },
];

const footerColumns = [
    {
        title: "Solutions",
        items: [
            { label: "Apps", to: "/apps" },
            { label: "Agencies", to: "/agencies" },
            { label: "eCommerce", to: "/ecommerce" },
            { label: "For Creators", to: "/for-creators" },
        ],
    },
    {
        title: "Resources",
        items: [
            { label: "What is UGC?", to: "/ugc" },
            { label: "Our Work", to: "/case-studies" },
            { label: "Blogs", to: "/blogs" },
            { label: "Masterclass", to: "/masterclass" },
            { label: "Affiliate program", to: "/affilate-program" },
        ],
    },
    {
        title: "Follow Us",
        items: [
            {
                label: "Instagram",
                href: "https://www.instagram.com/creatrend.za?igsh=MW13N203NWhybTR1eQ%3D%3D&utm_source=qr",
            },
            { label: "TikTok", href: "https://www.tiktok.com/@creatrend.za?_r=1&_t=ZS-95SVUcnCykG" },
            { label: "Facebook", href: "https://www.facebook.com/" },
            { label: "LinkedIn", href: "https://www.linkedin.com/company/creatrend/" },
            { label: "X", href: "https://x.com/creatrend_za?s=11&t=7v7jTjfx6LicKrQMe_SzSA" },
            { label: "Threads", href: "https://www.threads.com/@creatrend.za?igshid=NTc4MTIwNjQ2YQ==" },
        ],
    },
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
    {
        title: "FAQs",
        items: [
            { label: "FAQ's Brands", to: "/faqs-brands" },
            { label: "FAQ's Creators", to: "/faqs-creators" },
        ],
    },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-black text-white px-[6vw]"
            style={{ fontFamily: 'manrope' }}>
            <div className="flex flex-wrap justify-between gap-2 md:gap-4! py-[7vh] pb-2">
                {footerColumns.map((section, colIdx) => (
                    <div key={section.title} className="flex-1 min-w-[150px] space-y-4">
                        <div>
                            <h4 className="text-gray-400 text-xs mb-3">{section.title}</h4>
                            <ul className="space-y-2 text-xs">
                                {section.items.map((item) => (
                                    <li key={item.label}>
                                        {"to" in item ? (
                                            <Link
                                                to={item.to}
                                                onClick={() =>
                                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                                }
                                                className="text-white hover:underline"
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white hover:underline"
                                            >
                                                {item.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Solutions is the shortest column — the strip fills its dead space instead of sitting below the whole row */}
                        {colIdx === 0 && (
                            <div>
                                <h4 className="text-gray-400 text-xs mb-3">We Accept:</h4>
                                <ul className="flex gap-0.5">
                                    {paymentLogos.map((logo) => (
                                        <li
                                            key={logo.alt}
                                            style={{ flex: `${logo.width} 1 0%` }}
                                            className="min-w-0 bg-white p-0.5"
                                        >
                                            <img
                                                src={logo.src}
                                                alt={logo.alt}
                                                width={logo.width}
                                                height={80}
                                                loading="lazy"
                                                className="block w-full"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}

                <div className="flex-1 min-w-[200px] mt-6 md:mt-0!">
                    <img src={logo} alt="Creatrend" className="w-18 h-auto -mt-3 mb-3" />
                    <p className="text-xs"><a href="mailto:hello@creatrend.co.za" className="hover:underline">
                        hello@creatrend.co.za
                    </a></p>
                    <div className="text-xs mb-3!">
                        <a href="tel:+27 784558222" className="block pb-1 pt-1">+27 784558222</a>
                        <div>
                        1st Floor <br />
                        Constantia Emporium <br />
                        c/o Ladies Mile & Spaanschemat River Road, Constantia, Cape Town, <br /> 7806 ,
                        South Africa
                        </div>
                    </div>

                </div>
            </div>
            <div className="text-center pt-6 pb-4">
                <p className="text-gray-400 text-sm">© {year} Creatrend (PTY) LTD Company number 2025/465256</p>
            </div>
        </footer>
    )
}
