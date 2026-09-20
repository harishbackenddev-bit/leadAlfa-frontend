import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

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