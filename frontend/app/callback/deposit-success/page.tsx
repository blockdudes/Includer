"use client";

import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const DepositSuccess = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const amount = searchParams.get("amount");
  const sessionId = searchParams.get("session_id");

  const recordTransaction = async () => {
    if (!localStorage.getItem(`sessionId-${sessionId}`)) {
      localStorage.setItem(`sessionId-${sessionId}`, "true");
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/recordTransaction",
        {
          email,
          transactionType: "deposit-fiat",
          amount,
        }
      );
      if (response.status === 200) {
        console.log("Transaction recorded successfully");
      } else {
        console.error("Failed to record transaction");
      }
    } else {
      console.log("Transaction already recorded");
    }
  };
  useEffect(() => {
    recordTransaction();
  }, [sessionId]);

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
