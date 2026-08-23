import React, { useEffect, useState } from "react";

export default function WithdrawMoney({
  isOpen,
  onClose,
  totalAmount = 240.0,
}) {
  // Steps: 'amount' | 'payment' | 'loading' | 'success'
  const [step, setStep] = useState("amount");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // 'stripe' | 'bank'

  // Stripe fields
  const [stripeEmail, setStripeEmail] = useState("");

  // Bank fields
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("amount");
      setWithdrawAmount("");
      setError("");
      setPaymentMethod("");
      setStripeEmail("");
      setBankDetails({
        accountHolder: "",
        accountNumber: "",
        routingNumber: "",
        bankName: "",
      });
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

  const handleContinue = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 10 || amount > totalAmount) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
    setStep("payment");
  };

  const handleBack = () => {
    setStep("amount");
    setPaymentMethod("");
  };

  const handleWithdrawNow = () => {
    // Validate payment method fields
    if (paymentMethod === "stripe" && !stripeEmail) {
      setError("Please enter your Stripe email");
      return;
    }
    if (paymentMethod === "bank") {
      if (
        !bankDetails.accountHolder ||
        !bankDetails.accountNumber ||
        !bankDetails.routingNumber ||
        !bankDetails.bankName
      ) {
        setError("Please fill all bank details");
        return;
      }
    }
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }
    setError("");
    setStep("loading");

    // Simulate API call
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  const handleDone = () => {
    onClose();
  };

  // Calculate fees (Stripe: 2.9% + £0.30, Bank: no fees)
  const amount = parseFloat(withdrawAmount) || 0;
  const stripeFee = paymentMethod === "stripe" ? amount * 0.029 + 0.3 : 0;
  const youReceive = paymentMethod === "bank" ? amount : amount - stripeFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Step: Amount Entry */}
        {step === "amount" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-anton text-gray-900">
                Withdraw Money
              </h3>
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
              <p className="text-2xl font-anton text-gray-900">
                £ {totalAmount.toFixed(2)}
              </p>
            </div>
            {/* <div className="border-t border-gray-200 mb-6" /> */}

            {/* Withdrawal Amount Input */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  £
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
            {/* <div className="border-t border-gray-200 mb-6" /> */}
            <p className="text-sm text-gray-500 mb-4">
              Minimum withdrawal: £100.00
            </p>

            {/* Quick Select */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Quick Select
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[100, 200, 500].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleQuickSelect(val)}
                    className="py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    £{val}
                  </button>
                ))}
                <button
                  onClick={() => handleQuickSelect("all")}
                  className="py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  £All
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full py-3 main-btn text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </>
        )}

        {/* Step: Payment Method */}
        {step === "payment" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-anton text-gray-900">
                Payment Method
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute cursor-pointer top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
              >
                <span className="text-3xl leading-none">×</span>
              </button>
            </div>
            <div className="border-t border-gray-200 mb-4" />

            {/* Amount Summary */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Withdrawal Amount</span>
                <span className="text-lg font-anton text-gray-900">
                  £ {amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  Processing Fee (2.9% + £0.30)
                </span>
                <span className="text-sm text-gray-500">
                  £ {stripeFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-900">
                  You'll Receive
                </span>
                <span className="text-lg font-anton text-gray-900">
                  £ {youReceive.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Select Payment Method */}
            <p className="text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </p>

            {/* Stripe Option */}
            <div
              onClick={() => setPaymentMethod("stripe")}
              className={`border rounded-lg p-4 mb-3 cursor-pointer transition-colors ${
                paymentMethod === "stripe"
                  ? "border-[#1E60DB] border-2"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                      <path
                        d="M7 12h4M13 12h4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Stripe</p>
                    <p className="text-sm text-gray-500">
                      Instant transfer • 2.9% + £0.30
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "stripe"
                      ? "border-[#1E60DB] bg-[#1E60DB]"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "stripe" && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Stripe Email Field */}
              {paymentMethod === "stripe" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address for Stripe
                  </label>
                  <input
                    type="email"
                    value={stripeEmail}
                    onChange={(e) => setStripeEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Funds will be sent to your Stripe Connect account
                  </p>
                </div>
              )}
            </div>

            {/* Bank Transfer Option */}
            <div
              onClick={() => setPaymentMethod("bank")}
              className={`border rounded-lg p-4 mb-4 cursor-pointer transition-colors ${
                paymentMethod === "bank"
                  ? "border-[#1E60DB] border-2"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                      <path
                        d="M7 12h4M13 12h4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bank Transfer</p>
                    <p className="text-sm text-gray-500">
                      2-3 business days • No fees
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "bank"
                      ? "border-[#1E60DB] bg-[#1E60DB]"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "bank" && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Bank Details Fields */}
              {paymentMethod === "bank" && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountHolder}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          accountHolder: e.target.value,
                        })
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          accountNumber: e.target.value,
                        })
                      }
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.routingNumber}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          routingNumber: e.target.value,
                        })
                      }
                      placeholder="123456789"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          bankName: e.target.value,
                        })
                      }
                      placeholder="Chase Bank"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleWithdrawNow}
                className="flex-1 py-3 text-white font-medium rounded-full main-btn transition-colors"
              >
                Withdraw Now
              </button>
            </div>
          </>
        )}

        {/* Step: Loading */}
        {step === "loading" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#1E60DB] rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600">Processing your withdrawal...</p>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-anton text-gray-900">Success</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute cursor-pointer top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
              >
                <span className="text-3xl leading-none">×</span>
              </button>
            </div>

            <div className="text-center py-6">
              {/* Success Icon */}
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
              <h4 className="text-xl font-anton text-gray-900 mb-2">
                Withdrawal Successful!
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                Your withdrawal of £ {amount.toFixed(2)} has been processed
                successfully.
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-medium text-gray-900">
                  £ {amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Method</span>
                <span className="text-sm font-medium text-gray-900">
                  {paymentMethod === "stripe" ? "Stripe" : "Bank Transfer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Processing Time</span>
                <span className="text-sm font-medium text-gray-900">
                  {paymentMethod === "stripe" ? "Instant" : "2-3 business days"}
                </span>
              </div>
            </div>

            {/* Done Button */}
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
