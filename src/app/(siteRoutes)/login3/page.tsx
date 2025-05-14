"use client";
import toast, { Toaster } from "react-hot-toast";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import LoginFormCard from "@/components/LoginFormCard";

export default function LoginPage() {
  const router = useRouter();
  const popTost = (msg: string, success?: boolean) => {
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
  const [error, submitAction, isPending] = useActionState(async (previousState: unknown, formData: FormData) => {
    const data = Object.fromEntries(formData);
    let email = (data.email as string).trim().toLowerCase();
    try {
      const res = await fetch("/api/login", { method: "POST", credentials: "include", body: JSON.stringify({ email }) });
      if (res.status === 201 || res.status === 409) {
        router.push(`/verify?email=${email}`);
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
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <LoginFormCard submitAction={submitAction} isPending={isPending} headerDescription="Enter your email to continue." linkDescription=" Don't have an account" linkHref="register" collectInputs={["email"]} headerTopic="Login" />
    </>
  );
}
