"use client";
import { useEffect } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addNewMessage } from "@/redux/Slice";
import { PrivateMessage } from "@/app/(siteRoutes)/camera/page";
import { handleNewMessage } from "@/utility/getNewMessage";

export type MessageData = Omit<PrivateMessage, "accessToken"> & { userId: string; username: string };

export default function useGetMessages(clientId: string | undefined) {
  const pathname = usePathname();
  const dispath = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (data: MessageData) => {
      if (!clientId || pathname === `/chatpage/${data.userId}`) return;
      else {
        await handleNewMessage(clientId, data, pathname, router);
        if (pathname === "/chatscreen") {
          dispath(addNewMessage(1));
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
