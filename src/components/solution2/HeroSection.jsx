import { motion } from "motion/react";
import { Smartphone, TrendingUp, Users, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../common/ActionButton";
import CreatorReel from "../portfolio/for-creators/CreatorReel";
import appReel from "../../assets/videos/IMG_7907.MP4";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <section className="overflow-x-clip bg-[#F7F8F9]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-6 sm:gap-12 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:px-12 lg:pb-20 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[28px] font-bold leading-[1.18] tracking-[-0.025em] text-[#101727] sm:text-[40px] sm:leading-[1.16] lg:text-[46px]">
              Elevate Your South African App Marketing: Harness the Power of Data-Driven Advertisements
            </h1>

            <p className="mt-6 max-w-[640px] text-[15px] leading-[1.8] text-[#606977] sm:text-[16px]">
              In the highly competitive South African mobile app market, standing out takes more than just a great product. Consumers are looking for authenticity, trust, and real-world proof before they hit "install." If you are struggling to break through the noise, it is time to revolutionize your user acquisition strategy.
            </p>

            <p className="max-w-[640px] text-[15px] leading-[1.8] text-[#606977] sm:text-[16px]">
              By leveraging local, relatable creators, you can supercharge your installations and slash your Cost Per Acquisition (CPA) with compelling creator videos—fuelled by real ad data from over 1,000 successful campaigns!
            </p>

            <ActionButton
              label="Explore Creators for Free"
              onClick={() => navigate("/for-creators")}
              className="mt-9 mx-auto sm:mx-0"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <CreatorReel
              videoSrc={appReel}
              creator="South African creator"
              description="filming a data-driven app marketing ad"
              className="w-full max-w-[360px]"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#FCE7F3] py-4 text-black">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 text-center sm:px-8 md:gap-x-8 lg:px-12">
          <span className="text-sm font-semibold">1000+ Verified creators</span>
          <span className="hidden h-4 w-px bg-black/10 md:block" aria-hidden="true" />
          <span className="text-sm">South Africa's most diverse creator network</span>
          <span className="hidden h-4 w-px bg-black/10 md:block" aria-hidden="true" />
          <span className="flex items-center gap-2" aria-hidden="true">
            <Smartphone className="h-4 w-4" />
            <TrendingUp className="h-4 w-4" />
            <Users className="h-4 w-4" />
            <Target className="h-4 w-4" />
            <Award className="h-4 w-4" />
          </span>
        </div>
      </section>
    </>
  );
}
