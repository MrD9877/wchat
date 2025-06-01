import { PrivateMessage } from "@/app/(siteRoutes)/camera/page";
import { UnknownAction } from "redux";
import { encryptMessage } from "@/utility/Encription";
import { socket } from "@/socket";
import { updateFriend } from "@/utility/updateFriend";
import { uploadImageAndGetUrl } from "@/utility/uploadAndGetUrl";
import { checkFriendData, SavedDbFriends, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { setLoading } from "@/redux/Slice";
import { Dispatch } from "react";
import { getCookie } from "./getCookie";

export const encryptAwsURL = async (awsUrl: string, publicKey: CryptoKey) => {
  const url = new URL(awsUrl);
  const signature = url.searchParams.get("X-Amz-Signature");
  if (!signature) throw Error();
  const encryptedSignature = await encryptMessage({ message: signature, publicKey });
  url.searchParams.set("X-Amz-Signature", encryptedSignature);
  return url.href;
};

type SaveMessageData = { message: string } | { audio: Blob[] } | { message?: string; image: string[] | undefined } | { video: string };
export type SendPrivateMessageData = { userId: string; id: string; timestamp: number; clientId: string; publicKey: CryptoKey } & SaveMessageData;

export const sendPrivateMessage = async (msgData: SendPrivateMessageData, dispatch: Dispatch<UnknownAction>) => {
  console.log({ msgData });
  try {
    const { userId, id, timestamp, clientId, publicKey } = msgData;
    let message: string | undefined;
    let image: string[] | undefined;
    let audio: Blob[] | undefined;
    const ImageUrls: string[] = [];
    let audioUrl: string | undefined = undefined;

    if ("message" in msgData) message = msgData.message;
    if ("audio" in msgData) audio = msgData.audio;
    if ("image" in msgData) image = msgData.image;
    console.log(image);
    if (image || audio) {
      dispatch(setLoading(true));
    }
    if (audio) {
      const url = await uploadImageAndGetUrl({ audio });
      audioUrl = url ? await encryptAwsURL(url, publicKey) : undefined;
    }

    if (image) {
      for (let i = 0; i < image.length; i++) {
        const dataUri = image[i];
        const awsUrl = await uploadImageAndGetUrl({ image: dataUri });
        if (awsUrl) {
          const url = await encryptAwsURL(awsUrl, publicKey);
          ImageUrls.push(url);
        }
      }
    }

    await saveMessageForUser(clientId, { message, image, audio, sender: true, id, userId, timestamp });
    await checkFriendData(clientId, userId);
    await updateFriend({ clientId, userId, image, message, audio: audioUrl });
    const accessToken = getCookie("accessToken");
    const data: PrivateMessage = { message: message ? await encryptMessage({ message, publicKey }) : undefined, accessToken, image: ImageUrls.length > 0 ? ImageUrls : undefined, id, userId, audio: audioUrl, timestamp };
    socket.emit("private message", { ...data });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};
