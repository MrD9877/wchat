import dotenv from "dotenv";
import { toast } from "sonner";

dotenv.config();

const getUrl = async () => {
  try {
    const data = await fetch(`/api/auth/changeProfilePic`);
    const { url } = await data.json();
    console.log(url);
    return url as string;
  } catch (err) {
    console.log(err);
  }
};

export async function uploadProfilePic(dataUri: string | undefined, profilePicId: string | undefined, bufferData?: Buffer<ArrayBuffer>, contentType?: string) {
  if (!profilePicId) return;
  let buffer: Buffer<ArrayBuffer>;

  if (dataUri) {
    const base64 = dataUri.replace(/^data:image\/\w+;base64,/, "");
    buffer = Buffer.from(base64, "base64");
  } else if (bufferData) {
    buffer = bufferData;
  } else {
    return;
  }
  try {
    const url = await getUrl();
    if (!url) throw Error();
    const upload = await fetch(url, {
      method: "PUT",
      body: buffer,
      headers: {
        "Content-Type": contentType || "image/png",
      },
      mode: "cors",
    });
    const cache = await caches.open("media");
    const baseURL = `${process.env.NEXT_PUBLIC_AWS_URL}/${profilePicId}`;
    await cache.keys().then((requests) => {
      requests.forEach((request) => {
        const urlWithoutQuery = request.url.split("?")[0];
        if (urlWithoutQuery === baseURL) {
          cache.delete(request);
        }
      });
    });
  } catch (err) {
    console.log(err);
    toast("somthing went wrong when uploading image");
  }
}
