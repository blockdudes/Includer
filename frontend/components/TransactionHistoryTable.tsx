"use client";
import { useAppSelector } from "@/lib/hooks";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

const TransactionHistoryTable = () => {
  const { user } = useAppSelector((state) => state.user);
  const transactions: {
    id: string;
    type: string;
    amount: string;
    timestamp: string;
  }[] = (user?.history as any[] || []).map((transaction, index) => ({
    id: (index + 1).toString().padStart(4, "0"),
    type: transaction.type,
    amount: transaction.amount,
    timestamp: transaction.timestamp,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 11;

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.includes(searchTerm) ||
      transaction.type.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const currentTransactions = filteredTransactions
    .toReversed()
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  while (currentTransactions.length < rowsPerPage) {
    currentTransactions.push({
      id: "",
      amount: "",
      type: "",
      timestamp: "",
    });
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
      <h1 className="text-2xl font-semibold">Transaction History</h1>
      <div className="flex items-center gap-4">
        <Input
          type="text"
          label="Search"
          placeholder="Search by ID or type..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border-[1px] !border-green-500 !shadow-card-shadow text-white placeholder:opacity-100 placeholder:text-white rounded-full w-full"
          labelProps={{
            className: "hidden",
          }}
          icon={<BiSearchAlt color="white" />}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
      </div>
      <div className="overflow-auto rounded-xl shadow-card-shadow">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-neon-green/20"
                      : "bg-electric-yellow/20"
                  }
                >
                  <td className="py-2 px-4">{transaction.id || "-"}</td>
                  <td className="py-2 px-4">
                    {transaction.amount ? `$${transaction.amount}` : "-"}
                  </td>
                  <td className="py-2 px-4 capitalize">
                    {transaction.type || "-"}
                  </td>
                  <td className="py-2 px-4">
                    {transaction.timestamp
                      ? new Date(transaction.timestamp).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2">
        <Button
          size="lg"
          variant="gradient"
          color="light-green"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={"h-8 w-28 flex justify-center items-center rounded"}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            size="lg"
            variant="gradient"
            color={currentPage === i + 1 ? "yellow" : "lime"}
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={"h-8 w-8 p-0 flex justify-center items-center rounded"}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          size="lg"
          variant="gradient"
          color="light-green"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={"h-8 w-28 flex justify-center items-center rounded"}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
