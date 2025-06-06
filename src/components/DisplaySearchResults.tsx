"use client";
import React, { useState } from "react";
import { Users } from "./SearchBar";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";
import { toast } from "sonner";

export default function DisplaySearchResults({ array, setArray }: { array: Users | undefined; setArray: React.Dispatch<React.SetStateAction<Users | undefined>> }) {
  const [isPending, setPending] = useState<{ [email: string]: boolean | undefined }>({});
  const email = useSelector((state: UserState) => state.email);

  const handleSendRequest = async (email: string, index: number) => {
    setPending((pre) => ({ ...pre, [email]: true }));
    try {
      const res = await fetch("/api/auth/sendfriendrequest", { method: "POST", body: JSON.stringify({ email }) });
      if (res.status === 200) {
        setArray((pre) => {
          const temp = pre;
          if (!temp) return;
          temp[index].requestSend = true;
          return temp;
        });
      } else if (res.status === 404) {
        toast(404);
      } else {
        const { msg } = await res.json();
        toast(msg);
      }
      setPending((pre) => ({ ...pre, [email]: undefined }));
    } catch {
      setPending((pre) => ({ ...pre, [email]: undefined }));
    }
  };
  if (array)
    return (
      <div className="w-screen absolute px-8 select-none">
        <div className=" max-w-[400px] border border-black rounded-lg shadow p-2 my-2  mx-auto bg-white z-10  ">
          <div className="flow-root ">
            <ul role="list" className="divide-y divide-gray-200 ">
              {array.map((user, index) => {
                const userEmail = user.email;
                if (userEmail === email) return;
                return (
                  <li key={index} className="p-3 sm:p-4 ">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="w-8 h-8 rounded-full" src={`${process.env.NEXT_PUBLIC_AWS_URL}/${user.profilePic}`} alt="Neil image" />
                      </div>
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-black truncate ">Email: {user.email.slice(0, 20)}</p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">Name: {user.name.slice(0, 25)}</p>
                      </div>
                      <div className="flex flex-col">
                        {isPending[userEmail] === undefined ? (
                          user.friend ? (
                            <button className="weButton text-blue-600">✔</button>
                          ) : (
                            <button disabled={user.requestSend} style={{ opacity: user.requestSend ? "0.8" : "1" }} onClick={() => handleSendRequest(user.email, index)} className="weButton">
                              Add+
                            </button>
                          )
                        ) : (
                          <button disabled type="button" className="weButton">
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4  text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#1C64F2"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
}
