"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface userDataType {
  user: null | any;
  contractBalance: null | any;
  balance: any | null;
  error: null | any;
  loading: boolean;
}

const initialUserDataState: userDataType = {
  user: null,
  contractBalance: null,
  balance: null,
  error: null,
  loading: false,
};

export const getUserData = createAsyncThunk(
  "get/user/data",
  async (email: any, { rejectWithValue }) => {
    try {
      const [userDataResponse, userBalanceResponse] = await Promise.all([
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/getUserByEmail`,
          { email },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/getBalance/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
      ]);

      let balance = 0;
      balance += (userDataResponse.data.history as any[])
        .filter((transaction) => transaction.type === "mint")
        .reduce(
          (acc: number, transaction) => acc + Number(transaction.amount),
          0
        );
      balance -= (userDataResponse.data.history as any[])
        .filter((transaction) => transaction.type === "deposit")
        .reduce(
          (acc: number, transaction) => acc + Number(transaction.amount),
          0
        );
      balance += (userDataResponse.data.history as any[])
        .filter((transaction) => transaction.type === "borrow_token")
        .reduce(
          (acc: number, transaction) => acc + Number(transaction.amount),
          0
        );
      balance -= (userDataResponse.data.history as any[])
        .filter((transaction) => transaction.type.startsWith("transfer-to"))
        .reduce(
          (acc: number, transaction) => acc + Number(transaction.amount),
          0
        );
      balance += (userDataResponse.data.history as any[])
        .filter((transaction) => transaction.type.startsWith("transfer-from"))
        .reduce(
          (acc: number, transaction) => acc + Number(transaction.amount),
          0
        );
      balance -= (userDataResponse.data.history as any[])
        .filter((transaction) => transaction.type.startsWith("repay_token"))
        .reduce(
          (acc: number, transaction) => acc + Number(transaction.amount),
          0
        );
      balance -= (userDataResponse.data.history as any[])
        .filter((transaction) => transaction.type.startsWith("withdraw_token"))
        .reduce(
          (acc: number, transaction) => acc + Number(transaction.amount),
          0
        );

      const result = {
        user: userDataResponse?.data,
        contractBalance: userBalanceResponse?.data?.balance,
        balance: balance.toString(),
      };

      console.log(result);
      return result;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user data slice",
  initialState: initialUserDataState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.contractBalance = action.payload?.contractBalance;
        state.balance = action.payload?.balance;
        state.error = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.contractBalance = null;
        state.balance = null;
        state.error = action.error;
      });
  },
  reducers: {
    clearUserData: (state) => {
      state.user = null;
      state.contractBalance = null;
      state.balance = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { clearUserData } = userSlice.actions;

export default userSlice.reducer;
