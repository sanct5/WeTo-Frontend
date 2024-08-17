import { createSlice } from "@reduxjs/toolkit";
export interface UserState {
    idDocument: string;
    name: string;
    email: string;
    phone: string;
    stayLogged: boolean;
    config: UserConfig;
    isLogged: boolean;
}

interface UserConfig {
    primaryColor?: string;
    secondaryColor?: string;
}

const initialState: UserState = {
    idDocument: "",
    name: "",
    email: "",
    phone: "",
    stayLogged: false,
    config: {
        primaryColor: undefined,
        secondaryColor: undefined,
    },
    isLogged: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUser: () => initialState,
        setUser: (state, action) => {
            state.idDocument = action.payload.idDocument;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
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