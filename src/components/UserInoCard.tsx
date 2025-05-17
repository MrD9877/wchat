import { UserState } from "@/redux/Slice";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

export default function UserInoCard() {
  const { userName, email } = useSelector((state: UserState) => ({ userName: state.name, email: state.email }));

  return (
    <div className="my-4  flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
      <div className="w-full flex flex-col ">
        <div className="flex-1 bg-white rounded-lg shadow-xl p-3 sm:p-8">
          <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
          <ul className="w-full mt-2 text-gray-700">
            <li className="flex border-y py-2">
              <span className="font-bold w-24 ">Full name:</span>
              <Link href={"setting/editProfile?edit=userName"}>
                <span className="text-gray-700 ml-2 sm:ml-0 overflow-scroll">{userName}</span>
              </Link>
            </li>
            <li className="flex border-b py-2">
              <span className="font-bold w-24">Email:</span>
              <span className="text-gray-700 ml-2 sm:ml-0 overflow-scroll">{email ? email : "Not provided"}</span>
            </li>
            <li className="flex border-b py-2">
              <span className="font-bold w-24">Languages:</span>
              <span className="text-gray-700 ml-2 sm:ml-0">English</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
