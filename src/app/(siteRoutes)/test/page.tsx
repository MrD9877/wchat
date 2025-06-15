"use client";
import ChatBoxTopNav from "@/components/ChatBoxTopNav";
import React, { useState } from "react";

export default function Page() {
  const [page, setPage] = useState<"chat" | "call">("chat");

  return <ChatBoxTopNav setPage={setPage} page={page} />;
}
