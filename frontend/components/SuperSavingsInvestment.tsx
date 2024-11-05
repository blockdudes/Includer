"use client";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";

const SuperSavingsInvestment = () => {
  const [amount, setAmount] = useState(0);
  const [timeFrame, setTimeFrame] = useState("3");

  return (
    <div className="bg-card-background-gradient shadow-card-shadow p-6 rounded-3xl">
      <h2 className="text-2xl font-bold mb-4">Invest in Super Savings</h2>
      <form className="flex flex-col gap-4">
        <div>
          <label className="text-lg text-white">Amount to Lock</label>
          <Input
            type="number"
            size="md"
            className={
              "!border-green-500 !border-[1px] !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            }
            labelProps={{
              className: "hidden",
            }}
            value={amount}
            onChange={(e) => {
              if (e.target.value) {
                setAmount(Number(e.target.value));
              }
            }}
            placeholder="Enter amount"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </div>
        <div>
          <label className="text-lg text-white">Time Frame</label>
          <Select
            className="w-full p-2 border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white stroke-white"
            labelProps={{
              className: "hidden",
            }}
            menuProps={{
              className:
                "bg-card-background-gradient backdrop-blur-lg font-medium text-white accent-white",
            }}
            value={timeFrame}
            onChange={(value) => {
              if (value) {
                setTimeFrame(value);
              }
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Option value="3">3 months</Option>
            <Option value="6">6 months</Option>
            <Option value="12">1 year</Option>
          </Select>
        </div>
        <div>
          <label className="text-lg text-white">Estimated Interest Rate</label>
          <p className="text-lg font-semibold text-white">2.5%</p>
        </div>
        <Button
          size="lg"
          type="submit"
          className="w-full bg-card-background-gradient !shadow-card-shadow hover:shadow-xl text-white py-3 px-6 rounded-lg hover:bg-card-background-gradient transition-colors"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Lock Funds
        </Button>
        <p className="text-sm text-white/80 mt-2">
          Note: Early withdrawal may incur penalties. Interest rates are subject
          to change.
        </p>
      </form>
    </div>
  );
};

export default SuperSavingsInvestment;
