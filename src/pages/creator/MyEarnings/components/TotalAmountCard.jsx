import React, { useState } from "react";
import amountIcon from "../../../../assets/SVGs/creator/amount.svg";
import WithdrawMoney from "./WithdrawMoney";

export default function TotalAmountCard({ totalAmount = 240.0 }) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <>
      <div className="bg-white max-w-md rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-base text-gray-400 mb-2">Total Amount</p>
            <h1 className="text-3xl sm:text-4xl font-anton font-extrabold text-[#1E293B] mb-6">
              £ {totalAmount.toFixed(2)}
            </h1>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 sm:px-8 py-3 sm:py-3.5 main-btn text-white text-sm sm:text-base font-medium rounded-full transition-colors whitespace-nowrap"
            >
              Withdraw
            </button>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 bg-[#ffb3e2e8]">
            <img src={amountIcon} alt="Amount" className="w-9 h-9 sm:h-12" />
          </div>
        </div>
      </div>

      <WithdrawMoney
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        totalAmount={totalAmount}
      />
    </>
  );
}
