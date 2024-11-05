"use client";
import { useAppSelector } from "@/lib/hooks";
import { Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";

const LoanCalculator = () => {
  const { contractBalance } = useAppSelector((state) => state.user);
  const maxBorrowableAmount = 1000;
  // Number(contractBalance?.total_deposit_balance) * 0.8;
  const [loanAmount, setLoanAmount] = useState(0);
  const [duration, setDuration] = useState("1");

  const calculateTotalRepayment = (loanAmount: number) => {
    const interestRate =
      loanAmount < 0
        ? -999
        : loanAmount / maxBorrowableAmount <= 0.4
        ? 0.02
        : loanAmount / maxBorrowableAmount <= 0.6
        ? 0.03
        : loanAmount / maxBorrowableAmount <= 0.8
        ? 0.04
        : -1;

    if (interestRate === -999) {
      return "Invalid loan amount";
    }
    if (interestRate === -1) {
      return "Loan amount exceeds maximum borrowable amount";
    }

    return `$${(loanAmount * (1 + interestRate)).toFixed(2).toLocaleString()}`;
  };

  return (
    <div className="bg-card-background-gradient shadow-card-shadow p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Loan Calculator</h2>
      <form className="space-y-4">
        <div>
          <label>Loan Amount</label>
          <Input
            type="number"
            size="md"
            className={
              "!border-green-500 !border-[1px] !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            }
            labelProps={{
              className: "hidden",
            }}
            value={loanAmount}
            onChange={(e) => {
              if (e.target.value) {
                setLoanAmount(Number(e.target.value));
              }
            }}
            placeholder="Enter amount"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </div>
        <div>
          <label>Duration</label>
          <Select
            className="w-full p-2 border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white stroke-white"
            labelProps={{
              className: "hidden",
            }}
            menuProps={{
              className:
                "bg-card-background-gradient space-y-1 backdrop-blur-lg font-medium text-white accent-white",
            }}
            value={duration}
            onChange={(value) => {
              if (value) {
                setDuration(value);
              }
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Option value="1">1 month</Option>
            <Option value="3">3 months</Option>
            <Option value="6">6 months</Option>
            <Option value="12">12 months</Option>
          </Select>
        </div>
        <div>
          <div>
            <p className="text-sm">Total Repayment</p>
            <p className="text-xl font-bold">
              {calculateTotalRepayment(loanAmount)}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoanCalculator;
