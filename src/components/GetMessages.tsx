"use client";
import { useEffect } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import useInAppNotification from "./InAppNotification";
import { checkFriendData, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";
import { generateRandom } from "@/app/(backend)/utility/random";
import { usePathname } from "next/navigation";
import { updateFriend } from "@/utility/updateFriend";

export default function GetMessages() {
  const n = useInAppNotification();
  const clientId = useSelector((state: UserState) => state.userId);
  const pathname = usePathname();

  const handleIndexDb = async (message: string, userId: string, image?: string[], audio?: Blob[]) => {
    if (!clientId || pathname === `/chatpage/${userId}`) return;
    try {
      await checkFriendData(clientId, userId);
      await saveMessageForUser(clientId, { message, audio, image, sender: false, id: generateRandom(16) }, userId);
      await updateFriend({ clientId, userId, image, message, audio });
    } catch {}
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleNewMessage = ({ message, user, image, audio }: { message: string; user: string; image?: string[]; audio?: Blob[] }) => {
      handleIndexDb(message, user, image, audio);
    };
    socket.on("chat message", handleNewMessage);
    return () => {
      socket.off("chat message", handleNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);
  return [];
}
