import { useNavigate } from "react-router-dom";

import localRelevanceIcon from "../../../assets/SVGs/portfolio/local_relavance.svg";
import usageRightsIcon from "../../../assets/SVGs/portfolio/usageRights.svg";
import speedScaleIcon from "../../../assets/SVGs/portfolio/speed&Scale.svg";
import ActionButton from "../../common/ActionButton";
import SectionHead from "./SectionHead";

const FEATURES = [
  {
    icon: localRelevanceIcon,
    title: "Local Relevance",
    body: "From Johannesburg to Cape Town, access creators who understand the local culture, slang, and trends",
  },
  {
    icon: speedScaleIcon,
    title: "Speed & Scale",
    body: "Get custom videos in days, not weeks. Scale your content output without scaling your stress",
  },
  {
    icon: usageRightsIcon,
    title: "100% Usage Rights",
    body: "No complex royalties. You own the content to run as ads, post organically, or use on your website",
  },
];

export const WhyChooseUsSA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-6 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1140px]">
        <SectionHead eyebrow="Why Choose Us" size="large">
          Why Brands are <span className="text-[#0c7bb3]">Switching to UGC</span>
        </SectionHead>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[12px] border border-[#E8EAEE] bg-white p-6 transition-shadow hover:shadow-md sm:p-7"
            >
              <img src={feature.icon} alt="" width={56} height={40} className="mb-5 h-10 w-auto" />
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] lg:text-[20px]">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-[#64748A]">{feature.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <ActionButton label="Switch Today" onClick={() => navigate("/login")} />
        </div>
      </div>
    </div>
  );
};
