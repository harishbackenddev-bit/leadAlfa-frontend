import { motion } from "motion/react";
import creatorImg from "../../imports/first.png";
import strategyImg from "../../imports/second.png";
import editingImg from "../../imports/third.png";
import trackingImg from "../../imports/fourth.png";

const STEPS = [
  {
    image: creatorImg,
    title: "Creator Matching",
    description: "Narrow your use cases. Filter by niche, location, and key performance indicators, guided by data-small charts.",
  },
  {
    image: strategyImg,
    title: "Content Strategy",
    description: "View exact demographics, age, followers and optimise authentic, data monetary and branding graph.",
  },
  {
    image: editingImg,
    title: "Precision Editing",
    description: "Clients check before mechamics Approve videos. Discuss optimise includes.",
  },
  {
    image: trackingImg,
    title: "Performance Tracking",
    description: "Live performance powerups that track campaign and overall growth.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-center sm:text-[36px] sm:leading-[1.2] lg:text-[42px]"
        >
          A Data-Driven Approach to Creator Ads
        </motion.h2>

        <div className="mx-auto mt-10 grid max-w-[1240px] grid-cols-1 gap-7 md:grid-cols-2">
          {STEPS.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-5 rounded-[20px] border border-[#E4E6EB] bg-gradient-to-br from-gray-50 to-white p-7 transition-shadow hover:shadow-md sm:p-8"
            >
              <span className="text-[28px] font-bold leading-none text-[#0c7bb3]" aria-hidden="true">
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.85] text-[#606977] sm:text-[15px]">
                  {step.description}
                </p>
              </div>

              <img
                src={step.image}
                alt=""
                className="hidden h-20 w-24 shrink-0 object-contain sm:block"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
