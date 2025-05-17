"use client";

import { UserState } from "@/redux/Slice";
import { useSelector } from "react-redux";

export default function Page() {
  const profilePic = useSelector((state: UserState) => state.profilePic);
  return (
    <div className="h-[400svh] ">
      <img src={`https://webnovel-d.s3.eu-north-1.amazonaws.com/${profilePic}`} alt="sc" />
    </div>
  );
}
