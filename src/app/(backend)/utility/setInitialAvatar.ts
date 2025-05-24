import { uploadImageDirectly } from "./awsBucket";

export const fetchAvatar = async (seed: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AVATAR_URL}?seed=${seed}`);
  const body = res.body as ReadableStream;
  return await streamToBlob(body);
};

export async function streamToBlob(stream: ReadableStream, mimeType = "application/octet-stream") {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return new Blob(chunks, { type: mimeType });
}

export const getAndSetAvatarDp = async (seed: string, id: string) => {
  const avatarBlob = await fetchAvatar(seed);
  const arrayBuffer = await avatarBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await uploadImageDirectly(id, buffer);
  return result;
};
