import React from "react";

const RecentTransactionsTable = () => {
  const transactions = [
    {
      id: "0001",
      amount: "100",
      to: "john@doe.com",
      date: new Date().toLocaleDateString(),
      status: "success",
    },
    {
      id: "0002",
      amount: "200",
      to: "jane@doe.com",
      date: new Date().toLocaleDateString(),
      status: "fail",
    },
    {
      id: "0003",
      amount: "200",
      to: "jane@doe.com",
      date: new Date().toLocaleDateString(),
      status: "success",
    },
    {
      id: "0004",
      amount: "150",
      to: "alice@wonderland.com",
      date: new Date().toLocaleDateString(),
      status: "success",
    },
  ];

  const rows = [
    ...transactions.filter((transaction) => transaction.status === "success"),
  ];
  while (rows.length < 14) {
    rows.push({ id: "", amount: "", to: "", date: "", status: "" });
  }

  return (
    <div className="col-span-2 row-span-3 flex flex-col gap-4 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
      <h1 className="text-2xl font-semibold">Recent Transactions</h1>
      <div className="overflow-auto rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-electric-yellow/50">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">To</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 14).map((transaction, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? "bg-neon-green/20" : "bg-electric-yellow/20"
                }
              >
                <td className="py-2 px-4">{transaction.id || "-"}</td>
                <td className="py-2 px-4">
                  {transaction.amount ? `$${transaction.amount}` : "-"}
                </td>
                <td className="py-2 px-4">{transaction.to || "-"}</td>
                <td className="py-2 px-4">{transaction.date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;
