import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type userInfo = {
  name: string;
  email: string;
  picture: string;
};

export type userState = {
  user: userInfo;
  loading?: boolean;
  error: boolean;
  errorMessage: string;
  login: boolean;
  auth: any;
};

export const initialState: userState = {
  user: {
    name: "",
    email: "",
    picture:
      "https://images.unsplash.com/photo-1598128558393-70ff21433be0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2822&q=80",
  },
  login: false,
  loading: undefined,
  error: false,
  errorMessage: "",
  auth: undefined,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<userInfo>) => ({
      ...state,
      user: action.payload,
      login: true,
    }),
    setAuth: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        auth: action.payload,
      };
    },
    setLoading: (
      state,
      action: PayloadAction<{
        loading: boolean;
        error?: boolean;
        errorMessage?: string;
      }>
    ) => ({
      ...state,
      loading: action.payload.loading,
      error: action.payload.error || state.error,
      errorMessage: action.payload.errorMessage || state.errorMessage,
    }),
  },
});

export default counterSlice;
