"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDisplayTime } from "../utility/convertTime";
import ImageWithFallBack from "./ImageWithFallBack";
import { getFriends, SavedDbFriends } from "@/utility/saveAndRetrievedb";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";

export default function Chatlog() {
  const [friends, setFriends] = useState<SavedDbFriends[]>([]);
  const router = useRouter();
  const clientId = useSelector((state: UserState) => state.userId);

  const handleIndexDb = async () => {
    if (!clientId) return;
    try {
      const data = await getFriends(clientId);
      data.reverse();
      setFriends(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleIndexDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  return (
    <div className="overflow-scroll">
      <div className="py-3 px-5">
        {/* <!-- Chat list --> */}
        <div className="divide-y divide-gray-200">
          {/* <!-- User --> */}
          {friends &&
            friends.length > 0 &&
            friends.map((friend) => {
              return (
                <button key={friend.userId} onClick={() => router.push(`chatpage/${friend.userId}`)} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                  <div className="flex items-center">
                    <ImageWithFallBack className="rounded-full items-start flex-shrink-0 mr-3" src={`${process.env.NEXT_PUBLIC_AWS_URL}/${friend.profilePic}`} width={32} height={32} alt="dp" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{friend.name}</h4>
                      <div className="text-[13px]">
                        {friend.lastMessage && (
                          <>
                            <span className="opacity-70">{friend.lastMessage} </span>
                            <span className="text-weblue">&middot;{getDisplayTime(friend.lastMessageDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {friend.newMessage && <div className="absolute right-10 bg-weblue px-2 text-[12px] text-white py-0.5 rounded-full">{friend.newMessage}</div>}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
