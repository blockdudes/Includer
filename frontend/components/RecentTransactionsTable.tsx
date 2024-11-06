import { useAppSelector } from "@/lib/hooks";
import React from "react";

const RecentTransactionsTable = () => {
  const { user } = useAppSelector((state) => state.user);
  const transactions: {
    type: string;
    amount: number;
    timestamp: string;
  }[] = user?.history || [];

  const rows = [
    ...transactions
      .map((transaction, index) => ({
        id: (index + 1).toString().padStart(4, "0"),
        amount: transaction.amount,
        type: transaction.type,
        timestamp: new Date(transaction.timestamp).toLocaleString(),
      }))
      .toReversed(),
  ];
  while (rows.length < 14) {
    rows.push({ id: "", amount: 0, type: "", timestamp: "" });
  }

  return (
    <div className="col-span-2 row-span-3 flex flex-col gap-4 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
      <h1 className="text-2xl font-semibold">Recent Transactions</h1>
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
                <td className="py-2 px-4">{transaction.type || "-"}</td>
                <td className="py-2 px-4">{transaction.timestamp || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;
