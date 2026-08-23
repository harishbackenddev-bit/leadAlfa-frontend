import React from 'react';
import TotalAmountCard from './components/TotalAmountCard';
import TransactionsHistory from './components/TransactionsHistory';

export default function MyEarnings() {
  const totalAmount = 240.00;

  const transactions = [
    { id: '#123456', name: 'Ann Press', date: 'Jun 26 2025', amount: 20.00 },
    { id: '#123456', name: 'Gustavo Botosh', date: 'Jun 24 2025', amount: 44.32 },
    { id: '#123456', name: 'Desirae Mango', date: 'Jun 21 2025', amount: 76.90 },
    { id: '#123456', name: 'Zain Schleifer', date: 'Jun 16 2025', amount: 65.78 },
    { id: '#123456', name: 'Haylie Torff', date: 'Jun 14 2025', amount: 90.13 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TotalAmountCard totalAmount={totalAmount} />
        <TransactionsHistory transactions={transactions} />
      </div>
    </div>
  );
}
