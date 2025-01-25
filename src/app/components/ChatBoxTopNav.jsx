"use client";

import DisplaySearchResults from "./DisplaySearchResults";
import OutSideAlart from "./OutSideAlart";
import SearchBar from "./SearchBar";

export default function ChatBoxTopNav() {
  return (
    <>
      <div className="h-[15vh]  bg-weblue rounded-b-2xl pt-8">
        <SearchBar />
        <nav className="flex text-white font-bold justify-evenly text-xl mt-3">
          <div>Chats</div>
          <div>Calls</div>
        </nav>
      </div>
    </>
  );
}
