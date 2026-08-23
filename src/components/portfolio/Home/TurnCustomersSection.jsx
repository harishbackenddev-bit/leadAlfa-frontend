import { useNavigate } from "react-router-dom";

import Industries from "./Industries";
import VideoGrid from "../caseStudies/VideosSection";
import ActionButton from "../../common/ActionButton";

export default function TurnCustomersSection() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="bg-primary px-6 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-10 text-center text-[26px] font-bold leading-[1.25] tracking-[-0.02em] text-[#1A1A1A] sm:text-[32px] lg:text-[40px]">
            Ready to Turn Your Customers
            <br className="hidden sm:block" /> Into Your{" "}
            <span className="text-[#0c7bb3]">Best Marketers?</span>
          </h2>

          <Industries />
          <VideoGrid />

          <div className="mt-10 flex justify-center lg:mt-14">
            <ActionButton
              label="Get a free trial video"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
