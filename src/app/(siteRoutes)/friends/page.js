"use client";
import { useState } from "react";
import NavBarChatBox from "../../../components/NavBarChatBox";
import FriendPageMain from "../../../components/FriendPageMain";
import { useSelector } from "react-redux";
import SearchBar from "../../../components/SearchBar";

export default function FriendsPage() {
  const [page, setPage] = useState("friends");

  const setStyle = {};

  return (
    <div>
      <div className="h-[15vh]  bg-weblue rounded-b-2xl pt-8">
        <SearchBar />
        <nav className="flex text-white font-bold justify-evenly text-xl mt-3 max-w-screen">
          <div onClick={() => setPage("friends")} style={page === "friends" ? setStyle : { opacity: "0.9" }}>
            Friends
          </div>
          <div onClick={() => setPage("request")} style={page === "request" ? setStyle : { opacity: "0.9" }}>
            Requests
          </div>
        </nav>
      </div>
      <div className="z-1">
        <FriendPageMain page={page} />
      </div>
      <NavBarChatBox />
    </div>
  );
}
