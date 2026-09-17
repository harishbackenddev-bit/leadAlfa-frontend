import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import {
  getTradeSafeStatus,
  submitTradeSafeDetails,
} from "../../../../services/api/apiservices";

const SA_BANK_OPTIONS = [
  { label: "ABSA Bank", value: "ABSA" },
  { label: "Access Bank", value: "ACCESS" },
  { label: "African Bank", value: "AFRICAN" },
  { label: "Bank Zero", value: "BANKZERO" },
  { label: "Bidvest Bank", value: "BIDVEST" },
  { label: "Capitec Bank", value: "CAPITEC" },
  { label: "Capitec Business", value: "CAPITEC_BUSINESS" },
  { label: "Discovery Bank", value: "DISCOVERY" },
  { label: "FNB", value: "FNB" },
  { label: "Investec Bank", value: "INVESTEC" },
  { label: "Ithala", value: "ITHALA" },
  { label: "Mercantile", value: "MERCANTILE" },
  { label: "Nedbank", value: "NEDBANK" },
  { label: "RMB Private Bank", value: "RMB" },
  { label: "Sasfin Bank", value: "SASFIN" },
  { label: "Standard Bank SA", value: "SBSA" },
  { label: "TymeBank", value: "TYME" },
  { label: "Other Bank", value: "OTHER" },
];

const BANK_ACCOUNT_TYPES = [
  { label: "Savings Account", value: "SAVINGS" },
  { label: "Cheque Account", value: "CHEQUE" },
];

export default function CreatorPayoutSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    accountNumber: "",
    bank: "SBSA",
    accountType: "CHEQUE",
  });

  // ============================================================
  // FETCH STATUS
  // ============================================================
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const res = await getTradeSafeStatus();
        const data = res?.data || res;
        setStatusData(data);
        console.log("📊 Creator TradeSafe status:", data);
      } catch (err) {
        console.error("Failed to load status:", err);
        setError(err?.message || "Failed to load payout settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!formData.bank || !formData.accountNumber) {
      setError("Bank name and account number are required");
      return;
    }

    if (formData.accountNumber.length < 6) {
      setError("Account number must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitTradeSafeDetails({
        bank: formData.bank,
        accountType: formData.accountType,
        accountNumber: formData.accountNumber,
      });

      const data = res?.data || res;

      setSuccess("Payout details submitted! Verification pending.");
      setStatusData(data);

      // Refetch
      const statusRes = await getTradeSafeStatus();
      const statusData = statusRes?.data || statusRes;
      setStatusData(statusData);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err?.message || "Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-4">
          Payout Settings (TradeSafe)
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  const isRegistered = Boolean(statusData?.registered);
  const isVerified = statusData?.status === "VERIFIED";

  // ============================================================
  // ✅ REGISTERED — SHOW DETAILS ONLY
  // ============================================================
  if (isRegistered) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-4">
          Payout Settings (TradeSafe)
        </h2>

        <div
          className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${
            isVerified
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {isVerified ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {isVerified
                ? "Payout Account Verified"
                : "Verification Pending"}
            </p>
            <p className={isVerified ? "text-emerald-700" : "text-blue-700"}>
              {isVerified
                ? "Your bank account is verified. You'll receive payouts securely."
                : "Your payout account is being verified. This usually takes a few minutes."}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="TradeSafe User ID" value={statusData.tradeSafeUserId || "—"} mono />
          <DetailRow label="Reference" value={statusData.tradeSafeReference || "—"} mono />
          <DetailRow
            label="TradeSafe Status"
            value={
              <StatusBadge tone={isVerified ? "success" : "warning"}>
                {statusData.status || "PENDING"}
              </StatusBadge>
            }
          />
          <DetailRow
            label="KYC Status"
            value={
              <StatusBadge tone={statusData.kycStatus === "VERIFIED" ? "success" : "warning"}>
                {statusData.kycStatus || "PENDING"}
              </StatusBadge>
            }
          />
          <DetailRow
            label="Bank Verification"
            value={
              <StatusBadge tone={statusData.bankVerificationStatus === "VERIFIED" ? "success" : "warning"}>
                {statusData.bankVerificationStatus || "PENDING"}
              </StatusBadge>
            }
          />
        </div>

        {isVerified && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-xs text-emerald-700">
            <Shield className="h-4 w-4" />
            <span>Payout ready. Funds will auto-transfer to your bank account.</span>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // ❌ NOT REGISTERED — SHOW FORM
  // ============================================================
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-extrabold font-anton text-gray-900 mb-4">
        Verify Bank Account (TradeSafe)
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter your bank account details to receive payouts securely via TradeSafe.
      </p>

      <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 mb-4">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">No Payout Account</p>
          <p className="text-yellow-700">
            Register your bank account to receive payments.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter Account Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Account Type <span className="text-red-500">*</span>
          </label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BANK_ACCOUNT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <select
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !formData.bank || !formData.accountNumber || formData.accountNumber.length < 6}
        className={`px-8 py-3 text-sm font-medium rounded-full transition-colors ${
          isSubmitting || !formData.bank || !formData.accountNumber || formData.accountNumber.length < 6
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#1E60DB] text-white hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit for Verification"
        )}
      </button>
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-sm ${mono ? "font-mono" : "font-medium"} text-gray-900`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ tone, children }) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-yellow-50 text-yellow-700",
    neutral: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}