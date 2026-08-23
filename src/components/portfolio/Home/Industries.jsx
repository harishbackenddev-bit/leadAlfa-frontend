import { useSearchParams } from "react-router-dom";

import img1 from "../../../assets/images/portfolio/industries/lotus 1-7.png";
import img2 from "../../../assets/images/portfolio/industries/lotus 1-8.png";
import img3 from "../../../assets/images/portfolio/industries/lotus 1.png";
import img4 from "../../../assets/images/portfolio/industries/lotus 1-1.png";
import img5 from "../../../assets/images/portfolio/industries/lotus 1-2.png";
import img6 from "../../../assets/images/portfolio/industries/lotus 1-3.png";
import img7 from "../../../assets/images/portfolio/industries/lotus 1-4.png";
import img8 from "../../../assets/images/portfolio/industries/lotus 1-5.png";
import img9 from "../../../assets/images/portfolio/industries/lotus 1-9.png";
import img10 from "../../../assets/images/portfolio/industries/lotus 1-6.png";
import propertyIcon from "../../../assets/images/portfolio/industries/property.png";
import travelIcon from "../../../assets/images/portfolio/industries/airplane.png";
import financeIcon from "../../../assets/images/portfolio/industries/app-settings.png";
import servicesIcon from "../../../assets/images/portfolio/industries/professionalism.png";
import SelectDropdown from "../../common/SelectDropdown.jsx";

// The row wraps rather than forcing one line — a single line pushed the page
// wider than the viewport around 768px.
const INDUSTRIES = [
  { img: img1, title: "Cosmetics & Beauty", slug: "cosmetics-n-beauty" },
  { img: img3, title: "Apps & Digital Services", slug: "apps-n-digital" },
  { img: img2, title: "Apparel & Fashion", slug: "apparel-n-fashion" },
  { img: propertyIcon, title: "Real Estate & Luxury Property Tech", slug: "real-estate-n-property" },
  { img: img9, title: "Pets", slug: "pets" },
  { img: img4, title: "Health & Wellness", slug: "health-n-wellness" },
  { img: img6, title: "Technology & Gadgets", slug: "technology-n-gadgets" },
  { img: img5, title: "Children & Family", slug: "children-n-family" },
  { img: travelIcon, title: "Travel & Adventure", slug: "travel-n-adventure" },
  { img: img7, title: "Food & Beverage", slug: "food-n-beverage" },
  { img: servicesIcon, title: "Professional Services", slug: "professional-services" },
  { img: img8, title: "Home & Lifestyle", slug: "home-n-lifestyle" },
  { img: financeIcon, title: "Apps & Finance", slug: "apps-n-finance" },
  { img: img10, title: "Automotive", slug: "automotive" },
];

export default function Industries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIndustry = searchParams.get("industry");

  const handleSelect = (slug) => {
    if (slug === selectedIndustry) {
      return;
    }
    searchParams.set("industry", slug);
    setSearchParams(searchParams);
  };

  const renderOption = (industry) => (
    <span key={industry.slug} className="flex w-full items-center gap-2">
      <img
        src={industry.img}
        alt=""
        className="h-[22px] w-[22px] shrink-0 object-contain"
      />
      {industry.title}
    </span>
  );

  return (
    <>
      {/* Mobile: a single select keeps ten options usable on a narrow screen */}
      <SelectDropdown
        className="w-full rounded-full bg-white md:hidden"
        label="Select Industry"
        items={INDUSTRIES.map(renderOption)}
        value={
          INDUSTRIES.filter((i) => i.slug === selectedIndustry).map(renderOption)[0] || null
        }
        onChange={(node) => {
          const title = node.props.children[1];
          const selected = INDUSTRIES.find((i) => i.title === title);
          if (selected) {
            handleSelect(selected.slug);
          }
        }}
      />

      {/* Tablet and up: wrapping pill row */}
      <div className="mx-auto hidden max-w-[1180px] flex-wrap items-center justify-center gap-3 md:flex">
        {INDUSTRIES.map(({ img, title, slug }) => {
          const isSelected = selectedIndustry === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => handleSelect(slug)}
              aria-pressed={isSelected}
              className={`group flex cursor-pointer items-center gap-2.5 rounded-full border px-5 py-3 text-[15px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C7BB3] focus-visible:ring-offset-2 lg:text-[16px] ${
                isSelected
                  ? "border-[#0C7BB3] bg-[#0C7BB3] text-white"
                  : "border-[#E8EAEE] bg-white text-[#1A1A1A] hover:border-[#0C7BB3] hover:bg-[#0C7BB3] hover:text-white"
              }`}
            >
              <img
                src={img}
                alt=""
                className="h-[22px] w-[22px] shrink-0 object-contain"
              />
              {title}
            </button>
          );
        })}
      </div>
    </>
  );
}
