"use client";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./Slice";

export const makeStore = configureStore({
  reducer,
});
