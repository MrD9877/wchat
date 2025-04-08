"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/Slice";
import TopHeader from "@/components/TopHeader";
import WeButton from "@/utility/WeButton";
import { InputOTPControlled } from "@/components/OTPInput";

export default function VerifyPage() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const email = params.get("email");

  const popTost = (msg: string | number, success?: boolean) => {
    let emote = "❌";
    if (success) emote = "✅";
    toast(`${msg}`, {
      icon: `${emote}`,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleSubmit = async () => {
    const otp = value;
    if (otp.length < 4) {
      popTost("please input valid otp");
      return;
    }
    try {
      const res = await fetch("/api/verify", { method: "POST", credentials: "include", body: JSON.stringify({ otp, email }) });
      console.log(res.status);
      if (res.status === 200) {
        const { user } = await res.json();
        dispatch(setUser({ ...user }));
        router.push("/chatscreen");
      } else if (res.status === 400) {
        const data = await res.json();
        popTost(data.msg);
      } else {
        popTost(res.status);
      }
    } catch {
      popTost("Internal Server Error");
    }
  };

  const reSendOtp = async () => {
    try {
      const res = await fetch("/api/resendOTP");
      if (res.status === 201) {
        popTost("New OTP Generated", true);
      } else {
        const data = await res.json();
        popTost(data.msg);
      }
    } catch {
      popTost("Error 500");
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <TopHeader topic="OTP verification" description="Please enter your correct OTP for number verification process" />
      <div className="flex flex-col justify-center items-center h-[50vh] gap-10">
        <InputOTPControlled value={value} setValue={setValue} />
        <div>
          <div className="my-4">
            <WeButton handler={handleSubmit} btnText={"Verify"} />
          </div>
          <div className=" mx-auto w-fit">
            <button onClick={reSendOtp} className="text-weblue underline">
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
