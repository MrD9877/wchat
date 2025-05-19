"use server";

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { tokenAuth } from "./authToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenDataUser } from "./generateTokens";
import { oneDayInMS } from "./random";

async function refreshAccessToken(cookieStore: ReadonlyRequestCookies): Promise<string | false> {
  const refreshTokenString = cookieStore.get("refreshToken")?.value;
  if (!refreshTokenString) return false;
  try {
    const data = jwt.verify(refreshTokenString, process.env.LOCAL_SECRET || "") as JwtPayload;
    if (!data) return false;
    const token = jwt.sign({ user: data.user }, process.env.LOCAL_SECRET || "", { expiresIn: oneDayInMS });
    cookieStore.set("accessToken", token);
    return token;
  } catch (err) {
    return false;
  }
  //   todo add session authentication
}

export async function AuthRequest() {
  const cookieStore = await cookies();
  let accessTokenString = cookieStore.get("accessToken")?.value;
  if (!accessTokenString) {
    const newToken = await refreshAccessToken(cookieStore);

    if (!newToken) return false;
    accessTokenString = newToken;
  }
  const userData = await tokenAuth(accessTokenString);
  if (!userData) return false;
  return userData as { user: TokenDataUser };
}
