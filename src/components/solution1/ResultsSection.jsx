import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../common/ActionButton";

export function ResultsSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-[#0c7bb3] to-[#1E5BA8] py-14 sm:py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[840px] px-6 text-center sm:px-8 lg:px-12"
      >
        <h2 className="text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-white sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
          The Numbers Speak for Themselves
        </h2>

        <p className="mx-auto mt-6 max-w-[640px] text-[15px] leading-[1.8] text-white/90 sm:text-[16px]">
          We drive numbers, the new sweet on our sure creator promise to copre the brands learning and sign-up. Explore creators for free today.
        </p>

        <div className="mt-9 flex justify-center">
          <ActionButton
            label="Explore creators for free today"
            onClick={() => navigate("/login")}
            variant="secondary"
            showArrow={false}
          />
        </div>
      </motion.div>
    </section>
  );
}
