import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken } from "./generateTokens";
import { oneDayInMS } from "./random";

export async function setCokies(email: string, name: string, profilePic: string, userId: string) {
  "use server";
  const cookieStore = await cookies();
  const accessToken = await generateAccessToken({ email, name, profilePic, userId }, oneDayInMS);
  const refreshToken = await generateRefreshToken({ email, name, profilePic, userId });
  if (!accessToken || !refreshToken) return false;

  cookieStore.set("accessToken", accessToken, { expires: new Date(Date.now() + oneDayInMS) });
  cookieStore.set("refreshToken", refreshToken);
  return true;
}
