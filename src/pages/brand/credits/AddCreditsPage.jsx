import React, { useState } from "react";
import AddCredit from "./components/AddCredit";
import CheckoutPage from "./CheckoutPage";

export default function AddCreditsPage() {
  const [selectedPack, setSelectedPack] = useState(null);

  function handleBuy(pack) {
    setSelectedPack(pack);
  }

  function handleCloseCheckout() {
    setSelectedPack(null);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedPack ? (
          <div>
            <CheckoutPage pack={selectedPack} onClose={handleCloseCheckout} />
          </div>
        ) : (
          <AddCredit onBuy={handleBuy} />
        )}
      </div>
    </div>
  );
}
