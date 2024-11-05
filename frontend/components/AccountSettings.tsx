import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAccordianIndex, setShowAccordianIndex] = useState<number | null>(
    null
  );

  const handleAccordianClick = (index: number) => {
    setShowAccordianIndex(index === showAccordianIndex ? null : index);
  };

  const handlePasswordChange = () => {
    // Logic to change password
    console.log("Password changed:", { currentPassword, newPassword });
  };

  const handleDeactivateAccount = () => {
    // Logic to deactivate account
    console.log("Account deactivated");
  };

  const handleDeleteAccount = () => {
    // Logic to delete account
    console.log("Account deleted");
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      <div className="flex flex-col gap-4 bg-card-background-gradient rounded-3xl shadow-card-shadow p-4">
        <div
          onClick={() => handleAccordianClick(0)}
          className="flex flex-col gap-1 cursor-pointer"
        >
          <h3 className="text-xl font-semibold">Change Password</h3>
          <h4 className="text-sm text-white/90">
            You can change your password here.
          </h4>
        </div>
        {showAccordianIndex === 0 && (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              size="md"
              className="border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white"
              labelProps={{
                className: "hidden",
              }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <Input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white"
              labelProps={{
                className: "hidden",
              }}
              size="md"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <Input
              placeholder="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-[1px] !border-green-500 !shadow-card-shadow placeholder:opacity-100 placeholder:text-white/80 text-white"
              labelProps={{
                className: "hidden",
              }}
              size="md"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <Button
              variant="gradient"
              color="yellow"
              onClick={handlePasswordChange}
              className="mt-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Change Password
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 bg-card-background-gradient rounded-3xl shadow-card-shadow p-4">
        <div
          onClick={() => handleAccordianClick(1)}
          className="flex flex-col gap-1 cursor-pointer"
        >
          <h3 className="text-xl font-semibold">Deactivate Account</h3>
          <h4 className="text-sm text-white/90">
            You can deactivate your account for upto 30 days. After 30 days,
            your account will be deleted.
          </h4>
        </div>
        {showAccordianIndex === 1 && (
          <Button
            color="red"
            onClick={handleDeactivateAccount}
            variant="outlined"
            className=""
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Deactivate Account
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4 bg-card-background-gradient rounded-3xl shadow-card-shadow p-4">
        <div
          onClick={() => handleAccordianClick(2)}
          className="flex flex-col gap-1 cursor-pointer"
        >
          <h3 className="text-xl font-semibold">Delete Account</h3>
          <h4 className="text-sm text-white/90">
            Deleting your account is irreversible and will remove all of your
            information from our systems. This action cannot be undone.
          </h4>
        </div>
        {showAccordianIndex === 2 && (
          <Button
            color="red"
            variant="gradient"
            onClick={handleDeleteAccount}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Delete Account
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
