import { cookies } from "next/headers";
import dbConnect from "../../../lib/DbConnect";
import { User } from "../../../model/User";
import { authenticate } from "@/app/(backend)/utility/authUser";
import { keys } from "@/lib/keys";

export async function POST(request) {
  await dbConnect();
  const cookieStore = await cookies();
  const body = await request.json();
  const token = await authenticate(cookieStore);
  if (!token) {
    return new Response(JSON.stringify({ msg: "Unauthorize" }), { status: 401 });
  }
  const { user } = token;
  try {
    const userInfo = await User.findOne({ email: user.email });
    if (!userInfo || !body) return new Response(JSON.stringify({ msg: "bad Request" }), { status: 400 });
    userInfo.subscribe = { ...body };
    await userInfo.save();
    return new Response(JSON.stringify({ msg: "Subcribed" }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
