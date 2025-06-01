import axios from "axios";

export async function downloadImage(imageUrl: string) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  if (!response) return;
  return buffer;
}
