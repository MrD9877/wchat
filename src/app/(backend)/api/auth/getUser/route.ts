import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { authenticate } from "@/app/(backend)/utility/authUser";
import { keys } from "@/lib/keys";
import { cookies } from "next/headers";

export async function GET(req, res) {
  await dbConnect();
  const cookieStore = await cookies();
  const token = await authenticate(cookieStore);

  if (!token) {
    return new Response(JSON.stringify({ msg: "Unauthorize" }), { status: 401 });
  }
  const { user } = token;
  try {
    // console.log(user);
    const userInfo = await User.findOne({ email: user.email });
    return new Response(JSON.stringify({ email: userInfo.email, name: userInfo.name, userId: userInfo.userId, chatPages: userInfo.chatPages }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
