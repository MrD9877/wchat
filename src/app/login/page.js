"use client";
import Link from "next/link";
import TopHeader from "../components/TopHeader";
import WeButton from "../utility/WeButton";
import toast, { Toaster } from "react-hot-toast";
import { useActionState } from "react";

export default function LoginPage() {
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
  const [error, submitAction, isPending] = useActionState(async (previousState, formData) => {
    const data = Object.fromEntries(formData);
    let name = data.name.trim().toLowerCase();
    let email = data.email;
    try {
      const res = await fetch("/", { method: "POST", credentials: "include", body: JSON.stringify({ email }) });
      if (res.status === 200) {
        router.push("/verify");
      } else if (res.status === 400) {
        const data = await res.json();
        popTost(data.msg, false);
      } else if (res.status === 500) {
        popTost("Internal server Error", false);
      } else {
        popTost(`Error ${res.statusText}`, false);
      }
    } catch {
      popTost("Server not responding", false);
    }
    return null;
  }, null);
  return (
    <div>
      <TopHeader topic="Login" description="Enter your email to continue." />
      <form action={submitAction}>
        <div className="flex flex-col justify-center items-center gap-6 h-[50vh]">
          <div className="weInputContainer">
            <div className="weLabelDiv">
              <label className="weLabel" htmlFor="email">
                Email
              </label>
            </div>
            <div className="weinputdiv w-fit">
              <input className="weinput" name="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
          <WeButton btnDisable={isPending} type="submit" btnText={"Login"} />
        </div>
      </form>

      <div
        className="absolute bottom-20
      flex justify-center  items-center w-screen active:text-blue-600 "
      >
        Don&apos;t have an account{" "}
        <Link href={"/register"} className="text-weblue ml-1">
          Register
        </Link>
      </div>
    </div>
  );
}