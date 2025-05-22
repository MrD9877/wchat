import { getImageSigned, uploadImage } from "@/app/(backend)/utility/awsBucket";
import { generateRandom } from "@/app/(backend)/utility/random";

type UploadImageAndGetURL = { image: string; audio?: undefined } | { audio: Blob[]; image?: undefined };

const getBuffer = async (dataUri?: string, audio?: Blob[]) => {
  if (dataUri) {
    const base64 = dataUri.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    return buffer;
  } else if (audio) {
    const buffers = await Promise.all(
      audio.map(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        return Buffer.from(arrayBuffer);
      })
    );

    return Buffer.concat(buffers);
  }
};

export const uploadImageAndGetUrl = async ({ image, audio }: UploadImageAndGetURL) => {
  console.log(image);
  const id = generateRandom(16);
  try {
    const preSignedUploadUrl = await uploadImage(id, true);
    const buffer = await getBuffer(image, audio);
    const contentType = image ? "image/png" : "audio/mp4";

    console.log({ preSignedUploadUrl, buffer });
    if (!buffer) return;
    await fetch(preSignedUploadUrl, {
      method: "PUT",
      body: buffer,
      headers: {
        "Content-Type": contentType,
      },
      mode: "cors",
    });
    const url = await getImageSigned(id);
    return url;
  } catch (err) {
    console.log(err);
    return false;
  }
};
