import dbConnect from "@/app/(backend)/lib/DbConnect";
import { ChatPage } from "@/app/(backend)/model/Chatpages";
import { User } from "@/app/(backend)/model/User";
import { AuthRequest } from "@/app/(backend)/utility/authRequest";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const cookieStore = await cookies();
  const data = await AuthRequest();

  const { userId, chatId } = body;
  try {
    if (!data) return new Response(JSON.stringify({ msg: "Login to continue" }), { status: 401 });
    const { user } = data;
    if (userId) {
      const userInfo = await User.findOne({ email: user.email });
      if (!userInfo) return new Response(JSON.stringify({ msg: "what are you doing!!!" }), { status: 400 });
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
