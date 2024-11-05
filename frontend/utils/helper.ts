import axios from "axios"

export const handleContractDeposit = async (email: string, amount: number) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/deposit`, { email, amount })
    } catch (error) {
        console.log(error)
    }
}
export const handleContractRepay = async (email: string, amount: number) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/repay`, { email, amount })
    } catch (error) {
        console.log(error)
    }
}
export const handleContractWithdraw = async (email: string, amount: number) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/withdraw`, { email, amount })
    } catch (error) {
        console.log(error)
    }
}
export const handleContractBorrow = async (email: string, amount: number) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/borrow`, { email, amount })
    } catch (error) {
        console.log(error)
    }
}
export const handleContractSetAllowance = async (email: string, amount: number) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/setAllowance`, { email, amount })
    } catch (error) {
        console.log(error)
    }
}
