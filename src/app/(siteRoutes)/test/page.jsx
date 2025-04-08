"use client";
import { InputOTPControlled } from "@/components/OTPInput";

// Ensure this runs on the client-side

export default function Test() {
  return (
    <div>
      <InputOTPControlled />
      <button className="bg-black"></button>
    </div>
  );
}
