"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/Slice";
import TopHeader from "@/app/components/TopHeader";
import WeButton from "@/app/utility/WeButton";

export default function VerifyPage() {
  const [inputValue, setInputValue] = useState(["", "", "", ""]);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const inputRef = useRef();
  // const total = useSelector((state) => state.total);
  // const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const popTost = (msg, success) => {
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
    const otp = inputValue.join("");
    if (otp.length < 4) {
      popTost("please input valid otp");
      return;
    }
    try {
      const res = await fetch("/api/verify", { method: "POST", credentials: "include", body: JSON.stringify({ otp }) });
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

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newArr = [...inputValue];
      newArr[count] = "";
      setInputValue(newArr);
      if (count > 0) setCount(count - 1);
    }
  };

  const handleChange = (val) => {
    if (val === "") return;
    const arr = [...inputValue];
    arr[count] = val;
    setInputValue(arr);
    if (count < 3) {
      setCount(() => count + 1);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [inputRef, count, inputValue]);

  useEffect(() => {
    if (count <= 3 && count >= 0) {
      inputRef.current.children[count].focus();
    }
  }, [count]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <TopHeader topic="OTP verification" description="Please enter your correct OTP for number verification process" />
      <div className="flex flex-col justify-center items-center h-[50vh] gap-10">
        <div ref={inputRef} className="flex items-center justify-center gap-3">
          {inputValue.map((_, index) => {
            if (index > 3) return;
            return (
              <input
                type="number"
                value={inputValue[index]}
                key={index}
                onFocus={(e) => e.preventDefault()}
                onChange={(e) => {
                  e.preventDefault();
                  const val = e.target.value;
                  if (isFinite(val) && val >= 0 && val <= 9) handleChange(val);
                }}
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-white border border-weblue hover:border-slate-200 appearance-none rounded-full p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                maxLength={1}
              />
            );
          })}
        </div>
        <div>
          <div className="my-4">
            <WeButton handler={handleSubmit} btnText={"Verify"} />
          </div>
          <div className="text-weblue mx-auto w-fit underline">Resend OTP</div>
        </div>
      </div>
    </div>
  );
}
