import ActionButton from "../../common/ActionButton";
import { useNavigate } from "react-router-dom";
import ProvinceSelector from "./ProvinceSelector";

export default function HeroCaseStudy({ action }) {
  const navigate = useNavigate();
  const handleActionClick = () => {
    navigate("/login");
  };

  return (
    <section className="flex flex-col items-center text-center px-4 py-10 ">
      <ProvinceSelector action={action} />

      <div className="max-w-4xl mt-8">
        <h1 className="flex flex-wrap justify-center items-center gap-2 text-3xl md:text-5xl! ">
          Our Work
        </h1>

        <p className="mt-4 text-xs  text-gray-600 leading-relaxed">
          Our talented creators have partnered with numerous global brands to
          craft compelling ads that not only capture attention but also drive
          impressive conversions. Creatrend proudly partners with top brands
          globally, driving impactful campaigns across Meta, TikTok, YouTube,
          Amazon, and Takealot storefronts, as well as various e-commerce
          websites. Our carefully vetted creators deliver exceptional UGC videos
          that consistently convert and achieve outstanding results.
        </p>

        <div className="flex flex-col md:flex-row! items-center justify-center gap-8 mt-8">
          <ActionButton
            label={"Create a Free Account"}
            onClick={handleActionClick}
          />
        </div>
      </div>
    </section>
  );
}
