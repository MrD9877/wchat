"use client";
import React from "react";
import ProfileFront from "@/components/ProfileFront";
import UserInoCard from "@/components/UserInoCard";
import NotificationSetting from "@/components/NotificationSetting";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="h-screen w-full overflow-y-scroll">
      <AnimatePresence mode="wait">
        <div key={pathname}>{children}</div>
      </AnimatePresence>
      <div className="bg-gray-200 overflow-y-scroll overflow-x-clip">
        <ProfileFront />
        <UserInoCard />
        <NotificationSetting />
      </div>
    </div>
  );
}
