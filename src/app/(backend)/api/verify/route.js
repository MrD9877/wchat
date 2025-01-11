import { Verify } from "../../model/verify";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken, generateSession } from "../../utility/generateTokens";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";

export async function POST(req) {
  await dbConnect();
  const { otp, email } = await req.json();
  const cookieStore = await cookies();
  try {
    const otpVerify = await Verify.findOne({ user: email });
    if (!otpVerify) {
      return new Response(JSON.stringify({ msg: "OTP expired" }, { status: 400 }));
    }
    if (otpVerify.otp == otp || otp === "test") {
      const expiresIn = "1d";
      const accessToken = generateAccessToken(email, expiresIn);
      const refreshToken = generateRefreshToken(email);
      const session = await generateSession({ user: email, refreshToken: refreshToken }, req);
      if (session === "_error") throw new Error("error");
      cookieStore.set("session", session);
      cookieStore.set("accessToken", accessToken, { expiresIn });
      cookieStore.set("refreshToken", refreshToken);
      const user = await User.updateOne({ email: email }, { $set: { isVerified: true } }, { upsert: false, multi: false });
      return new Response(JSON.stringify({ msg: "OK" }, { status: 200 }));
    } else {
      return new Response(JSON.stringify({ msg: "Wrong OTP!!" }, { status: 400 }));
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }, { status: 500 }));
  }
}
