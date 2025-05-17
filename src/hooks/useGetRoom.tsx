"use client";
import { Chat, Friend } from "@/app/(siteRoutes)/chatpage/[chatId]/page";
import { connectIndexDb } from "@/utility/IndexDbConnect";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function useGetRoom(setChat: React.Dispatch<React.SetStateAction<Chat[]>>) {
  const [friend, setFriend] = useState<Friend>();

  const [room, setRoom] = useState<string>();

  const pathname = usePathname();

  const handleIndexDb = async (room: string) => {
    const db = await connectIndexDb();
    if (!db) return false;
    const { transaction, stores } = db;
    const findFriend = stores.friendStore.get(room);
    // 5
    const temp: Chat[] = [];
    findFriend.onsuccess = function () {
      const friend: Friend = findFriend.result;
      setFriend(friend);
      if (friend && friend.chats) {
        friend.chats.forEach((chat) => {
          const findChat = stores.chatStore.get(chat.chatId);
          findChat.onsuccess = function () {
            const chats = findChat.result.chats;
            temp.push({ date: chat.date, chats: structuredClone(chats) });
          };
        });
      }
    };
    transaction.oncomplete = function () {
      setChat([...temp]);
    };
  };

  useEffect(() => {
    const id = pathname.split("/");
    const room = id[id.length - 1];
    setRoom(room);
    handleIndexDb(room);
  }, [pathname]);
  return { room, friend } as const;
}
