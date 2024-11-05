"use client";
import AccountSettings from "@/components/AccountSettings";
import ProfileSettings from "@/components/ProfileSettings";
import { Button } from "@material-tailwind/react";
import React, { useState } from "react";

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState<"profile" | "account">(
    "profile"
  );

  return (
    <div className="h-full w-full p-4">
      <div className="h-full w-full flex flex-col gap-2 rounded-3xl bg-card-background-gradient shadow-card-shadow p-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="h-[calc(100%-3rem)] grid grid-cols-5 items-center gap-4">
          <div className="h-full bg-card-background-gradient rounded-3xl shadow-card-shadow p-4 flex flex-col gap-2">
            <Button
              variant={selectedTab === "profile" ? "gradient" : "text"}
              size="md"
              className={`w-full text-xl font-semibold text-white ${
                selectedTab === "profile"
                  ? "!bg-card-background-gradient shadow-card-shadow"
                  : ""
              } normal-case`}
              onClick={() => setSelectedTab("profile")}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Profile
            </Button>
            <Button
              variant={selectedTab === "account" ? "gradient" : "text"}
              size="md"
              className={`w-full text-xl font-semibold text-white ${
                selectedTab === "account"
                  ? "!bg-card-background-gradient shadow-card-shadow"
                  : ""
              } normal-case`}
              onClick={() => setSelectedTab("account")}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Account
            </Button>
          </div>
          <div className="h-full col-span-4 bg-card-background-gradient rounded-3xl shadow-card-shadow p-4">
            {selectedTab === "profile" && <ProfileSettings />}
            {selectedTab === "account" && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
