import React, { useEffect, useState } from "react";
import { requestCreatorWithdrawal } from "../../../../services/api/apiservices";

export default function WithdrawMoney({
  isOpen,
  onClose,
  totalAmount = 0,
}) {
  const [step, setStep] = useState("amount");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [successAmount, setSuccessAmount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep("amount");
      setWithdrawAmount("");
      setError("");
      setSuccessAmount(0);
    }
  }, [isOpen]);

  const handleQuickSelect = (value) => {
    setError("");
    if (value === "all") {
      setWithdrawAmount(totalAmount.toFixed(2));
    } else {
      setWithdrawAmount(value.toString());
    }
  };

  // ✅ Withdraw API call
  const handleWithdrawNow = async () => {
    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount) || amount < 10 || amount > totalAmount) {
      setError("Please enter a valid amount (min R10)");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const res = await requestCreatorWithdrawal(amount);
      const data = res?.data || res;

      if (!data?.success && !data?.withdrawalId) {
        throw new Error(data?.error || "Withdrawal failed");
      }

      setSuccessAmount(amount);
      setStep("success");
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError(err?.message || "Withdrawal failed. Please try again.");
      setStep("amount");
    }
  };

  const handleDone = () => {
    onClose();
  };

  if (!isOpen) return null;

  const withdrawValue = parseFloat(withdrawAmount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* ============================================================ */}
        {/* STEP: AMOUNT ENTRY */}
        {/* ============================================================ */}
        {step === "amount" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-gray-900">Withdraw Money</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute cursor-pointer top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
              >
                <span className="text-3xl leading-none">×</span>
              </button>
            </div>
            <div className="border-t border-gray-200 mb-4" />

            {/* Available Balance */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Available Balance</p>
              <p className="text-2xl text-gray-900">
                R {totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Withdrawal Amount Input */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  R
                </span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                    setError("");
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Minimum withdrawal: R10.00
            </p>

            {/* Quick Select */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Quick Select
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleQuickSelect(val)}
                    disabled={val > totalAmount}
                    className="py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    R{val}
                  </button>
                ))}
                <button
                  onClick={() => handleQuickSelect("all")}
                  className="py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  All
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Withdraw Button */}
            <button
              onClick={handleWithdrawNow}
              disabled={
                !withdrawAmount ||
                parseFloat(withdrawAmount) < 10 ||
                parseFloat(withdrawAmount) > totalAmount
              }
              className="w-full py-3 main-btn text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw to Bank Account
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Funds will be transferred to your TradeSafe-verified bank account.
            </p>
          </>
        )}

        {/* ============================================================ */}
        {/* STEP: LOADING */}
        {/* ============================================================ */}
        {step === "loading" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#1E60DB] rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600">Processing your withdrawal...</p>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP: SUCCESS */}
        {/* ============================================================ */}
        {step === "success" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-gray-900">Success</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute cursor-pointer top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
              >
                <span className="text-3xl leading-none">×</span>
              </button>
            </div>

            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="text-xl text-gray-900 mb-2">
                Withdrawal Successful!
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                Your withdrawal of R {successAmount.toFixed(2)} has been
                processed successfully.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-medium text-gray-900">
                  R {successAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Method</span>
                <span className="text-sm font-medium text-gray-900">
                  Bank Transfer
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Processing Time</span>
                <span className="text-sm font-medium text-gray-900">
                  Instant (TradeSafe IMMEDIATE)
                </span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3 main-btn text-white font-medium rounded-full transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}