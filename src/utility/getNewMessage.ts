import { MessageData } from "@/hooks/useGetMessages";
import { decryptOne, getKeysFromDb } from "@/utility/Encription";
import { checkFriendData, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { updateFriend } from "@/utility/updateFriend";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export const decryptAwsURL = async (awsUrl: string | undefined, privateKey: CryptoKey) => {
  if (!awsUrl) return;
  const url = new URL(awsUrl);
  const signature = url.searchParams.get("X-Amz-Signature");
  if (!signature) throw Error();
  const decryptedSignature = await decryptOne(signature, privateKey);
  if (decryptedSignature) url.searchParams.set("X-Amz-Signature", decryptedSignature);
  return url.href;
};

const decryptAwsURLS = async (awsUrls: string[] | undefined, privateKey: CryptoKey) => {
  if (!awsUrls) return;
  const urls: string[] = [];
  for (let i = 0; i < awsUrls.length; i++) {
    const url = await decryptAwsURL(awsUrls[i], privateKey);
    if (url) urls.push(url);
  }
  return urls;
};

export const handleNewMessage = async (clientId: string, { message, userId, image, audio, id, username, timestamp }: MessageData, pathname: string, router?: AppRouterInstance) => {
  try {
    const keys = await getKeysFromDb();
    if (!keys || !keys.privateKey) throw Error();
    const privateKey = keys.privateKey;
    const parsedMessage = await decryptOne(message, privateKey);
    const parsedaudio = await decryptAwsURL(audio, privateKey);
    const parsedImages = typeof image === "string" ? await decryptAwsURL(image, privateKey) : await decryptAwsURLS(image, privateKey);
    await checkFriendData(clientId, userId);
    const parsedData: MessageData = { message: parsedMessage, userId, image: parsedImages, id, audio: parsedaudio, username, timestamp };
    await saveMessageForUser(clientId, { sender: false, ...parsedData });
    await updateFriend({ clientId, ...parsedData });
    if (pathname !== "/chatscreen" && pathname !== `/chatpage/${userId}`) {
      pushNotification(parsedData, userId, router);
    }
    return parsedData;
  } catch (err) {
    console.log(err);
  }
};

function pushNotification(data: MessageData, userId: string, router?: AppRouterInstance) {
  const notificationMessage: string[] = [];
  if (data.message) notificationMessage.push(data.message);
  if (data.image) notificationMessage.push("🖼️");
  if (data.image && !data.message) notificationMessage.push("Image");
  if (data.audio) notificationMessage.push("🎙️ 1:00");
  toast(data.username, {
    description: notificationMessage.join(" "),
    action: {
      label: "view",
      onClick: () => {
        const url = `chatpage/${userId}`;
        if (router) router.push(url);
        else window.location.href = url;
      },
    },
  });
}
