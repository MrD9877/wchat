"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DisplaySearchResults from "./DisplaySearchResults";
import OutSideAlart from "./OutSideAlart";
import { UserState } from "@/redux/Slice";

export default function SearchBar() {
  const [search, setSeach] = useState("");
  const [result, setResult] = useState([]);
  const [visible, setVisible] = useState(false);
  const name = useSelector((state: UserState) => state.name);
  const searchResults = useRef<HTMLDivElement>(null);

  const searchUser = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeach(e.target.value);
    try {
      const res = await fetch("/api/auth/search", { method: "POST", body: JSON.stringify({ search: e.target.value }) });
      if (res.status === 200) {
        const { users } = await res.json();
        setResult(users);
        setVisible(users.length > 0);
      }
    } catch {}
  };
  return (
    <div ref={searchResults}>
      <div className="bg-white px-2 pr-3 py-2 w-4/5 mx-auto rounded-2xl flex justify-between">
        <span className="bg-weblue px-3 py-1 text-black font-bold rounded-full">{name && name.charAt(0).toUpperCase()}</span>
        <input className="outline-none px-3" value={search} onChange={searchUser} type="text" placeholder="Search by name or email.." />
        <div className="flex mr-3 justify-center items-center">
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="#191919" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.35 18L13 13.65" stroke="#191919" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {<OutSideAlart inside={searchResults} setInside={setVisible} />}
      {visible && <DisplaySearchResults array={result} setArray={setResult} />}
    </div>
  );
}
