import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import axiosInstance from "../../services/api/axiosInstance"; // apna path check karo

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Extract ALL params TradeSafe sends
  const action = searchParams.get("action");           // "complete"
  const method = searchParams.get("method");           // "card"
  const reason = searchParams.get("reason");           // "success"
  const transactionId = searchParams.get("transactionId");  // TradeSafe transaction ID
  const reference = searchParams.get("reference");     // "SIT-X5J9KSPP"

  // Confirmation state
  const [isConfirming, setIsConfirming] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  // ============================================================
  // ✅ AUTO-TRIGGER WEBHOOK ON MOUNT
  // ============================================================
  useEffect(() => {
    const triggerWebhook = async () => {
      try {
        setIsConfirming(true);
        setConfirmError(null);

        // ✅ Build webhook payload (TradeSafe event format)
        const webhookPayload = {
          event: "FUNDS_RECEIVED",
          data: {
            tokenId: transactionId
          },
        };

        console.log("🔄 Triggering webhook:");
        console.log(JSON.stringify(webhookPayload, null, 2));

        const response = await axiosInstance.post(
          "/webhook/tradesafe",
          webhookPayload
        );

        console.log("✅ Webhook response:", response.data);

        if (response.data?.error) {
          throw new Error(response.data.error);
        }

        setIsConfirmed(true);
      } catch (err) {
        console.error("❌ Webhook trigger error:", err);
        setConfirmError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to confirm payment"
        );
      } finally {
        setIsConfirming(false);
      }
    };

    // Only trigger if we have transactionId or reference
    if (transactionId || reference) {
      triggerWebhook();
    } else {
      setIsConfirming(false);
      setIsConfirmed(true);
    }
  }, [transactionId, reference]);

  // ============================================================
  // RETRY HANDLER
  // ============================================================
  const handleRetry = async () => {
    setIsConfirming(true);
    setConfirmError(null);

    try {
      await axiosInstance.post("/webhook/tradesafe", {
        event: "FUNDS_RECEIVED",
        data: {
          tokenId: transactionId,
          reference: reference,
          amount: 0,
        },
      });
      setIsConfirmed(true);
    } catch (err) {
      setConfirmError(
        err?.response?.data?.error || err?.message || "Retry failed"
      );
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment has been received. Funds are secured in escrow.
        </p>

        {/* Confirming state */}
        {isConfirming && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming with server...
          </div>
        )}

        {/* Confirmed state */}
        {isConfirmed && !isConfirming && !confirmError && (
          <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            ✅ Payment confirmed
          </div>
        )}

        {/* Error state with retry */}
        {confirmError && (
          <div className="mb-4 rounded-lg bg-yellow-50 px-4 py-3 text-xs text-yellow-800 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Confirmation pending</p>
                <p className="mt-0.5">{confirmError}</p>
                <p className="mt-1 text-yellow-700">
                  Webhook will update the status shortly.
                </p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 inline-flex items-center gap-1 rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-200"
            >
              <RefreshCw className="h-3 w-3" />
              Retry confirmation
            </button>
          </div>
        )}

        {/* Reference */}
        {reference && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 mb-1">Reference</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {reference}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/brand/campaigns")}
          className="w-full px-6 py-3 bg-[#0C7BB3] text-white rounded-lg hover:bg-[#0353A4] transition-colors font-medium"
        >
          Back to Campaigns
        </button>

        <p className="mt-4 text-xs text-gray-400">
          Funds will be held in escrow until you approve creator work.
        </p>
      </div>
    </div>
  );
}