import React from "react";

const SavingsBalanceSummary = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card-background-gradient shadow-card-shadow py-4 px-8 rounded-3xl">
        <h2 className="text-lg font-semibold mb-2">Current Savings Balance</h2>
        <p className="text-2xl font-bold">$0.00</p>
      </div>
      <div className="bg-card-background-gradient shadow-card-shadow py-4 px-8 rounded-3xl">
        <h2 className="text-lg font-semibold mb-2">Super Savings Balance</h2>
        <p className="text-2xl font-bold">$0.00</p>
      </div>
    </div>
  );
};

export default SavingsBalanceSummary;
