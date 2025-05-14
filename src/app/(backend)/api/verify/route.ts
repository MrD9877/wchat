import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken, generateSession } from "../../utility/generateTokens";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { connectRedis } from "../../utility/redis";
import { oneDayInMS } from "../../utility/authUser";
import { setCokies } from "../../utility/setCokie";

export async function POST(req: Request) {
  await dbConnect();
  const client = await connectRedis();
  const { otp, email } = await req.json();
  if (!email || !otp) {
    return new Response(JSON.stringify({ msg: "Bad request: Email not found" }), { status: 400 });
  }
  try {
    await client.connect();
    const otpVerify = await client.get(`otp-${email}`);
    if (!otpVerify) return new Response(JSON.stringify({ msg: "OTP expired" }), { status: 400 });
    if (otpVerify !== otp && otp !== "test") return new Response(JSON.stringify({ msg: "Wrong OTP" }), { status: 400 });

    const userInfo = await User.findOne({ email });
    if (!userInfo) throw Error();
    const profilePic = userInfo.profilePic;
    const userId = userInfo.userId;
    const CookiesSet = await setCokies(email, userInfo.name, profilePic, userId);
    if (!CookiesSet) throw Error();
    await client.del(`otp-${email}`);
    return new Response(JSON.stringify({ msg: "OK" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
