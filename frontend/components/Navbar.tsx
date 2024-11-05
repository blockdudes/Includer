"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaHandHoldingUsd, FaHistory } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import { TbHomeFilled } from "react-icons/tb";
import UserProfileMenu from "./UserProfileMenu";

const Navbar = () => {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/callback")
  ) {
    return null;
  }

  const links = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <TbHomeFilled />,
    },

    {
      name: "Savings",
      path: "/savings",
      icon: <FaWallet />,
    },
    {
      name: "Loans",
      path: "/loans",
      icon: <FaHandHoldingUsd />,
    },
    {
      name: "History",
      path: "/history",
      icon: <FaHistory />,
    },
  ];

  return (
    <div className="h-16 m-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 rounded-full bg-card-background-gradient shadow-card-shadow p-[4px]">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`flex items-center gap-2 text-base font-semibold ${
              pathname === link.path
                ? "bg-card-background-gradient shadow-card-shadow border-[1px] !border-green-500"
                : ""
            } py-3 px-10 rounded-full`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
      </div>
      <UserProfileMenu />
    </div>
  );
};

export default Navbar;
