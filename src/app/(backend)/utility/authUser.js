import { keys } from "@/lib/keys";
import { sessionAuth, tokenAuth } from "./authToken";
import { generateAccessToken } from "./generateTokens";

export async function authenticate(cookieStore) {
  let accessToken = tokenAuth(cookieStore.get("accessToken").value);
  if (accessToken == keys.ERROR) {
    const refreshToken = tokenAuth(cookieStore.get("refreshToken").value);
    if (refreshToken == keys.ERROR) return keys.UNAUTHORIZED;
    const newToken = generateAccessToken({ ...refreshToken.user }, "1d");
    cookieStore.set("accessToken", newToken);
    accessToken = newToken;
  }
  const refreshTokenString = cookieStore.get("refreshToken").value;
  if (!refreshTokenString) return keys.UNAUTHORIZED;
  const session = await sessionAuth(cookieStore.get("session").value);
  if (session == keys.ERROR || !session.sessionData || !session.sessionData.refreshToken || session.sessionData.refreshToken !== refreshTokenString) return keys.UNAUTHORIZED;
  return accessToken;
}
