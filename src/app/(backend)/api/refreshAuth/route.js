import { cookies } from "next/headers";
import { generateAccessToken } from "../../utility/generateTokens";
import dbConnect from "../../lib/DbConnect";
import { sessionAuth, tokenAuth } from "../../utility/authToken";
import { keys } from "@/lib/keys";

export async function GET(req) {
  await dbConnect();
  const cookieStore = await cookies();
  const refreshTokenString = cookieStore.get("refreshToken");
  if (!refreshTokenString) {
    return new Response(JSON.stringify({ msg: "Bad request: No refreshToken found" }), { status: 401 });
  }
  try {
    let accessToken;
    const refreshToken = tokenAuth(cookieStore.get("refreshToken").value);
    if (refreshToken == keys.ERROR) return new Response(JSON.stringify({ msg: keys.UNAUTHORIZED }), { status: 500 });
    const newToken = generateAccessToken({ ...refreshToken.user }, "1d");
    accessToken = newToken;
    const refreshTokenString = cookieStore.get("refreshToken").value;
    if (!refreshTokenString) return new Response(JSON.stringify({ msg: keys.UNAUTHORIZED }), { status: 500 });
    const session = await sessionAuth(cookieStore.get("session").value);
    if (session == keys.ERROR || !session.sessionData || !session.sessionData.refreshToken || session.sessionData.refreshToken !== refreshTokenString) return keys.UNAUTHORIZED;
    cookieStore.set("accessToken", accessToken);
    return new Response(JSON.stringify({ msg: "New Token generated" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
