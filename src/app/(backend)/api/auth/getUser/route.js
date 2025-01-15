import dbConnect from "@/app/(backend)/lib/DbConnect";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { cookies } from "next/headers";

export async function GET(req, res) {
  await dbConnect();
  const cookieStore = await cookies();
  const { user } = tokenAuth(cookieStore.get("accessToken").value);
  try {
    // console.log(user);
    const userInfo = await User.findOne({ email: user.email });
    const userId = userInfo.userId;
    const name = userInfo.name;
    const email = userInfo.email;
    return new Response(JSON.stringify({ userId, name, email }), { status: 200 });
  } catch (err) {
    // console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
