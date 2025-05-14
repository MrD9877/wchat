"use client";
import { Provider } from "react-redux";
import { makeStore } from "./Store";
import { ReactNode } from "react";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={makeStore}>{children}</Provider>;
};

export default StoreProvider;
