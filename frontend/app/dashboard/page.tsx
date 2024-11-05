"use client";
import React from "react";
import BalanceSummary from "@/components/BalanceSummary";
import RecentTransactionsTable from "@/components/RecentTransactionsTable";
import RecentActivitySummary from "@/components/RecentActivitySummary";
import { useAppSelector } from "@/lib/hooks";
import { redirect } from "next/navigation";

const DashboardPage = () => {
  const { user, loading } = useAppSelector((state) => state.user);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full h-full grid grid-cols-5 grid-rows-3 p-4 gap-4">
      <BalanceSummary />
      <RecentTransactionsTable />
      <RecentActivitySummary />
    </div>
  );
};

export default DashboardPage;
