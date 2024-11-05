"use client";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useState } from "react";
import { BsGoogle } from "react-icons/bs";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="relative w-full max-w-lg bg-white/10 rounded-lg shadow-md">
      <div className="absolute bottom-0 -z-50 background-dots-fade h-40 w-full" />
      <div className="p-8">
        <h4 className="text-center text-white text-base mb-4">Register with</h4>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            size="md"
            className="w-full flex items-center justify-center gap-2 bg-white/10"
            onClick={async () => {}}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <BsGoogle size={15} />
            Sign up with Google
          </Button>
        </div>
        <p className="text-center text-white mb-4">Or</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <h3 className="text-white mb-1">First Name</h3>
              <div className="relative w-full">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.8332 16.5L13.3332 14M13.3332 14L15.8332 11.5M13.3332 14H18.3332M9.99984 11.9167H6.24984C5.08687 11.9167 4.50538 11.9167 4.03222 12.0602C2.96688 12.3834 2.1332 13.217 1.81004 14.2824C1.6665 14.7555 1.6665 15.337 1.6665 16.5M12.0832 5.25C12.0832 7.32107 10.4042 9 8.33317 9C6.2621 9 4.58317 7.32107 4.58317 5.25C4.58317 3.17893 6.2621 1.5 8.33317 1.5C10.4042 1.5 12.0832 3.17893 12.0832 5.25Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  placeholder="First Name"
                  name="firstName"
                  onChange={handleChange}
                  className="w-full pl-12 px-2 py-2 rounded-md border-[0.1px] border-white/30 bg-white/10 text-sm placeholder:text-sm placeholder:text-gray-500 text-white"
                  required
                />
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-white mb-1">Last Name</h3>
              <div className="relative w-full">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.3332 16.5L17.8332 14M17.8332 14L15.3332 11.5M17.8332 14H12.8332M9.49984 11.9167H5.74984C4.58687 11.9167 4.00538 11.9167 3.53222 12.0602C2.46688 12.3834 1.6332 13.217 1.31004 14.2824C1.1665 14.7555 1.1665 15.337 1.1665 16.5M11.5832 5.25C11.5832 7.32107 9.90424 9 7.83317 9C5.7621 9 4.08317 7.32107 4.08317 5.25C4.08317 3.17893 5.7621 1.5 7.83317 1.5C9.90424 1.5 11.5832 3.17893 11.5832 5.25Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  placeholder="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  className="w-full pl-12 px-2 py-2 rounded-md border-[0.1px] border-white/30 bg-white/10 text-sm placeholder:text-sm placeholder:text-gray-500 text-white"
                  required
                />
              </div>
            </div>
          </div>
          {/* <div className="w-full">
            <h3 className="text-white mb-1">Username</h3>
            <div className="relative w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.43008 15.1987C3.93702 14.0043 5.12061 13.1667 6.49984 13.1667H11.4998C12.8791 13.1667 14.0627 14.0043 14.5696 15.1987M12.3332 6.91667C12.3332 8.75762 10.8408 10.25 8.99984 10.25C7.15889 10.25 5.6665 8.75762 5.6665 6.91667C5.6665 5.07572 7.15889 3.58334 8.99984 3.58334C10.8408 3.58334 12.3332 5.07572 12.3332 6.91667ZM17.3332 9.00001C17.3332 13.6024 13.6022 17.3333 8.99984 17.3333C4.39746 17.3333 0.666504 13.6024 0.666504 9.00001C0.666504 4.39763 4.39746 0.666672 8.99984 0.666672C13.6022 0.666672 17.3332 4.39763 17.3332 9.00001Z"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
                className="w-full pl-12 px-2 py-2 rounded-md border-[0.1px] border-white/30 bg-white/10 text-sm placeholder:text-sm placeholder:text-gray-500 text-white"
                required
              />
            </div>
          </div> */}
          <div className="w-full">
            <h3 className="text-white mb-1">Email</h3>
            <div className="relative w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.6665 5.83334L8.4706 10.5962C9.02158 10.9819 9.29707 11.1747 9.59672 11.2494C9.86142 11.3154 10.1383 11.3154 10.403 11.2494C10.7026 11.1747 10.9781 10.9819 11.5291 10.5962L18.3332 5.83334M5.6665 16.6667H14.3332C15.7333 16.6667 16.4334 16.6667 16.9681 16.3942C17.4386 16.1545 17.821 15.7721 18.0607 15.3017C18.3332 14.7669 18.3332 14.0668 18.3332 12.6667V7.33334C18.3332 5.93321 18.3332 5.23315 18.0607 4.69837C17.821 4.22796 17.4386 3.84551 16.9681 3.60583C16.4334 3.33334 15.7333 3.33334 14.3332 3.33334H5.6665C4.26637 3.33334 3.56631 3.33334 3.03153 3.60583C2.56112 3.84551 2.17867 4.22796 1.93899 4.69837C1.6665 5.23315 1.6665 5.93321 1.6665 7.33334V12.6667C1.6665 14.0668 1.6665 14.7669 1.93899 15.3017C2.17867 15.7721 2.56112 16.1545 3.03153 16.3942C3.56631 16.6667 4.26637 16.6667 5.6665 16.6667Z"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                placeholder="Email"
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full pl-12 px-2 py-2 rounded-md border-[0.1px] border-white/30 bg-white/10 text-sm placeholder:text-sm placeholder:text-gray-500 text-white"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-white mb-1">Password</h3>
            <div className="relative w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1668 8.33333V6.66667C14.1668 4.36548 12.3013 2.5 10.0002 2.5C7.69898 2.5 5.8335 4.36548 5.8335 6.66667V8.33333M10.0002 12.0833V13.75M7.3335 17.5H12.6668C14.067 17.5 14.767 17.5 15.3018 17.2275C15.7722 16.9878 16.1547 16.6054 16.3943 16.135C16.6668 15.6002 16.6668 14.9001 16.6668 13.5V12.3333C16.6668 10.9332 16.6668 10.2331 16.3943 9.69836C16.1547 9.22795 15.7722 8.8455 15.3018 8.60582C14.767 8.33333 14.067 8.33333 12.6668 8.33333H7.3335C5.93336 8.33333 5.2333 8.33333 4.69852 8.60582C4.22811 8.8455 3.84566 9.22795 3.60598 9.69836C3.3335 10.2331 3.3335 10.9332 3.3335 12.3333V13.5C3.3335 14.9001 3.3335 15.6002 3.60598 16.135C3.84566 16.6054 4.22811 16.9878 4.69852 17.2275C5.2333 17.5 5.93336 17.5 7.3335 17.5Z"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                placeholder="Password"
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full pl-12 px-2 py-2 rounded-md border-[0.1px] border-white/30 bg-white/10 text-sm placeholder:text-sm placeholder:text-gray-500 text-white"
                required
                pattern="^.{8,}$"
              />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            Minimum length is 8 characters.
          </p>
          <Button
            type="submit"
            color="yellow"
            size="md"
            className="w-full bg-primary text-black font-bold"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Sign Up
          </Button>
        </form>
        <p className="text-center text-white mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
