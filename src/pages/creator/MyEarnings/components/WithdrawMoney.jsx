import React, { useEffect, useState, useMemo } from "react";
import { zar } from "./earnings";

const MIN_WITHDRAWAL = 10;
const QUICK_AMOUNTS = [100, 500, 1000];
const STRIPE_FEE_PERCENT = 0.029;
const STRIPE_FEE_FIXED = 0.3;

export default function WithdrawMoney({
  isOpen,
  onClose,
  totalAmount = 0,
  onWithdraw,
}) {
  const [step, setStep] = useState("amount");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [stripeEmail, setStripeEmail] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
  });
  const [error, setError] = useState("");

  // ---------- Reset on close ----------
  useEffect(() => {
    if (!isOpen) {
      setStep("amount");
      setWithdrawAmount("");
      setPaymentMethod("");
      setStripeEmail("");
      setBankDetails({
        accountHolder: "",
        accountNumber: "",
        routingNumber: "",
        bankName: "",
      });
      setError("");
    }
  }, [isOpen]);

  // ---------- Lock body scroll ----------
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ---------- Derived values ----------
  const amount = useMemo(() => parseFloat(withdrawAmount) || 0, [withdrawAmount]);

  const stripeFee = useMemo(
    () => (paymentMethod === "stripe" ? amount * STRIPE_FEE_PERCENT + STRIPE_FEE_FIXED : 0),
    [paymentMethod, amount]
  );

  const youReceive = useMemo(
    () => (paymentMethod === "bank" ? amount : Math.max(amount - stripeFee, 0)),
    [paymentMethod, amount, stripeFee]
  );

  const isAmountValid = useMemo(
    () => !isNaN(amount) && amount >= MIN_WITHDRAWAL && amount <= totalAmount,
    [amount, totalAmount]
  );

  // ---------- Handlers ----------
  const handleQuickSelect = (value) => {
    setError("");
    if (value === "all") {
      setWithdrawAmount(totalAmount.toFixed(2));
    } else {
      setWithdrawAmount(value.toString());
    }
  };

  const handleContinue = () => {
    if (!isAmountValid) {
      setError(`Please enter a valid amount (min ${zar(MIN_WITHDRAWAL)})`);
      return;
    }
    setError("");
    setStep("payment");
  };

  const handleBack = () => {
    setStep("amount");
    setPaymentMethod("");
    setError("");
  };

  const handleWithdrawNow = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

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

    setError("");
    setStep("loading");

    try {
      // Optional: pass a callback from parent that handles the API call
      if (typeof onWithdraw === "function") {
        await onWithdraw({
          amount,
          paymentMethod,
          stripeEmail: paymentMethod === "stripe" ? stripeEmail : null,
          bankDetails: paymentMethod === "bank" ? bankDetails : null,
          youReceive,
          stripeFee,
        });
      } else {
        // Simulated delay if no callback provided
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setStep("success");
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError(err?.message || "Withdrawal failed. Please try again.");
      setStep("payment");
    }
  };

  const handleDone = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* ---------- STEP: AMOUNT ---------- */}
        {step === "amount" && (
          <>
            <Header title="Withdraw Money" onClose={onClose} />

            <BalanceCard totalAmount={totalAmount} />

            <div className="mb-2">
              <label className="block text-sm font-medium text-[#101727] mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606977]">
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
                  className="w-full pl-8 pr-4 py-3 border border-[#e2e8f0] rounded-lg text-[#101727] focus:outline-none focus:border-[#0c7bb3]"
                />
              </div>
            </div>

            <p className="text-sm text-[#606977] mb-4">
              Minimum withdrawal: {zar(MIN_WITHDRAWAL)}
            </p>

            <QuickSelect
              amounts={QUICK_AMOUNTS}
              totalAmount={totalAmount}
              onSelect={handleQuickSelect}
            />

            {error && <ErrorBox message={error} />}

            <button
              onClick={handleContinue}
              disabled={!isAmountValid}
              className="w-full py-3 main-btn text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </>
        )}

        {/* ---------- STEP: PAYMENT ---------- */}
        {step === "payment" && (
          <>
            <Header title="Payment Method" onClose={onClose} />

            <SummaryCard
              amount={amount}
              stripeFee={stripeFee}
              youReceive={youReceive}
            />

            <p className="text-sm font-medium text-[#101727] mb-3">
              Select Payment Method
            </p>

            <PaymentOption
              id="stripe"
              icon={<StripeIcon />}
              iconBg="bg-[#635BFF]"
              title="Stripe"
              subtitle={`Instant transfer • 2.9% + ${zar(STRIPE_FEE_FIXED)}`}
              selected={paymentMethod === "stripe"}
              onSelect={() => setPaymentMethod("stripe")}
            >
              <label className="block text-sm font-medium text-[#101727] mb-2">
                Email Address for Stripe
              </label>
              <input
                type="email"
                value={stripeEmail}
                onChange={(e) => setStripeEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg text-[#101727] focus:outline-none focus:border-[#0c7bb3]"
              />
              <p className="text-sm text-[#606977] mt-2">
                Funds will be sent to your Stripe Connect account
              </p>
            </PaymentOption>

            <PaymentOption
              id="bank"
              icon={<BankIcon />}
              iconBg="bg-[#10B981]"
              title="Bank Transfer"
              subtitle="2-3 business days • No fees"
              selected={paymentMethod === "bank"}
              onSelect={() => setPaymentMethod("bank")}
            >
              <BankFields bankDetails={bankDetails} setBankDetails={setBankDetails} />
            </PaymentOption>

            {error && <ErrorBox message={error} />}

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 bg-[#f8fafc] text-[#101727] font-medium rounded-full hover:bg-[#eaf6fb] transition-colors"
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

        {/* ---------- STEP: LOADING ---------- */}
        {step === "loading" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 border-4 border-[#e2e8f0] border-t-[#1E60DB] rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-[#606977]">Processing your withdrawal...</p>
          </div>
        )}

        {/* ---------- STEP: SUCCESS ---------- */}
        {step === "success" && (
          <>
            <Header title="Success" onClose={onClose} />

            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon />
              </div>
              <h4 className="text-xl font-bold text-[#101727] mb-2">
                Withdrawal Successful!
              </h4>
              <p className="text-sm text-[#606977] mb-6">
                Your withdrawal of {zar(amount)} has been processed successfully.
              </p>
            </div>

            <SuccessSummary
              amount={amount}
              paymentMethod={paymentMethod}
              youReceive={youReceive}
            />

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

// ============================================================================
// Sub-components
// ============================================================================

function Header({ title, onClose }) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#101727]">{title}</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute cursor-pointer top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-[#606977] hover:bg-[#f8fafc]"
        >
          <span className="text-3xl leading-none">×</span>
        </button>
      </div>
      <div className="border-t border-[#e2e8f0] mb-4" />
    </>
  );
}

function BalanceCard({ totalAmount }) {
  return (
    <div className="bg-[#f8fafc] rounded-lg p-4 mb-6">
      <p className="text-sm text-[#606977] mb-1">Available Balance</p>
      <p className="text-2xl text-[#101727]">{zar(totalAmount)}</p>
    </div>
  );
}

function QuickSelect({ amounts, totalAmount, onSelect }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-[#101727] mb-3">Quick Select</p>
      <div className="grid grid-cols-4 gap-3">
        {amounts.map((val) => (
          <button
            key={val}
            onClick={() => onSelect(val)}
            disabled={val > totalAmount}
            className="py-3 border border-[#e2e8f0] rounded-lg text-sm text-[#101727] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            R {val}
          </button>
        ))}
        <button
          onClick={() => onSelect("all")}
          className="py-3 border border-[#e2e8f0] rounded-lg text-sm text-[#101727] hover:bg-[#f8fafc]"
        >
          All
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ amount, stripeFee, youReceive }) {
  return (
    <div className="bg-[#f8fafc] rounded-lg p-4 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-[#606977]">Withdrawal Amount</span>
        <span className="text-lg text-[#101727]">{zar(amount)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-[#606977]">Processing Fee</span>
        <span className="text-sm text-[#606977]">{zar(stripeFee)}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-[#e2e8f0]">
        <span className="text-sm font-medium text-[#101727]">
          You'll Receive
        </span>
        <span className="text-lg text-[#101727]">{zar(youReceive)}</span>
      </div>
    </div>
  );
}

function PaymentOption({ icon, iconBg, title, subtitle, selected, onSelect, children }) {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg p-4 mb-3 cursor-pointer transition-colors ${
        selected ? "border-[#1E60DB] border-2" : "border-[#e2e8f0]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <p className="font-medium text-[#101727]">{title}</p>
            <p className="text-sm text-[#606977]">{subtitle}</p>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-[#1E60DB] bg-[#1E60DB]" : "border-[#e2e8f0]"
          }`}
        >
          {selected && <CheckIcon small />}
        </div>
      </div>

      {selected && children && (
        <div className="mt-4 pt-4 border-t border-[#e2e8f0]">{children}</div>
      )}
    </div>
  );
}

function BankFields({ bankDetails, setBankDetails }) {
  const update = (key, value) =>
    setBankDetails((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#101727] mb-2">
          Account Holder Name
        </label>
        <input
          type="text"
          value={bankDetails.accountHolder}
          onChange={(e) => update("accountHolder", e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg text-[#101727] focus:outline-none focus:border-[#0c7bb3]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#101727] mb-2">
          Account Number
        </label>
        <input
          type="text"
          value={bankDetails.accountNumber}
          onChange={(e) => update("accountNumber", e.target.value)}
          placeholder="1234567890"
          className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg text-[#101727] focus:outline-none focus:border-[#0c7bb3]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#101727] mb-2">
          Routing Number
        </label>
        <input
          type="text"
          value={bankDetails.routingNumber}
          onChange={(e) => update("routingNumber", e.target.value)}
          placeholder="123456789"
          className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg text-[#101727] focus:outline-none focus:border-[#0c7bb3]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#101727] mb-2">
          Bank Name
        </label>
        <input
          type="text"
          value={bankDetails.bankName}
          onChange={(e) => update("bankName", e.target.value)}
          placeholder="Chase Bank"
          className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg text-[#101727] focus:outline-none focus:border-[#0c7bb3]"
        />
      </div>
    </div>
  );
}

function SuccessSummary({ amount, paymentMethod, youReceive }) {
  return (
    <div className="bg-[#f8fafc] rounded-lg p-4 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-[#606977]">Amount</span>
        <span className="text-sm font-medium text-[#101727]">
          {zar(amount)}
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-[#606977]">Method</span>
        <span className="text-sm font-medium text-[#101727]">
          {paymentMethod === "stripe" ? "Stripe" : "Bank Transfer"}
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-[#606977]">You'll Receive</span>
        <span className="text-sm font-medium text-[#101727]">
          {zar(youReceive)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-[#606977]">Processing Time</span>
        <span className="text-sm font-medium text-[#101727]">
          {paymentMethod === "stripe" ? "Instant" : "2-3 business days"}
        </span>
      </div>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </div>
  );
}

function CheckIcon({ small = false }) {
  const size = small ? "w-3 h-3" : "w-8 h-8";
  return (
    <svg className={`${size} text-white`} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StripeIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 12h4M13 12h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 12h4M13 12h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}