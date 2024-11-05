import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearUserData } from "@/lib/reducers/user_data_slice";

const UserProfileMenu = () => {
  const { user, contractBalance } = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    dispatch(clearUserData());
    router.push("/login");
    toast.success("Signed out successfully");
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="h-[60px] w-72 flex justify-between items-center gap-2 rounded-full bg-card-background-gradient shadow-card-shadow p-2"
      >
        <div className="flex justify-start items-center gap-2">
          <div className="h-[50px] w-[50px] p-2 bg-gray-500 font-medium rounded-full flex items-center justify-center">
            {user?.name
              .split(" ")
              .slice(0, 2)
              .map((name: string) => name.charAt(0).toUpperCase())}
          </div>
          <div className="flex flex-col">
            <p className="text-base font-semibold">{user?.name}</p>
            <p className="text-xs text-white/80">{user?.email}</p>
          </div>
        </div>
        {isOpen ? (
          <FaChevronUp className="mr-3" />
        ) : (
          <FaChevronDown className="mr-3" />
        )}
      </div>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-64 backdrop-blur-md bg-card-background-gradient shadow-card-shadow rounded-[40px] p-4">
          <p className="text-lg font-semibold">Current Balance</p>
          <p className="text-base text-gray-100">
            {contractBalance?.total_deposit_balance} USD
          </p>
          <div className="h-[2px] w-full bg-white/20 rounded-full my-2" />
          <Button
            className={`w-full bg-card-background-gradient !shadow-card-shadow flex items-center justify-center gap-2 text-base font-semibold hover:bg-card-background-gradient py-4 px-10 rounded-3xl`}
            onClick={handleSignOut}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
