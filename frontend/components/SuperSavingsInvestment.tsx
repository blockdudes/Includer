"use client";
import { useAppSelector } from "@/lib/hooks";
import { handleSuperSavingsInvest } from "@/utils/helper";
import { Button, Input } from "@material-tailwind/react";
import React, { useState } from "react";

const SuperSavingsInvestment = () => {
  const { user } = useAppSelector((state) => state.user);
  const [amount, setAmount] = useState(0);

  return (
    <div className="bg-card-background-gradient shadow-card-shadow p-6 rounded-3xl">
      <h2 className="text-2xl font-bold mb-4">Invest in Super Savings</h2>
      <form className="flex flex-col gap-4">
        <div>
          <label className="text-lg text-white">Amount</label>
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
          <label className="text-lg text-white">Estimated Interest Rate</label>
          <p className="text-lg font-semibold text-white">5%</p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            handleSuperSavingsInvest(user?.email, amount);
          }}
          className="w-full bg-card-background-gradient !shadow-card-shadow hover:shadow-xl text-white py-3 px-6 rounded-lg hover:bg-card-background-gradient transition-colors"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Lock Funds
        </Button>
      </form>
    </div>
  );
};

export default SuperSavingsInvestment;
