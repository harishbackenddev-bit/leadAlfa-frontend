import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../common/ActionButton";
import CreatorReel from "../portfolio/for-creators/CreatorReel";
import heroReel from "../../assets/videos/ecommerce-hero.mp4";

const BENEFITS = [
  "Drive traffic to Amazon storefronts",
  "Drive traffic to Takealot storefronts",
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <section className="overflow-x-clip bg-[#F7F8F9]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-6 sm:gap-12 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:px-12 lg:pb-20 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[28px] font-bold leading-[1.18] tracking-[-0.025em] text-[#101727] sm:text-[40px] sm:leading-[1.16] lg:text-[46px]">
              Effective Creator Ads With High-ROAS For E-Commerce Brands
            </h1>

            <p className="mt-6 max-w-[640px] text-[15px] leading-[1.8] text-[#606977] sm:text-[16px]">
              Elevate your e-commerce marketing strategy with innovative, on-demand creator advertisements meticulously crafted to align with your brand's vision. Powered by comprehensive analytics, from selection to editing.
            </p>

            <ul className="mt-7 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-[15px] text-[#101727]">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0c7bb3]"
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <ActionButton
              label="Explore Creators for Free"
              onClick={() => navigate("/login")}
              className="mt-9"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <CreatorReel
              videoSrc={heroReel}
              creator="South African creator"
              description="filming a high-ROAS e-commerce ad"
              framed
              className="w-full max-w-[360px]"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-pink-100 py-4">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 text-center text-sm sm:px-8 md:text-base lg:px-12">
          <span className="font-semibold text-[#101727]">1000+ Verified creators</span>
          <span className="text-[#606977]" aria-hidden="true">|</span>
          <span className="font-semibold text-[#101727]">100+ Brands have already signed up</span>
        </div>
      </section>
    </>
  );
}
