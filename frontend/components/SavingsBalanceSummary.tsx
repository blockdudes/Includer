"use client";
import { useAppSelector } from "@/lib/hooks";
import React from "react";

const SavingsBalanceSummary = () => {
  const { contractBalance } = useAppSelector((state) => state.user);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card-background-gradient shadow-card-shadow py-10 px-8 rounded-3xl">
        <h2 className="text-lg font-semibold mb-2">Current Savings Balance</h2>
        <p className="text-4xl font-bold">
          ${Number(contractBalance?.total_deposit_balance).toFixed(2)}
        </p>
      </div>
      <div className="bg-card-background-gradient shadow-card-shadow py-10 px-8 rounded-3xl">
        <h2 className="text-lg font-semibold mb-2">Super Savings Balance</h2>
        <p className="text-4xl font-bold">
          ${Number(contractBalance?.total_deposit_balance).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default SavingsBalanceSummary;
