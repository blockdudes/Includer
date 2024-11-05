import React from "react";

const LoanHeader = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Loans</h1>
      <div className="bg-card-background-gradient p-4 rounded-lg">
        <p>
          Your loan eligibility is based on your Super Savings balance.
          You can borrow up to <span className="font-semibold">80%</span> of
          your Super Savings balance. Higher borrowing percentages may result in
          higher interest rates. Refer to the table below for interest rates.
        </p>
      </div>
    </div>
  );
};

export default LoanHeader;
