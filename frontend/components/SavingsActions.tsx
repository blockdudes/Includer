"use client";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import React, { useRef, useState } from "react";
import CustomDialog from "./CustomDialog";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import toast from "react-hot-toast";

const SavingsActions = () => {
  const { user } = useAppSelector((state) => state.user);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const depositFormRef = useRef<HTMLFormElement>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [savingsType, setSavingsType] = useState("savings");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferRecipientEmail, setTransferRecipientEmail] = useState("");

  const handleWithdraw = async () => {
    try {
      if (user.email) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/withdraw`,
          {
            email: user?.email,
            amount: withdrawAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Withdrawal successful");
        } else {
          toast.error("Something went wrong");
        }
        setIsWithdrawDialogOpen(false);
      } else {
        toast.error("Something went wrong");
        throw Error;
      }
    } catch (error) {
      toast.error("Withdrawal failed");
      console.log(error);
    }
  };
  
  const handleTransfer = async () => {
    try {
      if (user.email) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/transfer`,
          {
            email: user?.email,
            recipientEmail: transferRecipientEmail, 
            amount: transferAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Transfer successful");
        } else {
          toast.error("Something went wrong");
        }
        setIsTransferDialogOpen(false);
      } else {
        toast.error("Something went wrong");
        throw Error;
      }
    } catch (error) {
      toast.error("Transfer failed");
      console.log(error);
    }
  };

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
                onClick={handleWithdraw}
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

      <Button
        size="lg"
        className="w-full bg-card-background-gradient !shadow-card-shadow rounded-xl"
        onClick={() => setIsDepositDialogOpen(true)}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Deposit Funds
      </Button>
      <CustomDialog
        isOpen={isDepositDialogOpen}
        setIsOpen={setIsDepositDialogOpen}
        header="Deposit Funds"
        body={
          <div className="flex flex-col gap-2">
            <span className="text-sm">
              Deposit funds into your savings account. Enter the amount to
              deposit.
            </span>
            <div>
              <p>Amount</p>
              <Input
                name="quantity"
                type="number"
                size="md"
                className={
                  "!border-green-500 !border-[1px] !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                }
                labelProps={{
                  className: "hidden",
                }}
                value={depositAmount}
                onChange={(e) => {
                  if (e.target.value) {
                    setDepositAmount(Number(e.target.value));
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
              onClick={() => setIsDepositDialogOpen(false)}
              className="mr-1"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <span>Cancel</span>
            </Button>
            <form
              ref={depositFormRef}
              action="/api/payment"
              method="POST"
              target="_blank"
            >
              <input type="hidden" name="quantity" value={depositAmount} />
              <input type="hidden" name="email" value={user.email} />
              <Button
                variant="gradient"
                color="green"
                type="submit"
                onClick={() => setIsDepositDialogOpen(false)}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span>Confirm</span>
              </Button>
            </form>
          </>
        }
      />
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
                  value={transferRecipientEmail}
                  onChange={(e) => {
                    if (e.target.value) {
                      setTransferRecipientEmail(e.target.value);
                    }
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
                onClick={handleTransfer}
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
