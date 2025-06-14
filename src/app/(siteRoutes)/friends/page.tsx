"use client";
import { useState } from "react";
import NavBarChatBox from "../../../components/NavBarChatBox";
import FriendPageMain from "../../../components/FriendPageMain";
import SearchBar from "../../../components/SearchBar";

export default function FriendsPage() {
  const [page, setPage] = useState("friends");
  const [numberOfRequests, setNumber] = useState<number>();
  const setStyle = {};

  return (
    <div>
      <div className="h-[15%]  bg-weblue rounded-b-2xl pt-8">
        <SearchBar />
        <nav className="flex text-white font-bold justify-evenly text-xl mt-3 max-w-screen">
          <button onClick={() => setPage("friends")}>
            <span style={page === "friends" ? setStyle : { opacity: "0.9" }}>Friends</span>
          </button>
          <button onClick={() => setPage("request")}>
            <span className="flex" style={page === "request" ? setStyle : { opacity: "0.9" }}>
              Requests
              {numberOfRequests && numberOfRequests > 0 ? (
                <span className="text-xs flex w-full h-full  justify-center items-start mx-1">
                  <span className="px-0.5 bg-green-600 text-white rounded-full">{numberOfRequests}</span>
                </span>
              ) : (
                <></>
              )}
            </span>
          </button>
        </nav>
      </div>
      <div className="z-1 w-full">
        <FriendPageMain page={page} setNumber={setNumber} />
      </div>
      <NavBarChatBox />
    </div>
  );
}
