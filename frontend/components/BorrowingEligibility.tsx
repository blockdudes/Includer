"use client";
import { useAppSelector } from "@/lib/hooks";
import React from "react";

const BorrowingEligibility = () => {
  const { contractBalance } = useAppSelector((state) => state.user);
  return (
    <div className="bg-card-background-gradient shadow-card-shadow p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Borrowing Eligibility</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card-background-gradient shadow-card-shadow p-4 rounded-lg flex flex-col">
          <h3 className="font-semibold mb-2">Maximum Borrowable Amount</h3>
          <p className="text-3xl font-bold">
            $
            {(Number(contractBalance?.total_deposit_balance) * 0.8)
              .toFixed(2)
              .toLocaleString()}
          </p>
          <p className="text-sm text-white/90">(80% of locked Super Savings)</p>
        </div>
        <div className="bg-card-background-gradient shadow-card-shadow p-4 rounded-lg flex flex-col">
          <h3 className="font-semibold mb-2">Interest Rates</h3>
          <ul className="space-y-1 text-sm">
            <li>0-40% borrowed: 2% interest rate</li>
            <li>41-60% borrowed: 3% interest rate</li>
            <li>61-80% borrowed: 4% interest rate</li>
          </ul>
        </div>
      </div>
      <div className="mt-4 p-4 bg-card-background-gradient shadow-card-shadow rounded-lg">
        <h3 className="font-semibold mb-2">Loan Terms</h3>
        <p className="text-sm text-white/90">
          All loans must be repaid by the specified due date. Repayment can be
          made flexibly within the selected term, allowing you to repay in any
          amount and at any time before the due date. When a loan is availed,
          the borrowed amount, specified interest, and an additional 5% penalty
          are locked and will not be credited to your account even if your Super
          Savings matures. Upon repayment or term expiry, the remaining loan
          amount along with penalty for non-payment will be automatically
          deducted from this locked amount before crediting the remaining
          balance, if any, to your Savings account. Early repayment will result
          in the immediate release of locked funds.
        </p>
      </div>
    </div>
  );
};

export default BorrowingEligibility;
