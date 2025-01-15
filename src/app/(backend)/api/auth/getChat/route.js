import dbConnect from "@/app/(backend)/lib/DbConnect";
import { ChatPage } from "@/app/(backend)/model/Chatpages";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { cookies } from "next/headers";

export async function POST(req, res) {
  dbConnect();
  const cookieStore = await cookies();
  const body = await req.json();
  const { friend } = body;
  let chatId;
  const { user } = tokenAuth(cookieStore.get("accessToken").value);
  try {
    const userInfo = await User.findOne({ email: user, "friends.email": friend }, { "friends.$": 1 });
    if (!userInfo) new Response(JSON.stringify({ msg: "You are not a registered user!!" }), { status: 400 });
    chatId = userInfo.friends[0].chatId;
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
  try {
    const { chats } = await ChatPage.findOne({ chatId });
    return new Response(JSON.stringify({ chats }, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
