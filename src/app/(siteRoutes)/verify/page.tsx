"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "@/redux/Slice";
import TopHeader from "@/components/TopHeader";
import WeButton from "@/utility/WeButton";
import { InputOTPControlled } from "@/components/OTPInput";
import { toast } from "sonner";
import { exportPublicKeyBase64, getKeysForFirstTime } from "@/utility/Encription";

export default function VerifyPage() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const email = params.get("email");

  const handleSubmit = async () => {
    const otp = value;
    if (otp.length < 4) {
      toast("please input valid otp");
      return;
    }
    try {
      dispatch(setLoading(true));
      const keys = await getKeysForFirstTime();
      if (!keys.publicKey) throw Error();
      const publicKey = await exportPublicKeyBase64(keys.publicKey);
      const verifyRes = await fetch("/api/verify", { method: "POST", credentials: "include", body: JSON.stringify({ otp, email, publicKey }) });
      if (!verifyRes.ok) throw Error(`Error: status ${verifyRes.statusText}`);
      const user = await verifyRes.json();
      dispatch(setUser({ ...user }));
      router.push("/chatscreen");
      toast(`welcome ${user.name}`);
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("An unexpected error occurred.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const reSendOtp = async () => {
    try {
      const res = await fetch("/api/resendOTP");
      if (res.status === 201) {
        toast("New OTP Generated");
      } else {
        const data = await res.json();
        toast(data.msg);
      }
    } catch {
      toast("Error 500");
    }
  };

  return (
    <div>
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
