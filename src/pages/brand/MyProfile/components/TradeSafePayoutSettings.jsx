import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import {
  getTradeSafeStatus,
  submitTradeSafeDetails,
} from "../../../../services/api/apiservices";

const SA_BANK_OPTIONS = [
  { value: "ABSA", label: "ABSA" },
  { value: "CAPITEC", label: "Capitec" },
  { value: "FNB", label: "FNB" },
  { value: "NEDBANK", label: "Nedbank" },
  { value: "STANDARD_BANK", label: "Standard Bank" },
  { value: "TYMEBANK", label: "TymeBank" },
  { value: "AFRICAN_BANK", label: "African Bank" },
  { value: "BIDVEST_BANK", label: "Bidvest Bank" },
  { value: "DISCOVERY_BANK", label: "Discovery Bank" },
  { value: "INVESTEC", label: "Investec" },
];

const BANK_ACCOUNT_TYPES = [
  { value: "CHEQUE", label: "Cheque / Current" },
  { value: "SAVINGS", label: "Savings" },
  { value: "TRANSMISSION", label: "Transmission" },
];

export default function TradeSafePayoutSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tradeSafeData, setTradeSafeData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    bank: "",
    accountType: "CHEQUE",
    accountNumber: "",
  });

  // ============================================================
  // FETCH STATUS
  // ============================================================
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const res = await getTradeSafeStatus();

        console.log("📊 Full response:", res);

        // ✅ Response shape: { success: true, data: { registered, ... } }
        // getTradeSafeStatus already returns res.data OR res.data.data
        const data = res?.data || res;

        console.log("📊 Extracted data:", data);
        console.log("📊 data.registered:", data?.registered);

        if (data) {
          setTradeSafeData(data);
          setIsRegistered(Boolean(data.registered));

          if (data.bankDetails) {
            setFormData({
              bank: data.bankDetails.bank || "",
              accountType: data.bankDetails.accountType || "CHEQUE",
              accountNumber: data.bankDetails.accountNumber || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load TradeSafe status:", err);
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

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!formData.bank || !formData.accountNumber) {
      setError("Bank name and account number are required");
      return;
    }

    if (formData.accountNumber.length < 6) {
      setError("Account number must be at least 6 digits");
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

      setSuccess("Payout settings registered successfully!");

      // Refetch status
      const statusRes = await getTradeSafeStatus();
      const statusData = statusRes?.data || statusRes;

      if (statusData) {
        setTradeSafeData(statusData);
        setIsRegistered(Boolean(statusData.registered));
      }
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
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payout Settings (TradeSafe)
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  // ============================================================
  // ✅ REGISTERED — SHOW DETAILS ONLY (NO FORM)
  // ============================================================
  if (isRegistered && tradeSafeData) {
    const statusValue =
      tradeSafeData.status || tradeSafeData.tradeSafeStatus || "PENDING";
    const kycStatus = tradeSafeData.kycStatus || "PENDING";
    const bankStatus =
      tradeSafeData.bankVerificationStatus || "PENDING";

    const isVerified = statusValue === "VERIFIED";

    return (
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payout Settings (TradeSafe)
        </h3>

        {/* Status Banner */}
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
            <p
              className={
                isVerified ? "text-emerald-700" : "text-blue-700"
              }
            >
              {isVerified
                ? "Your bank account is registered and verified for payouts."
                : "Your payout account is being verified. This usually takes a few minutes."}
            </p>
          </div>
        </div>

        {/* TradeSafe Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow
            label="TradeSafe User ID"
            value={tradeSafeData.tradeSafeUserId || "—"}
            mono
          />
          <DetailRow
            label="Reference"
            value={tradeSafeData.tradeSafeReference || "—"}
            mono
          />
          <DetailRow
            label="TradeSafe Status"
            value={
              <StatusBadge tone={isVerified ? "success" : "warning"}>
                {statusValue}
              </StatusBadge>
            }
          />
          <DetailRow
            label="KYC Status"
            value={
              <StatusBadge
                tone={kycStatus === "VERIFIED" ? "success" : "warning"}
              >
                {kycStatus}
              </StatusBadge>
            }
          />
          <DetailRow
            label="Bank Verification"
            value={
              <StatusBadge
                tone={bankStatus === "VERIFIED" ? "success" : "warning"}
              >
                {bankStatus}
              </StatusBadge>
            }
          />
        </div>

        {isVerified && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-xs text-emerald-700">
            <Shield className="h-4 w-4" />
            <span>
              Your payout account is ready. Funds will be automatically
              transferred to your bank account.
            </span>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // ❌ NOT REGISTERED — SHOW REGISTRATION FORM
  // ============================================================
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Payout Settings (TradeSafe)
      </h3>

      <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">No Payout Account</p>
          <p className="text-yellow-700">
            Register your bank account to receive payments from campaigns.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Name
          </label>
          <select
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Bank</option>
            {SA_BANK_OPTIONS.map((bank) => (
              <option key={bank.value} value={bank.value}>
                {bank.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {BANK_ACCOUNT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter Account Number"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          !formData.bank ||
          !formData.accountNumber ||
          formData.accountNumber.length < 6
        }
        className={`mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition ${
          isSubmitting ||
          !formData.bank ||
          !formData.accountNumber ||
          formData.accountNumber.length < 6
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          "Register for Payouts"
        )}
      </button>
    </div>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================
function DetailRow({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p
        className={`mt-1 text-sm ${
          mono ? "font-mono" : "font-medium"
        } text-gray-900`}
      >
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
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        tones[tone] || tones.neutral
      }`}
    >
      {children}
    </span>
  );
}