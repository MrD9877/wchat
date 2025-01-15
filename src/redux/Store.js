"use client";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./Slice.js";

export const makeStore = configureStore({
  reducer,
});
