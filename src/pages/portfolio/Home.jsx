import { useNavigate } from "react-router-dom";

import HowItWorksVideo from "../../assets/videos/portfolio/main/howItWorksReel.mp4";

import HeroSection from "../../components/portfolio/Home/HeroSection";
import CreatorStrip from "../../components/portfolio/Home/CreatorStrip";
import TurnCustomersSection from "../../components/portfolio/Home/TurnCustomersSection";
import { WhyChooseUsSA } from "../../components/portfolio/Home/WhyChooseUsSA";
import HowItWorksCard from "../../components/common/HowItWorksCard";
import ProblemComparison from "../../components/portfolio/Home/ProblemComparison";
import WhoItsFor from "../../components/portfolio/Home/WhoItsFor";
import BriefToLiveAd from "../../components/portfolio/Home/BriefToLiveAd";
import BrandTestimonials from "../../components/portfolio/Home/BrandTestimonials";
import ReplaceRetainerCTA from "../../components/portfolio/Home/ReplaceRetainerCTA";
import FAQ from "../../components/portfolio/Home/FAQ";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="bg-primary">
        <HeroSection />
      </section>

      <CreatorStrip />

      <section>
        <WhyChooseUsSA />
      </section>

      <section className="bg-[#FCFBFB] mt-8">
        <HowItWorksCard
          title={
            <>
              How It Works
            </>
          }
          subtitle={<>Your Next Ad Campaign in  <span className="text-[#0c7bb3]">4 Steps</span>
          </>}
          steps={[
            {
              title: "Create Your Account",
              description:
                "Getting started is quick and easy. Create your account by signing up with your basic details, verify your email, and you’re all set.",
            },
            {
              title: "Create Your Brief",
              description:
                "Tell us what you need. Unboxing, testimonials, lifestyle shots, or specific TikTok trends.",
            },
            {
              title:
                "Match with Creators",
              description:
                "Our platform instantly matches you with South African creators who fit your brand vibe and demographics",
            },
            {
              title: "Approve & Download",
              description:
                "Receive your authentic video assets. Request edits if needed, then download and launch your ads. ",
            },
          ]}
          file={HowItWorksVideo}
          poster={HowItWorksVideo}
          stepVariant="outline"
          buttonLabel="Get started"
          buttonPlacement="outside"
          buttonAlign="center"
          onButtonClick={() => navigate("/signup")}
          mediaSide="right"
          mediaWidth={50}
          shadow={false}
        />
      </section>

      <TurnCustomersSection />

      <section>
        <ProblemComparison />
      </section>

      <section>
        <WhoItsFor />
      </section>

      <section>
        <BriefToLiveAd />
      </section>

      <section>
        <BrandTestimonials />
      </section>

      <section>
        <ReplaceRetainerCTA />
      </section>

      <section>
        <FAQ />
      </section>
    </>
  );
}
