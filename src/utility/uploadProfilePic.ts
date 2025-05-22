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

export async function uploadProfilePic(dataUri: string | undefined, profilePicId: string | undefined) {
  if (!dataUri || !profilePicId) return;
  const base64 = dataUri.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const url = await getUrl();
  if (!url) return;
  console.log(url);
  try {
    const upload = await fetch(url, {
      method: "PUT",
      body: buffer,
      headers: {
        "Content-Type": "image/png",
      },
      mode: "cors",
    });
    console.log(upload.status);
  } catch (err) {
    console.log(err);
  }
}
