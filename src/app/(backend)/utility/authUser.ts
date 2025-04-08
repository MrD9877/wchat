import { keys } from "@/lib/keys";
import { sessionAuth, tokenAuth } from "./authToken";
import { generateAccessToken } from "./generateTokens";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const oneDayInMS = 60 * 60 * 1000 * 24;

export async function authenticate(cookieStore: ReadonlyRequestCookies) {
  const accessTokenString = cookieStore.get("accessToken");
  if (!accessTokenString) {
    return false;
  }
  let accessToken = await tokenAuth(cookieStore.get("accessToken").value);
  let newToken: string;
  if (!accessToken) {
    const refreshToken = await tokenAuth(cookieStore.get("refreshToken").value);
    if (!refreshToken) return false;
    newToken = generateAccessToken({ ...refreshToken.user }, oneDayInMS);
    accessToken = await tokenAuth(newToken);
    const refreshTokenString = cookieStore.get("refreshToken").value;
    if (!refreshTokenString) return false;
    const session = await sessionAuth(cookieStore.get("session").value);
    if (!session || !session.sessionData || !session.sessionData.refreshToken || session.sessionData.refreshToken !== refreshTokenString) return false;
    cookieStore.set("accessToken", newToken);
  }
  return accessToken;
}
