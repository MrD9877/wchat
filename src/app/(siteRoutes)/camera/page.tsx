"use client";
import { getCookie } from "@/utility/getCookie";
import { socket } from "@/socket";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, UserState } from "@/redux/Slice";
import { saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { generateRandom } from "@/app/(backend)/utility/random";
import { updateFriend } from "@/utility/updateFriend";
import { uploadImageAndGetUrl } from "@/utility/uploadAndGetUrl";
import Camera from "@/components/Camera";

export default function CaremaPage() {
  const userId = useSelector((state: UserState) => state.userId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const room = searchParams.get("room");
  const dispatch = useDispatch();

  const sendImage = async (dataUri: string, caption?: string) => {
    const accessToken = getCookie("accessToken");
    if (!dataUri) return;
    const url = await uploadImageAndGetUrl({ image: dataUri });
    if (!url) {
      /// todo handle image not upload
      return;
    }
    socket.emit("private message", room, { message: caption, accessToken, image: url });
    if (room && dataUri && userId)
      try {
        await saveMessageForUser(userId, { message: caption, image: dataUri, audio: undefined, video: undefined, sender: true, id: generateRandom(16) }, room);
        await updateFriend({ clientId: userId, userId: room, image: dataUri, message: caption, audio: undefined });
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false));
        router.back();
      }
  };

  return <Camera sendImage={sendImage} isCaption={true} />;
}
