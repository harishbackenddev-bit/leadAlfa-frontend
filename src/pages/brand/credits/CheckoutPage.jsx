import React from "react";
import {
  Video,
  DollarSign,
  Plus,
  Lock,
  ShieldCheck,
  Check,
} from "lucide-react";

const CheckoutPage = () => {
  return (
    <div className="flex flex-col lg:flex-row text-gray-900">
      {/* Left Section (Summary & Payment Methods) */}
      <div className="w-full lg:w-7/12 bg-[#F3F5F9] p-2 lg:p-4 space-y-4">
        {/* Summary Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-black uppercase mb-6 tracking-tight">
            Summary
          </h2>

          <p className="text-lg mb-4 font-medium text-gray-800">
            Selected Pack
          </p>

          {/* Blue Selected Pack Box */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between relative mb-8">
            <div className="space-y-3 z-10">
              <div className="flex items-center space-x-3 text-gray-800">
                <Video className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-sm md:text-base">
                  Receive 5 videos or 15 photos
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-800">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-sm md:text-base">
                  Pay $120 per video or 3 photos
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 text-center z-10">
              <div className="text-xl font-bold text-gray-900">20 PACK</div>
              <div className="text-4xl font-black text-blue-600">$800</div>
            </div>

            {/* Black Starburst Badge */}
            <div className="absolute -top-4 -right-2 md:top-1/2 md:-translate-y-1/2 md:right-4 w-20 h-20 z-20">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-black fill-current drop-shadow-md"
              >
                <path d="M50 0L61 15L78 8L78 26L95 29L85 44L100 58L83 67L90 84L72 82L62 97L50 85L38 97L28 82L10 84L17 67L0 58L15 44L5 29L22 26L22 8L39 15L50 0Z" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white leading-none pt-1">
                <span className="text-[10px] uppercase font-bold">Saving</span>
                <span className="text-xl font-black">10%</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-3 text-gray-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-gray-900">$920</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-gray-900">$120</span>
            </div>
            <div className="border-t border-gray-100 my-4 pt-4 flex justify-between text-xl font-bold text-blue-600">
              <span>Total</span>
              <span>$800</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase mb-2 tracking-tight">
              Payment Methods
            </h2>
            <p className="text-gray-600 mb-8 font-medium">
              Here are your added cards
            </p>

            <div className="flex items-start space-x-4">
              {/* Add Card Button */}
              <button className="flex items-center justify-center w-14 h-10 border-2 border-dashed border-blue-300 rounded bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                <Plus size={20} />
              </button>

              <div>
                <div className="text-blue-600 font-bold text-lg">
                  Add New Card
                </div>
                <div className="text-sm font-bold text-gray-800">
                  Save and Pay via Cards.
                </div>

                {/* Card Logos */}
                <div className="flex items-center space-x-2 mt-2 opacity-60 grayscale">
                  {/* Simulating Logos with text for simplicity/reliability without external assets */}
                  <span className="font-black italic text-2xl tracking-tighter">
                    VISA
                  </span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-black/60"></div>
                    <div className="w-6 h-6 rounded-full bg-black/40"></div>
                  </div>
                  <span className="font-bold text-xs uppercase border border-gray-400 px-1">
                    Discover
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (Payment Form) */}
      <div className="w-full lg:w-5/12 bg-white px-8 border-l border-gray-100 flex flex-col justify-start pt-8">
        <h2 className="text-4xl font-black uppercase tracking-tight">
          Payment
        </h2>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">
              Card holder name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">
              Card number
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {/* Visa Icon Placeholder */}
                <div className="text-blue-800 font-black italic tracking-tighter text-xl border border-gray-200 px-2 rounded bg-white">
                  VISA
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2 space-y-2">
              <label className="block text-gray-600 font-medium">
                Expiry date
              </label>
              <input
                type="text"
                placeholder="MM / YY"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="w-1/2 space-y-2">
              <label className="block text-gray-600 font-medium">CVV</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="save-card"
                className="peer w-6 h-6 border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 appearance-none transition-colors cursor-pointer"
              />
              <Check className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1" />
            </div>
            <label
              htmlFor="save-card"
              className="text-gray-900 font-bold cursor-pointer"
            >
              Save this card for future use
            </label>
          </div>

          <div className="py-4 flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <ShieldCheck
                className="w-8 h-8 text-blue-600"
                strokeWidth={1.5}
              />
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Your card details are encrypted during transmission and storage,
                ensuring that they remain confidential and secure.
              </p>
            </div>

            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full shadow-lg shadow-blue-200 transition-all text-lg"
            >
              Buy Now
            </button>

            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <span>Powered by</span>
              <span className="font-bold text-indigo-600 text-lg">stripe</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
