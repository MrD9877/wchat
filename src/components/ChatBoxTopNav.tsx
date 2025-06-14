"use client";

import { Dispatch, SetStateAction } from "react";
import SearchBar from "./SearchBar";

export default function ChatBoxTopNav({ page, setPage }: { page: "chat" | "call"; setPage: Dispatch<SetStateAction<"chat" | "call">> }) {
  return (
    <div className="w-full">
      <div className="min-h-[15%] bg-weblue rounded-b-2xl pt-8 w-full">
        <SearchBar /> {/* This component must have `w-full` on its root div */}
        <nav className="flex justify-evenly text-white font-bold text-xl mt-3 w-full">
          <button className="w-full text-center" style={{ opacity: page === "chat" ? 1 : 0.8 }} onClick={() => setPage("chat")}>
            Chats
          </button>
          <button className="w-full text-center" style={{ opacity: page === "call" ? 1 : 0.8 }} onClick={() => setPage("call")}>
            Calls
          </button>
        </nav>
      </div>
    </div>
  );
}
