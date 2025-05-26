"use client";
import { useEffect } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { checkFriendData, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { usePathname } from "next/navigation";
import { updateFriend } from "@/utility/updateFriend";

export type MessageData = { message: string; user: string; image?: string[]; audio?: Blob[]; id: string };

export const handleNewMessage = async (clientId: string, { message, user, image, audio, id }: MessageData) => {
  try {
    await checkFriendData(clientId, user);
    await saveMessageForUser(clientId, { message: message, audio, image, sender: false, id }, user);
    await updateFriend({ clientId, userId: user, image, message, audio });
  } catch (err) {
    console.log(err);
  }
};

export default function useGetMessages(clientId: string | undefined) {
  const pathname = usePathname();

  const handleMessage = async (data: MessageData) => {
    if (!clientId || pathname === `/chatpage/${data.user}`) return;
    await handleNewMessage(clientId, data);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    socket.on("chat message", handleMessage);
    return () => {
      socket.off("chat message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);
  return [];
}
