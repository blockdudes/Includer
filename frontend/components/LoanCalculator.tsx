"use client";
import { Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [duration, setDuration] = useState("3");

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
              "border !border-white placeholder:opacity-100 placeholder:text-white/80 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            className="w-full p-2 border !border-white placeholder:opacity-100 placeholder:text-white/80 text-white stroke-white"
            labelProps={{
              className: "hidden",
            }}
            menuProps={{
              className:
                "bg-card-background-gradient backdrop-blur-lg font-medium text-white accent-white",
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
            <Option value="3">3 months</Option>
            <Option value="6">6 months</Option>
            <Option value="12">12 months</Option>
          </Select>
        </div>
        <div>
          <div>
            <p className="text-sm">Total Repayment</p>
            <p className="text-xl font-bold">$0.00</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoanCalculator;
