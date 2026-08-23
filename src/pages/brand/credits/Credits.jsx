import React from "react";
import CreditCard from "./components/CreditCard";
import TransactionsHistory from "../../creator/MyEarnings/components/TransactionsHistory";

export default function Credits() {
  const totalCredit = 240.0;

  const transactions = [
    { id: "#123456", name: "Ann Press", date: "Jun 26 2025", amount: 20.0 },
    {
      id: "#123456",
      name: "Gustavo Botosh",
      date: "Jun 24 2025",
      amount: 44.32,
    },
    { id: "#123456", name: "Desirae Mango", date: "Jun 21 2025", amount: 76.9 },
    {
      id: "#123456",
      name: "Zain Schleifer",
      date: "Jun 16 2025",
      amount: 65.78,
    },
    { id: "#123456", name: "Haylie Torff", date: "Jun 14 2025", amount: 90.13 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CreditCard totalCredit={totalCredit} />
        <TransactionsHistory transactions={transactions} />
      </div>
    </div>
  );
}
