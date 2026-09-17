import { Gift } from "lucide-react";
import { CashIcon } from "../../../assets/SVGs/brands/customSVGs";
import { brandCityOptions } from "../../../utils/location";

export const platformOptions = [
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "X / Twitter", value: "x" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "YouTube Shorts", value: "youtube" },
  { label: "Other", value: "other" },
];

export const locationOptions = [
  { label: "All", value: "all" },
  ...brandCityOptions,
];




export const compensationOptions = [
  {
    label: "Cash",
    value: "cash",
    icon: CashIcon,
  },
  {
    label: "Gift",
    value: "gift",
    icon: Gift,
  },
];

export const selectOptions = {
  deliverables: [
    { label: "Testimonials and Reviews", value: "testimonials_reviews" },
    { label: "Problem/Solution (Before & After)", value: "problem_solution" },
    { label: "Product Demonstrations and Tutorials", value: "product_demonstrations" },
    { label: "Unboxing Videos", value: "unboxing_videos" },
    { label: "Lifestyle/Routine Integration", value: "lifestyle_routine" },
    { label: "Photography", value: "photography" },    
  ],
  usageRights: [
    { label: "Organic Post", value: "organic_post" },
    { label: "3 Months Paid Ads", value: "paid_30" },
    { label: "6 Months Paid Ads", value: "paid_60" },
    { label: "Full buyout", value: "buyout" },
    { label: "Custom", value: "custom" },
  ],
  productStatus: [
    { label: "Prop / Return Required", value: "prop_return_required" },
    { label: "Prop / Gifted / Keep", value: "prop_gifted_keep" },
    { label: "Digital Services (Not Applicable)", value: "service_digital" },
  ],
  whitelisting: [
    { label: "Not required", value: "not_required" },
    { label: "Required", value: "required" },
    { label: "Optional", value: "optional" },
  ],
  ageRange: [
    { label: "18-24", value: "18_24" },
    { label: "25-34", value: "25_34" },
    { label: "35-44", value: "35_44" },
    { label: "45+", value: "45_plus" },
  ],
  gender: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
    { label: "All Genders", value: "all-genders" },
  ],
  numberOfCreators: [
    { label: "1 Creator", value: "1" },
    { label: "2-5 Creators", value: "2-5" },
    { label: "6-10 Creators", value: "6-10" },
    { label: "11-20 Creators", value: "11-20" },
    { label: "21 - 50 Creators", value: "21-50" },
    { label: "51 - 100 Creators", value: "51-100" },
    { label: "100+ Creators", value: "100+" },
  ],
  videoLength: [
    { label: "15 seconds", value: "15sec" },
    { label: "30 seconds", value: "30sec" },
    { label: "60 seconds", value: "60sec" },
  ],
  followerCount: [
    { label: "Not Needed", value: "null" },    
    { label: "1 K - 10 K", value: "1k_10k" },
    { label: "10 K - 50 K", value: "10k_50k" },
    { label: "50 K - 100K", value: "50k_100k" },
    { label: "100 K - 500 K", value: "100k_500k" },
    { label: "500 K - 1 M", value: "500k_1m" },
    { label: "1 M+", value: "1m_plus" },
  ],
  engagementRate: [
    { label: "2%+", value: "2_plus" },
    { label: "3%+", value: "3_plus" },
    { label: "4%+", value: "4_plus" },
    { label: "5%+", value: "5_plus" },
  ],
  hook: [
    { label: "Problem first", value: "problem_first" },
    { label: "Before/after", value: "before_after" },
    { label: "Testimonial", value: "testimonial" },
    { label: "Trending format", value: "trending" },
  ],
  problem: [
    { label: "Time saving", value: "time" },
    { label: "Cost saving", value: "cost" },
    { label: "Quality concern", value: "quality" },
    { label: "Convenience", value: "convenience" },
  ],
  solution: [
    { label: "Demo workflow", value: "demo" },
    { label: "Feature highlight", value: "feature" },
    { label: "Result reveal", value: "result" },
    { label: "Lifestyle integration", value: "lifestyle" },
  ],
  toneVoice: [
    { label: "Conversational", value: "conversational" },
    { label: "Professional", value: "professional" },
    { label: "Energetic", value: "energetic" },
    { label: "Authentic / UGC Native", value: "authentic_ugc" },
    { label: "Educational", value: "educational" },
  ],
  videoLength: [
    { label: "15 sec", value: "starter" },
    { label: "30 sec", value: "standard" },
    { label: "60 sec", value: "deepdive" },
  ],
};
