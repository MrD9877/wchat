import dotenv from "dotenv";

dotenv.config();

const getUrl = async () => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_URL_BASE}/api/auth/changeProfilePic`);
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
  const url = await getUrl();
  if (!url) return;
  try {
    const upload = await fetch(url, {
      method: "PUT",
      body: buffer,
      headers: {
        "Content-Type": contentType || "image/png",
      },
      mode: "cors",
    });
    const cache = await caches.open("media");
    const d = await cache.delete(`${process.env.NEXT_PUBLIC_AWS_URL}/${profilePicId}`);
  } catch (err) {
    console.log(err);
  }
}
