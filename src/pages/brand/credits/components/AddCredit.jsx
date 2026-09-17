import React from "react";
import { Layers, Image, DollarSign, MessageSquare, Star } from "lucide-react";

const PricingPage = ({ onBuy }) => {
  // Data for the pricing tiers to make the code cleaner
  const tiers = [
    {
      title: "5 PACK",
      price: "$600",
      save: null,
      videos: "5",
      photos: "15",
      unitPrice: "$120",
      isPopular: false,
    },
    {
      title: "20 PACK",
      price: "$2,232",
      save: "7%",
      videos: "20",
      photos: "60",
      unitPrice: "$112",
      isPopular: true, // This controls the blue highlight style
    },
    {
      title: "50 PACK",
      price: "$5,280",
      save: "12%",
      videos: "50",
      photos: "150",
      unitPrice: "$106",
      isPopular: false,
    },
    {
      title: "100 PACK",
      price: "$10,200",
      save: "15%",
      videos: "100",
      photos: "300",
      unitPrice: "$102",
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 overflow-hidden relative">
      {/* Decorative Rotating Banner Background */}
      <div className="absolute top-10 -left-10 w-[120%] h-12 bg-blue-100 -rotate-2 flex items-center justify-center space-x-8 overflow-hidden z-0 select-none opacity-80 text-xs font-bold tracking-widest text-blue-900/60 uppercase">
        {Array(15)
          .fill("Buy More Save More ✦")
          .map((text, i) => (
            <span key={i} className="whitespace-nowrap">
              {text}
            </span>
          ))}
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto pt-16">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-black mb-4 uppercase font-condensed tracking-tight">
            Get Credits
          </h1>
          <p className="text-gray-600 max-w-3xl text-lg leading-relaxed">
            A passionate creator who loves turning ideas into engaging content.
            From eye-catching videos and scroll-stopping photos to authentic
            product reviews and creative storytelling.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300
                ${
                  tier.isPopular
                    ? "bg-blue-100/50 border-2 border-blue-600 shadow-xl"
                    : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                }
              `}
            >
              {/* Background Pattern (Subtle Grid) */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* Discount Badge (Black Starburst) */}
              {tier.save && (
                <div className="absolute -top-6 -right-4 z-20">
                  <div className="relative flex items-center justify-center w-20 h-20">
                    {/* CSS Shape for Starburst */}
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute w-full h-full text-black fill-current drop-shadow-md animate-pulse-slow"
                    >
                      <path d="M50 0L61 15L78 8L78 26L95 29L85 44L100 58L83 67L90 84L72 82L62 97L50 85L38 97L28 82L10 84L17 67L0 58L15 44L5 29L22 26L22 8L39 15L50 0Z" />
                    </svg>
                    <div className="relative text-center text-white leading-tight">
                      <span className="block text-xs font-medium">Save</span>
                      <span className="block text-xl font-bold">
                        {tier.save}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className="relative z-10 text-center mt-4">
                <h3 className="text-2xl font-medium text-gray-900 uppercase tracking-wide mb-1">
                  {tier.title}
                </h3>
                <div className="text-4xl font-extrabold text-blue-900 mb-8">
                  {tier.price}
                </div>

                <div className="space-y-4 text-left px-2">
                  <div className="flex items-start space-x-3 text-gray-700">
                    <Layers className="w-5 h-5 mt-1 text-gray-400 shrink-0" />
                    <span className="text-sm font-medium">
                      Receive {tier.videos} videos or {tier.photos} photos
                    </span>
                  </div>
                  <div className="flex items-start space-x-3 text-gray-700">
                    <DollarSign className="w-5 h-5 mt-1 text-gray-400 shrink-0" />
                    <span className="text-sm font-medium">
                      Pay {tier.unitPrice} per video or 3 photos
                    </span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => onBuy && onBuy(tier)}
                className="relative z-10 w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-colors shadow-blue-200 shadow-lg"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise Footer Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-black mb-2 uppercase font-condensed">
              Want to get enterprise level pricing?
            </h2>
            <p className="text-gray-600">
              Choose enterprise pricing and get custom credit packages as per
              your requirements.
            </p>
          </div>
          <button className="mt-6 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg shadow-blue-200">
            Chat With Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
