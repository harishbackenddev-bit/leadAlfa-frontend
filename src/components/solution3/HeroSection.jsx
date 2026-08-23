import { motion } from "motion/react";
import { Smartphone, TrendingUp, Users, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../common/ActionButton";
import CreatorReel from "../portfolio/for-creators/CreatorReel";
import agencyReel from "../../assets/videos/agency-hero.mp4";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <section className="overflow-x-clip bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-6 sm:gap-12 sm:px-8 sm:pb-16 lg:grid-cols-2 lg:px-12 lg:pb-20 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[28px] font-bold leading-[1.18] tracking-[-0.025em] text-[#101727] sm:text-[40px] sm:leading-[1.16] lg:text-[46px]">
              Scale Your Marketing Agency with High-Converting UGC
            </h1>

            <p className="mt-6 max-w-[640px] text-[15px] leading-[1.8] text-[#606977] sm:text-[16px]">
              Stop letting creative bottlenecks cap your agency's growth...
            </p>

            <p className="max-w-[640px] text-[15px] leading-[1.8] text-[#606977] sm:text-[16px]">
              Whether you want to offer a brand-new service...
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <ActionButton
                label="Explore Creators for Free"
                onClick={() => navigate("/for-creators")}
                className="min-w-[232px]"
              />
              <ActionButton
                label="Book A Call"
                onClick={() => navigate("/book-a-call")}
                variant="secondary"
                arrow_bg="#0c7bb3"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <CreatorReel
              videoSrc={agencyReel}
              creator="South African creator"
              description="filming a UGC ad for an agency client"
              className="w-full max-w-[360px]"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#FCE7F3] py-4 text-black">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 text-center sm:px-8 md:gap-x-8 lg:px-12">
          <span className="text-sm font-semibold">1000+ Verified creators</span>
          <span className="hidden h-4 w-px bg-black/10 md:block" aria-hidden="true" />
          <span className="text-sm">100+ Brands have already signed up</span>
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
