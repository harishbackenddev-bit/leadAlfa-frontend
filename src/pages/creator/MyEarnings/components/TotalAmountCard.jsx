import React, { useState, useEffect } from "react";
import amountIcon from "../../../../assets/SVGs/creator/amount.svg";
import WithdrawMoney from "./WithdrawMoney";
import { getCreatorBalance } from "../../../../services/api/apiservices";

export default function TotalAmountCard() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [balanceData, setBalanceData] = useState({
    balance: 0,
    currency: "ZAR",
    isRegistered: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch balance from TradeSafe
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        const res = await getCreatorBalance();
        const data = res?.data || res;

        console.log("📊 Creator balance:", data);
        setBalanceData(data);
      } catch (err) {
        console.error("Balance fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [showWithdrawModal]); // refetch when modal closes

  const totalAmount = balanceData?.balance || 0;

  return (
    <>
      <div className="bg-white max-w-md rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-base text-gray-400 mb-2">Total Amount</p>

            {isLoading ? (
              <div className="h-10 w-40 bg-gray-200 animate-pulse rounded mb-6" />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] mb-6">
                R {totalAmount.toFixed(2)}
              </h1>
            )}

            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={isLoading || !balanceData?.isRegistered || totalAmount <= 0}
              className="px-6 sm:px-8 py-3 sm:py-3.5 main-btn text-white text-sm sm:text-base font-medium rounded-full transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                !balanceData?.isRegistered
                  ? "Register with TradeSafe first"
                  : totalAmount <= 0
                  ? "No funds available"
                  : "Withdraw funds"
              }
            >
              Withdraw
            </button>

            {!balanceData?.isRegistered && (
              <p className="mt-3 text-xs text-yellow-600">
                ⚠️ Register your bank account with TradeSafe to withdraw
              </p>
            )}

            {totalAmount === 0 && balanceData?.isRegistered && (
              <p className="mt-3 text-xs text-gray-500">
                No funds available yet. Complete campaigns to earn.
              </p>
            )}
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