"use client";
import { useEffect } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { useRouter } from "next/navigation";
import { getCookie } from "../utility/getCookie";
export default function useConnectToServer(room: String | undefined) {
  useEffect(() => {
    if (!room) return;
    const accessToken = getCookie("accessToken");
    socket.emit("joinRoom", accessToken);
    socket.on("reconnect", () => {
      socket.emit("joinRoom", accessToken);
    });
    return () => {
      socket.emit("leaveRoom", room);
    };
  }, [room]);
  return [];
}
