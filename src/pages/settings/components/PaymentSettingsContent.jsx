// PaymentSettingsContent.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../store/hooks";
import { 
  selectUser, 
  selectTradeSafeStatus,
  setTradeSafeStatus 
} from "../../../store/slices/authSlice";
import { submitTradeSafeDetails, getTradeSafeStatus } from "../../../services/api/apiservices";

// --- CONSTANTS (South African Banks & Account Types) ---
const SA_BANK_OPTIONS = [
  { label: "ABSA Bank", value: "ABSA" },
  { label: "Access Bank", value: "ACCESS" },
  { label: "African Bank", value: "AFRICAN" },
  { label: "Bank Zero", value: "BANKZERO" },
  { label: "Bidvest Bank", value: "BIDVEST" },
  { label: "Capitec Bank", value: "CAPITEC" },
  { label: "Capitec Business / Mercantile", value: "CAPITEC_BUSINESS" },
  { label: "Discovery Bank", value: "DISCOVERY" },
  { label: "First National Bank (FNB)", value: "FNB" },
  { label: "Investec Bank", value: "INVESTEC" },
  { label: "Ithala", value: "ITHALA" },
  { label: "Mercantile", value: "MERCANTILE" },
  { label: "Nedbank", value: "NEDBANK" },
  { label: "RMB Private Bank", value: "RMB" },
  { label: "Sasfin Bank", value: "SASFIN" },
  { label: "Standard Bank South Africa", value: "SBSA" },
  { label: "TymeBank", value: "TYME" },
  { label: "Other Bank", value: "OTHER" },
];

const BANK_ACCOUNT_TYPES = [
  { label: "Savings Account", value: "SAVINGS" },
  { label: "Cheque Account", value: "CHEQUE" },
];

export default function PaymentSettingsContent() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const tradeSafeStatus = useAppSelector(selectTradeSafeStatus);

  // --- STATES ---
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [statusData, setStatusData] = useState(null);

  // 1. State for TRADESAFE BANK FORM
  const [tradeSafeData, setTradeSafeData] = useState({
    accountNumber: "",
    bank: "SBSA",
    accountType: "CHEQUE",
  });

  // 2. Card form state (UNTOUCHED)
  const [showCVV, setShowCVV] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [cardData, setCardData] = useState({
    cardHolderName: "",
    cardNumber: "",
    mmyy: "",
    cvv: "",
  });

  // ========== CHECK TRADESAFE STATUS ON MOUNT ==========
  useEffect(() => {
    const checkStatus = async () => {
      setIsCheckingStatus(true);
      setError("");

      try {
        const response = await getTradeSafeStatus();
        console.log("📊 TradeSafe Status Response:", response);

        if (response && response.status) {
          dispatch(setTradeSafeStatus(response.status));
          setStatusData(response);
        } else {
          dispatch(setTradeSafeStatus('NOT_STARTED'));
        }
      } catch (err) {
        console.error("❌ Failed to fetch TradeSafe status:", err);
        dispatch(setTradeSafeStatus('NOT_STARTED'));
        setError("Could not fetch TradeSafe status. Please try again.");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [dispatch]);

  // ========== HANDLERS ==========

  const handleTradeSafeChange = (e) => {
    const { name, value } = e.target;
    setTradeSafeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit TRADESAFE details to backend
  const handleTradeSafeSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        bank: tradeSafeData.bank,
        accountNumber: tradeSafeData.accountNumber,
        accountType: tradeSafeData.accountType,
      };

      console.log("📤 Submitting TradeSafe details:", payload);

      const response = await submitTradeSafeDetails(payload);
      console.log("✅ TradeSafe submission response:", response);

      dispatch(setTradeSafeStatus('PENDING'));
      setSuccess(true);
      
      setTradeSafeData({ accountNumber: "", bank: "SBSA", accountType: "CHEQUE" });

      // Refresh status after submission
      setTimeout(async () => {
        const statusResp = await getTradeSafeStatus();
        if (statusResp && statusResp.status) {
          dispatch(setTradeSafeStatus(statusResp.status));
        }
      }, 2000);

    } catch (err) {
      console.error("❌ TradeSafe submission error:", err);
      setError(err?.message || "Failed to submit bank details to TradeSafe.");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh status manually
  const handleRefreshStatus = async () => {
    setIsCheckingStatus(true);
    setError("");
    try {
      const response = await getTradeSafeStatus();
      console.log("📊 Refreshed Status:", response);
      if (response && response.status) {
        dispatch(setTradeSafeStatus(response.status));
        setStatusData(response);
      }
    } catch (err) {
      console.error("❌ Failed to refresh status:", err);
      setError("Could not refresh TradeSafe status.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // ========== VALIDATION ==========
  const isFormValid = tradeSafeData.accountNumber.trim().length >= 6;

  // ========== LOADING STATE ==========
  if (isCheckingStatus) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6">
        <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-2">Payment Method</h2>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Checking TradeSafe status...</span>
        </div>
      </div>
    );
  }

  // ========== RENDER BASED ON STATUS ==========

  // CASE 1: VERIFIED
  if (tradeSafeStatus === "VERIFIED") {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6">
        <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-2">Payment Method</h2>
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-green-800">✅ Your TradeSafe verification is complete!</span>
          </div>
          <p className="mt-2 text-sm text-green-700">
            You are ready to receive payouts securely via TradeSafe.
          </p>
          {statusData && (
            <div className="mt-2 text-xs text-green-600">
              <p>TradeSafe ID: {statusData.tradeSafeUserId || 'N/A'}</p>
              <p>Reference: {statusData.tradeSafeReference || 'N/A'}</p>
            </div>
          )}
          <button
            onClick={handleRefreshStatus}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  // CASE 2: PENDING
  if (tradeSafeStatus === "PENDING") {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6">
        <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-2">Payment Method</h2>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-blue-800">⏳ Your TradeSafe details are pending verification.</span>
          </div>
          <p className="mt-2 text-sm text-blue-700">
            This usually takes 1-2 business days. You'll be notified once verified.
          </p>
          {statusData && (
            <div className="mt-2 text-xs text-blue-600">
              <p>Status: {statusData.status}</p>
              <p>KYC Status: {statusData.kycStatus || 'Pending'}</p>
            </div>
          )}
          <button
            onClick={handleRefreshStatus}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  // ========== DEFAULT ('NOT_STARTED' or null): SHOW FORM ==========
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 space-y-8">
      
      {/* ========================================== */}
      {/* SECTION 1: TRADESAFE BANK DETAILS          */}
      {/* ========================================== */}
      <div>
        <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-2">
          Verify Bank Account (TradeSafe)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter your bank account details to receive payouts securely via TradeSafe.
          Your details are sent securely and never stored in our database.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            ✅ Details submitted successfully! Awaiting verification.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Account Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={tradeSafeData.accountNumber}
              onChange={handleTradeSafeChange}
              placeholder="Enter Account Number (Min 6 digits)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {tradeSafeData.accountNumber.length > 0 && tradeSafeData.accountNumber.length < 6 && (
              <p className="mt-1 text-xs text-red-500">
                Account number must be at least 6 characters long.
              </p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={tradeSafeData.accountType}
              onChange={handleTradeSafeChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {BANK_ACCOUNT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <select
              name="bank"
              value={tradeSafeData.bank}
              onChange={handleTradeSafeChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {SA_BANK_OPTIONS.map((bank) => (
                <option key={bank.value} value={bank.value}>
                  {bank.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleTradeSafeSubmit}
          disabled={!isFormValid || isLoading}
          className={`px-8 py-3 text-white text-sm font-medium rounded-full transition-colors ${
            isFormValid && !isLoading
              ? "bg-[#1E60DB] hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit for Verification"}
        </button>
      </div>

      {/* ========================================== */}
      {/* SECTION 2: CARD FORM (UNTOUCHED)           */}
      {/* ========================================== */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-6">
          Add Payment Method (Card)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Card Holder Name
            </label>
            <input
              type="text"
              name="cardHolderName"
              value={cardData.cardHolderName}
              onChange={handleCardChange}
              placeholder="Enter Card Holder Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardChange}
              placeholder="Enter Card Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              MM/YY
            </label>
            <input
              type="text"
              name="mmyy"
              value={cardData.mmyy}
              onChange={handleCardChange}
              placeholder="Enter MM/YY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              CVV
            </label>
            <div className="relative">
              <input
                type={showCVV ? "text" : "password"}
                name="cvv"
                value={cardData.cvv}
                onChange={handleCardChange}
                placeholder="Enter CVV"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCVV(!showCVV)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCVV ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#0c7bb3] border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="block text-sm font-medium text-gray-900">Save my information</span>
            </div>
          </label>
        </div>

        <button
          className="px-8 py-3 bg-gray-300 text-gray-600 text-sm font-medium rounded-full cursor-not-allowed"
          disabled
        >
          Save (Card Placeholder)
        </button>
      </div>
    </div>
  );
}