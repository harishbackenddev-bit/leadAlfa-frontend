import { HeroSection } from "../../components/solution1/HeroSection";
import { WhyUGCSection } from "../../components/solution1/WhyUGCSection";
import { MarketplacesSection } from "../../components/solution1/MarketplacesSection";
import { ProcessSection } from "../../components/solution1/ProcessSection";
import { ResultsSection } from "../../components/solution1/ResultsSection";
import TurnCustomersSection from "../../components/portfolio/Home/TurnCustomersSection";

export default function Solution1() {
  return (
    <main className="bg-white text-[#101727]">
      <HeroSection />
      <WhyUGCSection />
      <MarketplacesSection />
      <ProcessSection />
      <TurnCustomersSection />
      <ResultsSection />
    </main>
  );
}
