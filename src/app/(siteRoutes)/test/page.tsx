"use client";
import { UserState } from "@/redux/Slice";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const userId = useSelector((state: UserState) => state.userId);
  return (
    <div className="h-[400svh] ">
      <div className="fixed top-0 z-10 bg-red-50 h-12 w-screen">{userId}</div>
    </div>
  );
}
