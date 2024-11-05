import React from "react";
import LoanHeader from "@/components/LoanHeader";
import LoanSummary from "@/components/LoanSummary";
import BorrowingEligibility from "@/components/BorrowingEligibility";
import LoanActions from "@/components/LoanActions";
import LoanCalculator from "@/components/LoanCalculator";

const LoansPage = () => {
  return (
    <div className="h-full w-full overflow-y-scroll p-4">
      <div className="w-full flex flex-col gap-4 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
        <LoanHeader />
        {/* <LoanSummary /> */}
        <BorrowingEligibility />
        <LoanActions />
        <LoanCalculator />
      </div>
    </div>
  );
};

export default LoansPage;
