"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import TopHeader from "@/components/TopHeader";
import WeButton from "@/utility/WeButton";

export default function Page() {
  const router = useRouter();
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
    let email = data.email.trim().toLowerCase();
    try {
      const res = await fetch("/api/register", { method: "POST", credentials: "include", body: JSON.stringify({ name, email }) });
      if (res.status === 201) {
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
    <div className="w-screen h-screen  bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      <TopHeader topic="Register" description="Fill up your details to register" />
      <form className="mt-10 flex flex-col gap-5" action={submitAction}>
        <div className="weInputContainer">
          <div className="weLabelDiv">
            <label className="weLabel" htmlFor="name">
              Name
            </label>
          </div>
          <div className="weinputdiv w-fit">
            <input className="weinput" name="name" type="text" placeholder="Enter your name" />
          </div>
        </div>
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
        <div className="absolute w-screen bottom-20">
          <WeButton type="submit" btnText={"Register"} btnDisable={isPending} />
        </div>
        <div className="absolute flex justify-center bottom-10 items-center w-screen active:text-blue-600">
          Already have an account{" "}
          <Link className="text-weblue ml-1 " href={"/login"}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
