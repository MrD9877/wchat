import dbConnect from "@/app/(backend)/lib/DbConnect";
import { ChatPage } from "@/app/(backend)/model/Chatpages";
import { User } from "@/app/(backend)/model/User";
import { tokenAuth } from "@/app/(backend)/utility/authToken";
import { authenticate } from "@/app/(backend)/utility/authUser";
import { keys } from "@/lib/keys";
import { cookies } from "next/headers";

export async function POST(req, res) {
  await dbConnect();
  const body = await req.json();
  const cookieStore = await cookies();
  const token = await authenticate(cookieStore);

  if (token == keys.UNAUTHORIZED) {
    return new Response(JSON.stringify({ msg: "Unauthorize" }), { status: 401 });
  }
  const { user } = token;
  const { userId, chatId } = body;
  try {
    if (userId) {
      const userInfo = await User.findOne({ email: user.email });
      if (!userInfo) return new Response(JSON.stringify({ msg: "what are you doing!!!" }), { status: 401 });
      const page = userInfo.chatPages.get(userId);
      if (!page) return new Response(JSON.stringify({ msg: "No chat from this user Found" }), { status: 400 });
      userInfo.chatPages.delete(userId);
      await userInfo.save();
    }
    if (chatId) {
      const chatInfo = await ChatPage.deleteOne({ chatId: chatId });
      if (!chatInfo.acknowledged) return new Response(JSON.stringify({ msg: "No chatPage from this id Found" }), { status: 400 });
    }
    return new Response(JSON.stringify({ msg: "Done" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
