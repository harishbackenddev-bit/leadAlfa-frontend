import { HeroSection } from "../../components/solution2/HeroSection";
import { MarketplacesSection } from "../../components/solution2/MarketplacesSection";
import { WhyUGCSection } from "../../components/solution2/WhyUGCSection";
import ResultSection from "../../components/solution2/ResultsSection";

const Solution2 = () => {
  return (
    <main className="bg-white text-[#101727]">
      <HeroSection />
      <WhyUGCSection />
      <MarketplacesSection />
      <ResultSection />
    </main>
  );
};

export default Solution2;