import { motion } from "motion/react";
import CreatorLocationCard from "../common/CreatorLocationCard";
import ugcReel from "../../assets/videos/ecommerce-ugc.mp4";

export function WhyUGCSection() {
  return (
    <section className="overflow-x-clip bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
              Why UGC is the Secret to E-Commerce Success in South Africa
            </h2>

            <p className="mt-6 max-w-[680px] text-[15px] leading-[1.8] text-[#606977]">
              South African consumer habits have certainly evolved. Shoppers
              research on TikTok and Instagram long before they reach your
              product page, and they trust a real person holding the product far
              more than a studio shot.
            </p>

            <p className="mt-4 max-w-[680px] text-[15px] leading-[1.8] text-[#606977]">
              User-Generated Content bridges that trust gap. It lowers your
              Customer Acquisition Cost (CAC) and significantly boosts Return On
              Ad Spend (ROAS).
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-end"
          >
            <CreatorLocationCard video={ugcReel} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
