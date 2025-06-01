"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDisplayTime } from "../utility/convertTime";
import ImageWithFallBack from "./ImageWithFallBack";
import { getFriends, getLastRead, getMessagesSortedByTime, SavedDbFriends } from "@/utility/saveAndRetrievedb";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";
import { socket } from "@/socket";
import OpenProfilePic from "./OpenProfilePic";

type ChatLogFriendstype = { newMessages?: number } & SavedDbFriends;
export default function Chatlog() {
  const [friends, setFriends] = useState<ChatLogFriendstype[]>([]);
  const router = useRouter();
  const clientId = useSelector((state: UserState) => state.userId);
  const newMessage = useSelector((state: UserState) => state.newMessage);
  const [url, setUrl] = useState<string>();

  const handleIndexDb = async () => {
    if (!clientId) return;
    try {
      const data: ChatLogFriendstype[] = await getFriends(clientId);
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].userId;
        const lastRead = await getLastRead(clientId, userId);
        const messages = await getMessagesSortedByTime(clientId, userId, lastRead);
        data[i].newMessages = messages.length;
      }
      setFriends(data.reverse());
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleIndexDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, newMessage]);

  return (
    <>
      {url && <OpenProfilePic url={url} setUrl={setUrl} />}
      <div className="overflow-y-scroll min-h-[70svh]">
        <div className="py-3 px-5">
          {/* <!-- Chat list --> */}
          <div className="divide-y divide-gray-200">
            {/* <!-- User --> */}
            {friends &&
              friends.length > 0 &&
              friends.map((friend) => {
                return (
                  <button key={friend.userId} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                    <div className="flex items-center">
                      <div onClick={() => setUrl(`${process.env.NEXT_PUBLIC_AWS_URL}/${friend.profilePic}`)}>
                        <ImageWithFallBack className="rounded-full items-start flex-shrink-0 mr-3 w-10 h-10" src={`${process.env.NEXT_PUBLIC_AWS_URL}/${friend.profilePic}`} width={32} height={32} alt="dp" />
                      </div>
                      <div onClick={() => router.push(`chatpage/${friend.userId}`)}>
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
                      {!!friend.newMessages && <div className="absolute right-10 bg-weblue px-2 text-[12px] text-white py-0.5 rounded-full">{friend.newMessages}</div>}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
