"use client";
import { useEffect } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { useRouter } from "next/navigation";
import { getCookie } from "../utility/getCookie";
export default function useConnectToServer(room: String | undefined) {
  const router = useRouter();

  useEffect(() => {
    const handleWelcome = async (msg: string | number) => {
      if (msg === 401) {
        socket.off("welcome", handleWelcome);
        const res = await fetch("/api/refreshAuth");
        if (res.status === 200) {
          const accessToken = getCookie("accessToken");
          socket.emit("joinRoom", accessToken);
        } else {
          router.push("/login");
        }
      }
    };
    const accessToken = getCookie("accessToken");
    socket.on("connect", () => {
      socket.emit("joinRoom", accessToken);
    });
    socket.on("reconnect", () => {
      socket.emit("joinRoom", accessToken);
    });
    socket.on("welcome", handleWelcome);
    return () => {
      socket.off("welcome", handleWelcome);
      socket.emit("leaveRoom", room);
    };
  }, [room, router]);
  return [];
}
