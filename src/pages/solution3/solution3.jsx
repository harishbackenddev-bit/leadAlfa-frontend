import { MarketplacesSection } from "../../components/solution3/MarketplacesSection";
import { WhyUGCSection } from "../../components/solution3/WhyUGCSection";
import { HeroSection } from "../../components/solution3/HeroSection";
import ResultSection from "../../components/solution2/ResultsSection";

const Solution3 = () => {
  return (
    <main className="bg-white text-[#101727]">
      <HeroSection />
      <WhyUGCSection />
      <MarketplacesSection />
      <ResultSection />
    </main>
  );
};

export default Solution3;
