"use client";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

const TransactionHistoryTable = () => {
  const transactions = [
    {
      id: "0001",
      amount: "100",
      to_from: "john@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 100,
    },
    {
      id: "0002",
      amount: "200",
      to_from: "jane@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "fail",
      closingBalance: 100,
    },
    {
      id: "0003",
      amount: "20",
      to_from: "jane@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "success",
      closingBalance: 80,
    },
    {
      id: "0004",
      amount: "150",
      to_from: "alice@wonderland.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 230,
    },
    {
      id: "0005",
      amount: "300",
      to_from: "bob@builder.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "fail",
      closingBalance: 230,
    },
    {
      id: "0006",
      amount: "450",
      to_from: "charlie@chocolate.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 680,
    },
    {
      id: "0007",
      amount: "50",
      to_from: "eve@eden.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 730,
    },
    {
      id: "0001",
      amount: "100",
      to_from: "john@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 830,
    },
    {
      id: "0002",
      amount: "200",
      to_from: "jane@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "fail",
      closingBalance: 830,
    },
    {
      id: "0003",
      amount: "200",
      to_from: "jane@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "success",
      closingBalance: 630,
    },
    {
      id: "0004",
      amount: "150",
      to_from: "alice@wonderland.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 780,
    },
    {
      id: "0005",
      amount: "300",
      to_from: "bob@builder.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "fail",
      closingBalance: 780,
    },
    {
      id: "0006",
      amount: "450",
      to_from: "charlie@chocolate.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 1230,
    },
    {
      id: "0007",
      amount: "50",
      to_from: "eve@eden.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 1280,
    },
    {
      id: "0001",
      amount: "100",
      to_from: "john@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 1380,
    },
    {
      id: "0002",
      amount: "2000",
      to_from: "jane@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "fail",
      closingBalance: 1380,
    },
    {
      id: "0003",
      amount: "200",
      to_from: "jane@doe.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "success",
      closingBalance: 1180,
    },
    {
      id: "0004",
      amount: "150",
      to_from: "alice@wonderland.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "success",
      closingBalance: 1030,
    },
    {
      id: "0005",
      amount: "300",
      to_from: "bob@builder.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "fail",
      closingBalance: 1030,
    },
    {
      id: "0006",
      amount: "450",
      to_from: "charlie@chocolate.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "credit",
      status: "success",
      closingBalance: 1480,
    },
    {
      id: "0007",
      amount: "50",
      to_from: "eve@eden.com",
      date: new Date().toString().split("GMT")[0].slice(0, -4),
      type: "debit",
      status: "success",
      closingBalance: 1530,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const rowsPerPage = 11;

  const filteredTransactions = transactions
    .filter((transaction) =>
      statusFilter === "all" ? true : transaction.status === statusFilter
    )
    .filter(
      (transaction) =>
        transaction.id.includes(searchTerm) ||
        transaction.to_from.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const currentTransactions = filteredTransactions
    .toReversed()
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  while (currentTransactions.length < rowsPerPage) {
    currentTransactions.push({
      id: "",
      amount: "",
      to_from: "",
      type: "",
      date: "",
      status: "",
      closingBalance: 0,
    });
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string | undefined) => {
    setStatusFilter(val || "all");
    setCurrentPage(1);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
      <h1 className="text-2xl font-semibold">Transaction History</h1>
      <div className="flex items-center gap-4">
        <Input
          type="text"
          label="Search"
          placeholder="Search by ID or recipient..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white rounded-full w-full"
          labelProps={{
            className: "hidden",
          }}
          icon={<BiSearchAlt color="white" />}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
        <div className="w-1/6">
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 rounded-3xl bg-card-background-gradient shadow-card-shadow text-white border-[1px] !border-green-500"
            labelProps={{ className: "hidden" }}
            menuProps={{
              className:
                "bg-card-background-gradient space-y-1 text-white backdrop-blur-md p-2",
            }}
            containerProps={{
              className: "bg-card-background-gradient rounded-3xl",
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Option value="all">All Statuses</Option>
            <Option value="success">Success Only</Option>
            <Option value="pending">Pending Only</Option>
            <Option value="fail">Fail Only</Option>
          </Select>
        </div>
      </div>
      <div className="overflow-auto rounded-xl shadow-card-shadow">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">To/From</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Closing Balance</th>
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
                  <td className="py-2 px-4">{transaction.to_from || "-"}</td>
                  <td className="py-2 px-4 capitalize">
                    {transaction.type || "-"}
                  </td>
                  <td className="py-2 px-4">{transaction.date || "-"}</td>
                  <td className="py-2 px-4">
                    {transaction.status ? (
                      <span
                        className={`w-[100px] flex justify-center items-center uppercase px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "success"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {transaction.closingBalance
                      ? `$${transaction.closingBalance}`
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
