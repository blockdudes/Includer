"use client";
import { useAppDispatch } from "@/lib/hooks";
import { getUserData } from "@/lib/reducers/user_data_slice";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignInForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    // emailOrUsername: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here
    const loader = toast.loading("Signing in...");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/loginUser`,
        {
          email: formData.email,
          password: formData.password,
        }
      );
      toast.dismiss(loader);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        dispatch(getUserData(formData.email));
        toast.success("Signed in successfully");
        router.push("/dashboard");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.dismiss(loader);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-white/10 rounded-lg shadow-md">
      <div className="absolute bottom-0 -z-50 background-dots-fade h-40 w-full" />
      <div className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              />
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            By signing in, you are confirming your acceptance of{" "}
            <span className="text-primary">Terms of Service</span> and
            acknowledging that you have read and understood{" "}
            <span className="text-primary">Privacy Policy</span>.
          </p>
          <Button
            type="submit"
            color="yellow"
            size="md"
            className="w-full bg-primary text-black font-bold mt-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Log In
          </Button>
        </form>
        <p className="text-center text-white mt-4">
          Do not have an account?{" "}
          <Link href="/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
