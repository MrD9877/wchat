import { cookies } from "next/headers";
import { generateAccessToken } from "../../utility/generateTokens";
import dbConnect from "../../lib/DbConnect";
import { sessionAuth, tokenAuth } from "../../utility/authToken";
import { keys } from "@/lib/keys";
import { oneDayInMS } from "../../utility/authUser";

export async function GET() {
  await dbConnect();
  const cookieStore = await cookies();
  try {
    let accessToken;
    const refreshTokenString = cookieStore.get("refreshToken")?.value;
    const sessionTokenString = cookieStore.get("session")?.value;
    if (!refreshTokenString || !sessionTokenString) return new Response(JSON.stringify({ msg: keys.UNAUTHORIZED }), { status: 401 });
    const refreshToken = await tokenAuth(refreshTokenString);
    if (!refreshToken) return new Response(JSON.stringify({ msg: keys.UNAUTHORIZED }), { status: 401 });
    accessToken = await generateAccessToken({ ...refreshToken.user }, oneDayInMS);
    const session = await sessionAuth(sessionTokenString);
    if (!session || !session.sessionData || !session.sessionData.refreshToken || session.sessionData.refreshToken !== refreshTokenString) return new Response(JSON.stringify({ msg: keys.UNAUTHORIZED }), { status: 401 });
    await cookieStore.set("accessToken", accessToken);
    return new Response(JSON.stringify({ msg: "New Token generated" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
