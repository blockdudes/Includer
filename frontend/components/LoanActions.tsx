"use client";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";
import CustomDialog from "./CustomDialog";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";

const LoanActions = () => {
  const [isGetLoanDialogOpen, setIsGetLoanDialogOpen] = useState(false);
  const [isRepayLoanDialogOpen, setIsRepayLoanDialogOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(0);
  const [duration, setDuration] = useState("1");
  const [repayAmount, setRepayAmount] = useState(0);
  const { user } = useAppSelector((state) => state.user);

  const handleGetLoan = async () => {
    try {
      if (user.email) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/borrow`,
          {
            email: user?.email,
            amount: loanAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Loan request successful");
        } else {
          toast.error("Something went wrong");
        }
        setIsGetLoanDialogOpen(false);
      } else {
        toast.error("Something went wrong");
        throw Error;
      }
    } catch (error) {
      toast.error("Loan request failed");
      console.log(error);
    }
  };

  const handleRepayLoan = async () => {
    try {
      if (user.email) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/repay`,
          {
            email: user?.email,
            amount: repayAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Loan repayment successful");
        } else {
          toast.error("Something went wrong");
        }
        setIsRepayLoanDialogOpen(false);
      } else {
        toast.error("Something went wrong");
        throw Error;
      }
    } catch (error) {
      toast.error("Loan repayment failed");
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <>
        <Button
          size="lg"
          className="bg-card-background-gradient !shadow-card-shadow rounded-lg"
          onClick={() => setIsGetLoanDialogOpen(true)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Get a Loan
        </Button>
        <CustomDialog
          isOpen={isGetLoanDialogOpen}
          setIsOpen={setIsGetLoanDialogOpen}
          header="Get a Loan"
          body={
            <div className="flex flex-col gap-2">
              <span className="text-sm">
                Request a loan by entering the amount you want to borrow.
              </span>
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
                  value={loanAmount}
                  onChange={(e) => {
                    if (e.target.value) {
                      setLoanAmount(Number(e.target.value));
                    }
                  }}
                  placeholder="Enter amount"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <p>Duration</p>
                <Select
                  className="w-full p-2 border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white stroke-white"
                  labelProps={{
                    className: "hidden",
                  }}
                  menuProps={{
                    className:
                      "bg-card-background-gradient space-y-1 backdrop-blur-lg font-medium text-white accent-white",
                  }}
                  value={duration}
                  onChange={(value) => {
                    if (value) {
                      setDuration(value);
                    }
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Option value="1">1 month</Option>
                  <Option value="3">3 months</Option>
                  <Option value="6">6 months</Option>
                  <Option value="12">12 months</Option>
                </Select>
              </div>
            </div>
          }
          footer={
            <>
              <Button
                variant="text"
                color="red"
                onClick={() => setIsGetLoanDialogOpen(false)}
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
                onClick={handleGetLoan}
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
      <>
        <Button
          size="lg"
          className="bg-card-background-gradient !shadow-card-shadow rounded-lg"
          onClick={() => setIsRepayLoanDialogOpen(true)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Repay a Loan
        </Button>
        <CustomDialog
          isOpen={isRepayLoanDialogOpen}
          setIsOpen={setIsRepayLoanDialogOpen}
          header="Repay a Loan"
          body={
            <div className="flex flex-col gap-2">
              <span className="text-sm">
                Repay a loan by entering the amount you want to repay.
              </span>
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
                  value={repayAmount}
                  onChange={(e) => {
                    if (e.target.value) {
                      setRepayAmount(Number(e.target.value));
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
                onClick={() => setIsRepayLoanDialogOpen(false)}
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
                onClick={handleRepayLoan}
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

export default LoanActions;
