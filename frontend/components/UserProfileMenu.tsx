import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const UserProfileMenu = () => {
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
        className="h-[60px] w-64 flex justify-between items-center gap-2 rounded-full bg-card-background-gradient shadow-card-shadow p-2"
      >
        <div className="flex justify-start items-center gap-2">
          <img
            src="https://via.placeholder.com/50"
            alt="avatar"
            className="h-full aspect-square rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-base font-semibold">John Doe</p>
            <p className="text-xs text-white/80">john@doe.com</p>
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
          <p className="text-base text-gray-100">13,000.23 USD</p>
          <div className="h-[2px] w-full bg-white/20 rounded-full my-2" />
          <button
            className={`w-full flex items-center justify-center gap-2 text-base font-semibold hover:bg-card-background-gradient hover:shadow-2xl py-4 px-10 rounded-3xl`}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
