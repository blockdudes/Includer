"use client";
import { Button } from "@material-tailwind/react";
import React from "react";

const LoanActions = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        size="lg"
        className="bg-card-background-gradient rounded-lg"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Get a Loan
      </Button>
      <Button
        size="lg"
        className="bg-card-background-gradient rounded-lg"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Repay a Loan
      </Button>
    </div>
  );
};

export default LoanActions;
