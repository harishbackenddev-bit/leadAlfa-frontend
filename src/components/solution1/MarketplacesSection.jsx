import { motion } from "motion/react";
import amazonImage from "../../imports/solution1image.PNG";
import takealotImage from "../../imports/solution1image2.PNG";

const MARKETPLACES = [
  {
    name: "Takealot",
    badge: "bg-[#F5A6D6]",
    background: "from-blue-50 to-purple-50",
    title: "Drive Traffic to Your Takealot Storefront",
    body: "Take your viral content that your social media audience produces, lower your Customer Acquisition Cost (CAC), and significantly boost your Visibility on Takealot.",
    image: takealotImage,
    imageAlt: "Takealot storefront product listing with creator",
    imageClass: "",
  },
  {
    name: "Amazon",
    badge: "bg-[#0c7bb3]",
    background: "from-pink-50 to-purple-50",
    title: "Drive Traffic to Your Amazon Storefront",
    body: "Optimize your Amazon business expansion. Customer Acquisition Cost (CAC) and lower costs increase your Return on Ad Spend (ROAS).",
    image: amazonImage,
    imageAlt: "Amazon storefront product listing with creator",
    imageClass: "-translate-y-3",
  },
];

export function MarketplacesSection() {
  return (
    <section id="solutions" className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-7 md:grid-cols-2">
          {MARKETPLACES.map((market, index) => (
            <motion.article
              key={market.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={`flex h-full flex-col rounded-[20px] bg-gradient-to-br p-7 sm:p-8 ${market.background}`}
            >
              <span
                className={`inline-flex w-fit items-center rounded-lg px-3 py-1.5 text-sm font-medium text-white ${market.badge}`}
              >
                {market.name}
              </span>

              <h3 className="mt-4 text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">
                {market.title}
              </h3>

              <p className="mt-3 text-[14px] leading-[1.85] text-[#606977] sm:text-[15px]">
                {market.body}
              </p>

              <div className="mt-auto overflow-hidden rounded-xl pt-4">
                <img
                  src={market.image}
                  alt={market.imageAlt}
                  className={`h-auto w-full ${market.imageClass}`}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
