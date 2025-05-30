"use client";
import { useEffect } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { useRouter } from "next/navigation";
import { getCookie } from "../utility/getCookie";
export default function useConnectToServer(room: String | undefined) {
  const router = useRouter();
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

  useEffect(() => {
    socket.on("unauthorized", async ({ data, custom }: { data: { accessToken: string }; custom: string }) => {
      try {
        const res = await fetch("/api/refreshAuth");
        if (!res.ok) throw Error();
        const accessToken = getCookie("accessToken");
        socket.emit(custom, { ...data, accessToken });
      } catch {
        router.push("/login");
      }
    });

    return () => {
      socket.off("unauthorized");
    };
  }, [router]);
  return [];
}
