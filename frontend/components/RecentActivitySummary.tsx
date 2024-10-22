import React from "react";
import FinanceLineChart from "./FinanceLineChart";

const RecentActivitySummary = () => {
  const transactions = [
    {
      id: "0001",
      amount: "100",
      to_from: "john@doe.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 100,
    },
    {
      id: "0002",
      amount: "200",
      to_from: "jane@doe.com",
      date: new Date().toLocaleDateString(),
      type: "debit",
      status: "fail",
      closingBalance: 100,
    },
    {
      id: "0003",
      amount: "20",
      to_from: "jane@doe.com",
      date: new Date().toLocaleDateString(),
      type: "debit",
      status: "success",
      closingBalance: 80,
    },
    {
      id: "0004",
      amount: "150",
      to_from: "alice@wonderland.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 230,
    },
    {
      id: "0005",
      amount: "300",
      to_from: "bob@builder.com",
      date: new Date().toLocaleDateString(),
      type: "debit",
      status: "fail",
      closingBalance: 230,
    },
    {
      id: "0006",
      amount: "450",
      to_from: "charlie@chocolate.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 680,
    },
    {
      id: "0007",
      amount: "50",
      to_from: "eve@eden.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 730,
    },
    {
      id: "0001",
      amount: "100",
      to_from: "john@doe.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 830,
    },
    {
      id: "0002",
      amount: "200",
      to_from: "jane@doe.com",
      date: new Date().toLocaleDateString(),
      type: "debit",
      status: "fail",
      closingBalance: 830,
    },
    {
      id: "0003",
      amount: "200",
      to_from: "jane@doe.com",
      date: new Date().toLocaleDateString(),
      type: "debit",
      status: "success",
      closingBalance: 630,
    },
    {
      id: "0004",
      amount: "150",
      to_from: "alice@wonderland.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 780,
    },
    {
      id: "0005",
      amount: "300",
      to_from: "bob@builder.com",
      date: new Date().toLocaleDateString(),
      type: "debit",
      status: "fail",
      closingBalance: 780,
    },
    {
      id: "0006",
      amount: "450",
      to_from: "charlie@chocolate.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 1230,
    },
    {
      id: "0007",
      amount: "50",
      to_from: "eve@eden.com",
      date: new Date().toLocaleDateString(),
      type: "credit",
      status: "success",
      closingBalance: 1280,
    },
  ];

  const recentTransactionData = transactions
    .filter((transaction) => transaction.status === "success")
    .map((transaction) => transaction.closingBalance);
  const recentTransactionLabels = transactions
    .filter((transaction) => transaction.status === "success")
    .map((transaction) => transaction.date);

  return (
    <div className="col-span-3 row-span-2 flex flex-col gap-4 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
      <h1 className="text-2xl font-semibold">Recent Activity Summary</h1>
      <div className="h-[calc(100%-3rem)] w-full flex items-center gap-4">
        <FinanceLineChart
          data={recentTransactionData}
          labels={recentTransactionLabels}
        />
      </div>
    </div>
  );
};

export default RecentActivitySummary;
