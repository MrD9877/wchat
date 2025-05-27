"use client";
import { useState } from "react";
import ChatBoxTopNav from "../../../components/ChatBoxTopNav";
import Chatlog from "../../../components/Chatlog";
import NavBarChatBox from "../../../components/NavBarChatBox";
import CallHistory from "@/components/CallHistory";

export default function ChatscreenPage() {
  const [page, setPage] = useState<"chat" | "call">("chat");
  return (
    <div>
      <ChatBoxTopNav setPage={setPage} page={page} />
      {page === "chat" ? <Chatlog /> : <CallHistory />}
      {/* <AddNewBtn /> */}
      <NavBarChatBox />
    </div>
  );
}
