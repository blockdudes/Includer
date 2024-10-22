import React from "react";
import FinanceDonutChart from "./FinanceDonutChart";

const BalanceSummary = () => {
  const currentBalanceData = [3000, 2000]; // Savings, Super Savings, Borrowed Amount
  const currentBalanceLabels = ["Savings Account", "Super Savings"];
  const currentBalanceColors = ["#FDE74C", "#EE8434"];
  const totalBalance = currentBalanceData.reduce((acc, val) => acc + val, 0);

  // Data for the second chart (Borrowed vs Repaid)
  const borrowedVsRepaidData = [4283, 2334]; // Borrowed, Repaid
  const borrowedVsRepaidLabels = ["Borrowed Amount", "Repaid Amount"];
  const borrowedVsRepaidColors = ["#FFCA3A", "#FF595E"];

  return (
    <div className="col-span-3 flex flex-col gap-2 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
      <h1 className="text-2xl font-semibold">Balance Summary</h1>
      <div className="h-[calc(100%-3rem)] w-full flex items-center gap-4">
        <div className="w-1/2">
          <FinanceDonutChart
            data={currentBalanceData}
            labels={currentBalanceLabels}
            colors={currentBalanceColors}
          >
            <div className="w-full flex flex-col items-center justify-start">
              <span className="w-full flex items-center justify-start gap-1">
                <h3>Total Balance:</h3>
                <p className="text-lg font-semibold">
                  {`$${totalBalance.toLocaleString()}`}
                </p>
              </span>
              <span className="w-full flex items-center justify-start gap-1">
                <h3>Savings:</h3>
                <p className="text-lg font-semibold">
                  {`$${currentBalanceData[0].toLocaleString()}`}
                </p>
              </span>
              <span className="w-full flex items-center justify-start gap-1">
                <h3>Super Savings:</h3>
                <p className="text-lg font-semibold">
                  {`$${currentBalanceData[1].toLocaleString()}`}
                </p>
              </span>
            </div>
          </FinanceDonutChart>
        </div>
        <div className="w-1/2">
          <FinanceDonutChart
            data={borrowedVsRepaidData}
            labels={borrowedVsRepaidLabels}
            colors={borrowedVsRepaidColors}
          >
            <div className="w-full flex flex-col items-center justify-start">
              <span className="w-full flex items-center justify-start gap-1">
                <h3>Borrowed Amount:</h3>
                <p className="text-lg font-semibold">
                  {`$${borrowedVsRepaidData
                    .reduce((acc, val) => acc + val, 0)
                    .toLocaleString()}`}
                </p>
              </span>
              <span className="w-full flex items-center justify-start gap-1">
                <h3>Repaid Amount:</h3>
                <p className="text-lg font-semibold">
                  {`$${borrowedVsRepaidData[1].toLocaleString()}`}
                </p>
              </span>
            </div>
          </FinanceDonutChart>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
