import LoginForm from "@/components/LoginForm";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-12">
      <div className="flex flex-col justify-center items-center gap-4">
        <Image src="/logo.png" alt="Includer" width={100} height={100} />
        <h2 className="text-3xl font-bold text-white">Login to Includer</h2>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
