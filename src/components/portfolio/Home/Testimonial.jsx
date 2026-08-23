// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import logo_1 from "../../../assets/images/portfolio/testimonial/img-1.png";
import logo_2 from "../../../assets/images/portfolio/testimonial/img-2.png";
import logo_3 from "../../../assets/images/portfolio/testimonial/img-3.png";
import logo_4 from "../../../assets/images/portfolio/testimonial/img-4.png";
import logo_5 from "../../../assets/images/portfolio/testimonial/img-5.png";
import logo_6 from "../../../assets/images/portfolio/testimonial/img-6.png";
import logo_7 from "../../../assets/images/portfolio/testimonial/img-7.png";
import logo_8 from "../../../assets/images/portfolio/testimonial/img-8.png";
import logo_9 from "../../../assets/images/portfolio/testimonial/img-9.png";
import logo_10 from "../../../assets/images/portfolio/testimonial/img-10.png";

export default function Testimonial() {
  const logoList = [
    { url: logo_1, alt: "flipbox" },
    { url: logo_2, alt: "flipbox" },
    { url: logo_3, alt: "flipbox" },
    { url: logo_4, alt: "flipbox" },
    { url: logo_5, alt: "flipbox" },
    { url: logo_6, alt: "flipbox" },
    { url: logo_7, alt: "flipbox" },
    { url: logo_8, alt: "flipbox" },
    { url: logo_9, alt: "flipbox" },
    { url: logo_10, alt: "flipbox" },
  ];

  // ✅ Reusable Marquee Component
  const Marquee = ({ direction = "left", speed = 20, gap = "gap-10 sm:gap-16" }) => {
    const animation =
      direction === "left"
        ? { x: ["0%", "-100%"] }
        : { x: ["-100%", "0%"] };

    return (
      <div className="relative overflow-hidden">
        <motion.div
          className={`flex ${gap}`}
          animate={animation}
          transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        >
          {[...logoList, ...logoList].map((element, idx) => (
            <img
              key={idx}
              src={element.url}
              alt={element.alt}
              className="h-12 sm:h-20 object-contain flex-shrink-0"
            />
          ))}
        </motion.div>

        {/* Left gradient overlay */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        {/* Right gradient overlay */}
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    );
  };

  return (
    <div className="relative bg-white py-[5vh] overflow-hidden">
      {/* Title */}
      <h5 className="text-center text-[#444a46] font-light text-[13px] md:text-lg mb-6">
        Some of our partners
      </h5>

      {/* Example usage with different speed + gap */}
      <Marquee direction="left" speed={50} gap="gap-10 sm:gap-15" />
      <Marquee direction="right" speed={50} gap="gap-10 sm:gap-15" />
      <Marquee direction="left" speed={50} gap="gap-10 sm:gap-15" />
    </div>
  );
}
