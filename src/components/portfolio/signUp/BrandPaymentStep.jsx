import React from "react";

export default function BrandPaymentStep({
  formData,
  onFormDataChange,
  onNext,
  submitting = false,
}) {
  const handleContinue = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Payment <span className="font-bold">Information</span></h2>
        <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto">
          Enter your payment details below.
        </p>
      </div>

      <form className="flex flex-col gap-6  mx-auto w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          <input
            type="text"
            placeholder="Enter card number"
            value={formData.cardNumber || ""}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                cardNumber: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={formData.expiryDate || ""}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  expiryDate: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
            <input
              type="text"
              placeholder="Enter CVV"
              value={formData.cvv || ""}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  cvv: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            placeholder="Enter cardholder name"
            value={formData.cardholderName || ""}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                cardholderName: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
          <input
            type="text"
            placeholder="Enter billing address"
            value={formData.billingAddress || ""}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                billingAddress: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
          />
        </div>
      </form>

      <div className="flex justify-end sm:gap-10 gap-6 items-center mt-6 mx-auto w-full">
      
        
        <button
              type="button"
              disabled={submitting}
              onClick={onNext}
              className="sm:px-10 px-2 py-3 sm:me-0  text-sm font-medium text-sky-950 rounded-full transition  border border-gray-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              Skip For Now
            </button>
        
        <button
          type="button"
          onClick={handleContinue}
          disabled={submitting}
          className="px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition  disabled:opacity-50 disabled:pointer-events-none main-btn"
        >
          {submitting ? "Please wait..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

// inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 shadow-md h-12 px-10 main-btn rounded-xl sm:min-w-[200px] disabled:opacity-60 disabled:pointer-events-none