"use client"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface userDataType {
    user: null | any;
    contractBalance: null | any;
    error: null | any;
    loading: boolean;
}

const initialUserDataState: userDataType = {
    user: null,
    contractBalance: null,
    error: null,
    loading: false
}

export const getUserData = createAsyncThunk("get/user/data", async (email: any, { rejectWithValue }) => {
    try {
        const [userDataResponse, userBalanceResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/getUserByEmail`),
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/getBalance/${email}`)
        ])

        return { user: userDataResponse?.data?.userData, contractBalance: userBalanceResponse?.data?.balance }
    } catch (error) {
        rejectWithValue(error);
    }
})

export const userSlice = createSlice({
    name: "user data slice",
    initialState: initialUserDataState,
    extraReducers: builder => {
        builder
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user;
                state.contractBalance = action.payload?.contractBalance;
                state.error = null;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.contractBalance = null;
                state.error = action.error;
            })
    },
    reducers: {}
})

export default userSlice.reducer;