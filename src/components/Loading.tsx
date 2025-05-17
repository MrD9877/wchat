import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="w-screen bg-black/20 h-[100svh] flex justify-center items-center ">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
