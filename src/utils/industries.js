const INDUSTRIES = [
  {
    id: 5,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786030884/Beauty_Cosmetics_vkhj7y.png",
    title: "Cosmetics & Beauty",
    slug: "cosmetics-n-beauty",
    apiSlug: "beauty-cosmetics",
  },
  {
    id: 6,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786031110/Apps_Finance_sipcos.png",
    title: "Apps & Digital Services",
    slug: "apps-n-digital",
    apiSlug: "apps-digital-services",
  },
  {
    id: 4,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786031237/Apparel_Fashion_z8hfpv.png",
    title: "Apparel & Fashion",
    slug: "apparel-n-fashion",
    apiSlug: "apparel-fashion",
  },
  {
    id: 15,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786031157/property_sirim1.png",
    title: "Real Estate & Luxury Property Tech",
    slug: "real-estate-n-property",
    apiSlug: "real-estate-luxury-property-tech",
  },
  {
    id: 10,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786031038/Pets_efuzzi.png",
    title: "Pets",
    slug: "pets",
    apiSlug: "pets",
  },
  {
    id: 1,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1785952446/Health_Wellness_o88w9r.png",
    title: "Health & Wellness",
    slug: "health-n-wellness",
    apiSlug: "health-wellness",
  },
  {
    id: 11,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786030977/Technology_Gadgets_l3kz1t.png",
    title: "Technology & Gadgets",
    slug: "technology-n-gadgets",
    apiSlug: "technology-gadgets",
  },
  {
    id: 3,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1785952446/Children_Family_sonbco.png",
    title: "Children & Family",
    slug: "children-n-family",
    apiSlug: "children-family",
  },
  {
    id: 12,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786031067/Travel_Adventure_naxwtl.png",
    title: "Travel & Adventure",
    slug: "travel-n-adventure",
    apiSlug: "travel-adventure",
  },
  {
    id: 2,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1785952446/Food_Drink_wj0mae.png",
    title: "Food & Beverage",
    slug: "food-n-beverage",
    apiSlug: "food-drink",
  },
  {
    id: 13,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786031020/ProfessionalServices_rlyci3.png",
    title: "Professional Services",
    slug: "professional-services",
    apiSlug: "professional-services",
  },
  {
    id: 8,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786030919/Home_Lifestyle_nh5hii.png",
    title: "Home & Lifestyle",
    slug: "home-n-lifestyle",
    apiSlug: "home-lifestyle",
  },
  {
    id: 16,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786031171/app-settings_aosn7w.png",
    title: "Apps & Finance",
    slug: "apps-n-finance",
    apiSlug: "apps-finance",
  },
  {
    id: 9,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1788281023/car_zygd12.png",
    title: "Automotive",
    slug: "automotive",
    apiSlug: "automotive",
  },
  {
    id: 7,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786465725/ConsumerGoods_flnn9p_ghq1f2.png",
    title: "Consumer Goods",
    slug: "consumer-goods",
    apiSlug: "consumer-goods",
  },
  {
    id: 14,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786030944/Fitness_x2xdwm.png",
    title: "Fitness",
    slug: "fitness",
    apiSlug: "fitness",
  },
  {
    id: 17,
    img: "https://res.cloudinary.com/w2hbybua/image/upload/v1786030919/Home_Lifestyle_nh5hii.png",
    title: "Sustainable Living",
    slug: "sustainable-living",
    apiSlug: "sustainable-living",
  },
];

export function getIndustryApiSlug(slugOrId) {
  if (!slugOrId) return "";
  const match = INDUSTRIES.find(
    (item) =>
      item.slug === slugOrId ||
      item.apiSlug === slugOrId ||
      String(item.id) === String(slugOrId)
  );
  return match?.apiSlug || match?.slug || String(slugOrId);
}

export { INDUSTRIES };
export default INDUSTRIES;
