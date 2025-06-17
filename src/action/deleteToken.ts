"use server";
import { cookies } from "next/headers";
export async function deleteTokens() {
  const cookieStore = await cookies();
  try {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
