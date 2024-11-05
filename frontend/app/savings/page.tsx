import React from "react";
import SavingsBalanceSummary from "@/components/SavingsBalanceSummary";
import SavingsActions from "@/components/SavingsActions";
import SuperSavingsInvestment from "@/components/SuperSavingsInvestment";

const SavingsPage = () => {
  return (
    <div className="h-full w-full overflow-y-scroll p-4">
      <div className="w-full flex flex-col gap-4 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
        <h1 className="text-3xl font-bold">Savings & Investments</h1>
        <SavingsBalanceSummary />
        <SavingsActions />
        <SuperSavingsInvestment />
      </div>
    </div>
  );
};

export default SavingsPage;
