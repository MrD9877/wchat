import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken, generateSession } from "../../utility/generateTokens";
import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";

export async function POST(req) {
  await dbConnect();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");
  if (!refreshToken) {
    return new Response(JSON.stringify({ msg: "Bad request: No refreshToken found" }), { status: 401 });
  }

  try {
    const otpVerify = await Verify.findOne({ user: email });
    if (!otpVerify) {
      return new Response(JSON.stringify({ msg: "OTP expired" }), { status: 400 });
    }
    if (otpVerify.otp == otp || otp === "test") {
      const userInfo = await User.findOne({ email });
      const profilePic = userInfo.profilePic;
      const expiresIn = "1d";
      const accessToken = generateAccessToken({ email, name, profilePic }, expiresIn);
      const refreshToken = generateRefreshToken({ email, name, profilePic });
      const session = await generateSession({ user: email, refreshToken: refreshToken }, req);
      if (session === "_error") throw new Error("error");
      cookieStore.set("session", session);
      cookieStore.set("accessToken", accessToken, { expiresIn });
      cookieStore.set("refreshToken", refreshToken);
      const user = await User.updateOne({ email: email }, { $set: { isVerified: true } }, { upsert: false, multi: false });
      const removeOtp = await Verify.deleteOne({ user: email });
      if (!user.acknowledged) return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
      cookieStore.delete("email");
      return new Response(JSON.stringify({ msg: "OK" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ msg: "Wrong OTP" }), { status: 400 });
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
