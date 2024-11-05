"use client";
import React from "react";
import { useAppSelector } from "./hooks";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const VerifyAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAppSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/callback")) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Image
          src="https://i0.wp.com/www.bearghost.com/wp-content/uploads/2019/09/loader.gif?fit=940%2C940&ssl=1"
          alt="Loading..."
          width={75}
          height={75}
        />
      </div>
    );
  }

  if (!user && !(pathname === "/login" || pathname === "/register")) {
    router.push("/login");
    return null;
  }

  if (user && (pathname === "/login" || pathname === "/register")) {
    router.push("/dashboard");
    return null;
  }

  return <>{children}</>;
};

export default VerifyAuth;
