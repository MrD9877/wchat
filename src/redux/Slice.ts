"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InComingCall = null | { from: string; offer: RTCSessionDescriptionInit; type: "video" | "voice"; name: string };

// Define the types for the user state
export interface UserState {
  email?: string;
  name?: string;
  userId?: string;
  inComingCall: InComingCall;
}

const initialState: UserState = {
  email: undefined,
  name: undefined,
  userId: undefined,
  inComingCall: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; name: string; userId: string }>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.userId = action.payload.userId;
    },
    setIncomingCall: (state, action: PayloadAction<{ inComingCall: InComingCall }>) => {
      state.inComingCall = action.payload.inComingCall;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setIncomingCall } = userSlice.actions;

export default userSlice.reducer;
