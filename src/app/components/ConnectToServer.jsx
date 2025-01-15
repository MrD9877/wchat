"use client";
import React, { useState, useEffect, useActionState } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
export default function ConnectToServer({ room }) {
  useEffect(() => {
    const handleNewMessage = (msg) => {
      console.log(msg);
    };
    socket.emit("joinRoom", room);
    return () => {
      socket.emit("leaveRoom", room);
    };
  }, []);
  return <div></div>;
}
