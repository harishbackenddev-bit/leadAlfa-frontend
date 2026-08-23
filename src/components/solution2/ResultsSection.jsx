import { useNavigate } from "react-router-dom";

import Industries from "../../components/portfolio/Home/Industries";
import VideoGrid from "../../components/portfolio/caseStudies/VideosSection";
import ActionButton from "../../components/common/ActionButton";

export default function ResultSectionglobal() {
  const navigate = useNavigate();

  return (
    <section className="bg-primary pt-14 pb-10 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <h2 className="text-center text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
          Ready to Turn Your Customers
          <br className="hidden sm:block" /> Into Your{" "}
          <span className="mark font-bold text-[#0c7bb3]">Best Marketers?</span>
        </h2>

        <div className="mt-12">
          <Industries />
        </div>

        <VideoGrid />

        <div className="flex justify-center">
          <ActionButton
            label="Explore Creators Now"
            onClick={() => navigate("/for-creators")}
          />
        </div>
      </div>
    </section>
  );
}
