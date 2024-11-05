"use client";
import React from "react";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";

const LoanSummary = () => {
  return (
    <div className="bg-card-background-gradient rounded-lg shadow-card-shadow p-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Current Loans</h2>
      <Tabs>
        <TabsHeader
          className="flex gap-1 rounded-xl bg-card-background-gradient !text-white p-1 mb-4"
          indicatorProps={{
            className: "bg-card-background-gradient",
          }}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Tab
            key="active"
            value="active"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            // className={({ selected }) =>
            //   `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            // ${
            //   selected
            //     ? "bg-white shadow text-blue-700"
            //     : "text-blue-500 hover:bg-white/[0.12] hover:text-blue-600"
            // }`
            // }
          >
            Active Loans
          </Tab>
          <Tab
            value="closed"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            // className={({ selected }) =>
            //   `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            // ${
            //   selected
            //     ? "bg-white shadow text-blue-700"
            //     : "text-blue-500 hover:bg-white/[0.12] hover:text-blue-600"
            // }`
            // }
          >
            Closed Loans
          </Tab>
        </TabsHeader>
        <TabsBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <TabPanel
            className="rounded-xl bg-card-background-gradient shadow-card-shadow p-3"
            value="active"
          >
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2">Loan ID</th>
                  <th className="px-4 py-2">Borrowed Amount</th>
                  <th className="px-4 py-2">Remaining Balance</th>
                  <th className="px-4 py-2">Interest Rate</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>{/* Add loan data rows here */}</tbody>
            </table>
          </TabPanel>
          <TabPanel
            className="rounded-xl bg-card-background-gradient shadow-card-shadow p-3"
            value="closed"
          >
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2">Loan ID</th>
                  <th className="px-4 py-2">Borrowed Amount</th>
                  <th className="px-4 py-2">Total Paid</th>
                  <th className="px-4 py-2">Interest Paid</th>
                  <th className="px-4 py-2">Closed Date</th>
                </tr>
              </thead>
              <tbody>{/* Add closed loan data rows here */}</tbody>
            </table>
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default LoanSummary;
