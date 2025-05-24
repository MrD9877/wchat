"use client";
import { UserState } from "@/redux/Slice";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

export default function Loading() {
  const loading = useSelector((state: UserState) => state.loading);
  if (loading)
    return (
      <div className="w-screen bg-black/20 h-[100svh] flex justify-center items-center absolute top-0 z-[1200] ">
        <LoaderCircle className="animate-spin" />
      </div>
    );
}
