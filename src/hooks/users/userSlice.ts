import { createSlice } from "@reduxjs/toolkit";

export type Role = "RESIDENT" | "ADMIN";
export interface UserState {
    _id: string;
    idDocument: string;
    userName: string;
    idComplex: string;
    email: string;
    phone: string;
    apartment: string;
    role: Role;
    config: UserConfig;
    stayLogged: boolean;
    isLogged: boolean;
}

interface UserConfig {
    primaryColor?: string;
    secondaryColor?: string;
}

const initialState: UserState = {
    _id: "",
    idDocument: "",
    userName: "",
    idComplex: "",
    email: "",
    phone: "",
    apartment: "",
    role: "RESIDENT",
    config: {
        primaryColor: undefined,
        secondaryColor: undefined,
    },
    stayLogged: false,
    isLogged: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUser: () => initialState,
        setUser: (state, action) => {
            state._id = action.payload._id;
            state.idDocument = action.payload.idDocument;
            state.userName = action.payload.userName;
            state.idComplex = action.payload.idComplex;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.apartment = action.payload.apartment;
            state.role = action.payload.role;
            state.config = action.payload.config;
            state.isLogged = action.payload.isLogged;
        },
        setStayLogged: (state, action) => {
            state.stayLogged = action.payload;
        },
    },
});

export const { setUser, setStayLogged, resetUser } = userSlice.actions;
export default userSlice.reducer;