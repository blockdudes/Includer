"use client";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import React, { useState } from "react";

const SavingsActions = () => {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        size="lg"
        className="bg-card-background-gradient !shadow-card-shadow rounded-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Withdraw Funds
      </Button>
      <Button
        size="lg"
        className="bg-card-background-gradient !shadow-card-shadow rounded-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Deposit Funds
      </Button>
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
        <Dialog
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          open={isTransferDialogOpen}
          className="bg-black shadow-card-shadow"
          handler={() => setIsTransferDialogOpen(false)}
        >
          <DialogHeader
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Transfer Funds
          </DialogHeader>
          <DialogBody
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <p>Transfer funds from your savings account to your checking account.</p>
            <p>Amount</p>
            <Input
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
          </DialogBody>
          <DialogFooter
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
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
          </DialogFooter>
        </Dialog>
      </>
    </div>
  );
};

export default SavingsActions;
