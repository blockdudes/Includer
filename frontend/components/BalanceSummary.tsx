import React from "react";
import FinanceDonutChart from "./FinanceDonutChart";
import { useAppSelector } from "@/lib/hooks";

const BalanceSummary = () => {
  const { contractBalance, balance } = useAppSelector((state) => state.user);
  const currentBalanceData = [
    Number(balance),
    Number(contractBalance?.total_deposit_balance),
  ]; // Savings, Super Savings, Borrowed Amount
  const currentBalanceLabels = ["Savings Account", "Super Savings"];
  const currentBalanceColors = ["#FDE74C", "#EE8434"];
  const totalBalance = currentBalanceData.reduce((acc, val) => acc + val, 0);

  // Data for the second chart (Super Savings vs Borrowed Amount)
  const superSavingsVsBorrowedData = [
    Number(contractBalance?.total_deposit_balance),
    Number(contractBalance?.borrow_balance),
  ]; // Super Savings, Borrowed Amount
  const borrowedVsRepaidLabels = ["Super Savings", "Borrowed Amount"];
  const borrowedVsRepaidColors = ["#FFCA3A", "#FF595E"];

  return (
    <div className="col-span-3 flex flex-col gap-2 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
      <h1 className="text-2xl font-semibold">Balance Summary</h1>
      <div className="h-[calc(100%-3rem)] w-full flex items-center gap-4">
        <div className="w-1/2">
          <FinanceDonutChart
            data={
              currentBalanceData.every((val) => val > 0)
                ? currentBalanceData
                : [1, 0]
            }
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
            data={
              superSavingsVsBorrowedData.every((val) => val > 0)
                ? [
                    superSavingsVsBorrowedData[0] -
                      superSavingsVsBorrowedData[1],
                    superSavingsVsBorrowedData[1],
                  ]
                : [1, 0]
            }
            labels={borrowedVsRepaidLabels}
            colors={borrowedVsRepaidColors}
          >
            <div className="w-full flex flex-col items-center justify-start">
              <span className="w-full flex items-center justify-start gap-1">
                <h3>Super Savings:</h3>
                <p className="text-lg font-semibold">
                  {`$${superSavingsVsBorrowedData[0].toLocaleString()}`}
                </p>
              </span>
              <span className="w-full flex items-center justify-start gap-1">
                <h3>Borrowed Amount:</h3>
                <p className="text-lg font-semibold">
                  {`$${superSavingsVsBorrowedData[1].toLocaleString()}`}
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
