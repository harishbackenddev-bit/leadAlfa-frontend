import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ActionButton from "../../common/ActionButton";
import PricingCard from "./PricingCard";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    id: 1,
    label: "Basic",
    title: "Basic Plan",
    price: "300",
    bonus: "A basic plan with exciting features",
    option: "regular",
    features: [
      "Covers 1–3 campaigns / 12 months",
      "Tracked post results.",
      "Up to 5 creator invitations",
      "Standard support",
    ],
  },
  {
    id: 2,
    label: "+100 Bonus credit",
    title: "Standard Plan",
    price: "1000",
    bonus: "Get +100 Bonus Credits",
    option: "regular",
    features: [
      "Covers 3–8 campaigns / 12 months",
      "Up to 15 creator invitations",
      "Tracked post results.",
      "Standard support",
      "AI brief writing",
    ],
  },
  {
    id: 3,
    label: "+150 Bonus credit",
    title: "Professional Plan",
    price: "2500",
    bonus: "Get +150 Bonus Credits",
    option: "recommended",
    features: [
      "8–20 campaigns / 12 months",
      "Up to 25 creator invitations",
      "Tracked post results.",
      "Priority support",
      "AI brief writing",
      "Dedicated Account Manager",
    ],
  },
  {
    id: 4,
    label: "+200 Bonus credit",
    title: "Premium Plan",
    price: "5000",
    bonus: "Get +200 Bonus Credits",
    option: "regular",
    features: [
      "20–35 videos",
      "Up to 40 creator invitations",
      "Tracked post results",
      "Priority support",
      "AI brief",
      "Dedicated Account Manager",
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const handleActionClick = () => {
    navigate("/login");
  };
  return (
    <div className="carousel">
      {/* Custom Prev Button */}
      <div className="swiper-button-prev-custom -mt-25">
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_2_13)">
            <path
              d="M0 26C0 11.6406 11.6406 0 26 0C40.3594 0 52 11.6406 52 26C52 40.3594 40.3594 52 26 52C11.6406 52 0 40.3594 0 26Z"
              fill="#0c7bb3"
            />
            <path
              d="M33.5834 26.0001H18.4167M18.4167 26.0001L26 18.4167M18.4167 26.0001L26 33.5834"
              stroke="white"
              strokeWidth="2.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_2_13">
              <rect width="52" height="52" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Custom Next Button */}
      <div className="swiper-button-next-custom -mt-25">
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_2_13)">
            <path
              d="M0 26C0 11.6406 11.6406 0 26 0C40.3594 0 52 11.6406 52 26C52 40.3594 40.3594 52 26 52C11.6406 52 0 40.3594 0 26Z"
              fill="#0c7bb3"
            />
            <path
              d="M18.4166 26H33.5833M33.5833 26L26 18.4167M33.5833 26L26 33.5833"
              stroke="white"
              strokeWidth="2.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_2_13">
              <rect width="52" height="52" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.2}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {pricingPlans.map((plan) => (
          <SwiperSlide key={plan.id}>
            <PricingCard plan={plan} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-around flex-wrap ">
        <div className="w-[360px]" />
        <div className="w-[360px]" />
        <div className="mt-10 w-[360px] rounded-2xl bg-[#e6efff] p-5">
          <h2 className="text-[20px] font-semibold text-[#202124] mb-1">
            Still can't decide?
          </h2>
          <p className="text-[14px] text-[#5f6368] mb-4">
            Let's figure out what you need
          </p>
          <ActionButton
            label="Let's talk"
            arrow_bg="#FFFFFFFF"
            stroke="#4C86F3"
            onClick={handleActionClick}
          />
        </div>
      </div>
    </div>
  );
}
