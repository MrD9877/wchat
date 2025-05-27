"use client";

import { Dispatch, SetStateAction } from "react";
import SearchBar from "./SearchBar";

export default function ChatBoxTopNav({ page, setPage }: { page: "chat" | "call"; setPage: Dispatch<SetStateAction<"chat" | "call">> }) {
  return (
    <>
      <div className="h-[15vh]  bg-weblue rounded-b-2xl pt-8">
        <SearchBar />
        <nav className="flex text-white font-bold justify-evenly text-xl mt-3">
          <button style={{ opacity: page === "chat" ? 1 : 0.8 }} onClick={() => setPage("chat")}>
            Chats
          </button>
          <button style={{ opacity: page === "call" ? 1 : 0.8 }} onClick={() => setPage("call")}>
            Calls
          </button>
        </nav>
      </div>
    </>
  );
}
