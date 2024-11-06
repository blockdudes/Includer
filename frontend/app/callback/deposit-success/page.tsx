"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const DepositSuccess = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-md flex flex-col items-center justify-center gap-2">
        <FaCheckCircle className="text-green-500 text-4xl" />
        <h1 className="text-2xl font-bold">Deposit Successful</h1>
        <p className="text-sm text-center text-white/80">
          You have successfully deposited funds into your savings account. It is
          safe to close this page and return to the dashboard. Your balance will
          be updated shortly.
        </p>
      </div>
    </div>
  );
};

export default DepositSuccess;
