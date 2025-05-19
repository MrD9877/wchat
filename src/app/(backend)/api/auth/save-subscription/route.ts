import { cookies } from "next/headers";
import dbConnect from "../../../lib/DbConnect";
import { User } from "../../../model/User";
import { keys } from "@/lib/keys";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";

export async function POST(request: Request) {
  await dbConnect();
  const cookieStore = await cookies();
  const body = await request.json();
  const data = await AuthRequest();

  try {
    if (!data) return new Response(JSON.stringify({ msg: "Login to continue" }), { status: 401 });
    const { user } = data;
    const userInfo = await User.findOne({ email: user.email });
    if (!userInfo || !body) return new Response(JSON.stringify({ msg: "bad Request" }), { status: 400 });
    userInfo.subscribe = { ...body };
    await userInfo.save();
    return new Response(JSON.stringify({ msg: "Subcribed" }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
