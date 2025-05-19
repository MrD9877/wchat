import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";

export async function GET() {
  await dbConnect();
  const data = await AuthRequest();
  console.log({ data });
  try {
    if (!data) return new Response(JSON.stringify({ msg: "login to continue.." }), { status: 401 });
    const user = data.user;
    const userInfo = await User.findOne({ email: user.email });
    if (!userInfo) throw Error();
    return new Response(JSON.stringify({ email: userInfo.email, name: userInfo.name, userId: userInfo.userId, chatPages: userInfo.chatPages, profilePic: userInfo.profilePic }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
