"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";
import { generateRandom } from "@/app/(backend)/utility/random";
import Camera from "@/components/Camera";
import { checkFriendData } from "@/utility/saveAndRetrievedb";
import { sendPrivateMessage } from "@/utility/sendPrivateMessage";
import { getPublicKey } from "@/action/getpublicKey";
import { toast } from "sonner";
import { Base64ToPublicKey } from "@/utility/Encription";

export type PrivateMessage = {
  userId: string | null;
  message?: string | undefined;
  accessToken: string | null;
  image?: string | string[];
  id: string;
  audio?: string;
  timestamp: number;
};

export default function CaremaPage() {
  const clientId = useSelector((state: UserState) => state.userId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const room = searchParams.get("room");
  const dispatch = useDispatch();

  const sendImage = async (dataUri: string, caption?: string) => {
    if (!room || !dataUri || !clientId) return;
    const friend = await checkFriendData(clientId, room);
    if (!friend) return;
    const id = generateRandom(8);
    try {
      const key = await getPublicKey(room);
      if (!key) throw Error();
      const publicKey = await Base64ToPublicKey(key);
      await sendPrivateMessage({ clientId, message: caption, image: [dataUri], id, userId: room, timestamp: Date.now(), publicKey }, dispatch);
    } catch (err) {
      toast("Unable to send message");
      console.log(err);
    } finally {
      router.back();
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Camera sendImage={sendImage} isCaption={true} />;
    </Suspense>
  );
}
