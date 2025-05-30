"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InComingCall = null | { from: string; type: "video" | "voice"; name: string };

// Define the types for the user state
export interface UserState {
  email?: string;
  name?: string;
  userId?: string;
  inComingCall: InComingCall;
  profilePic?: string;
  loading: boolean;
  newMessage: number;
}

const initialState: UserState = {
  email: undefined,
  name: undefined,
  userId: "me",
  inComingCall: null,
  loading: false,
  profilePic: undefined,
  newMessage: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; name: string; userId: string; profilePic: string }>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.userId = action.payload.userId;
      state.profilePic = action.payload.profilePic;
    },
    setIncomingCall: (state, action: PayloadAction<{ inComingCall: InComingCall }>) => {
      state.inComingCall = action.payload.inComingCall;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addNewMessage: (state, action: PayloadAction<number>) => {
      state.newMessage = state.newMessage + action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setIncomingCall, setLoading, addNewMessage } = userSlice.actions;

export default userSlice.reducer;
