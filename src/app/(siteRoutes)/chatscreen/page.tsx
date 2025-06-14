"use client";
import { useState } from "react";
import ChatBoxTopNav from "../../../components/ChatBoxTopNav";
import Chatlog from "../../../components/Chatlog";
import NavBarChatBox from "../../../components/NavBarChatBox";

export default function ChatscreenPage() {
  const [page, setPage] = useState<"chat" | "call">("chat");
  return (
    <>
      <ChatBoxTopNav setPage={setPage} page={page} />
      {/* {page === "chat" ? */}
      <Chatlog />
      {/* : <CallHistory />} */}
      {/* <AddNewBtn /> */}
      <NavBarChatBox />
    </>
  );
}
