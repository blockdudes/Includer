import SignUpForm from "@/components/SignUpForm";
import Image from "next/image";

const SignUpPage = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-12">
      <div className="flex flex-col justify-center items-center gap-4">
        <Image src="/logo.png" alt="Includer" width={100} height={100} />
        <h2 className="text-3xl font-bold text-white">Sign up to Includer</h2>
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
