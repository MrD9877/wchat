"use client";
import { handleVideoCall } from "@/components/ChatPageTop";
import { EditOptionsCard } from "@/components/EditProfilePic";
import ImageWithFallBack from "@/components/ImageWithFallBack";
import { copyToClipboard } from "@/utility/copyToClipboard";
import { unfriendUser } from "@/utility/updateFriend";
import { ArrowLeft, Ban, Copy, Heart, MessageCircleCode, Phone, ThumbsDown, Video } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type UserData = {
  userId: any;
  name: string;
  email: string;
  profilePic: string;
};

export default function ProfilePage() {
  const param = useSearchParams();
  const userId = param.get("userId");
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>();
  const [report, setReport] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/userFriends", { method: "POST", body: JSON.stringify({ userId }) });
        if (res.ok) {
          const data: UserData = await res.json();
          setUserData(data);
          return;
        }
        throw Error();
      } catch {}
    }
    if (!userId) return;
    getUser();
  }, [userId]);

  if (!userId) return;
  return (
    <div>
      <div className="top-0 h-12 px-4 flex items-end">
        <button onClick={() => router.back()}>
          <ArrowLeft width={36} height={36} />
        </button>
      </div>
      <div className="flex flex-col pb-10 bg-white shadow-xl">
        <div className="flex flex-col items-center">
          {userData && <ImageWithFallBack className="w-36 h-36 border-2 border-black rounded-full" src={`${process.env.NEXT_PUBLIC_AWS_URL}/${userData.profilePic}`} alt="profile Image" width={120} height={120} />}
          <span
            className="text-lg mt-1 font-bold select-none flex gap-1 items-center "
            onClick={() => {
              if (!userData) return;
              copyToClipboard(userData.name);
            }}
          >
            {userData?.name}
            <Copy width={12} height={12} />
          </span>
          <span
            className="text-sm select-none flex gap-1 items-center text-blue-700"
            onClick={() => {
              if (!userData) return;
              copyToClipboard(userData.email);
            }}
          >
            {userData?.email}
            <Copy width={12} height={12} />
          </span>
        </div>
        <div className="flex justify-center gap-8 mt-4 px-4">
          <EditOptionsCard text="Video" callbackfn={() => handleVideoCall({ room: userId, router })}>
            <Video className="text-green-500 w-14" />
          </EditOptionsCard>
          <EditOptionsCard text="Chat" callbackfn={() => router.push(`/chatpage/${userId}`)}>
            <MessageCircleCode className="text-green-500 w-14" />
          </EditOptionsCard>
        </div>
      </div>
      <div className="flex flex-col px-4 gap-8  bg-white shadow-xl my-4 w-screen py-4">
        <span className="text-xl flex gap-4 items-center">
          <Heart />
          Add to Favourites
        </span>
        <span
          className="text-xl flex gap-4 items-center text-red-600 select-none"
          onClick={async () => {
            if (userId) await unfriendUser(userId);
          }}
        >
          <Ban />
          <button>Unfriend this User</button>
        </span>
        <span className="text-xl flex gap-4 items-center text-red-600" onClick={() => setReport(!report)}>
          <ThumbsDown color={report ? "black" : "red"} fill={report ? "red" : "none"} />
          <button>Report this User</button>
        </span>
      </div>
    </div>
  );
}
