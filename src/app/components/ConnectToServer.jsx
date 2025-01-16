"use client";
import React, { useState, useEffect, useActionState } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { useRouter } from "next/navigation";
import { getCookie } from "../utility/getCookie";
export default function ConnectToServer({ room }) {
  const router = useRouter();

  useEffect(() => {
    const handleWelcome = async (msg) => {
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
    socket.emit("joinRoom", accessToken);
    socket.on("welcome", handleWelcome);
    return () => {
      socket.off("welcome", handleWelcome);
      socket.emit("leaveRoom", room);
    };
  }, []);
  return <div></div>;
}
