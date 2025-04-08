"use client";

import * as React from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function InputOTPControlled({ value, setValue }: { value: string; setValue: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <div className="space-y-2">
      <InputOTP maxLength={4} value={value} onChange={(value) => setValue(value)}>
        <InputOTPGroup className="gap-3 mx-auto">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">{value === "" ? <>Enter your one-time password.</> : <>You entered: {value}</>}</div>
    </div>
  );
}
