"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function ProfilePage() {
  const param = useSearchParams();
  const userId = param.get("userId");
  const router = useRouter();

  if (!userId) return;
  return <div>{userId}</div>;
}
