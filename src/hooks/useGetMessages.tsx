"use client";
import { useEffect } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { checkFriendData, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { usePathname } from "next/navigation";
import { updateFriend } from "@/utility/updateFriend";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addNewMessage } from "@/redux/Slice";

export type MessageData = { message: string; user: string; image?: string | string[]; audio?: string; id: string; username: string };

export const handleNewMessage = async (clientId: string, { message, user, image, audio, id }: MessageData) => {
  try {
    await checkFriendData(clientId, user);
    await saveMessageForUser(clientId, { message: message, audio, image, sender: false, id, userId: user, timestamp: Date.now() });
    await updateFriend({ clientId, userId: user, image, message, audio });
  } catch (err) {
    console.log(err);
  }
};

function pushNotification(data: MessageData) {
  const notificationMessage: string[] = [];
  if (data.message) notificationMessage.push(data.message);
  if (data.image) notificationMessage.push("🖼️");
  if (data.image && !data.message) notificationMessage.push("Image");
  if (data.audio) notificationMessage.push("🎙️ 1:00");
  toast(data.username, { description: notificationMessage.join(" ") });
}

export default function useGetMessages(clientId: string | undefined) {
  const pathname = usePathname();
  const dispath = useDispatch();

  useEffect(() => {
    const handleMessage = async (data: MessageData) => {
      if (!clientId || pathname === `/chatpage/${data.user}`) return;
      else {
        await handleNewMessage(clientId, data);
        if (pathname === "/chatscreen") {
          dispath(addNewMessage(1));
        } else {
          pushNotification(data);
        }
      }
    };

    if (typeof window === "undefined") return;
    socket.on("chat message", handleMessage);
    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [clientId, pathname, dispath]);
  return [];
}
