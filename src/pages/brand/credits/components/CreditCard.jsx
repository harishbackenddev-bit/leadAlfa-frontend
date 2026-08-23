import React from "react";
import { useNavigate } from "react-router-dom";
import walletIcon from "../../../../assets/SVGs/creator/amount.svg";
import whiteStarIcon from "../../../../assets/SVGs/brands/whiteStar.svg";

export default function CreditCard({ totalCredit = 240.0 }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Total Credit Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-base text-gray-400 mb-2">Total Credit</p>
            <h1 className="text-3xl sm:text-4xl font-anton font-extrabold text-[#1E293B] mb-6">
              {totalCredit.toFixed(2)}
            </h1>
            <button
              onClick={() => navigate("/brand/credits/add")}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#1E60DB] text-white text-sm sm:text-base font-medium rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Add Credit
            </button>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C0D6F5] rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src={walletIcon}
              alt="Wallet"
              className="w-14 h-14 sm:w-16 sm:h-16"
            />
          </div>
        </div>
      </div>

      {/* Videos/Photos Info Card */}
      <div className="bg-[#1E60DB]/15 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative white star (behind content) */}
        <div className="absolute top-2 right-4 z-0 pointer-events-none">
          <img
            src={whiteStarIcon}
            alt="Star"
            className="w-12 h-12 sm:w-14 sm:h-14"
          />
        </div>

        <div className="relative z-10">
          <p className="text-base text-gray-700 mb-6">
            With your available Credit, you can get
          </p>
          <h2 className="text-3xl sm:text-4xl font-anton font-extrabold text-[#1E293B]">
            2 Videos / 6 Photos
          </h2>
        </div>

        {/* Bottom stacked white stars pattern (stacked icons behind content) */}
        <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none opacity-40">
          {Array.from({ length: 2 }).map((_, row) => (
            <div
              key={row}
              className={
                row === 0
                  ? "flex justify-start translate-x-2 translate-y-5"
                  : "flex justify-start"
              }
            >
              {Array.from({ length: 18 }).map((_, col) => (
                <img
                  key={col}
                  src={whiteStarIcon}
                  alt=""
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-0"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Add Credit handled on separate page */}
    </div>
  );
}
