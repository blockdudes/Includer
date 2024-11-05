"use client";
import { Button } from "@material-tailwind/react";
import React from "react";

const SavingsActions = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        size="lg"
        className="bg-card-background-gradient rounded-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Withdraw Funds
      </Button>
      <Button
        size="lg"
        className="bg-card-background-gradient rounded-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Deposit Funds
      </Button>
      <Button
        size="lg"
        className="bg-card-background-gradient rounded-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Transfer Funds
      </Button>
    </div>
  );
};

export default SavingsActions;
