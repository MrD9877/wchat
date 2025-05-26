"use client";
import { subscribe } from "@/utility/subcribeNotification";
import React from "react";

export default function Page() {
  return (
    <div>
      <button onClick={subscribe}>Click</button>
    </div>
  );
}
