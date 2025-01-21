"use client";
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    email: undefined,
    name: undefined,
    userId: undefined,
    inComingCall: undefined,
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.userId = action.payload.userId;
    },
    setIncomingCall: (state, action) => {
      state.inComingCall = action.payload.inComingCall;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setIncomingCall } = userSlice.actions;

export default userSlice.reducer;
