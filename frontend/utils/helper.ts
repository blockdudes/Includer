import axios from "axios";
import { toast } from "react-hot-toast";

export const handleSuperSavingsInvest = async (
  email: string,
  amount: number
) => {
  const loader = toast.loading("Processing...");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/deposit`,
      { email, amount }
    );
    toast.dismiss(loader);
    if (response.status === 200) {
      toast.success("Super Savings Investment Successful");
    } else {
      toast.error("Super Savings Investment Failed");
    }
  } catch (error) {
    console.log(error);
    toast.dismiss(loader);
    toast.error("Super Savings Investment Failed");
  }
};

export const handleLoanRepayment = async (email: string, amount: number) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/repay`,
      { email, amount }
    );
  } catch (error) {
    console.log(error);
  }
};
export const handleSuperSavingsWithdraw = async (
  email: string,
  amount: number
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/withdraw`,
      { email, amount }
    );
  } catch (error) {
    console.log(error);
  }
};
export const handleAvailLoan = async (email: string, amount: number) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/borrow`,
      { email, amount }
    );
  } catch (error) {
    console.log(error);
  }
};
export const handleTransferP2P = async (
  email: string,
  recipientEmail: string,
  amount: number
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/transfer`,
      { email, recipientEmail, amount }
    );
  } catch (error) {
    console.log(error);
  }
};
