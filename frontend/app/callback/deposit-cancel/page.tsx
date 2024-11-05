import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const DepositCancel = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex max-w-md flex-col items-center justify-center gap-2">
        <FaTimesCircle className="text-red-500 text-4xl" />
        <h1 className="text-2xl font-bold">Deposit Failed</h1>
        <p className="text-sm text-white/80">
          There was an error processing your deposit. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default DepositCancel;
