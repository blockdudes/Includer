import React from "react";
import BalanceSummary from "@/components/BalanceSummary";
import RecentTransactionsTable from "@/components/RecentTransactionsTable";
import RecentActivitySummary from "@/components/RecentActivitySummary";

const DashboardPage = () => {
  return (
    <div className="w-full h-full grid grid-cols-5 grid-rows-3 p-4 gap-4">
      <BalanceSummary />
      <RecentTransactionsTable />
      <RecentActivitySummary />
    </div>
  );
};

export default DashboardPage;
