import { configureStore } from '@reduxjs/toolkit';
import useReducer from "@/lib/reducers/user_data_slice";
export const makeStore = () => {
    return configureStore({
        reducer: {
            user: useReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
        })
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']