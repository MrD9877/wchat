"use client";
import { InAppNotificationData } from "@/app/(backend)/utility/sendInAppNotification";
import { socket } from "@/socket";
import { useEffect } from "react";
export type InAppNotificationReceived = Omit<InAppNotificationData, "userId">;
export default function useInAppNotification() {
  const handleNotification = async (data: InAppNotificationData) => {};

  useEffect(() => {
    socket.on("inAppNotification", handleNotification);
    return () => {
      socket.off("inAppNotification", handleNotification);
    };
  }, []);
  return [];
}
