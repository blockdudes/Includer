"use client";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";
import CustomDialog from "./CustomDialog";

const SavingsActions = () => {
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [savingsType, setSavingsType] = useState("savings");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <>
        <Button
          size="lg"
          className="bg-card-background-gradient !shadow-card-shadow rounded-xl"
          onClick={() => setIsWithdrawDialogOpen(true)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Withdraw Funds
        </Button>
        <CustomDialog
          isOpen={isWithdrawDialogOpen}
          setIsOpen={setIsWithdrawDialogOpen}
          header="Withdraw Funds"
          body={
            <div className="flex flex-col gap-2">
              <span className="text-sm">
                Withdraw funds from your savings or super savings account.
                Select the type of savings account and enter the amount to
                withdraw.
              </span>
              <div>
                <label>Savings Type</label>
                <Select
                  className="w-full p-2 border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white stroke-white"
                  labelProps={{
                    className: "hidden",
                  }}
                  menuProps={{
                    className:
                      "bg-card-background-gradient backdrop-blur-lg font-medium text-white accent-white space-y-1",
                  }}
                  value={savingsType}
                  onChange={(value) => {
                    if (value) {
                      setSavingsType(value);
                    }
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Option value="savings">Savings</Option>
                  <Option value="superSavings">Super Savings</Option>
                </Select>
              </div>
              <div>
                <p>Amount</p>
                <Input
                  type="number"
                  size="md"
                  className={
                    "!border-green-500 !border-[1px] !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  }
                  labelProps={{
                    className: "hidden",
                  }}
                  value={withdrawAmount}
                  onChange={(e) => {
                    if (e.target.value) {
                      setWithdrawAmount(Number(e.target.value));
                    }
                  }}
                  placeholder="Enter amount"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
            </div>
          }
          footer={
            <>
              <Button
                variant="text"
                color="red"
                onClick={() => setIsWithdrawDialogOpen(false)}
                className="mr-1"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={() => setIsWithdrawDialogOpen(false)}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span>Confirm</span>
              </Button>
            </>
          }
        />
      </>
      <form action="/api/payment" method="POST" className="w-full">
        <Button
          size="lg"
          className="w-full bg-card-background-gradient !shadow-card-shadow rounded-xl"
          type="submit"
          role="link"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Deposit Funds
        </Button>
      </form>
      <>
        <Button
          size="lg"
          className="bg-card-background-gradient !shadow-card-shadow rounded-xl"
          onClick={() => setIsTransferDialogOpen(true)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Transfer Funds
        </Button>
        <CustomDialog
          isOpen={isTransferDialogOpen}
          setIsOpen={setIsTransferDialogOpen}
          header="Transfer Funds"
          body={
            <div className="flex flex-col gap-2">
              <span className="text-sm">
                Execute a fund transfer to a designated recipient. Enter the
                recipient&apos;s email address and the amount to transfer.
              </span>
              <div>
                <p>Recipient</p>
                <Input
                  size="md"
                  className="!border-green-500 !border-[1px] !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white"
                  labelProps={{
                    className: "hidden",
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <p>Amount</p>
                <Input
                  type="number"
                  size="md"
                  className={
                    "!border-green-500 !border-[1px] !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  }
                  labelProps={{
                    className: "hidden",
                  }}
                  value={transferAmount}
                  onChange={(e) => {
                    if (e.target.value) {
                      setTransferAmount(Number(e.target.value));
                    }
                  }}
                  placeholder="Enter amount"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
            </div>
          }
          footer={
            <>
              <Button
                variant="text"
                color="red"
                onClick={() => setIsTransferDialogOpen(false)}
                className="mr-1"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={() => setIsTransferDialogOpen(false)}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span>Confirm</span>
              </Button>
            </>
          }
        />
      </>
    </div>
  );
};

export default SavingsActions;
