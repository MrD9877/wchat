import { keys } from "@/lib/keys";
import { sessionAuth, tokenAuth } from "./authToken";
import { generateAccessToken } from "./generateTokens";

export async function authenticate(cookieStore) {
  // console.log(cookieStore.get("accessToken"));
  let accessToken = tokenAuth(cookieStore.get("accessToken").value);
  let newToken;
  if (accessToken == keys.ERROR) {
    const refreshToken = tokenAuth(cookieStore.get("refreshToken").value);
    if (refreshToken == keys.ERROR) return keys.UNAUTHORIZED;
    newToken = generateAccessToken({ ...refreshToken.user }, "1d");
    accessToken = tokenAuth(newToken);
    const refreshTokenString = cookieStore.get("refreshToken").value;
    if (!refreshTokenString) return keys.UNAUTHORIZED;
    const session = await sessionAuth(cookieStore.get("session").value);
    if (session == keys.ERROR || !session.sessionData || !session.sessionData.refreshToken || session.sessionData.refreshToken !== refreshTokenString) return keys.UNAUTHORIZED;
    cookieStore.set("accessToken", newToken);
  }
  return accessToken;
}
