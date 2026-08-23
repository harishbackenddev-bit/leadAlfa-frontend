import nikeLogo from "../../../assets/images/brands/nikeLogo.png";

/** Static fallback until creator brand-profile API is available. */
export const brandProfileDummyData = {
  id: "dummy",
  companyName: "Nike",
  brandLogo: nikeLogo,
  isVerified: true,
  industries: ["Fashion & Apparel", "Fitness & Health"],
  location: "Johannesburg, South Africa",
  description:
    "Nike is a global leader in athletic footwear, apparel, equipment, and accessories. We partner with talented content creators to bring authentic stories that inspire athletes worldwide.",
  website: "https://www.nike.com",
  stats: {
    totalCampaigns: 47,
    activeCreators: 234,
    averageRating: 4.8,
    totalInvestment: "R 2.4M",
  },
};

export function getBrandProfileDummy(brandId) {
  return {
    ...brandProfileDummyData,
    id: brandId || brandProfileDummyData.id,
  };
}
