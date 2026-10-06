import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building,
  Check,
  Lock,
  ShieldCheck,
  User,
  Wallet,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/authSlice";
import {
  BackLink,
  Pill,
  SUPPORT_EMAIL,
  card,
  fullName,
} from "../MyEarnings/components/earnings";
import {
  getTradeSafeStatus,
  submitTradeSafeDetails,
} from "../../../services/api/apiservices";

const input =
  "w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#101727] focus:outline-none focus:border-[#0c7bb3]";
const label = "block text-[13px] font-semibold text-[#101727] mb-[7px]";
const hint = "text-xs text-[#606977] mt-[7px]";
const panel =
  "rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-4";

// 🔥 SA Banks list (missing था)
const BANKS = [
  "ABSA",
  "Capitec",
  "First National Bank (FNB)",
  "Nedbank",
  "Standard Bank",
  "TymeBank",
  "African Bank",
  "Bidvest Bank",
  "Discovery Bank",
  "Investec",
];

// 🔥 Bank code mapping for TradeSafe (अगर backend चाहे)
const BANK_VALUES = {
  "ABSA": "ABSA",
  "Capitec": "CAPITEC",
  "First National Bank (FNB)": "FNB",
  "Nedbank": "NEDBANK",
  "Standard Bank": "STANDARD_BANK",
  "TymeBank": "TYMEBANK",
  "African Bank": "AFRICAN_BANK",
  "Bidvest Bank": "BIDVEST_BANK",
  "Discovery Bank": "DISCOVERY_BANK",
  "Investec": "INVESTEC",
};

const ACCOUNT_KINDS = {
  individual: {
    title: "Individual",
    copy: "Use your legal name, South African ID or foreign passport number, and a personal bank account.",
    idLabel: "South African ID or passport number",
    idHint: "Use your South African ID number or foreign passport number.",
  },
  business: {
    title: "Business",
    copy: "Use your company registration number, business bank account, and supporting CIPC documentation.",
    idLabel: "Company registration number",
    idHint: "Use the registration number on your CIPC documents.",
  },
};

const FLOW = [
  ["Funds received", "Brand payment enters TradeSafe escrow."],
  ["Escrow", "Funds are held until release conditions are met."],
  ["Release approved", "TradeSafe approves release after verification and review."],
  ["Bank payout", "Approved funds are settled to your South African bank account."],
];

function PanelHeading({ Icon, title, children, white }) {
  return (
    <div className="flex gap-3 items-center">
      <span
        className={`size-9 shrink-0 rounded-full flex items-center justify-center text-[#0c7bb3] ${
          white ? "bg-white" : "bg-[#eaf6fb]"
        }`}
      >
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm font-bold text-[#101727]">{title}</p>
        <p className="text-[13px] leading-[1.4] text-[#606977] mt-[3px]">
          {children}
        </p>
      </div>
    </div>
  );
}

export default function BankAccountSetup() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const profile = user?.profile;
  const phone = profile?.phoneNumber || user?.phoneNumber || "";

  const [kind, setKind] = useState("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔥 Existing TradeSafe registration info
  const [tradeSafeData, setTradeSafeData] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [form, setForm] = useState({
    bank: "",
    accountType: "Cheque / Current",
    accountNumber: "",
    idNumber: "",
    email: profile?.email || user?.email || "",
    mobile: phone.includes("*") ? "" : phone,
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // ---------- Fetch TradeSafe status ----------
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingStatus(true);
        const res = await getTradeSafeStatus();
        const data = res?.data || res;
        if (data) {
          setTradeSafeData(data);

          // Prefill bank details if available
          if (data.bankDetails) {
            setForm((prev) => ({
              ...prev,
              bank: data.bankDetails.bank || prev.bank,
              accountType: data.bankDetails.accountType || prev.accountType,
              accountNumber:
                data.bankDetails.accountNumber || prev.accountNumber,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load TradeSafe status:", err);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, []);

  // ---------- Submit ----------
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate
    if (!form.bank || !form.accountNumber || !form.idNumber) {
      setError("Please fill all required fields");
      return;
    }
    if (form.accountNumber.length < 6) {
      setError("Account number must be at least 6 digits");
      return;
    }

    setIsSubmitting(true);

    try {
      // Map display bank name → backend value
      const bankValue = BANK_VALUES[form.bank] || form.bank;

      // Map account type
      const accountTypeMap = {
        "Cheque / Current": "CHEQUE",
        "Savings": "SAVINGS",
        "Transmission": "TRANSMISSION",
      };

      await submitTradeSafeDetails({
        bank: bankValue,
        accountType: accountTypeMap[form.accountType] || "CHEQUE",
        accountNumber: form.accountNumber,
        // अगर backend idNumber/mobile accept करे तो add करो
        // idNumber: form.idNumber,
        // mobile: form.mobile,
      });

      setSuccess("Bank account registered successfully!");
      setTimeout(() => {
        navigate("/creator/earnings/bank-accounts");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to register. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Existing registered account view ----------
  const isRegistered = Boolean(tradeSafeData?.registered);

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 py-6 lg:py-8 flex flex-col gap-6">
        <BackLink to="/creator/earnings">Back to Earnings</BackLink>

        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#101727]">
            South African bank payout setup
          </h1>
          <p className="text-sm text-[#606977] mt-1.5">
            Set up a valid South African bank account for TradeSafe escrow
            payouts. Choose your account type, confirm your identity, and enter
            the bank details exactly as they appear on your bank statement.
          </p>
        </div>

        {/* Status banner (if already registered) */}
        {isRegistered && (
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Account already registered</p>
              <p className="text-blue-700">
                You already have a registered payout account. Submitting new
                details will replace the existing one and may require fresh
                verification.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] items-start">
          <form onSubmit={submit} className={`${card} overflow-hidden`}>
            <div className="p-4 sm:p-6 border-b border-[#e2e8f0]">
              <h2 className="text-xl font-bold text-[#101727]">
                TradeSafe escrow payout details
              </h2>
              <p className="text-[13px] text-[#606977] mt-1">
                Complete the required fields below to enable payouts from
                TradeSafe escrow to your South African bank account.
              </p>
            </div>

            <div className="p-4 sm:p-6 flex flex-col gap-5">
              {/* Account type */}
              <fieldset>
                <legend className="text-[13px] font-bold text-[#101727] mb-3">
                  Account type
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(ACCOUNT_KINDS).map(([key, k]) => (
                    <label
                      key={key}
                      className={`cursor-pointer rounded-[10px] border p-4 flex flex-col gap-3 ${
                        kind === key
                          ? "border-[#0c7bb3] bg-[#eaf6fb]"
                          : "border-[#e2e8f0] bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="kind"
                        value={key}
                        checked={kind === key}
                        onChange={() => setKind(key)}
                        className="sr-only"
                      />
                      <span className="flex items-center justify-between">
                        <span
                          className={`size-[18px] rounded-full flex items-center justify-center ${
                            kind === key
                              ? "bg-[#0c7bb3] text-white"
                              : "border border-[#cbd5e1] bg-white"
                          }`}
                        >
                          {kind === key && (
                            <Check size={12} strokeWidth={3} />
                          )}
                        </span>
                        {kind === key && (
                          <span className="text-xs font-bold text-[#0c7bb3]">
                            Selected
                          </span>
                        )}
                      </span>
                      <span>
                        <span className="block text-[15px] font-bold text-[#101727]">
                          {k.title}
                        </span>
                        <span className="block text-[13px] leading-[1.4] text-[#606977] mt-1">
                          {k.copy}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Creator identity */}
              <div className={`${panel} flex flex-col gap-3.5`}>
                <PanelHeading Icon={User} title="Creator identity">
                  This payout account is linked to your profile and will be used
                  for TradeSafe escrow settlements.
                </PanelHeading>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Profile", fullName(user)],
                    ["Email", form.email],
                    ["Mobile", form.mobile || phone],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-lg border border-[#e2e8f0] bg-white p-3 min-w-0"
                    >
                      <p className="text-xs font-bold text-[#606977]">{k}</p>
                      <p className="text-sm font-bold text-[#101727] mt-1 truncate">
                        {v || "Not added"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank details */}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-bold text-[#101727]">
                  Bank details
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bank" className={label}>
                      Bank
                    </label>
                    <select
                      id="bank"
                      required
                      value={form.bank}
                      onChange={set("bank")}
                      className={input}
                    >
                      <option value="" disabled>
                        Select your bank
                      </option>
                      {BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="accountType" className={label}>
                      Account type
                    </label>
                    <select
                      id="accountType"
                      value={form.accountType}
                      onChange={set("accountType")}
                      className={input}
                    >
                      <option>Cheque / Current</option>
                      <option>Savings</option>
                      <option>Transmission</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="accountNumber" className={label}>
                    Account number
                  </label>
                  <input
                    id="accountNumber"
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    pattern="\d{6,16}"
                    title="6 to 16 digits, numbers only"
                    value={form.accountNumber}
                    onChange={set("accountNumber")}
                    className={input}
                  />
                  <p className={hint}>
                    Enter the account number exactly as it appears on your bank
                    statement.
                  </p>
                </div>
              </div>

              {/* Verification */}
              <div className={`${panel} flex flex-col gap-3.5`}>
                <PanelHeading
                  Icon={ShieldCheck}
                  title="Verification requirements"
                >
                  TradeSafe uses AVS to match the account holder with the bank
                  record. Verification may be required before payouts are
                  released.
                </PanelHeading>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="idNumber" className={label}>
                      {ACCOUNT_KINDS[kind].idLabel}
                    </label>
                    <input
                      id="idNumber"
                      type="password"
                      required
                      autoComplete="off"
                      value={form.idNumber}
                      onChange={set("idNumber")}
                      className={input}
                    />
                    <p className={hint}>{ACCOUNT_KINDS[kind].idHint}</p>
                  </div>
                  <div>
                    <label htmlFor="email" className={label}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      className={input}
                    />
                    <p className={hint}>
                      This email will receive payout notifications and
                      verification updates.
                    </p>
                  </div>
                </div>
                <div>
                  <label htmlFor="mobile" className={label}>
                    Mobile number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    pattern="(\+27|0)[\s\d]{9,12}"
                    title="A South African number, e.g. +27 82 000 0000"
                    value={form.mobile}
                    onChange={set("mobile")}
                    className={input}
                  />
                  <p className={hint}>
                    Use a valid South African mobile number for verification and
                    payout alerts.
                  </p>
                </div>
              </div>

              {/* Info panel */}
              <div className="rounded-[10px] bg-[#eaf6fb] p-4 flex flex-col gap-3">
                <PanelHeading
                  Icon={ShieldCheck}
                  title="AVS / FICA verification"
                  white
                >
                  TradeSafe may withhold payouts until the account holder
                  matches the bank record. Changing banking details may trigger
                  fresh verification.
                </PanelHeading>
                <ul className="list-disc pl-5 marker:text-[#0c7bb3] text-[13px] leading-[1.4] text-[#606977] flex flex-col gap-2">
                  <li>
                    Use a valid South African bank account in your legal name.
                  </li>
                  <li>
                    Enter the account number exactly as it appears on your bank
                    statement.
                  </li>
                  <li>
                    Verification timing depends on bank response and TradeSafe
                    review.
                  </li>
                </ul>
              </div>

              {/* Flow */}
              <div className={`${panel} flex flex-col gap-3.5`}>
                <PanelHeading Icon={Wallet} title="Escrow-to-payout flow">
                  Funds move from brand payment into escrow, then release to your
                  bank account after approval.
                </PanelHeading>
                <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {FLOW.map(([title, copy], i) => (
                    <li
                      key={title}
                      className="rounded-lg border border-[#e2e8f0] bg-white p-3"
                    >
                      <span className="flex items-center gap-2">
                        <span className="size-5 rounded-full bg-[#eaf6fb] text-[11px] font-bold text-[#0c7bb3] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-[13px] font-bold text-[#101727]">
                          {title}
                        </span>
                      </span>
                      <p className="text-xs leading-[1.4] text-[#606977] mt-2">
                        {copy}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Error / Success */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  <Check className="h-5 w-5 shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              {/* Confirm */}
              <label className="flex gap-3 items-start text-[13px] leading-normal text-[#101727] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="size-[18px] mt-0.5 shrink-0 accent-[#0c7bb3]"
                />
                I confirm that I am the account holder and that the details
                above are accurate. I understand that TradeSafe may withhold
                payouts until verification is complete.
              </label>
            </div>

            {/* Submit */}
            <div className="flex flex-wrap justify-end gap-3 bg-[#f8fafc] border-t border-[#e2e8f0] p-4 sm:p-6">
              <Link
                to="/creator/earnings/bank-accounts"
                className="flex items-center h-11 px-[18px] rounded-lg border border-[#e2e8f0] bg-white text-sm font-semibold text-[#101727]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="main-btn flex items-center gap-2 h-11 px-[18px] rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Save bank account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            {isRegistered && tradeSafeData && (
              <div className={`${card} shadow-none p-5 flex flex-col gap-4`}>
                <div className="flex flex-col gap-2.5 items-start">
                  <p className="text-base font-bold text-[#101727]">
                    Current payout account
                  </p>
                  <Pill
                    tone={
                      tradeSafeData.status === "VERIFIED" ? "green" : "amber"
                    }
                  >
                    {tradeSafeData.status === "VERIFIED"
                      ? "Verified"
                      : "Needs verification"}
                  </Pill>
                </div>
                <span className="size-[42px] rounded-lg bg-[#eaf6fb] text-[#0c7bb3] flex items-center justify-center">
                  <Building size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#101727]">
                    TradeSafe Verified Account
                  </p>
                  <p className="text-[13px] text-[#606977] mt-1 font-mono">
                    ID: {tradeSafeData.tradeSafeUserId || "—"}
                  </p>
                </div>
                <p className="text-[13px] leading-normal text-[#606977]">
                  Saving new details starts verification. TradeSafe will review
                  the account holder match before enabling payouts.
                </p>
              </div>
            )}

            <div className="rounded-xl bg-[#eaf6fb] p-5">
              <p className="flex gap-3 items-center text-sm font-bold text-[#101727]">
                <ShieldCheck size={18} className="text-[#0c7bb3]" />
                Your details stay protected
              </p>
              <p className="text-[13px] leading-[1.55] text-[#606977] mt-3">
                Bank details are encrypted in transit and at rest. TradeSafe
                never asks for your banking password, PIN, or one-time password.
              </p>
            </div>

            <div className={`${card} shadow-none p-5`}>
              <p className="text-sm font-bold text-[#101727]">
                Popular supported banks
              </p>
              <p className="text-[13px] leading-[1.65] text-[#606977] mt-2.5">
                {BANKS.join(" · ")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}