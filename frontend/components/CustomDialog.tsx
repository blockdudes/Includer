import React from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";

const CustomDialog = ({
  isOpen,
  header,
  body,
  footer,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  header: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
}) => {
  return (
    <Dialog
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      open={isOpen}
      className="bg-[url('/background.svg')] shadow-card-shadow"
      handler={() => false}
    >
      <DialogHeader
        className="text-white"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {header}
      </DialogHeader>
      <DialogBody
        className="text-white"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {body}
      </DialogBody>
      <DialogFooter
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {footer}
      </DialogFooter>
    </Dialog>
  );
};

export default CustomDialog;
