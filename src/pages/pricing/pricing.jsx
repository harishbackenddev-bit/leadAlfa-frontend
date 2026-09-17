import { useState } from "react";
import ConfidentContentCreation from "../../components/pricing/ConfidentContentCreation";
import PricingHeroSection from "../../components/pricing/PricingHero";
import PricingPackages from "../../components/pricing/PricingPackages";
import WhyTrustCreatrend from "../../components/pricing/WhySABrandsTrustCreatrend ";
import ZeroGhostingPolicy from "../../components/pricing/ZeroGhostingPolicy";
import Campaignconfiguration from "../../components/pricing/CampaignConfigurator";
import PricingCTA from "../../components/pricing/PricingCta";
import TurnCustomersSection from "../../components/portfolio/Home/TurnCustomersSection";
import Header from "../../components/Header"
import Footer from "../../components/Footer"

const Pricing = () => {
  const [packageId, setPackageId] = useState("standard");

  return (
    <div>
      <PricingHeroSection />
      <WhyTrustCreatrend />
      <ZeroGhostingPolicy />
      <ConfidentContentCreation />
      <PricingPackages onConfigure={setPackageId} />
      <Campaignconfiguration packageId={packageId} onPackageChange={setPackageId} />
      <TurnCustomersSection />
      <PricingCTA />
    </div>
  );
};

export default Pricing;