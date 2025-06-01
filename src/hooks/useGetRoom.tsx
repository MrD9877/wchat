"use client";
import { UserState } from "@/redux/Slice";
import { checkFriendData, getMessagesSortedByTime, SavedDbFriends, SavedDbMessages } from "@/utility/saveAndRetrievedb";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useGetRoom(setChat: React.Dispatch<React.SetStateAction<SavedDbMessages[]>>) {
  const [friend, setFriend] = useState<SavedDbFriends | null | undefined>();
  const clientId = useSelector((state: UserState) => state.userId);

  const [room, setRoom] = useState<string>();

  const pathname = usePathname();

  const handleIndexDb = async (room: string) => {
    if (!clientId) return;
    try {
      const chat = await getMessagesSortedByTime(clientId, room);
      setChat(chat);
      const friendInfo = await checkFriendData(clientId, room);
      setFriend(friendInfo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const id = pathname.split("/");
    const room = id[id.length - 1];
    setRoom(room);
    handleIndexDb(room);
  }, [pathname, clientId]);
  return { room, friend } as const;
}
