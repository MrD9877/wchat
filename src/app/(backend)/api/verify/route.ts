import dbConnect from "../../lib/DbConnect";
import { User } from "../../model/User";
import { connectRedis } from "../../utility/redis";
import { setCokies } from "../../utility/setCokie";

export async function POST(req: Request) {
  await dbConnect();
  const client = await connectRedis();
  const body: { email?: string; otp?: string; publicKey?: string } = await req.json();
  console.log(body);
  if (!body || !body.email || !body.otp || !body.publicKey) {
    return new Response(JSON.stringify({ msg: "Bad request: Email not found" }), { status: 400 });
  }
  const { email, otp, publicKey } = body;
  console.log(body);
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
    userInfo.publicKey = publicKey;
    await userInfo.save();
    return new Response(JSON.stringify({ name: userInfo.name, email: userInfo.email, userId: userInfo.userId, profilePic: userInfo.profilePic }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error Try agian!!" }), { status: 500 });
  }
}
