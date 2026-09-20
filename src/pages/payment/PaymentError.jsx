import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentError() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get("reason") || searchParams.get("message");
  const reference = searchParams.get("reference");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-6">
          {reason ||
            "Your payment could not be processed. Please try again or use a different payment method."}
        </p>

        {reference && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 mb-1">Reference</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {reference}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-[#0C7BB3] text-white rounded-lg hover:bg-[#0353A4] transition-colors font-medium"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/brand/campaigns")}
            className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Campaigns
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Need help? Contact support at support@creatrend.com
        </p>
      </div>
    </div>
  );
}